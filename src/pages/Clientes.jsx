import { useState } from "react";
import MeuCadastro from "./MeuCadastro";
import "../styles/clientes.css";

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

function CampoDetalhe({ titulo, valor }) {
  return (
    <div className="cliente-campo-detalhe">
      <small>{titulo}</small>
      <strong>{valor || "Não informado"}</strong>
    </div>
  );
}

function Clientes() {
  const [clientes, setClientes] = useState(obterClientes);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [clienteSelecionado, setClienteSelecionado] =
    useState(null);

  const [exibirCadastro, setExibirCadastro] =
    useState(false);

  const quantidadeFisica = clientes.filter(
    (cliente) => cliente.isFisica
  ).length;

  const quantidadeJuridica = clientes.filter(
    (cliente) => !cliente.isFisica
  ).length;

  const clientesFiltrados = clientes
    .filter((cliente) => {
      const termo = normalizarTexto(busca);
      const documentoBusca = somenteNumeros(busca);

      const correspondeNome = normalizarTexto(
        cliente.nome
      ).includes(termo);

      const correspondeDocumento =
        documentoBusca.length > 0 &&
        somenteNumeros(cliente.documento).includes(
          documentoBusca
        );

      const correspondeBusca =
        !termo ||
        correspondeNome ||
        correspondeDocumento;

      const correspondeTipo =
        filtro === "todos" ||
        (filtro === "fisica" && cliente.isFisica) ||
        (filtro === "juridica" && !cliente.isFisica);

      return correspondeBusca && correspondeTipo;
    })
    .sort((a, b) =>
      String(a.nome).localeCompare(
        String(b.nome),
        "pt-BR"
      )
    );

  function abrirCadastro() {
    setExibirCadastro(true);
    window.scrollTo(0, 0);
  }

  function voltarLista() {
    setClientes(obterClientes());
    setClienteSelecionado(null);
    setExibirCadastro(false);
    window.scrollTo(0, 0);
  }

  function visualizarCliente(cliente) {
    setClienteSelecionado(cliente);
    window.scrollTo(0, 0);
  }

  if (exibirCadastro) {
    return (
      <>
        <div className="clientes-navegacao">
          <button
            type="button"
            className="clientes-voltar"
            onClick={voltarLista}
          >
            ← Voltar para clientes
          </button>
        </div>

        <MeuCadastro />
      </>
    );
  }

  if (clienteSelecionado) {
    const cliente = clienteSelecionado;
    const endereco = cliente.endereco || {};

    return (
      <section className="clientes-pagina">
        <button
          type="button"
          className="clientes-voltar"
          onClick={voltarLista}
        >
          ← Voltar para clientes
        </button>

        <div className="clientes-cabecalho">
          <span className="secao-etiqueta">
            GERENCIAMENTO DE CLIENTES
          </span>

          <h1>{cliente.nome}</h1>

          <p>
            Consulte as informações do cliente
            cadastrado no sistema.
          </p>
        </div>

        <section className="clientes-bloco">
          <div className="clientes-bloco-titulo">
            <h2>Dados pessoais</h2>

            <span
              className={`clientes-tipo ${
                cliente.isFisica
                  ? "fisica"
                  : "juridica"
              }`}
            >
              {cliente.isFisica
                ? "Pessoa física"
                : "Pessoa jurídica"}
            </span>
          </div>

          <div className="clientes-detalhes-grid">
            <CampoDetalhe
              titulo={
                cliente.isFisica
                  ? "Nome completo"
                  : "Razão social"
              }
              valor={cliente.nome}
            />

            <CampoDetalhe
              titulo={cliente.isFisica ? "CPF" : "CNPJ"}
              valor={cliente.documento}
            />
          </div>
        </section>

        <section className="clientes-bloco">
          <h2>Telefones</h2>

          <div className="clientes-detalhes-grid">
            {cliente.telefones?.length > 0 ? (
              cliente.telefones.map(
                (telefone, indice) => (
                  <CampoDetalhe
                    key={indice}
                    titulo={`Telefone ${indice + 1}`}
                    valor={`+${telefone.ddi} (${telefone.ddd}) ${telefone.numero}`}
                  />
                )
              )
            ) : (
              <p>Nenhum telefone informado.</p>
            )}
          </div>
        </section>

        <section className="clientes-bloco">
          <h2>E-mails</h2>

          <div className="clientes-detalhes-grid">
            {cliente.emails?.length > 0 ? (
              cliente.emails.map((email, indice) => (
                <CampoDetalhe
                  key={indice}
                  titulo={`E-mail ${indice + 1}`}
                  valor={email}
                />
              ))
            ) : (
              <p>Nenhum e-mail informado.</p>
            )}
          </div>
        </section>

        <section className="clientes-bloco">
          <h2>Endereço principal</h2>

          <div className="clientes-detalhes-grid">
            <CampoDetalhe
              titulo="CEP"
              valor={endereco.cep}
            />

            <CampoDetalhe
              titulo="Tipo de logradouro"
              valor={endereco.tipoLogradouro}
            />

            <CampoDetalhe
              titulo="Logradouro"
              valor={endereco.logradouro}
            />

            <CampoDetalhe
              titulo="Número"
              valor={endereco.numero}
            />

            <CampoDetalhe
              titulo="Complemento"
              valor={endereco.complemento}
            />

            <CampoDetalhe
              titulo="Bairro"
              valor={endereco.bairro}
            />

            <CampoDetalhe
              titulo="Cidade"
              valor={endereco.cidade}
            />

            <CampoDetalhe
              titulo="Estado"
              valor={endereco.nomeEstado}
            />

            <CampoDetalhe
              titulo="UF"
              valor={endereco.uf}
            />
          </div>
        </section>

        <div className="clientes-aviso">
          Para atualizar este cadastro, consulte o
          documento {cliente.documento} no formulário
          de gerenciamento de cadastro.
        </div>

        <div className="clientes-acoes">
          <button
            type="button"
            className="clientes-botao-secundario"
            onClick={voltarLista}
          >
            Voltar
          </button>

          <button
            type="button"
            className="botao-principal"
            onClick={abrirCadastro}
          >
            Atualizar cadastro
            <span>→</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="clientes-pagina">
      <div className="clientes-cabecalho">
        <span className="secao-etiqueta">
          GERENCIAMENTO DE CLIENTES
        </span>

        <h1>Clientes</h1>

        <p>
          Consulte e gerencie os clientes cadastrados
          no sistema.
        </p>
      </div>

      <div className="clientes-indicadores">
        <button
          type="button"
          className={`clientes-indicador ${
            filtro === "todos" ? "ativo" : ""
          }`}
          onClick={() => setFiltro("todos")}
        >
          <span>Total de clientes</span>
          <strong>{clientes.length}</strong>
          <small>Clientes cadastrados</small>
        </button>

        <button
          type="button"
          className={`clientes-indicador ${
            filtro === "fisica" ? "ativo" : ""
          }`}
          onClick={() => setFiltro("fisica")}
        >
          <span>Pessoas físicas</span>
          <strong>{quantidadeFisica}</strong>
          <small>Cadastros individuais</small>
        </button>

        <button
          type="button"
          className={`clientes-indicador ${
            filtro === "juridica" ? "ativo" : ""
          }`}
          onClick={() => setFiltro("juridica")}
        >
          <span>Pessoas jurídicas</span>
          <strong>{quantidadeJuridica}</strong>
          <small>Empresas cadastradas</small>
        </button>
      </div>

      <section className="clientes-bloco">
        <div className="clientes-lista-cabecalho">
          <div>
            <h2>Clientes cadastrados</h2>

            <p>
              {clientesFiltrados.length} cliente(s)
              encontrado(s)
            </p>
          </div>

          <button
            type="button"
            className="botao-principal"
            onClick={abrirCadastro}
          >
            + Novo cliente
          </button>
        </div>

        <div className="clientes-filtros">
          <label>
            Buscar cliente

            <input
              type="text"
              value={busca}
              onChange={(evento) =>
                setBusca(evento.target.value)
              }
              placeholder="Nome, CPF ou CNPJ..."
            />
          </label>

          <label>
            Tipo de cliente

            <select
              value={filtro}
              onChange={(evento) =>
                setFiltro(evento.target.value)
              }
            >
              <option value="todos">Todos</option>

              <option value="fisica">
                Pessoa física
              </option>

              <option value="juridica">
                Pessoa jurídica
              </option>
            </select>
          </label>
        </div>

        {clientesFiltrados.length === 0 ? (
          <div className="clientes-vazio">

            <h3>Nenhum cliente encontrado</h3>

            <p>
              {clientes.length === 0
                ? "Ainda não existem clientes cadastrados."
                : "Tente alterar os filtros ou o termo da busca."}
            </p>

            {clientes.length === 0 ? (
              <button
                type="button"
                className="botao-principal"
                onClick={abrirCadastro}
              >
                Cadastrar primeiro cliente
              </button>
            ) : (
              <button
                type="button"
                className="clientes-botao-secundario"
                onClick={() => {
                  setBusca("");
                  setFiltro("todos");
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="clientes-lista">
            {clientesFiltrados.map((cliente) => (
              <article
                className="clientes-card"
                key={cliente.idCliente}
              >
                <div className="clientes-avatar">
                  {String(cliente.nome || "?")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="clientes-card-info">
                  <h3>{cliente.nome}</h3>

                  <p>{cliente.documento}</p>

                  <small>
                    {cliente.endereco?.cidade ||
                      "Cidade não informada"}
                    {cliente.endereco?.uf
                      ? ` - ${cliente.endereco.uf}`
                      : ""}
                  </small>
                </div>

                <span
                  className={`clientes-tipo ${
                    cliente.isFisica
                      ? "fisica"
                      : "juridica"
                  }`}
                >
                  {cliente.isFisica
                    ? "Pessoa física"
                    : "Pessoa jurídica"}
                </span>

                <button
                  type="button"
                  className="clientes-botao-secundario"
                  onClick={() =>
                    visualizarCliente(cliente)
                  }
                >
                  Ver cadastro →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Clientes;