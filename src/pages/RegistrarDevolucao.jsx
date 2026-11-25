import { useState } from "react";
import "../styles/registrarDevolucao.css";

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

function formatarData(valor) {
  if (!valor) {
    return "Não informado";
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

function formatarMoeda(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
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

function RegistrarDevolucao() {
  const [alugueis, setAlugueis] =
    useState(obterAlugueis);

  const [aluguelId, setAluguelId] = useState("");

  const [dataDevolucao, setDataDevolucao] =
    useState("");

  const [valorPago, setValorPago] = useState("");

  const [erro, setErro] = useState("");

  const alugueisEmLocacao = alugueis.filter(
    (item) => item.situacao === "Em locação"
  );

  const alugueisEncerrados = alugueis.filter(
    (item) => item.situacao === "Encerrado"
  );

  const aluguel = alugueisEmLocacao.find(
    (item) =>
      String(item.idAluguel) === aluguelId
  );

  const equipamento = aluguel?.equipamento;

  const valorPagoValido =
    valorPago.trim() !== "" &&
    Number.isFinite(Number(valorPago)) &&
    Number(valorPago) >= 0;

  const podeRegistrar =
    Boolean(aluguel) &&
    Boolean(dataDevolucao) &&
    valorPagoValido;

  function selecionarAluguel(evento) {
    setAluguelId(evento.target.value);
    setDataDevolucao("");
    setValorPago("");
    setErro("");
  }

  function limpar() {
    setAluguelId("");
    setDataDevolucao("");
    setValorPago("");
    setErro("");
  }

  function atualizarLista() {
    setAlugueis(obterAlugueis());
    limpar();
  }

  function registrar(evento) {
    evento.preventDefault();

    setErro("");

    if (!aluguel) {
      setErro("Selecione um aluguel em locação.");
      return;
    }

    if (!dataDevolucao) {
      setErro(
        "Informe a data e a hora da devolução."
      );
      return;
    }

    const data = new Date(dataDevolucao);

    if (Number.isNaN(data.getTime())) {
      setErro(
        "Informe uma data de devolução válida."
      );
      return;
    }

    if (data > new Date()) {
      setErro(
        "A data da devolução não pode estar no futuro."
      );
      return;
    }

    if (
      aluguel.dataHoraEntrega &&
      data < new Date(aluguel.dataHoraEntrega)
    ) {
      setErro(
        "A devolução não pode ocorrer antes da entrega."
      );
      return;
    }

    if (!valorPagoValido) {
      setErro("Informe um valor pago válido.");
      return;
    }

    setErro(
      "O registro da devolução estará disponível após a integração com o servidor."
    );
  }

  return (
    <section className="registrar-devolucao-pagina">
      <div className="registrar-devolucao-cabecalho">
        <span className="secao-etiqueta">
          CONTROLE DE LOCAÇÕES
        </span>

        <h1>Registrar Devolução</h1>

        <p>
          Localize um aluguel em andamento, confira
          o equipamento devolvido e registre as
          informações da devolução.
        </p>
      </div>

      <div className="devolucao-indicadores">
        <div className="devolucao-indicador">
          <span>Aluguéis em andamento</span>

          <strong>
            {alugueisEmLocacao.length}
          </strong>
        </div>

        <div className="devolucao-indicador">
          <span>Aluguéis encerrados</span>

          <strong>
            {alugueisEncerrados.length}
          </strong>
        </div>
      </div>

      <form
        className="registrar-devolucao-painel"
        onSubmit={registrar}
      >
        <section className="devolucao-etapa">
          <div className="devolucao-etapa-titulo">
            <span className="devolucao-numero">
              1
            </span>

            <h2>Identificação do aluguel</h2>
          </div>

          <p className="devolucao-descricao">
            Selecione um aluguel cujo equipamento
            já tenha sido entregue ao cliente.
          </p>

          <div className="devolucao-form-grid">
            <label className="devolucao-campo devolucao-campo-largo">
              Número do aluguel *

              <select
                value={aluguelId}
                onChange={selecionarAluguel}
                disabled={
                  alugueisEmLocacao.length === 0
                }
                required
              >
                <option value="">
                  {alugueisEmLocacao.length === 0
                    ? "Nenhum aluguel em locação"
                    : "Selecione um aluguel"}
                </option>

                {alugueisEmLocacao.map((item) => (
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

          {alugueisEmLocacao.length === 0 && (
            <div className="devolucao-vazio">
              <h3>Nenhuma devolução pendente</h3>

              <p>
                Não há aluguéis em andamento
                aguardando a devolução do equipamento.
              </p>

              <button
                type="button"
                className="devolucao-botao-secundario"
                onClick={atualizarLista}
              >
                Atualizar lista
              </button>
            </div>
          )}

          {aluguel && (
            <div className="devolucao-resumo">
              <div className="devolucao-resumo-cabecalho">
                <h3>Informações do aluguel</h3>

                <span className="devolucao-status">
                  Em locação
                </span>
              </div>

              <div className="devolucao-resumo-grid">
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
                  titulo="Entrega realizada em"
                  valor={formatarData(
                    aluguel.dataHoraEntrega
                  )}
                />

                <CampoResumo
                  titulo="Devolução prevista"
                  valor={formatarData(
                    aluguel.dataHoraFim
                  )}
                />

                <CampoResumo
                  titulo="Valor previsto"
                  valor={formatarMoeda(
                    aluguel.valorTotal
                  )}
                />
              </div>
            </div>
          )}
        </section>

        <section className="devolucao-etapa">
          <div className="devolucao-etapa-titulo">
            <span className="devolucao-numero">
              2
            </span>

            <h2>Conferência do equipamento</h2>
          </div>

          <p className="devolucao-descricao">
            Confira os dados do equipamento físico
            vinculado ao aluguel.
          </p>

          {!aluguel ? (
            <div className="devolucao-aviso">
              Selecione um aluguel para visualizar
              as informações do equipamento.
            </div>
          ) : equipamento ? (
            <div className="devolucao-resumo">
              <h3>Equipamento vinculado</h3>

              <div className="devolucao-resumo-grid">
                <CampoResumo
                  titulo="Tipo de equipamento"
                  valor={aluguel.tipoEquipamento}
                />

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
                  valor="Em locação"
                />
              </div>
            </div>
          ) : (
            <div className="devolucao-aviso">
              As informações do equipamento físico
              não estão disponíveis.
            </div>
          )}
        </section>

        <section className="devolucao-etapa">
          <div className="devolucao-etapa-titulo">
            <span className="devolucao-numero">
              3
            </span>

            <h2>Dados da devolução</h2>
          </div>

          <p className="devolucao-descricao">
            Informe a data e a hora em que o
            equipamento foi devolvido.
          </p>

          <div className="devolucao-form-grid">
            <label className="devolucao-campo">
              Data e hora da devolução *

              <input
                type="datetime-local"
                value={dataDevolucao}
                disabled={!aluguel}
                onChange={(evento) => {
                  setDataDevolucao(
                    evento.target.value
                  );
                  setErro("");
                }}
                required
              />
            </label>
          </div>
        </section>

        <section className="devolucao-etapa">
          <div className="devolucao-etapa-titulo">
            <span className="devolucao-numero">
              4
            </span>

            <h2>Informações financeiras</h2>
          </div>

          <p className="devolucao-descricao">
            Informe o valor efetivamente pago pelo
            cliente referente à locação.
          </p>

          <div className="devolucao-financeiro">
            <div className="devolucao-financeiro-item">
              <span>Valor da diária</span>

              <strong>
                {aluguel
                  ? formatarMoeda(
                      aluguel.valorDiaria
                    )
                  : "—"}
              </strong>
            </div>

            <div className="devolucao-financeiro-item">
              <span>Valor total previsto</span>

              <strong>
                {aluguel
                  ? formatarMoeda(
                      aluguel.valorTotal
                    )
                  : "—"}
              </strong>
            </div>
          </div>

          <div className="devolucao-form-grid">
            <label className="devolucao-campo">
              Valor pago (R$) *

              <input
                type="number"
                min="0"
                step="0.01"
                value={valorPago}
                placeholder="0,00"
                disabled={!aluguel}
                onChange={(evento) => {
                  setValorPago(evento.target.value);
                  setErro("");
                }}
                required
              />
            </label>
          </div>

          <p className="devolucao-observacao">
            Este campo registra o valor recebido.
            O sistema não realiza o processamento
            do pagamento.
          </p>
        </section>

        <div className="devolucao-confirmacao">
          <h3>Confirmação da devolução</h3>

          <div className="devolucao-confirmacao-linha">
            <span>Aluguel</span>

            <strong>
              {aluguel
                ? `#${String(aluguel.idAluguel)
                    .padStart(4, "0")}`
                : "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha">
            <span>Cliente</span>

            <strong>
              {aluguel?.nomeCliente || "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha">
            <span>Tipo de equipamento</span>

            <strong>
              {aluguel?.tipoEquipamento || "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha">
            <span>Patrimônio</span>

            <strong>
              {equipamento?.numeroPatrimonio ||
                "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha">
            <span>Data da devolução</span>

            <strong>
              {dataDevolucao
                ? formatarData(dataDevolucao)
                : "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha">
            <span>Valor previsto</span>

            <strong>
              {aluguel
                ? formatarMoeda(
                    aluguel.valorTotal
                  )
                : "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha">
            <span>Valor pago</span>

            <strong>
              {valorPagoValido
                ? formatarMoeda(
                    Number(valorPago)
                  )
                : "—"}
            </strong>
          </div>

          <div className="devolucao-confirmacao-linha devolucao-confirmacao-final">
            <span>Situação após o registro</span>

            <strong>
              {aluguel ? "Encerrado" : "—"}
            </strong>
          </div>

          <p>
            Após a confirmação pelo servidor,
            o aluguel será encerrado e o equipamento
            ficará disponível para novas locações.
          </p>
        </div>

        {erro && (
          <div
            className="devolucao-erro"
            role="alert"
          >
            {erro}
          </div>
        )}

        <div className="devolucao-acoes">
          <button
            type="button"
            className="devolucao-botao-secundario"
            onClick={limpar}
          >
            Limpar formulário
          </button>

          <button
            type="submit"
            className="devolucao-botao-principal"
            disabled={!podeRegistrar}
          >
            Registrar devolução
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrarDevolucao;