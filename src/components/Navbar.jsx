
function Navbar({
  pagina,
  setPagina,
  ator,
  alterarAtor,
  menus,
}) {
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

        <div className="navbar-perfil">
          <select
            value={ator}
            onChange={(event) => alterarAtor(event.target.value)}
            aria-label="Selecionar ator do sistema"
          >
            <option value="cliente">
              Cliente
            </option>

            <option value="tecnico">
              Atendente Técnico
            </option>

            <option value="entrega">
              Atendente de Entrega
            </option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Navbar;