
import { useState } from "react";
import "../styles/registrarEntrega.css";

const alugueisExemplo = [
  {
    id: 1001,
    cliente: "Ana Paula Silva",
    equipamento: "Furadeira de impacto",
    patrimonio: "EQ-001",
    marca: "Bosch",
    modelo: "GSB 13 RE",
    endereco: "Rua das Flores, 120 - Centro",
  },
  {
    id: 1002,
    cliente: "Carlos Eduardo Lima",
    equipamento: "Martelete rompedor",
    patrimonio: "EQ-002",
    marca: "Makita",
    modelo: "HM0870C",
    endereco: "Av. Brasil, 850 - Centro",
  },
  {
    id: 1003,
    cliente: "Mariana Oliveira",
    equipamento: "Lavadora de alta pressão",
    patrimonio: "EQ-003",
    marca: "Karcher",
    modelo: "K3",
    endereco: "Rua Paraná, 450 - Vila A",
  },
];

function RegistrarEntrega() {
  const [aluguelId, setAluguelId] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const aluguel = alugueisExemplo.find(
    (item) => String(item.id) === aluguelId
  );

  function registrar(evento) {
    evento.preventDefault();

    if (!aluguel || !dataEntrega || !responsavel.trim()) {
      return;
    }

    setConfirmado(true);
  }

  function limpar() {
    setAluguelId("");
    setDataEntrega("");
    setResponsavel("");
    setObservacoes("");
    setConfirmado(false);
  }

  return (
    <section className="registrar-entrega-pagina">
      <div className="registrar-entrega-cabecalho">
        <span className="secao-etiqueta">
          CONTROLE DE LOCAÇÕES
        </span>

        <h1>Registrar Entrega</h1>

        <p>
          Identifique o aluguel e registre as informações
          da entrega do equipamento ao cliente.
        </p>
      </div>

      <form
        className="registrar-entrega-painel"
        onSubmit={registrar}
      >
        <h2>Dados do aluguel</h2>

        <div className="entrega-form-grid">
          <label className="entrega-campo entrega-campo-largo">
            Número do aluguel
            <select
              value={aluguelId}
              onChange={(e) => {
                setAluguelId(e.target.value);
                setConfirmado(false);
              }}
              required
            >
              <option value="">Selecione um aluguel</option>

              {alugueisExemplo.map((item) => (
                <option key={item.id} value={item.id}>
                  #{item.id} - {item.cliente}
                </option>
              ))}
            </select>
          </label>
        </div>

        {aluguel && (
          <div className="entrega-resumo">
            <h3>Informações do aluguel</h3>

            <div className="entrega-resumo-grid">
              <div>
                <span>Cliente</span>
                <strong>{aluguel.cliente}</strong>
              </div>

              <div>
                <span>Equipamento</span>
                <strong>{aluguel.equipamento}</strong>
              </div>

              <div>
                <span>Número patrimonial</span>
                <strong>{aluguel.patrimonio}</strong>
              </div>

              <div>
                <span>Marca</span>
                <strong>{aluguel.marca}</strong>
              </div>

              <div>
                <span>Modelo</span>
                <strong>{aluguel.modelo}</strong>
              </div>

              <div>
                <span>Endereço de entrega</span>
                <strong>{aluguel.endereco}</strong>
              </div>
            </div>
          </div>
        )}

        <h2>Dados da entrega</h2>

        <div className="entrega-form-grid">
          <label className="entrega-campo">
            Data e hora da entrega
            <input
              type="datetime-local"
              value={dataEntrega}
              onChange={(e) => {
                setDataEntrega(e.target.value);
                setConfirmado(false);
              }}
              required
            />
          </label>

          <label className="entrega-campo">
            Responsável pela entrega
            <input
              type="text"
              placeholder="Nome do entregador"
              value={responsavel}
              onChange={(e) => {
                setResponsavel(e.target.value);
                setConfirmado(false);
              }}
              required
            />
          </label>

          <label className="entrega-campo entrega-campo-largo">
            Observações
            <textarea
              rows="4"
              placeholder="Informações adicionais sobre a entrega..."
              value={observacoes}
              onChange={(e) => {
                setObservacoes(e.target.value);
                setConfirmado(false);
              }}
            />
          </label>
        </div>

        {confirmado && (
          <div className="entrega-sucesso" role="status">
            Entrega simulada com sucesso! Nenhum dado foi
            enviado ao servidor.
          </div>
        )}

        <div className="entrega-acoes">
          <button
            type="button"
            className="entrega-botao-secundario"
            onClick={limpar}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="entrega-botao-principal"
          >
            Registrar entrega
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrarEntrega;
