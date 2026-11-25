import { useEffect, useState } from "react";

import {
  obterEquipamentos,
  obterTiposEquipamento,
  buscarEquipamentoPorId,
} from "../services/equipamentosService";

import "../styles/equipamentos.css";

function formatarMoeda(valor) {
  if (valor == null) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function CampoDetalhe({ titulo, valor }) {
  return (
    <div className="equipamento-campo-detalhe">
      <small>{titulo}</small>
      <strong>{valor ?? "Não informado"}</strong>
    </div>
  );
}

function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [aba, setAba] = useState("tipos");
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroSituacao, setFiltroSituacao] =
    useState("todos");

  const [equipamentoSelecionado, setEquipamentoSelecionado] =
    useState(null);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [listaEquipamentos, listaTipos] =
        await Promise.all([
          obterEquipamentos(),
          obterTiposEquipamento(),
        ]);

      setEquipamentos(listaEquipamentos);
      setTipos(listaTipos);
    } catch (erro) {
      console.error(erro);

      setEquipamentos([]);
      setTipos([]);

      setErro(
        "Não foi possível consultar os equipamentos. " +
        "Verifique se o servidor está funcionando."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function buscarTipoLocal(id) {
    return tipos.find(
      (tipo) =>
        String(tipo.idTipoEquipamento) === String(id)
    );
  }

  const quantidadeDisponiveis = equipamentos.filter(
    (equipamento) => !equipamento.isAlugado
  ).length;

  const quantidadeAlugados = equipamentos.filter(
    (equipamento) => equipamento.isAlugado
  ).length;

  const tiposFiltrados = tipos.filter((tipo) =>
    normalizarTexto(tipo.nome).includes(
      normalizarTexto(busca)
    )
  );

  const equipamentosFiltrados = equipamentos.filter(
    (equipamento) => {
      const tipo = buscarTipoLocal(
        equipamento.idTipoEquipamento
      );

      const textoEquipamento = normalizarTexto(
        [
          equipamento.modelo,
          equipamento.fabricante,
          equipamento.numeroPatrimonio,
          tipo?.nome,
        ].join(" ")
      );

      const correspondeBusca =
        textoEquipamento.includes(
          normalizarTexto(busca)
        );

      const correspondeTipo =
        filtroTipo === "todos" ||
        String(equipamento.idTipoEquipamento) ===
          filtroTipo;

      const correspondeSituacao =
        filtroSituacao === "todos" ||
        (
          filtroSituacao === "disponivel" &&
          !equipamento.isAlugado
        ) ||
        (
          filtroSituacao === "alugado" &&
          equipamento.isAlugado
        );

      return (
        correspondeBusca &&
        correspondeTipo &&
        correspondeSituacao
      );
    }
  );

  function alterarAba(novaAba) {
    setAba(novaAba);
    setBusca("");
    setFiltroTipo("todos");
    setFiltroSituacao("todos");
  }

  function filtrarPorSituacao(situacao) {
    setAba("fisicos");
    setBusca("");
    setFiltroTipo("todos");
    setFiltroSituacao(situacao);
  }

  function visualizarTipo(idTipo) {
    setAba("fisicos");
    setBusca("");
    setFiltroTipo(String(idTipo));
    setFiltroSituacao("todos");
  }

  async function visualizarEquipamento(equipamento) {
    setCarregando(true);
    setErro("");

    try {
      const detalhes = await buscarEquipamentoPorId(
        equipamento.idEquipamento
      );

      if (!detalhes) {
        setErro("Equipamento não encontrado.");
        return;
      }

      setEquipamentoSelecionado(detalhes);

      window.scrollTo(0, 0);
    } catch (erro) {
      console.error(erro);

      setErro(
        "Não foi possível consultar os detalhes " +
        "do equipamento."
      );
    } finally {
      setCarregando(false);
    }
  }

  function voltarLista() {
    setEquipamentoSelecionado(null);
    carregarDados();

    window.scrollTo(0, 0);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroTipo("todos");
    setFiltroSituacao("todos");
  }

  if (carregando) {
    return (
      <section className="equipamentos-pagina">
        <div className="equipamentos-cabecalho">
          <span className="secao-etiqueta">
            CONSULTA DE EQUIPAMENTOS
          </span>

          <h1>Equipamentos</h1>
        </div>

        <section className="equipamentos-bloco">
          <div className="equipamentos-vazio">
            <h3>Carregando equipamentos...</h3>

            <p>Aguarde enquanto consultamos o servidor.</p>
          </div>
        </section>
      </section>
    );
  }

  if (equipamentoSelecionado) {
    const equipamento = equipamentoSelecionado;

    const tipo = buscarTipoLocal(
      equipamento.idTipoEquipamento
    );

    return (
      <section className="equipamentos-pagina">
        <button
          type="button"
          className="equipamentos-voltar"
          onClick={voltarLista}
        >
          ← Voltar para equipamentos
        </button>

        <div className="equipamentos-cabecalho">
          <span className="secao-etiqueta">
            DETALHES DO EQUIPAMENTO
          </span>

          <h1>
            {equipamento.fabricante} {equipamento.modelo}
          </h1>

          <p>
            Consulte as informações e a situação
            atual deste equipamento.
          </p>
        </div>

        <section className="equipamentos-bloco">
          <div className="equipamentos-bloco-titulo">
            <h2>Identificação do equipamento</h2>

            <span
              className={`equipamentos-status ${
                equipamento.isAlugado
                  ? "alugado"
                  : "disponivel"
              }`}
            >
              {equipamento.isAlugado
                ? "Em locação"
                : "Disponível"}
            </span>
          </div>

          <div className="equipamentos-detalhes-grid">
            <CampoDetalhe
              titulo="Número de patrimônio"
              valor={equipamento.numeroPatrimonio}
            />

            <CampoDetalhe
              titulo="Tipo de equipamento"
              valor={tipo?.nome ?? equipamento.tipoEquipamento}
            />

            <CampoDetalhe
              titulo="Fabricante"
              valor={equipamento.fabricante}
            />

            <CampoDetalhe
              titulo="Modelo"
              valor={equipamento.modelo}
            />

            <CampoDetalhe
              titulo="Valor da diária"
              valor={
                tipo
                  ? formatarMoeda(tipo.valorDiaria)
                  : null
              }
            />

            <CampoDetalhe
              titulo="Situação atual"
              valor={
                equipamento.isAlugado
                  ? "Em locação"
                  : "Disponível"
              }
            />
          </div>
        </section>

        <div className="equipamentos-aviso">
          A disponibilidade do equipamento é atualizada
          por meio dos registros de entrega e devolução.
        </div>

        <div className="equipamentos-acoes">
          <button
            type="button"
            className="botao-principal"
            onClick={voltarLista}
          >
            Voltar para equipamentos
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="equipamentos-pagina">
      <div className="equipamentos-cabecalho">
        <span className="secao-etiqueta">
          CONSULTA DE EQUIPAMENTOS
        </span>

        <h1>Equipamentos</h1>

        <p>
          Consulte os equipamentos cadastrados e
          acompanhe sua disponibilidade.
        </p>
      </div>

      {erro && (
        <section
          className="equipamentos-bloco"
          role="alert"
        >
          <div className="equipamentos-vazio">
            <h3>Erro na consulta</h3>

            <p>{erro}</p>

            <button
              type="button"
              className="equipamentos-botao-secundario"
              onClick={carregarDados}
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )}

      {!erro && (
        <>
          <div className="equipamentos-indicadores">
            <button
              type="button"
              className={`equipamentos-indicador ${
                aba === "fisicos" &&
                filtroSituacao === "todos"
                  ? "ativo"
                  : ""
              }`}
              onClick={() => filtrarPorSituacao("todos")}
            >
              <span>Total de equipamentos</span>

              <strong>{equipamentos.length}</strong>

              <small>Equipamentos cadastrados</small>
            </button>

            <button
              type="button"
              className={`equipamentos-indicador ${
                aba === "fisicos" &&
                filtroSituacao === "disponivel"
                  ? "ativo"
                  : ""
              }`}
              onClick={() =>
                filtrarPorSituacao("disponivel")
              }
            >
              <span>Disponíveis</span>

              <strong className="texto-disponivel">
                {quantidadeDisponiveis}
              </strong>

              <small>Disponíveis para locação</small>
            </button>

            <button
              type="button"
              className={`equipamentos-indicador ${
                aba === "fisicos" &&
                filtroSituacao === "alugado"
                  ? "ativo"
                  : ""
              }`}
              onClick={() =>
                filtrarPorSituacao("alugado")
              }
            >
              <span>Em locação</span>

              <strong className="texto-alugado">
                {quantidadeAlugados}
              </strong>

              <small>Equipamentos alugados</small>
            </button>
          </div>

          <section className="equipamentos-bloco">
            <div className="equipamentos-abas">
              <button
                type="button"
                className={aba === "tipos" ? "ativo" : ""}
                onClick={() => alterarAba("tipos")}
              >
                Tipos de equipamentos
              </button>

              <button
                type="button"
                className={aba === "fisicos" ? "ativo" : ""}
                onClick={() => alterarAba("fisicos")}
              >
                Equipamentos físicos
              </button>
            </div>

            <div
              className={`equipamentos-filtros ${
                aba === "tipos" ? "filtro-simples" : ""
              }`}
            >
              <label>
                Buscar equipamento

                <input
                  type="text"
                  value={busca}
                  onChange={(evento) =>
                    setBusca(evento.target.value)
                  }
                  placeholder={
                    aba === "tipos"
                      ? "Nome do tipo de equipamento..."
                      : "Modelo, fabricante ou patrimônio..."
                  }
                />
              </label>

              {aba === "fisicos" && (
                <>
                  <label>
                    Tipo de equipamento

                    <select
                      value={filtroTipo}
                      onChange={(evento) =>
                        setFiltroTipo(evento.target.value)
                      }
                    >
                      <option value="todos">Todos</option>

                      {tipos.map((tipo) => (
                        <option
                          key={tipo.idTipoEquipamento}
                          value={tipo.idTipoEquipamento}
                        >
                          {tipo.nome}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Situação

                    <select
                      value={filtroSituacao}
                      onChange={(evento) =>
                        setFiltroSituacao(evento.target.value)
                      }
                    >
                      <option value="todos">Todas</option>

                      <option value="disponivel">
                        Disponível
                      </option>

                      <option value="alugado">
                        Em locação
                      </option>
                    </select>
                  </label>
                </>
              )}
            </div>

            {aba === "tipos" ? (
              <>
                <div className="equipamentos-lista-cabecalho">
                  <h2>Tipos cadastrados</h2>

                  <p>
                    {tiposFiltrados.length} tipo(s)
                    encontrado(s)
                  </p>
                </div>

                {tiposFiltrados.length === 0 ? (
                  <div className="equipamentos-vazio">
                    <h3>Nenhum tipo encontrado</h3>

                    <p>
                      {tipos.length === 0
                        ? "Nenhum tipo de equipamento cadastrado."
                        : "Tente pesquisar por outro nome."}
                    </p>

                    <button
                      type="button"
                      className="equipamentos-botao-secundario"
                      onClick={limparFiltros}
                    >
                      Limpar busca
                    </button>
                  </div>
                ) : (
                  <div className="equipamentos-lista">
                    {tiposFiltrados.map((tipo) => {
                      const equipamentosDoTipo =
                        equipamentos.filter(
                          (equipamento) =>
                            String(equipamento.idTipoEquipamento) ===
                            String(tipo.idTipoEquipamento)
                        );

                      const disponiveis =
                        equipamentosDoTipo.filter(
                          (equipamento) =>
                            !equipamento.isAlugado
                        ).length;

                      return (
                        <article
                          className="equipamentos-tipo-card"
                          key={tipo.idTipoEquipamento}
                        >
                          <div className="equipamentos-card-info">
                            <h3>{tipo.nome}</h3>

                            <p>
                              {formatarMoeda(tipo.valorDiaria)}
                              {" / dia"}
                            </p>
                          </div>

                          <div className="equipamentos-quantidade">
                            <strong>{disponiveis}</strong>

                            <small>
                              disponíveis de{" "}
                              {equipamentosDoTipo.length}
                            </small>
                          </div>

                          <button
                            type="button"
                            className="equipamentos-botao-secundario"
                            onClick={() =>
                              visualizarTipo(
                                tipo.idTipoEquipamento
                              )
                            }
                          >
                            Ver equipamentos →
                          </button>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="equipamentos-lista-cabecalho">
                  <h2>Equipamentos cadastrados</h2>

                  <p>
                    {equipamentosFiltrados.length} equipamento(s)
                    encontrado(s)
                  </p>
                </div>

                {equipamentosFiltrados.length === 0 ? (
                  <div className="equipamentos-vazio">
                    <h3>Nenhum equipamento encontrado</h3>

                    <p>
                      {equipamentos.length === 0
                        ? "Nenhum equipamento cadastrado."
                        : "Tente alterar os filtros ou o termo da busca."}
                    </p>

                    <button
                      type="button"
                      className="equipamentos-botao-secundario"
                      onClick={limparFiltros}
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <div className="equipamentos-lista">
                    {equipamentosFiltrados.map(
                      (equipamento) => {
                        const tipo = buscarTipoLocal(
                          equipamento.idTipoEquipamento
                        );

                        return (
                          <article
                            className="equipamentos-card"
                            key={equipamento.idEquipamento}
                          >
                            <div className="equipamentos-card-info">
                              <small className="equipamentos-patrimonio">
                                {equipamento.numeroPatrimonio}
                              </small>

                              <h3>
                                {equipamento.fabricante}{" "}
                                {equipamento.modelo}
                              </h3>

                              <p>
                                {tipo?.nome ||
                                  equipamento.tipoEquipamento ||
                                  "Tipo não informado"}
                              </p>
                            </div>

                            <span
                              className={`equipamentos-status ${
                                equipamento.isAlugado
                                  ? "alugado"
                                  : "disponivel"
                              }`}
                            >
                              {equipamento.isAlugado
                                ? "Em locação"
                                : "Disponível"}
                            </span>

                            <button
                              type="button"
                              className="equipamentos-botao-secundario"
                              onClick={() =>
                                visualizarEquipamento(
                                  equipamento
                                )
                              }
                            >
                              Ver detalhes →
                            </button>
                          </article>
                        );
                      }
                    )}
                  </div>
                )}
              </>
            )}
          </section>

          <div className="equipamentos-acoes">
            <button
              type="button"
              className="equipamentos-botao-secundario"
              onClick={carregarDados}
            >
              Atualizar equipamentos
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Equipamentos;