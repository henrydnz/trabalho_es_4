import { useState } from "react";

import DetalhesAluguel from "./DetalhesAluguel";

import {
  buscarClientePorDocumento,
} from "../services/clientesService";

import {
  buscarAlugueisPorCliente,
} from "../services/alugueisService";

import "../styles/alugueis.css";

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

function MeusAlugueis({ setPagina }) {
  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState(null);
  const [alugueis, setAlugueis] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [erro, setErro] = useState("");

  const [carregando, setCarregando] = useState(false);

  const [aluguelSelecionado, setAluguelSelecionado] =
    useState(null);

  async function consultarAlugueis(evento) {
    evento?.preventDefault();

    if (carregando) {
      return;
    }

    setErro("");
    setCliente(null);
    setAlugueis([]);
    setFiltro("Todos");
    setAluguelSelecionado(null);

    const documentoLimpo = somenteNumeros(documento);

    if (![11, 14].includes(documentoLimpo.length)) {
      setErro("Informe um CPF ou CNPJ válido.");
      return;
    }

    setCarregando(true);

    try {
      const clienteEncontrado =
        await buscarClientePorDocumento(documentoLimpo);

      if (!clienteEncontrado) {
        setErro(
          "Nenhum cliente encontrado com esse documento."
        );

        return;
      }

      const pedidos = await buscarAlugueisPorCliente(
        clienteEncontrado.idCliente
      );

      pedidos.sort(
        (a, b) =>
          new Date(b.dataPedido) -
          new Date(a.dataPedido)
      );

      setCliente(clienteEncontrado);
      setAlugueis(pedidos);
    } catch (erro) {
      console.error(erro);

      setErro(
        "Não foi possível consultar os aluguéis. " +
        "Verifique a conexão com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  function atualizarDocumento(evento) {
    setDocumento(
      formatarDocumento(evento.target.value)
    );

    setCliente(null);
    setAlugueis([]);
    setAluguelSelecionado(null);
    setErro("");
  }

  function abrirDetalhes(aluguel) {
    setAluguelSelecionado(aluguel);

    window.scrollTo(0, 0);
  }

  function fecharDetalhes() {
    setAluguelSelecionado(null);

    consultarAlugueis();

    window.scrollTo(0, 0);
  }

  const solicitados = alugueis.filter(
    (item) => item.situacao === "Solicitado"
  ).length;

  const emLocacao = alugueis.filter(
    (item) => item.situacao === "Em locação"
  ).length;

  const encerrados = alugueis.filter(
    (item) => item.situacao === "Encerrado"
  ).length;

  const alugueisFiltrados =
    filtro === "Todos"
      ? alugueis
      : alugueis.filter(
          (item) => item.situacao === filtro
        );

  if (aluguelSelecionado) {
    return (
      <DetalhesAluguel
        aluguel={aluguelSelecionado}
        voltar={fecharDetalhes}
      />
    );
  }

  return (
    <section className="alugueis-pagina">
      <div className="alugueis-cabecalho">
        <span className="secao-etiqueta">
          ÁREA DO CLIENTE
        </span>

        <h1>Meus Aluguéis</h1>

        <p>
          Consulte suas solicitações e acompanhe cada
          etapa das suas locações.
        </p>
      </div>

      <section className="alugueis-bloco">
        <h2>Consultar meus aluguéis</h2>

        <p>
          Informe seu CPF ou CNPJ para localizar
          seus pedidos.
        </p>

        <form
          className="alugueis-busca"
          onSubmit={consultarAlugueis}
        >
          <label>
            CPF ou CNPJ

            <input
              type="text"
              inputMode="numeric"
              value={documento}
              onChange={atualizarDocumento}
              placeholder="Informe seu documento"
              disabled={carregando}
              required
            />
          </label>

          <button
            type="submit"
            className="botao-principal"
            disabled={carregando}
          >
            {carregando
              ? "Consultando..."
              : "Consultar aluguéis"}
          </button>
        </form>

        {erro && (
          <p className="alugueis-erro" role="alert">
            {erro}
          </p>
        )}
      </section>

      {carregando && (
        <div className="alugueis-vazio">
          <h3>Consultando aluguéis...</h3>

          <p>
            Aguarde enquanto consultamos o servidor.
          </p>
        </div>
      )}

      {cliente && !carregando && (
        <>
          <div className="alugueis-identificacao">
            <div>
              <span>CLIENTE IDENTIFICADO</span>

              <h2>{cliente.nome}</h2>

              <p>
                {formatarDocumento(cliente.documento)}
              </p>
            </div>

            <button
              type="button"
              className="botao-principal"
              onClick={() =>
                setPagina("Registrar Aluguel")
              }
            >
              + Novo aluguel
            </button>
          </div>

          <div className="alugueis-indicadores">
            {[
              {
                titulo: "Total de pedidos",
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
            ].map((item) => (
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

          <div className="alugueis-lista-cabecalho">
            <div>
              <h2>Histórico de aluguéis</h2>

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
                  ? "Você ainda não possui solicitações de aluguel."
                  : "Nenhum aluguel corresponde à situação selecionada."}
              </p>

              {alugueis.length === 0 ? (
                <button
                  type="button"
                  className="botao-principal"
                  onClick={() =>
                    setPagina("Registrar Aluguel")
                  }
                >
                  Solicitar primeiro aluguel
                </button>
              ) : (
                <button
                  type="button"
                  className="alugueis-botao-secundario"
                  onClick={() => setFiltro("Todos")}
                >
                  Limpar filtro
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
                      {aluguel.situacao}
                    </span>
                  </div>

                  <div className="alugueis-card-dados">
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
                      <span>Duração prevista</span>

                      <strong>
                        {aluguel.diasPrevistos} dia(s)
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
                      Ver detalhes →
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
              onClick={consultarAlugueis}
              disabled={carregando}
            >
              Atualizar aluguéis
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default MeusAlugueis;