
import "../styles/alugueis.css";

function formatarMoeda(valor) {
  if (valor === null || valor === undefined) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(valor) {
  if (!valor) {
    return "Ainda não registrado";
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

function CampoDetalhe({ titulo, valor }) {
  return (
    <div className="detalhes-campo">
      <span>{titulo}</span>
      <strong>{valor ?? "Não informado"}</strong>
    </div>
  );
}

function DetalhesAluguel({ aluguel, voltar }) {
  if (!aluguel) {
    return (
      <section className="alugueis-pagina">
        <h1>Aluguel não encontrado</h1>

        <button
          type="button"
          className="alugueis-botao-secundario"
          onClick={voltar}
        >
          ← Voltar
        </button>
      </section>
    );
  }

  const endereco = aluguel.enderecoEntrega;
  const equipamento = aluguel.equipamento;

  const etapas = [
    {
      titulo: "Solicitado",
      descricao: "Pedido registrado",
      data: aluguel.dataPedido,
    },
    {
      titulo: "Em locação",
      descricao: "Equipamento entregue",
      data: aluguel.dataHoraEntrega,
    },
    {
      titulo: "Encerrado",
      descricao: "Equipamento devolvido",
      data: aluguel.dataHoraDevolucao,
    },
  ];

  const etapaAtual = etapas.findIndex(
    (etapa) => etapa.titulo === aluguel.situacao
  );

  return (
    <section className="alugueis-pagina">
      <button
        type="button"
        className="detalhes-voltar"
        onClick={voltar}
      >
        ← Voltar para os aluguéis
      </button>

      <div className="alugueis-cabecalho">
        <span className="secao-etiqueta">
          CONSULTA DE LOCAÇÃO
        </span>

        <div className="detalhes-cabecalho">
          <h1>
            Aluguel #{String(aluguel.idAluguel)
              .padStart(4, "0")}
          </h1>

          <span
            className={`alugueis-status ${
              classeSituacao(aluguel.situacao)
            }`}
          >
            {aluguel.situacao}
          </span>
        </div>

        <p>
          Consulte as informações e acompanhe o
          andamento desta locação.
        </p>
      </div>

      <section className="alugueis-bloco">
        <h2>Andamento da locação</h2>

        <div className="detalhes-etapas">
          {etapas.map((etapa, indice) => (
            <div
              key={etapa.titulo}
              className={`detalhes-etapa ${
                indice <= etapaAtual ? "concluida" : ""
              } ${indice === etapaAtual ? "atual" : ""}`}
            >
              <div className="detalhes-etapa-numero">
                {indice < etapaAtual ? "✓" : indice + 1}
              </div>

              <h3>{etapa.titulo}</h3>

              <p>{etapa.descricao}</p>

              <small>
                {etapa.data
                  ? formatarData(etapa.data)
                  : "Aguardando"}
              </small>
            </div>
          ))}
        </div>
      </section>

      <section className="alugueis-bloco">
        <h2>Dados do cliente</h2>

        <div className="detalhes-grid">
          <CampoDetalhe
            titulo="Nome do cliente"
            valor={aluguel.nomeCliente}
          />

          <CampoDetalhe
            titulo="CPF ou CNPJ"
            valor={aluguel.documentoCliente}
          />
        </div>
      </section>

      <section className="alugueis-bloco">
        <h2>Equipamento</h2>

        <div className="detalhes-grid">
          <CampoDetalhe
            titulo="Tipo de equipamento solicitado"
            valor={aluguel.tipoEquipamento}
          />

          <CampoDetalhe
            titulo="Valor da diária"
            valor={formatarMoeda(aluguel.valorDiaria)}
          />
        </div>

        {equipamento ? (
          <div className="detalhes-equipamento">
            <h3>Equipamento entregue</h3>

            <div className="detalhes-grid">
              <CampoDetalhe
                titulo="Modelo"
                valor={equipamento.modelo}
              />

              <CampoDetalhe
                titulo="Fabricante"
                valor={equipamento.fabricante}
              />

              <CampoDetalhe
                titulo="Número de patrimônio"
                valor={equipamento.numeroPatrimonio}
              />
            </div>
          </div>
        ) : (
          <div className="detalhes-aviso">
            O equipamento físico ainda não foi vinculado
            a esta solicitação. A identificação será
            registrada no momento da entrega.
          </div>
        )}
      </section>

      <section className="alugueis-bloco">
        <h2>Datas da locação</h2>

        <div className="detalhes-grid">
          <CampoDetalhe
            titulo="Data da solicitação"
            valor={formatarData(aluguel.dataPedido)}
          />

          <CampoDetalhe
            titulo="Início previsto"
            valor={formatarData(aluguel.dataHoraInicio)}
          />

          <CampoDetalhe
            titulo="Devolução prevista"
            valor={formatarData(aluguel.dataHoraFim)}
          />

          <CampoDetalhe
            titulo="Duração prevista"
            valor={`${aluguel.diasPrevistos} dia(s)`}
          />

          <CampoDetalhe
            titulo="Entrega realizada em"
            valor={formatarData(aluguel.dataHoraEntrega)}
          />

          <CampoDetalhe
            titulo="Devolução realizada em"
            valor={formatarData(aluguel.dataHoraDevolucao)}
          />
        </div>
      </section>

      <section className="alugueis-bloco">
        <h2>Endereço de entrega</h2>

        {endereco ? (
          <div className="detalhes-grid">
            <CampoDetalhe
              titulo="CEP"
              valor={endereco.cep}
            />

            <CampoDetalhe
              titulo="Logradouro"
              valor={`${endereco.tipoLogradouro} ${endereco.logradouro}`}
            />

            <CampoDetalhe
              titulo="Número"
              valor={endereco.numero}
            />

            <CampoDetalhe
              titulo="Complemento"
              valor={endereco.complemento || "Não informado"}
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
              valor={`${endereco.nomeEstado} - ${endereco.uf}`}
            />
          </div>
        ) : (
          <p>Endereço não informado.</p>
        )}
      </section>

      <section className="detalhes-financeiro">
        <h2>Resumo financeiro</h2>

        <div className="detalhes-financeiro-linha">
          <span>Valor da diária</span>

          <strong>
            {formatarMoeda(aluguel.valorDiaria)}
          </strong>
        </div>

        <div className="detalhes-financeiro-linha">
          <span>Duração prevista</span>

          <strong>
            {aluguel.diasPrevistos} dia(s)
          </strong>
        </div>

        <div className="detalhes-financeiro-linha">
          <span>Valor total previsto</span>

          <strong>
            {formatarMoeda(aluguel.valorTotal)}
          </strong>
        </div>

        <div className="detalhes-financeiro-linha detalhes-total">
          <span>Valor pago</span>

          <strong>
            {aluguel.valorPago === null ||
            aluguel.valorPago === undefined
              ? "Aguardando registro"
              : formatarMoeda(aluguel.valorPago)}
          </strong>
        </div>

        <p>
          O valor pago será registrado pelo atendente
          técnico no momento da devolução.
        </p>
      </section>

      <div className="detalhes-acoes">
        <button
          type="button"
          className="alugueis-botao-secundario"
          onClick={voltar}
        >
          ← Voltar para os aluguéis
        </button>
      </div>
    </section>
  );
}

export default DetalhesAluguel;
