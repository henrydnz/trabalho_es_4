import { useState } from "react";

import {
  obterEquipamentosDisponiveis,
} from "../services/equipamentosService";

import "../styles/registrarEntrega.css";

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
  const [alugueis, setAlugueis] =
    useState(obterAlugueis);

  const [aluguelId, setAluguelId] = useState("");
  const [equipamentoId, setEquipamentoId] =
    useState("");

  const [dataEntrega, setDataEntrega] =
    useState("");

  const [erro, setErro] = useState("");

  const alugueisPendentes = alugueis.filter(
    (item) => item.situacao === "Solicitado"
  );

  const aluguel = alugueisPendentes.find(
    (item) =>
      String(item.idAluguel) === aluguelId
  );

  const equipamentosDisponiveis = aluguel
    ? obterEquipamentosDisponiveis(
        aluguel.idTipoEquipamento
      )
    : [];

  const equipamento =
    equipamentosDisponiveis.find(
      (item) =>
        String(item.idEquipamento) === equipamentoId
    );

  const podeRegistrar =
    Boolean(aluguel) &&
    Boolean(equipamento) &&
    Boolean(dataEntrega);

  function selecionarAluguel(evento) {
    setAluguelId(evento.target.value);
    setEquipamentoId("");
    setDataEntrega("");
    setErro("");
  }

  function limpar() {
    setAluguelId("");
    setEquipamentoId("");
    setDataEntrega("");
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
      data < new Date(aluguel.dataPedido)
    ) {
      setErro(
        "A entrega não pode ocorrer antes da solicitação."
      );
      return;
    }

    setErro(
      "O registro da entrega estará disponível após a integração com o servidor."
    );
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

      <div className="entrega-indicadores">
        <div className="entrega-indicador">
          <span>Entregas pendentes</span>

          <strong>
            {alugueisPendentes.length}
          </strong>
        </div>

        <div className="entrega-indicador">
          <span>Equipamentos em locação</span>

          <strong>
            {
              alugueis.filter(
                (item) =>
                  item.situacao === "Em locação"
              ).length
            }
          </strong>
        </div>
      </div>

      <form
        className="registrar-entrega-painel"
        onSubmit={registrar}
      >
        <section className="entrega-etapa">
          <div className="entrega-etapa-titulo">
            <span className="entrega-numero">
              1
            </span>

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
                  alugueisPendentes.length === 0
                }
                required
              >
                <option value="">
                  {alugueisPendentes.length === 0
                    ? "Nenhum aluguel aguardando entrega"
                    : "Selecione um aluguel"}
                </option>

                {alugueisPendentes.map(
                  (item) => (
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
                  )
                )}
              </select>
            </label>
          </div>

          {alugueisPendentes.length === 0 && (
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
            <span className="entrega-numero">
              2
            </span>

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
                      equipamentosDisponiveis.length === 0
                    }
                    required
                  >
                    <option value="">
                      {equipamentosDisponiveis.length === 0
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

              {equipamentosDisponiveis.length === 0 && (
                <div className="entrega-aviso">
                  Não há equipamentos disponíveis
                  do tipo solicitado neste aluguel.
                </div>
              )}

              {equipamento && (
                <div className="entrega-resumo">
                  <h3>
                    Equipamento selecionado
                  </h3>

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
            <span className="entrega-numero">
              3
            </span>

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
                disabled={!aluguel || !equipamento}
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
              {equipamento?.numeroPatrimonio || "—"}
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
          <div
            className="entrega-erro"
            role="alert"
          >
            {erro}
          </div>
        )}

        <div className="entrega-acoes">
          <button
            type="button"
            className="entrega-botao-secundario"
            onClick={limpar}
          >
            Limpar formulário
          </button>

          <button
            type="submit"
            className="entrega-botao-principal"
            disabled={!podeRegistrar}
          >
            Registrar entrega
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrarEntrega;