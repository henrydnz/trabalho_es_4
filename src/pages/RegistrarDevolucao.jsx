
import { useState } from "react";
import "../styles/registrarDevolucao.css";

const alugueisExemplo = [
  {
    id: 1001,
    cliente: "Ana Paula Silva",
    equipamento: "Furadeira de impacto",
    patrimonio: "EQ-001",
    marca: "Bosch",
    modelo: "GSB 13 RE",
    dataPrevista: "2026-11-08T14:00",
  },
  {
    id: 1002,
    cliente: "Carlos Eduardo Lima",
    equipamento: "Martelete rompedor",
    patrimonio: "EQ-002",
    marca: "Makita",
    modelo: "HM0870C",
    dataPrevista: "2026-11-10T16:00",
  },
  {
    id: 1003,
    cliente: "Mariana Oliveira",
    equipamento: "Lavadora de alta pressão",
    patrimonio: "EQ-003",
    marca: "Karcher",
    modelo: "K3",
    dataPrevista: "2026-11-12T10:00",
  },
];

function formatarData(valor) {
  if (!valor) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "—";

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function RegistrarDevolucao() {
  const [aluguelId, setAluguelId] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [condicao, setCondicao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const aluguel = alugueisExemplo.find(
    (item) => String(item.id) === aluguelId
  );

  function registrar(evento) {
    evento.preventDefault();

    setConfirmado(false);

    if (
      !aluguel ||
      !dataDevolucao ||
      !responsavel.trim() ||
      !condicao
    ) {
      return;
    }

    setConfirmado(true);
  }

  function limpar() {
    setAluguelId("");
    setDataDevolucao("");
    setResponsavel("");
    setCondicao("");
    setObservacoes("");
    setConfirmado(false);
  }

  function atualizarCampo(funcao, valor) {
    funcao(valor);
    setConfirmado(false);
  }

  return (
    <section className="registrar-devolucao-pagina">
      <div className="registrar-devolucao-cabecalho">
        <span className="secao-etiqueta">
          CONTROLE DE LOCAÇÕES
        </span>

        <h1>Registrar Devolução</h1>

        <p>
          Identifique o aluguel, confira o equipamento
          devolvido e registre as condições da devolução.
        </p>
      </div>

      <form
        className="registrar-devolucao-painel"
        onSubmit={registrar}
      >
        <h2>Dados do aluguel</h2>

        <div className="devolucao-form-grid">
          <label className="devolucao-campo devolucao-campo-largo">
            Número do aluguel
            <select
              value={aluguelId}
              onChange={(e) =>
                atualizarCampo(setAluguelId, e.target.value)
              }
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
          <div className="devolucao-resumo">
            <h3>Informações do aluguel</h3>

            <div className="devolucao-resumo-grid">
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
                <span>Devolução prevista</span>
                <strong>
                  {formatarData(aluguel.dataPrevista)}
                </strong>
              </div>
            </div>
          </div>
        )}

        <h2>Dados da devolução</h2>

        <div className="devolucao-form-grid">
          <label className="devolucao-campo">
            Data e hora da devolução
            <input
              type="datetime-local"
              value={dataDevolucao}
              onChange={(e) =>
                atualizarCampo(
                  setDataDevolucao,
                  e.target.value
                )
              }
              required
            />
          </label>

          <label className="devolucao-campo">
            Responsável pelo recebimento
            <input
              type="text"
              placeholder="Nome do atendente"
              value={responsavel}
              onChange={(e) =>
                atualizarCampo(setResponsavel, e.target.value)
              }
              required
            />
          </label>

          <label className="devolucao-campo devolucao-campo-largo">
            Condição do equipamento
            <select
              value={condicao}
              onChange={(e) =>
                atualizarCampo(setCondicao, e.target.value)
              }
              required
            >
              <option value="">Selecione a condição</option>
              <option value="bom">
                Bom estado
              </option>
              <option value="desgaste">
                Desgaste pelo uso
              </option>
              <option value="danificado">
                Equipamento danificado
              </option>
              <option value="manutencao">
                Necessita de manutenção
              </option>
            </select>
          </label>

          <label className="devolucao-campo devolucao-campo-largo">
            Observações
            <textarea
              rows="4"
              placeholder="Descreva as condições do equipamento ou outras observações..."
              value={observacoes}
              onChange={(e) =>
                atualizarCampo(setObservacoes, e.target.value)
              }
            />
          </label>
        </div>

        {confirmado && (
          <div
            className="devolucao-sucesso"
            role="status"
          >
            Devolução simulada com sucesso! Nenhum dado
            foi enviado ao servidor.
          </div>
        )}

        <div className="devolucao-acoes">
          <button
            type="button"
            className="devolucao-botao-secundario"
            onClick={limpar}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="devolucao-botao-principal"
          >
            Registrar devolução
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrarDevolucao;
