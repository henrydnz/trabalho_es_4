import { useEffect, useState } from "react";

import DetalhesAluguel from "./DetalhesAluguel";

import {
  obterAlugueis,
} from "../services/alugueisService";

import "../styles/alugueis.css";

function somenteNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatarMoeda(valor) {
  if (valor == null) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

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

function classeSituacao(situacao) {
  switch (situacao) {
    case "Solicitado":
      return "solicitado";

    case "Em locação":
      return "em-locacao";

    case "Encerrado":
      return "encerrado";

    default:
      return "";
  }
}

function Alugueis({ ator, setPagina }) {
  const [alugueis, setAlugueis] = useState([]);

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [aluguelSelecionado, setAluguelSelecionado] =
    useState(null);

  async function atualizarLista() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await obterAlugueis();

      dados.sort(
        (a, b) =>
          new Date(b.dataPedido) -
          new Date(a.dataPedido)
      );

      setAlugueis(dados);
    } catch (erro) {
      console.error(erro);

      setAlugueis([]);

      setErro(
        "Não foi possível consultar os aluguéis. " +
        "Verifique a conexão com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    atualizarLista();
  }, []);

  const solicitados = alugueis.filter(
    (item) => item.situacao === "Solicitado"
  ).length;

  const emLocacao = alugueis.filter(
    (item) => item.situacao === "Em locação"
  ).length;

  const encerrados = alugueis.filter(
    (item) => item.situacao === "Encerrado"
  ).length;

  const indicadores = [
    {
      titulo: "Total de aluguéis",
      quantidade: alugueis.length,
      classe: "total",
      filtro: "Todos",
    },
    {
      titulo: "Solicitados",
      quantidade: solicitados,
      classe: "solicitado",
      filtro: "Solicitado",
    },
    {
      titulo: "Em locação",
      quantidade: emLocacao,
      classe: "em-locacao",
      filtro: "Em locação",
    },
    {
      titulo: "Encerrados",
      quantidade: encerrados,
      classe: "encerrado",
      filtro: "Encerrado",
    },
  ];

  const alugueisFiltrados = alugueis.filter(
    (aluguel) => {
      const termo = normalizarTexto(busca);

      const buscaNumerica = /^[\d.\-/#\s]+$/.test(
        busca.trim()
      );

      const numerosBusca = somenteNumeros(busca);

      const numeroAluguel = String(
        aluguel.idAluguel ?? ""
      );

      const numeroFormatado =
        numeroAluguel.padStart(4, "0");

      const correspondeBusca =
        termo === "" ||

        normalizarTexto(numeroAluguel)
          .includes(termo) ||

        normalizarTexto(`#${numeroFormatado}`)
          .includes(termo) ||

        normalizarTexto(aluguel.nomeCliente)
          .includes(termo) ||

        normalizarTexto(aluguel.documentoCliente)
          .includes(termo) ||

        normalizarTexto(aluguel.tipoEquipamento)
          .includes(termo) ||

        normalizarTexto(
          aluguel.equipamento?.numeroPatrimonio
        ).includes(termo) ||

        (
          buscaNumerica &&
          numerosBusca.length > 0 &&
          somenteNumeros(
            aluguel.documentoCliente
          ).includes(numerosBusca)
        );

      const correspondeSituacao =
        filtro === "Todos" ||
        aluguel.situacao === filtro;

      return correspondeBusca && correspondeSituacao;
    }
  );

  function abrirDetalhes(aluguel) {
    setAluguelSelecionado(aluguel);

    window.scrollTo(0, 0);
  }

  function fecharDetalhes() {
    setAluguelSelecionado(null);

    atualizarLista();

    window.scrollTo(0, 0);
  }

  function limparFiltros() {
    setBusca("");
    setFiltro("Todos");
  }

  if (aluguelSelecionado) {
    return (
      <DetalhesAluguel
        aluguel={aluguelSelecionado}
        voltar={fecharDetalhes}
      />
    );
  }

  if (carregando) {
    return (
      <section className="alugueis-pagina">
        <div className="alugueis-cabecalho">
          <span className="secao-etiqueta">
            CONSULTA DE LOCAÇÕES
          </span>

          <h1>Aluguéis</h1>
        </div>

        <div className="alugueis-vazio">
          <h3>Carregando aluguéis...</h3>

          <p>
            Aguarde enquanto consultamos o servidor.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="alugueis-pagina">
      <div className="alugueis-cabecalho">
        <span className="secao-etiqueta">
          CONSULTA DE LOCAÇÕES
        </span>

        <h1>Aluguéis</h1>

        <p>
          Consulte os aluguéis registrados e acompanhe
          a situação de cada locação.
        </p>
      </div>

      {erro ? (
        <section className="alugueis-bloco" role="alert">
          <div className="alugueis-vazio">
            <h3>Erro na consulta</h3>

            <p>{erro}</p>

            <button
              type="button"
              className="alugueis-botao-secundario"
              onClick={atualizarLista}
            >
              Tentar novamente
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="alugueis-indicadores">
            {indicadores.map((item) => (
              <button
                type="button"
                key={item.titulo}
                className={`alugueis-indicador ${
                  item.classe
                } ${
                  filtro === item.filtro ? "ativo" : ""
                }`}
                onClick={() => setFiltro(item.filtro)}
                aria-pressed={filtro === item.filtro}
              >
                <span>{item.titulo}</span>

                <strong>{item.quantidade}</strong>
              </button>
            ))}
          </div>

          <section className="alugueis-bloco">
            <h2>Consultar aluguéis</h2>

            <p>
              Pesquise pelo número do aluguel, nome do
              cliente, CPF, CNPJ, tipo de equipamento ou
              número de patrimônio.
            </p>

            <div className="alugueis-busca">
              <label>
                Buscar aluguel

                <input
                  type="search"
                  value={busca}
                  onChange={(evento) =>
                    setBusca(evento.target.value)
                  }
                  placeholder="Informe os dados para a busca"
                />
              </label>

              <button
                type="button"
                className="alugueis-botao-secundario"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          </section>

          {ator === "tecnico" && (
            <div className="alugueis-identificacao">
              <div>
                <span>REGISTRO DE LOCAÇÕES</span>

                <h2>Solicitações de aluguel</h2>

                <p>
                  Consulte os pedidos existentes ou
                  registre uma nova solicitação.
                </p>
              </div>

              <button
                type="button"
                className="botao-principal"
                onClick={() =>
                  setPagina("Registrar Aluguel")
                }
              >
                Novo aluguel
              </button>
            </div>
          )}

          <div className="alugueis-lista-cabecalho">
            <div>
              <h2>Aluguéis registrados</h2>

              <p>
                {alugueisFiltrados.length} registro(s)
                encontrado(s)
              </p>
            </div>

            <label className="alugueis-filtro">
              Situação

              <select
                value={filtro}
                onChange={(evento) =>
                  setFiltro(evento.target.value)
                }
              >
                <option value="Todos">
                  Todos
                </option>

                <option value="Solicitado">
                  Solicitado
                </option>

                <option value="Em locação">
                  Em locação
                </option>

                <option value="Encerrado">
                  Encerrado
                </option>
              </select>
            </label>
          </div>

          {alugueisFiltrados.length === 0 ? (
            <div className="alugueis-vazio">
              <h3>Nenhum aluguel encontrado</h3>

              <p>
                {alugueis.length === 0
                  ? "Não há aluguéis registrados para exibição."
                  : "Nenhum aluguel corresponde aos filtros informados."}
              </p>

              {alugueis.length === 0 ? (
                <button
                  type="button"
                  className="alugueis-botao-secundario"
                  onClick={atualizarLista}
                >
                  Atualizar lista
                </button>
              ) : (
                <button
                  type="button"
                  className="alugueis-botao-secundario"
                  onClick={limparFiltros}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="alugueis-lista">
              {alugueisFiltrados.map((aluguel) => (
                <article
                  className="alugueis-card"
                  key={aluguel.idAluguel}
                >
                  <div className="alugueis-card-topo">
                    <div>
                      <span className="alugueis-pedido">
                        PEDIDO #
                        {String(aluguel.idAluguel)
                          .padStart(4, "0")}
                      </span>

                      <h3>
                        {aluguel.tipoEquipamento ||
                          "Não informado"}
                      </h3>
                    </div>

                    <span
                      className={`alugueis-status ${
                        classeSituacao(aluguel.situacao)
                      }`}
                    >
                      {aluguel.situacao ||
                        "Não informado"}
                    </span>
                  </div>

                  <div className="alugueis-card-dados">
                    <div>
                      <span>Cliente</span>

                      <strong>
                        {aluguel.nomeCliente ||
                          "Não informado"}
                      </strong>
                    </div>

                    <div>
                      <span>CPF ou CNPJ</span>

                      <strong>
                        {aluguel.documentoCliente ||
                          "Não informado"}
                      </strong>
                    </div>

                    <div>
                      <span>Início previsto</span>

                      <strong>
                        {formatarData(
                          aluguel.dataHoraInicio
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Devolução prevista</span>

                      <strong>
                        {formatarData(
                          aluguel.dataHoraFim
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Data da solicitação</span>

                      <strong>
                        {formatarData(
                          aluguel.dataPedido
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Equipamento físico</span>

                      <strong>
                        {aluguel.equipamento
                          ?.numeroPatrimonio ??
                          "Ainda não vinculado"}
                      </strong>
                    </div>
                  </div>

                  <div className="alugueis-card-rodape">
                    <div>
                      <span>Valor previsto</span>

                      <strong>
                        {formatarMoeda(
                          aluguel.valorTotal
                        )}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="alugueis-botao-secundario"
                      onClick={() =>
                        abrirDetalhes(aluguel)
                      }
                    >
                      Ver detalhes
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="detalhes-acoes">
            <button
              type="button"
              className="alugueis-botao-secundario"
              onClick={atualizarLista}
            >
              Atualizar aluguéis
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Alugueis;