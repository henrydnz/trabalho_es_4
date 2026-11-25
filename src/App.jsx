
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Enderecos from "./pages/Enderecos";
import NovoAluguel from "./pages/NovoAluguel";
import RegistrarEntrega from "./pages/RegistrarEntrega";
import RegistrarDevolucao from "./pages/RegistrarDevolucao";

function obterPaginaInicial() {
  return window.location.pathname.replace(/\/+$/, "") === "/debug"
    ? "Debug"
    : "Início";
}

function App() {
  const [pagina, setPaginaAtual] = useState(obterPaginaInicial);

  function setPagina(novaPagina) {
    const caminho = novaPagina === "Debug" ? "/debug" : "/";

    if (window.location.pathname !== caminho) {
      window.history.pushState({}, "", caminho);
    }

    setPaginaAtual(novaPagina);
  }

  useEffect(() => {
    function verificarUrl() {
      setPaginaAtual(obterPaginaInicial());
    }

    window.addEventListener("popstate", verificarUrl);

    return () => {
      window.removeEventListener("popstate", verificarUrl);
    };
  }, []);

  function renderizarPagina() {
    switch (pagina) {
      case "Debug":
        return <Enderecos />;

      case "Início":
        return <Home setPagina={setPagina} />;

      case "Registrar Aluguel":
        return <NovoAluguel />;

      case "Registrar Entrega":
        return <RegistrarEntrega />;

      case "Registrar Devolução":
        return <RegistrarDevolucao />;

      default:
        return <Home setPagina={setPagina} />;
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
        />
      )}

      <main>{renderizarPagina()}</main>
    </div>
  );
}

export default App;
