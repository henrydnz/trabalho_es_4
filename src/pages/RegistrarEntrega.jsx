import { useEffect, useState } from "react";

import {
  obterEquipamentosDisponiveis,
} from "../services/equipamentosService";

import {
  obterAlugueis,
} from "../services/alugueisService";

import { requisicao } from "../services/api";

import "../styles/registrarEntrega.css";

function formatarData(valor) {
  if (!valor) {
    return "Não informado";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data inválida";
  }

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatarEndereco(endereco) {
  if (!endereco?.cep) {
    return "Endereço não informado";
  }

  return [
    [
      endereco.tipoLogradouro,
      endereco.logradouro,
      endereco.numero,
    ].filter(Boolean).join(" "),
    endereco.complemento,
    endereco.bairro,
    [
      endereco.cidade,
      endereco.uf,
    ].filter(Boolean).join(" - "),
    `CEP: ${endereco.cep}`,
  ]
    .filter(Boolean)
    .join(" - ");
}

function CampoResumo({ titulo, valor }) {
  return (
    <div>
      <span>{titulo}</span>

      <strong>
        {valor ?? "Não informado"}
      </strong>
    </div>
  );
}

function RegistrarEntrega() {
  const [alugueis, setAlugueis] = useState([]);

  const [equipamentosDisponiveis, setEquipamentosDisponiveis] =
    useState([]);

  const [aluguelId, setAluguelId] = useState("");

  const [equipamentoId, setEquipamentoId] =
    useState("");

  const [dataEntrega, setDataEntrega] =
    useState("");

  const [erro, setErro] = useState("");
  const [erroLista, setErroLista] = useState("");
  const [erroEquipamentos, setErroEquipamentos] =
    useState("");

  const [sucesso, setSucesso] = useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [carregandoEquipamentos, setCarregandoEquipamentos] =
    useState(false);

  const [registrando, setRegistrando] =
    useState(false);

  const alugueisPendentes = alugueis.filter(
    (item) => item.situacao === "Solicitado"
  );

  const aluguel = alugueisPendentes.find(
    (item) =>
      String(item.idAluguel) === aluguelId
  );

  const tipoSolicitado =
    aluguel?.idTipoEquipamento ??
    aluguel?.tipoEquipamento;

  const equipamento = equipamentosDisponiveis.find(
    (item) =>
      String(item.idEquipamento) === equipamentoId
  );

  const podeRegistrar =
    Boolean(aluguel) &&
    Boolean(equipamento) &&
    Boolean(dataEntrega) &&
    !carregando &&
    !carregandoEquipamentos &&
    !registrando &&
    !erroLista &&
    !erroEquipamentos;

  async function carregarAlugueis() {
    setCarregando(true);
    setErroLista("");

    try {
      const dados = await obterAlugueis();

      setAlugueis(dados);
    } catch (erro) {
      console.error(erro);

      setAlugueis([]);

      setErroLista(
        "Não foi possível consultar os aluguéis."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAlugueis();
  }, []);

  useEffect(() => {
    let cancelado = false;

    setEquipamentosDisponiveis([]);
    setEquipamentoId("");
    setErroEquipamentos("");

    if (!aluguelId || tipoSolicitado == null) {
      setCarregandoEquipamentos(false);

      if (aluguelId) {
        setErroEquipamentos(
          "O tipo de equipamento não foi informado pelo servidor."
        );
      }

      return;
    }

    async function carregarEquipamentos() {
      setCarregandoEquipamentos(true);

      try {
        const dados =
          await obterEquipamentosDisponiveis(
            tipoSolicitado
          );

        if (!cancelado) {
          setEquipamentosDisponiveis(dados);
        }
      } catch (erro) {
        console.error(erro);

        if (!cancelado) {
          setErroEquipamentos(
            "Não foi possível consultar os equipamentos disponíveis."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoEquipamentos(false);
        }
      }
    }

    carregarEquipamentos();

    return () => {
      cancelado = true;
    };
  }, [aluguelId, tipoSolicitado]);

  function selecionarAluguel(evento) {
    setAluguelId(evento.target.value);
    setEquipamentoId("");
    setEquipamentosDisponiveis([]);
    setDataEntrega("");
    setErro("");
    setSucesso("");
    setErroEquipamentos("");
  }

  function limpar() {
    setAluguelId("");
    setEquipamentoId("");
    setEquipamentosDisponiveis([]);
    setDataEntrega("");
    setErro("");
    setErroEquipamentos("");
    setSucesso("");
  }

  async function atualizarLista() {
    limpar();

    await carregarAlugueis();
  }

  async function registrar(evento) {
    evento.preventDefault();

    if (registrando) {
      return;
    }

    setErro("");
    setSucesso("");

    if (!aluguel) {
      setErro("Selecione um aluguel solicitado.");
      return;
    }

    if (!equipamento) {
      setErro("Selecione um equipamento disponível.");
      return;
    }

    if (!dataEntrega) {
      setErro("Informe a data e a hora da entrega.");
      return;
    }

    const data = new Date(dataEntrega);

    if (Number.isNaN(data.getTime())) {
      setErro("Informe uma data de entrega válida.");
      return;
    }

    if (data > new Date()) {
      setErro(
        "A data da entrega não pode estar no futuro."
      );
      return;
    }

    if (
      aluguel.dataPedido &&
      dataEntrega.slice(0, 10) <
        String(aluguel.dataPedido).slice(0, 10)
    ) {
      setErro(
        "A entrega não pode ocorrer antes da solicitação."
      );
      return;
    }

    setRegistrando(true);

    try {
      const parametros = new URLSearchParams({
        dtEntrega: dataEntrega,
        idEquipamento: String(
          equipamento.idEquipamento
        ),
      });

      await requisicao(
        `/alugueis/${aluguel.idAluguel}/entrega?${parametros}`,
        {
          method: "PUT",
        }
      );

      const numeroAluguel = String(
        aluguel.idAluguel
      ).padStart(4, "0");

      limpar();

      setSucesso(
        `Entrega do aluguel #${numeroAluguel} registrada com sucesso.`
      );

      await carregarAlugueis();

      window.scrollTo(0, 0);
    } catch (erro) {
      console.error(erro);

      setErro(
        erro.message ||
          "Não foi possível registrar a entrega."
      );
    } finally {
      setRegistrando(false);
    }
  }

  return (
    <section className="registrar-entrega-pagina">
      <div className="registrar-entrega-cabecalho">
        <span className="secao-etiqueta">
          CONTROLE DE LOCAÇÕES
        </span>

        <h1>Registrar Entrega</h1>

        <p>
          Localize uma solicitação de aluguel,
          selecione o equipamento físico e registre
          sua entrega ao cliente.
        </p>
      </div>

      {sucesso && (
        <div
          className="entrega-aviso"
          role="status"
        >
          {sucesso}
        </div>
      )}

      {erroLista && (
        <div className="entrega-erro" role="alert">
          <p>{erroLista}</p>

          <button
            type="button"
            className="entrega-botao-secundario"
            onClick={atualizarLista}
            disabled={carregando || registrando}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="entrega-indicadores">
        <div className="entrega-indicador">
          <span>Entregas pendentes</span>

          <strong>
            {carregando || erroLista
              ? "—"
              : alugueisPendentes.length}
          </strong>
        </div>

        <div className="entrega-indicador">
          <span>Equipamentos em locação</span>

          <strong>
            {carregando || erroLista
              ? "—"
              : alugueis.filter(
                  (item) =>
                    item.situacao === "Em locação"
                ).length}
          </strong>
        </div>
      </div>

      <form
        className="registrar-entrega-painel"
        onSubmit={registrar}
      >
        <section className="entrega-etapa">
          <div className="entrega-etapa-titulo">
            <span className="entrega-numero">1</span>

            <h2>Identificação do aluguel</h2>
          </div>

          <p className="entrega-descricao">
            Selecione uma solicitação que ainda
            esteja aguardando a entrega.
          </p>

          <div className="entrega-form-grid">
            <label className="entrega-campo entrega-campo-largo">
              Número do aluguel *

              <select
                value={aluguelId}
                onChange={selecionarAluguel}
                disabled={
                  carregando ||
                  registrando ||
                  Boolean(erroLista) ||
                  alugueisPendentes.length === 0
                }
                required
              >
                <option value="">
                  {carregando
                    ? "Carregando aluguéis..."
                    : erroLista
                      ? "Erro na consulta"
                      : alugueisPendentes.length === 0
                        ? "Nenhum aluguel aguardando entrega"
                        : "Selecione um aluguel"}
                </option>

                {alugueisPendentes.map((item) => (
                  <option
                    key={item.idAluguel}
                    value={item.idAluguel}
                  >
                    #{String(item.idAluguel)
                      .padStart(4, "0")}
                    {" - "}
                    {item.nomeCliente}
                    {" - "}
                    {item.tipoEquipamento}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!carregando &&
            !erroLista &&
            alugueisPendentes.length === 0 && (
              <div className="entrega-vazio">
                <h3>Nenhuma entrega pendente</h3>

                <p>
                  Não há solicitações de aluguel
                  aguardando entrega.
                </p>

                <button
                  type="button"
                  className="entrega-botao-secundario"
                  onClick={atualizarLista}
                  disabled={registrando}
                >
                  Atualizar lista
                </button>
              </div>
            )}

          {aluguel && (
            <div className="entrega-resumo">
              <div className="entrega-resumo-cabecalho">
                <h3>Informações do aluguel</h3>

                <span className="entrega-status">
                  Solicitado
                </span>
              </div>

              <div className="entrega-resumo-grid">
                <CampoResumo
                  titulo="Cliente"
                  valor={aluguel.nomeCliente}
                />

                <CampoResumo
                  titulo="CPF ou CNPJ"
                  valor={aluguel.documentoCliente}
                />

                <CampoResumo
                  titulo="Tipo de equipamento"
                  valor={aluguel.tipoEquipamento}
                />

                <CampoResumo
                  titulo="Data da solicitação"
                  valor={formatarData(
                    aluguel.dataPedido
                  )}
                />

                <CampoResumo
                  titulo="Início previsto"
                  valor={formatarData(
                    aluguel.dataHoraInicio
                  )}
                />

                <CampoResumo
                  titulo="Devolução prevista"
                  valor={formatarData(
                    aluguel.dataHoraFim
                  )}
                />

                <div className="entrega-campo-largo">
                  <span>Endereço de entrega</span>

                  <strong>
                    {formatarEndereco(
                      aluguel.enderecoEntrega
                    )}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="entrega-etapa">
          <div className="entrega-etapa-titulo">
            <span className="entrega-numero">2</span>

            <h2>Equipamento físico</h2>
          </div>

          <p className="entrega-descricao">
            Selecione o equipamento que será
            entregue ao cliente.
          </p>

          {!aluguel ? (
            <div className="entrega-aviso">
              Selecione um aluguel para consultar
              os equipamentos disponíveis.
            </div>
          ) : (
            <>
              <div className="entrega-form-grid">
                <label className="entrega-campo entrega-campo-largo">
                  Equipamento disponível *

                  <select
                    value={equipamentoId}
                    onChange={(evento) => {
                      setEquipamentoId(
                        evento.target.value
                      );

                      setErro("");
                    }}
                    disabled={
                      carregandoEquipamentos ||
                      registrando ||
                      equipamentosDisponiveis.length === 0
                    }
                    required
                  >
                    <option value="">
                      {carregandoEquipamentos
                        ? "Consultando equipamentos..."
                        : erroEquipamentos
                          ? "Erro na consulta"
                          : equipamentosDisponiveis.length === 0
                            ? "Nenhum equipamento disponível"
                            : "Selecione um equipamento"}
                    </option>

                    {equipamentosDisponiveis.map(
                      (item) => (
                        <option
                          key={item.idEquipamento}
                          value={item.idEquipamento}
                        >
                          {item.numeroPatrimonio}
                          {" - "}
                          {item.fabricante}
                          {" - "}
                          {item.modelo}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              {erroEquipamentos && (
                <div
                  className="entrega-erro"
                  role="alert"
                >
                  {erroEquipamentos}

                  <p>
                    Atualize a lista e selecione
                    novamente o aluguel.
                  </p>

                  <button
                    type="button"
                    className="entrega-botao-secundario"
                    onClick={atualizarLista}
                  >
                    Atualizar lista
                  </button>
                </div>
              )}

              {!carregandoEquipamentos &&
                !erroEquipamentos &&
                equipamentosDisponiveis.length === 0 && (
                  <div className="entrega-aviso">
                    Não há equipamentos disponíveis
                    do tipo solicitado neste aluguel.
                  </div>
                )}

              {equipamento && (
                <div className="entrega-resumo">
                  <h3>Equipamento selecionado</h3>

                  <div className="entrega-resumo-grid">
                    <CampoResumo
                      titulo="Número de patrimônio"
                      valor={
                        equipamento.numeroPatrimonio
                      }
                    />

                    <CampoResumo
                      titulo="Fabricante"
                      valor={equipamento.fabricante}
                    />

                    <CampoResumo
                      titulo="Modelo"
                      valor={equipamento.modelo}
                    />

                    <CampoResumo
                      titulo="Situação"
                      valor="Disponível"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section className="entrega-etapa">
          <div className="entrega-etapa-titulo">
            <span className="entrega-numero">3</span>

            <h2>Dados da entrega</h2>
          </div>

          <p className="entrega-descricao">
            Informe quando o equipamento foi
            entregue ao cliente.
          </p>

          <div className="entrega-form-grid">
            <label className="entrega-campo">
              Data e hora da entrega *

              <input
                type="datetime-local"
                value={dataEntrega}
                disabled={
                  !aluguel ||
                  !equipamento ||
                  registrando
                }
                onChange={(evento) => {
                  setDataEntrega(
                    evento.target.value
                  );

                  setErro("");
                }}
                required
              />
            </label>
          </div>
        </section>

        <div className="entrega-confirmacao">
          <h3>Confirmação da entrega</h3>

          <div className="entrega-confirmacao-linha">
            <span>Aluguel</span>

            <strong>
              {aluguel
                ? `#${String(aluguel.idAluguel)
                    .padStart(4, "0")}`
                : "—"}
            </strong>
          </div>

          <div className="entrega-confirmacao-linha">
            <span>Cliente</span>

            <strong>
              {aluguel?.nomeCliente || "—"}
            </strong>
          </div>

          <div className="entrega-confirmacao-linha">
            <span>Tipo de equipamento</span>

            <strong>
              {aluguel?.tipoEquipamento || "—"}
            </strong>
          </div>

          <div className="entrega-confirmacao-linha">
            <span>Patrimônio</span>

            <strong>
              {equipamento?.numeroPatrimonio ?? "—"}
            </strong>
          </div>

          <div className="entrega-confirmacao-linha">
            <span>Data da entrega</span>

            <strong>
              {dataEntrega
                ? formatarData(dataEntrega)
                : "—"}
            </strong>
          </div>

          <div className="entrega-confirmacao-linha entrega-confirmacao-final">
            <span>Situação após o registro</span>

            <strong>
              {aluguel ? "Em locação" : "—"}
            </strong>
          </div>

          <p>
            Após a confirmação pelo servidor, o
            equipamento será vinculado ao aluguel
            e ficará indisponível para novas entregas.
          </p>
        </div>

        {erro && (
          <div className="entrega-erro" role="alert">
            {erro}
          </div>
        )}

        <div className="entrega-acoes">
          <button
            type="button"
            className="entrega-botao-secundario"
            onClick={limpar}
            disabled={registrando}
          >
            Limpar formulário
          </button>

          <button
            type="submit"
            className="entrega-botao-principal"
            disabled={!podeRegistrar}
          >
            {registrando
              ? "Registrando entrega..."
              : "Registrar entrega"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrarEntrega;