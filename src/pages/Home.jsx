
const conteudoPorAtor = {
  cliente: {
    etiqueta: "SIMPLES, PRÁTICO E ORGANIZADO",
    titulo: "Tudo o que você precisa,",
    destaque: " ao seu alcance.",
    descricao:
      "Com o Equipass, alugar equipamentos ficou mais simples. Encontre o que precisa, organize suas locações e acompanhe cada etapa em um só lugar.",

    botaoPrincipal: "Quero alugar",
    paginaPrincipal: "Registrar Aluguel",

    botaoSecundario: "Meus aluguéis",
    paginaSecundaria: "Meus Aluguéis",

    seloTitulo: "Mais praticidade",
    seloDescricao: "Do pedido à devolução",

    secaoEtiqueta: "CONHEÇA O EQUIPASS",
    secaoTitulo: "Menos complicação.",
    secaoDestaque: "Mais possibilidades.",
    secaoDescricao:
      "Uma plataforma que conecta pessoas aos equipamentos de que precisam e facilita o gerenciamento de cada locação.",

    beneficios: [
      {
        icone: "⌕",
        titulo: "Solicite um aluguel",
        descricao:
          "Encontre o tipo de equipamento ideal para sua necessidade.",
        pagina: "Registrar Aluguel",
      },
      {
        icone: "▦",
        titulo: "Organize suas locações",
        descricao:
          "Consulte seus pedidos, períodos de aluguel e informações importantes.",
        pagina: "Meus Aluguéis",
      },
      {
        icone: "✓",
        titulo: "Meu cadastro",
        descricao:
          "Consulte e mantenha seus dados cadastrais e endereços.",
        pagina: "Meu Cadastro",
      },
    ],
  },

  tecnico: {
    etiqueta: "ÁREA DO ATENDENTE TÉCNICO",
    titulo: "Gerencie suas locações",
    destaque: " em um só lugar.",
    descricao:
      "Cadastre clientes, consulte equipamentos, registre pedidos de aluguel e acompanhe as devoluções de forma simples e organizada.",

    botaoPrincipal: "Registrar aluguel",
    paginaPrincipal: "Registrar Aluguel",

    botaoSecundario: "Consultar aluguéis",
    paginaSecundaria: "Aluguéis",

    seloTitulo: "Gestão simplificada",
    seloDescricao: "Controle de cada locação",

    secaoEtiqueta: "ÁREA DE ATENDIMENTO",
    secaoTitulo: "Mais organização.",
    secaoDestaque: "Melhor atendimento.",
    secaoDescricao:
      "Acesse rapidamente as principais funcionalidades disponíveis para o atendente técnico.",

    beneficios: [
      {
        icone: "♙",
        titulo: "Gerenciar clientes",
        descricao:
          "Cadastre e consulte clientes, seus contatos e endereços.",
        pagina: "Clientes",
      },
      {
        icone: "▦",
        titulo: "Consultar equipamentos",
        descricao:
          "Consulte os equipamentos cadastrados e sua disponibilidade.",
        pagina: "Equipamentos",
      },
      {
        icone: "✓",
        titulo: "Registrar devolução",
        descricao:
          "Registre a devolução dos equipamentos e encerre as locações.",
        pagina: "Registrar Devolução",
      },
    ],
  },

  entrega: {
    etiqueta: "ÁREA DO ATENDENTE DE ENTREGA",
    titulo: "Organize e acompanhe",
    destaque: " suas entregas.",
    descricao:
      "Consulte os pedidos de aluguel, verifique os equipamentos disponíveis e registre as entregas aos clientes.",

    botaoPrincipal: "Registrar entrega",
    paginaPrincipal: "Registrar Entrega",

    botaoSecundario: "Consultar aluguéis",
    paginaSecundaria: "Aluguéis",

    seloTitulo: "Entregas organizadas",
    seloDescricao: "Controle de equipamentos",

    secaoEtiqueta: "ÁREA DE ENTREGAS",
    secaoTitulo: "Mais agilidade.",
    secaoDestaque: "Menos complicação.",
    secaoDescricao:
      "Acesse as informações necessárias para organizar e registrar a entrega dos equipamentos.",

    beneficios: [
      {
        icone: "⌕",
        titulo: "Consultar aluguéis",
        descricao:
          "Consulte os pedidos e as informações necessárias para cada entrega.",
        pagina: "Aluguéis",
      },
      {
        icone: "▦",
        titulo: "Consultar equipamentos",
        descricao:
          "Verifique os equipamentos cadastrados e disponíveis para locação.",
        pagina: "Equipamentos",
      },
      {
        icone: "✓",
        titulo: "Registrar entrega",
        descricao:
          "Vincule o equipamento ao pedido e registre sua entrega ao cliente.",
        pagina: "Registrar Entrega",
      },
    ],
  },
};

function Home({ setPagina, ator = "cliente" }) {
  const conteudo =
    conteudoPorAtor[ator] || conteudoPorAtor.cliente;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-texto">
          <span className="hero-etiqueta">
            {conteudo.etiqueta}
          </span>

          <h1>
            {conteudo.titulo}
            <span>{conteudo.destaque}</span>
          </h1>

          <p>{conteudo.descricao}</p>

          <div className="hero-acoes">
            <button
              type="button"
              className="botao-principal"
              onClick={() =>
                setPagina(conteudo.paginaPrincipal)
              }
            >
              {conteudo.botaoPrincipal}
              <span>→</span>
            </button>

            <button
              type="button"
              className="botao-secundario"
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              onClick={() =>
                setPagina(conteudo.paginaSecundaria)
              }
            >
              {conteudo.botaoSecundario}
            </button>
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
              <strong>{conteudo.seloTitulo}</strong>
              <small>{conteudo.seloDescricao}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="sobre" id="sobre">
        <div className="secao-cabecalho">
          <span className="secao-etiqueta">
            {conteudo.secaoEtiqueta}
          </span>

          <h2>
            {conteudo.secaoTitulo}
            <br />
            {conteudo.secaoDestaque}
          </h2>

          <p>{conteudo.secaoDescricao}</p>
        </div>

        <div className="beneficios">
          {conteudo.beneficios.map((beneficio) => (
            <button
              key={beneficio.titulo}
              type="button"
              className="beneficio"
              style={{
                textAlign: "left",
                color: "inherit",
              }}
              onClick={() => setPagina(beneficio.pagina)}
            >
              <div className="beneficio-icone">
                {beneficio.icone}
              </div>

              <h3>{beneficio.titulo}</h3>

              <p>{beneficio.descricao}</p>
            </button>
          ))}
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