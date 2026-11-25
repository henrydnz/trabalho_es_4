
const menus = [
  "Início",
  "Registrar Aluguel",
  "Registrar Entrega",
  "Registrar Devolução",
];

function Navbar({ pagina, setPagina }) {
  return (
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
        <nav className="navbar-menu" aria-label="Menu principal">
          {menus.map((item) => (
            <button
              key={item}
              type="button"
              className={pagina === item ? "ativo" : ""}
              onClick={() => setPagina(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
