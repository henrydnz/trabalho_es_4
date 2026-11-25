
function Home({ setPagina }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-texto">
          <span className="hero-etiqueta">
            SIMPLES, PRÁTICO E ORGANIZADO
          </span>

          <h1>
            Tudo o que você precisa,
            <span> ao seu alcance.</span>
          </h1>

          <p>
            Com o Equipass, alugar equipamentos ficou
            mais simples. Encontre o que precisa,
            organize suas locações e acompanhe cada
            etapa em um só lugar.
          </p>

          <div className="hero-acoes">
            <button
              type="button"
              className="botao-principal"
              onClick={() => setPagina("Registrar Aluguel")}
            >
              Quero alugar
              <span>→</span>
            </button>

            <a className="botao-secundario" href="#sobre">
              Conheça o Equipass
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-forma"></div>

          <img
            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=85"
            alt="Equipamentos e ferramentas de trabalho"
          />

          <div className="hero-selo">
            <div>
              <strong>Mais praticidade</strong>
              <small>Do pedido à devolução</small>
            </div>
          </div>
        </div>
      </section>

      <section className="sobre" id="sobre">
        <div className="secao-cabecalho">
          <span className="secao-etiqueta">
            CONHEÇA O EQUIPASS
          </span>

          <h2>
            Menos complicação.
            <br />
            Mais possibilidades.
          </h2>

          <p>
            Uma plataforma que conecta pessoas aos
            equipamentos de que precisam e facilita
            o gerenciamento de cada locação.
          </p>
        </div>

        <div className="beneficios">
          <article className="beneficio">
            <div className="beneficio-icone">⌕</div>
            <h3>Escolha com facilidade</h3>
            <p>
              Encontre o tipo de equipamento ideal
              para sua necessidade.
            </p>
          </article>

          <article className="beneficio">
            <div className="beneficio-icone">▦</div>
            <h3>Organize suas locações</h3>
            <p>
              Consulte seus pedidos, períodos de
              aluguel e informações importantes.
            </p>
          </article>

          <article className="beneficio">
            <div className="beneficio-icone">✓</div>
            <h3>Acompanhe cada etapa</h3>
            <p>
              Tenha mais clareza sobre as entregas,
              devoluções e situação dos aluguéis.
            </p>
          </article>
        </div>
      </section>

      <section className="destaque">
        <div className="destaque-imagem">
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85"
            alt="Equipamentos em ambiente de trabalho"
          />
        </div>

        <div className="destaque-texto">
          <span className="secao-etiqueta">
            TUDO EM UM SÓ LUGAR
          </span>

          <h2>
            Equipamentos em movimento.
            Gestão sem complicação.
          </h2>

          <p>
            O Equipass reúne as informações de
            clientes, equipamentos e aluguéis
            em um ambiente simples e organizado.
          </p>

          <p>
            Cada etapa fica registrada, desde
            a solicitação até a devolução.
          </p>
        </div>
      </section>

      <footer className="rodape">
        <strong>equipass.</strong>
        <span>
          © {new Date().getFullYear()} Equipass
        </span>
      </footer>
    </div>
  );
}

export default Home;
