import { useState } from "react";
import { obterTiposEquipamento } from "../services/equipamentosService";
import "../styles/novoAluguel.css";

const enderecoInicial = {
  cep: "",
  tipoLogradouro: "Rua",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  nomeEstado: "",
};

const tiposLogradouro = [
  "Rua",
  "Avenida",
  "Travessa",
  "Alameda",
  "Praça",
  "Estrada",
  "Rodovia",
  "Viela",
  "Largo",
  "Outro",
];

function somenteNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function formatarDocumento(valor) {
  const numeros = somenteNumeros(valor).slice(0, 14);

  if (numeros.length <= 11) {
    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatarCEP(valor) {
  return somenteNumeros(valor)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarEndereco(endereco) {
  if (!endereco) {
    return "Endereço não informado";
  }

  return [
    `${endereco.tipoLogradouro} ${endereco.logradouro}, ${endereco.numero}`,
    endereco.complemento,
    endereco.bairro,
    `${endereco.cidade} - ${endereco.uf}`,
    `CEP: ${endereco.cep}`,
  ]
    .filter(Boolean)
    .join(" - ");
}

function calcularDias(dataInicio, dataDevolucao) {
  if (!dataInicio || !dataDevolucao) {
    return 0;
  }

  const inicio = new Date(dataInicio);
  const devolucao = new Date(dataDevolucao);

  if (
    Number.isNaN(inicio.getTime()) ||
    Number.isNaN(devolucao.getTime()) ||
    devolucao <= inicio
  ) {
    return 0;
  }

  const milissegundosPorDia = 24 * 60 * 60 * 1000;

  return Math.ceil(
    (devolucao.getTime() - inicio.getTime()) /
      milissegundosPorDia
  );
}

function obterClientes() {
  try {
    const dados = JSON.parse(
      localStorage.getItem("equipass-clientes") || "[]"
    );

    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function obterAlugueis() {
  try {
    const dados = JSON.parse(
      localStorage.getItem("equipass-alugueis") || "[]"
    );

    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function NovoAluguel() {
  const [tiposEquipamento] = useState(obterTiposEquipamento);

  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState(null);

  const [tipoSelecionado, setTipoSelecionado] =
    useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataDevolucao, setDataDevolucao] =
    useState("");

  const [usarEnderecoCadastro, setUsarEnderecoCadastro] =
    useState(true);

  const [enderecoEntrega, setEnderecoEntrega] =
    useState(enderecoInicial);

  const [erroCliente, setErroCliente] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const tipo = tiposEquipamento.find(
    (item) =>
      String(item.idTipoEquipamento) === tipoSelecionado
  );

  const diaria = tipo?.valorDiaria ?? 0;
  const dias = calcularDias(dataInicio, dataDevolucao);
  const total = dias * diaria;

  function buscarCliente() {
    setErroCliente("");
    setErro("");
    setSucesso("");
    setCliente(null);

    const documentoLimpo = somenteNumeros(documento);

    if (![11, 14].includes(documentoLimpo.length)) {
      setErroCliente("Informe um CPF ou CNPJ válido.");
      return;
    }

    const clienteEncontrado = obterClientes().find(
      (item) =>
        somenteNumeros(item.documento) === documentoLimpo
    );

    if (!clienteEncontrado) {
      setErroCliente(
        "Cliente não encontrado. Realize o cadastro antes de solicitar um aluguel."
      );

      return;
    }

    setCliente(clienteEncontrado);
    setUsarEnderecoCadastro(true);
    setEnderecoEntrega(enderecoInicial);
  }

  function atualizarDocumento(evento) {
    setDocumento(formatarDocumento(evento.target.value));
    setCliente(null);
    setErroCliente("");
    setSucesso("");
  }

  function atualizarEndereco(evento) {
    const { name, value } = evento.target;

    let novoValor = value;

    if (name === "cep") {
      novoValor = formatarCEP(value);
    }

    if (name === "uf") {
      novoValor = value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
    }

    setEnderecoEntrega((anterior) => ({
      ...anterior,
      [name]: novoValor,
    }));
  }

  function registrarAluguel(evento) {
    evento.preventDefault();

    setErro("");
    setSucesso("");

    if (tiposEquipamento.length === 0) {
      setErro("Nenhum tipo de equipamento disponível.");
      return;
    }

    if (!cliente) {
      setErro("Localize o cadastro do cliente.");
      return;
    }

    if (!tipo) {
      setErro("Selecione um tipo de equipamento.");
      return;
    }

    if (dias <= 0) {
      setErro(
        "A devolução deve acontecer depois da data de início."
      );

      return;
    }

    if (new Date(dataInicio) < new Date()) {
      setErro(
        "A data de início não pode estar no passado."
      );

      return;
    }

    const enderecoFinal = usarEnderecoCadastro
      ? cliente.endereco
      : enderecoEntrega;

    if (!enderecoFinal) {
      setErro("Informe um endereço de entrega.");
      return;
    }

    if (
      somenteNumeros(enderecoFinal.cep).length !== 8
    ) {
      setErro("Informe um CEP válido para a entrega.");
      return;
    }

    const camposObrigatorios = [
      enderecoFinal.tipoLogradouro,
      enderecoFinal.logradouro,
      enderecoFinal.numero,
      enderecoFinal.bairro,
      enderecoFinal.cidade,
      enderecoFinal.uf,
      enderecoFinal.nomeEstado,
    ];

    if (
      camposObrigatorios.some(
        (campo) => !String(campo ?? "").trim()
      )
    ) {
      setErro(
        "Preencha todos os campos obrigatórios do endereço."
      );

      return;
    }

    if (enderecoFinal.uf.length !== 2) {
      setErro("Informe uma UF com duas letras.");
      return;
    }

    const alugueis = obterAlugueis();

    const proximoId =
      Math.max(
        0,
        ...alugueis.map(
          (item) => Number(item.idAluguel) || 0
        )
      ) + 1;

    const novoAluguel = {
      idAluguel: proximoId,

      idCliente: cliente.idCliente,
      nomeCliente: cliente.nome,
      documentoCliente: cliente.documento,

      idTipoEquipamento: tipo.idTipoEquipamento,
      tipoEquipamento: tipo.nome,
      valorDiaria: diaria,

      idEquipamento: null,
      equipamento: null,

      dataPedido: new Date().toISOString(),
      dataHoraInicio: dataInicio,
      dataHoraFim: dataDevolucao,
      dataHoraEntrega: null,
      dataHoraDevolucao: null,

      enderecoEntrega: { ...enderecoFinal },

      diasPrevistos: dias,
      valorTotal: total,
      valorPago: null,

      situacao: "Solicitado",
      ativo: true,
    };

    try {
      localStorage.setItem(
        "equipass-alugueis",
        JSON.stringify([...alugueis, novoAluguel])
      );
    } catch {
      setErro("Não foi possível salvar o aluguel.");
      return;
    }

    limparFormulario();

    setSucesso(
      `Aluguel nº ${proximoId} registrado com sucesso! ` +
        "A solicitação está aguardando a entrega do equipamento."
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function limparFormulario() {
    setDocumento("");
    setCliente(null);
    setTipoSelecionado("");
    setDataInicio("");
    setDataDevolucao("");
    setUsarEnderecoCadastro(true);
    setEnderecoEntrega(enderecoInicial);
    setErroCliente("");
    setErro("");
    setSucesso("");
  }

  return (
    <section className="novo-aluguel-pagina">
      <div className="novo-aluguel-cabecalho">
        <span className="secao-etiqueta">
          LOCAÇÃO DE EQUIPAMENTOS
        </span>

        <h1>Registrar Aluguel</h1>

        <p>
          Identifique o cliente, escolha o tipo de
          equipamento e defina o período da locação.
        </p>
      </div>

      {sucesso && (
        <div
          className="aluguel-mensagem sucesso"
          role="status"
        >
          {sucesso}
        </div>
      )}

      <form
        className="novo-aluguel-painel"
        onSubmit={registrarAluguel}
      >
        <section className="aluguel-etapa">
          <div className="aluguel-etapa-titulo">
            <span className="aluguel-numero">1</span>
            <h2>Identificação do cliente</h2>
          </div>

          <p className="aluguel-descricao">
            Informe o CPF ou CNPJ do cliente cadastrado.
          </p>

          <div className="aluguel-busca-cliente">
            <label className="campo">
              CPF ou CNPJ

              <input
                type="text"
                inputMode="numeric"
                value={documento}
                onChange={atualizarDocumento}
                placeholder="Informe o documento"
                onKeyDown={(evento) => {
                  if (evento.key === "Enter") {
                    evento.preventDefault();
                    buscarCliente();
                  }
                }}
              />
            </label>

            <button
              type="button"
              className="botao-principal"
              onClick={buscarCliente}
            >
              Buscar cliente
            </button>
          </div>

          {erroCliente && (
            <p
              className="aluguel-mensagem erro"
              role="alert"
            >
              {erroCliente}
            </p>
          )}

          {cliente && (
            <div className="aluguel-cliente-encontrado">
              <span className="aluguel-cliente-status">
                Cliente localizado
              </span>

              <h3>{cliente.nome}</h3>

              <p>
                <strong>Documento:</strong>{" "}
                {cliente.documento}
              </p>

              <p>
                <strong>Tipo:</strong>{" "}
                {cliente.isFisica
                  ? "Pessoa física"
                  : "Pessoa jurídica"}
              </p>

              <p>
                <strong>E-mail:</strong>{" "}
                {cliente.emails?.[0] || "Não informado"}
              </p>
            </div>
          )}
        </section>

        <section className="aluguel-etapa">
          <div className="aluguel-etapa-titulo">
            <span className="aluguel-numero">2</span>
            <h2>Equipamento desejado</h2>
          </div>

          <p className="aluguel-descricao">
            Selecione o tipo de equipamento que deseja
            alugar.
          </p>

          <label className="campo">
            Tipo de equipamento *

            <select
              value={tipoSelecionado}
              onChange={(evento) =>
                setTipoSelecionado(evento.target.value)
              }
              disabled={tiposEquipamento.length === 0}
              required
            >
              <option value="">
                {tiposEquipamento.length === 0
                  ? "Nenhum tipo de equipamento disponível"
                  : "Selecione um tipo de equipamento"}
              </option>

              {tiposEquipamento.map((item) => (
                <option
                  key={item.idTipoEquipamento}
                  value={item.idTipoEquipamento}
                >
                  {item.nome} -{" "}
                  {formatarMoeda(item.valorDiaria)}/dia
                </option>
              ))}
            </select>
          </label>

          {tiposEquipamento.length === 0 && (
            <div className="aluguel-aviso">
              Não há tipos de equipamentos disponíveis
              para seleção no momento.
            </div>
          )}

          {tipo && (
            <div className="aluguel-equipamento-info">
              <div>
                <small>Equipamento selecionado</small>
                <h3>{tipo.nome}</h3>
              </div>

              <div className="aluguel-diaria">
                <strong>{formatarMoeda(diaria)}</strong>
                <small>por dia</small>
              </div>
            </div>
          )}

          <p className="aluguel-observacao">
            O equipamento físico será definido pelo
            atendente responsável no momento da entrega.
          </p>
        </section>

        <section className="aluguel-etapa">
          <div className="aluguel-etapa-titulo">
            <span className="aluguel-numero">3</span>
            <h2>Período da locação</h2>
          </div>

          <p className="aluguel-descricao">
            Defina quando deseja receber e devolver o
            equipamento.
          </p>

          <div className="form-grid">
            <label className="campo">
              Data e hora de início *

              <input
                type="datetime-local"
                value={dataInicio}
                onChange={(evento) =>
                  setDataInicio(evento.target.value)
                }
                required
              />
            </label>

            <label className="campo">
              Previsão de devolução *

              <input
                type="datetime-local"
                value={dataDevolucao}
                min={dataInicio || undefined}
                onChange={(evento) =>
                  setDataDevolucao(evento.target.value)
                }
                required
              />
            </label>
          </div>
        </section>

        <section className="aluguel-etapa">
          <div className="aluguel-etapa-titulo">
            <span className="aluguel-numero">4</span>
            <h2>Endereço de entrega</h2>
          </div>

          <p className="aluguel-descricao">
            Escolha onde o equipamento deverá ser entregue.
          </p>

          {!cliente ? (
            <div className="aluguel-aviso">
              Localize o cadastro do cliente para
              selecionar o endereço de entrega.
            </div>
          ) : (
            <>
              <div className="aluguel-opcoes-endereco">
                <label>
                  <input
                    type="radio"
                    name="opcaoEndereco"
                    checked={usarEnderecoCadastro}
                    onChange={() =>
                      setUsarEnderecoCadastro(true)
                    }
                  />

                  Utilizar endereço cadastrado
                </label>

                <label>
                  <input
                    type="radio"
                    name="opcaoEndereco"
                    checked={!usarEnderecoCadastro}
                    onChange={() =>
                      setUsarEnderecoCadastro(false)
                    }
                  />

                  Informar outro endereço
                </label>
              </div>

              {usarEnderecoCadastro ? (
                <div className="aluguel-endereco-cadastrado">
                  <strong>Endereço principal</strong>

                  <p>
                    {formatarEndereco(cliente.endereco)}
                  </p>
                </div>
              ) : (
                <div className="form-grid">
                  <label className="campo">
                    CEP *

                    <input
                      type="text"
                      name="cep"
                      inputMode="numeric"
                      value={enderecoEntrega.cep}
                      onChange={atualizarEndereco}
                      placeholder="00000-000"
                      required
                    />
                  </label>

                  <label className="campo">
                    Tipo de logradouro *

                    <select
                      name="tipoLogradouro"
                      value={enderecoEntrega.tipoLogradouro}
                      onChange={atualizarEndereco}
                      required
                    >
                      {tiposLogradouro.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="campo">
                    Logradouro *

                    <input
                      type="text"
                      name="logradouro"
                      value={enderecoEntrega.logradouro}
                      onChange={atualizarEndereco}
                      placeholder="Nome da rua"
                      required
                    />
                  </label>

                  <label className="campo">
                    Número *

                    <input
                      type="text"
                      name="numero"
                      value={enderecoEntrega.numero}
                      onChange={atualizarEndereco}
                      placeholder="Número do endereço"
                      required
                    />
                  </label>

                  <label className="campo campo-largo">
                    Complemento

                    <input
                      type="text"
                      name="complemento"
                      value={enderecoEntrega.complemento}
                      onChange={atualizarEndereco}
                      placeholder="Apartamento, bloco..."
                    />
                  </label>

                  <label className="campo">
                    Bairro *

                    <input
                      type="text"
                      name="bairro"
                      value={enderecoEntrega.bairro}
                      onChange={atualizarEndereco}
                      required
                    />
                  </label>

                  <label className="campo">
                    Cidade *

                    <input
                      type="text"
                      name="cidade"
                      value={enderecoEntrega.cidade}
                      onChange={atualizarEndereco}
                      required
                    />
                  </label>

                  <label className="campo">
                    Estado *

                    <input
                      type="text"
                      name="nomeEstado"
                      value={enderecoEntrega.nomeEstado}
                      onChange={atualizarEndereco}
                      placeholder="Nome do estado"
                      required
                    />
                  </label>

                  <label className="campo">
                    UF *

                    <input
                      type="text"
                      name="uf"
                      value={enderecoEntrega.uf}
                      onChange={atualizarEndereco}
                      placeholder="Sigla do estado"
                      maxLength={2}
                      required
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </section>

        <div className="resumo-aluguel">
          <h3>Resumo do aluguel</h3>

          <div className="resumo-linha">
            <span>Cliente</span>
            <strong>{cliente?.nome || "—"}</strong>
          </div>

          <div className="resumo-linha">
            <span>Equipamento</span>
            <strong>{tipo?.nome || "—"}</strong>
          </div>

          <div className="resumo-linha">
            <span>Valor da diária</span>

            <strong>
              {tipo ? formatarMoeda(diaria) : "—"}
            </strong>
          </div>

          <div className="resumo-linha">
            <span>Duração prevista</span>

            <strong>
              {dias > 0 ? `${dias} dia(s)` : "—"}
            </strong>
          </div>

          <div className="resumo-linha resumo-total">
            <span>Valor total previsto</span>

            <strong>
              {tipo && dias > 0
                ? formatarMoeda(total)
                : "—"}
            </strong>
          </div>

          <p className="aluguel-observacao">
            O valor apresentado corresponde ao período
            previsto da locação.
          </p>
        </div>

        {erro && (
          <p
            className="aluguel-mensagem erro"
            role="alert"
          >
            {erro}
          </p>
        )}

        <div className="form-acoes">
          <button
            type="button"
            className="aluguel-limpar"
            onClick={limparFormulario}
          >
            Limpar formulário
          </button>

          <button
            type="submit"
            className="botao-principal"
            disabled={tiposEquipamento.length === 0}
            style={
              tiposEquipamento.length === 0
                ? {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }
                : undefined
            }
          >
            Confirmar solicitação

            <span>→</span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default NovoAluguel;