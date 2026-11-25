import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Enderecos from "./pages/Enderecos";
import MeuCadastro from "./pages/MeuCadastro";
import Clientes from "./pages/Clientes";
import Equipamentos from "./pages/Equipamentos";
import NovoAluguel from "./pages/NovoAluguel";
import MeusAlugueis from "./pages/MeusAlugueis";
import Alugueis from "./pages/Alugueis";
import RegistrarEntrega from "./pages/RegistrarEntrega";
import RegistrarDevolucao from "./pages/RegistrarDevolucao";

const menusPorAtor = {
  cliente: [
    "Início",
    "Meu Cadastro",
    "Registrar Aluguel",
    "Meus Aluguéis",
  ],

  tecnico: [
    "Início",
    "Clientes",
    "Equipamentos",
    "Registrar Aluguel",
    "Aluguéis",
    "Registrar Devolução",
  ],

  entrega: [
    "Início",
    "Equipamentos",
    "Aluguéis",
    "Registrar Entrega",
  ],
};

function obterPaginaInicial() {
  return window.location.pathname.replace(/\/+$/, "") === "/debug"
    ? "Debug"
    : "Início";
}

function obterAtorInicial() {
  const atorSalvo = localStorage.getItem("ator");

  return Object.keys(menusPorAtor).includes(atorSalvo)
    ? atorSalvo
    : "cliente";
}

function App() {
  const [pagina, setPaginaAtual] =
    useState(obterPaginaInicial);

  const [ator, setAtor] =
    useState(obterAtorInicial);

  function setPagina(novaPagina) {
    if (
      novaPagina !== "Debug" &&
      !menusPorAtor[ator].includes(novaPagina)
    ) {
      return;
    }

    const caminho =
      novaPagina === "Debug" ? "/debug" : "/";

    if (window.location.pathname !== caminho) {
      window.history.pushState({}, "", caminho);
    }

    setPaginaAtual(novaPagina);
    window.scrollTo(0, 0);
  }

  function alterarAtor(novoAtor) {
    if (!Object.keys(menusPorAtor).includes(novoAtor)) {
      return;
    }

    setAtor(novoAtor);
    localStorage.setItem("ator", novoAtor);

    setPagina("Início");
  }

  useEffect(() => {
    function verificarUrl() {
      setPaginaAtual(obterPaginaInicial());
    }

    window.addEventListener(
      "popstate",
      verificarUrl
    );

    return () => {
      window.removeEventListener(
        "popstate",
        verificarUrl
      );
    };
  }, []);

  function renderizarPagina() {
    switch (pagina) {
      case "Debug":
        return <Enderecos />;

      case "Início":
        return (
          <Home
            setPagina={setPagina}
            ator={ator}
          />
        );

      case "Meu Cadastro":
        return <MeuCadastro />;

      case "Clientes":
        return <Clientes />;

      case "Equipamentos":
        return <Equipamentos />;

      case "Meus Aluguéis":
        return (
          <MeusAlugueis
            setPagina={setPagina}
          />
        );

      case "Aluguéis":
        return (
          <Alugueis
            ator={ator}
            setPagina={setPagina}
          />
        );

      case "Registrar Aluguel":
        return <NovoAluguel />;

      case "Registrar Entrega":
        return <RegistrarEntrega />;

      case "Registrar Devolução":
        return <RegistrarDevolucao />;

      default:
        return (
          <Home
            setPagina={setPagina}
            ator={ator}
          />
        );
    }
  }

  return (
    <div className="app">
      {pagina === "Debug" ? (
        <header className="navbar">
          <button
            type="button"
            className="navbar-logo"
            onClick={() => setPagina("Início")}
          >
            equipass
            <span className="logo-ponto">.</span>
          </button>

          <div className="navbar-direita">
            <button
              type="button"
              onClick={() => setPagina("Início")}
            >
              Voltar ao sistema
            </button>
          </div>
        </header>
      ) : (
        <Navbar
          pagina={pagina}
          setPagina={setPagina}
          ator={ator}
          alterarAtor={alterarAtor}
          menus={menusPorAtor[ator]}
        />
      )}

      <main>{renderizarPagina()}</main>
    </div>
  );
}

export default App;