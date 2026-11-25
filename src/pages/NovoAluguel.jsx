
import { useState } from "react";

import "../styles/novoAluguel.css";

const tiposEquipamento = [
  {
    idTipoEquipamento: 1,
    nome: "Furadeira de impacto",
    valorDiaria: 35,
  },
  {
    idTipoEquipamento: 2,
    nome: "Martelete rompedor",
    valorDiaria: 85,
  },
  {
    idTipoEquipamento: 3,
    nome: "Betoneira",
    valorDiaria: 120,
  },
  {
    idTipoEquipamento: 4,
    nome: "Lavadora de alta pressão",
    valorDiaria: 65,
  },
  {
    idTipoEquipamento: 5,
    nome: "Serra circular",
    valorDiaria: 45,
  },
];

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function calcularDias(dataInicio, dataDevolucao) {
  if (!dataInicio || !dataDevolucao) {
    return 0;
  }

  const inicio = new Date(dataInicio);
  const devolucao = new Date(dataDevolucao);

  if (
    Number.isNaN(inicio.getTime()) ||
    Number.isNaN(devolucao.getTime()) ||
    devolucao <= inicio
  ) {
    return 0;
  }

  const milissegundosPorDia = 24 * 60 * 60 * 1000;

  return Math.ceil(
    (devolucao.getTime() - inicio.getTime()) /
      milissegundosPorDia
  );
}

function NovoAluguel() {
  const [cliente, setCliente] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const tipo = tiposEquipamento.find(
    (item) =>
      String(item.idTipoEquipamento) === tipoSelecionado
  );

  const diaria = tipo?.valorDiaria ?? 0;
  const dias = calcularDias(dataInicio, dataDevolucao);
  const total = dias * diaria;

  function registrarAluguel(evento) {
    evento.preventDefault();

    setErro("");
    setSucesso("");

    if (!cliente.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    if (!tipoSelecionado) {
      setErro("Selecione um tipo de equipamento.");
      return;
    }

    if (dias <= 0) {
      setErro(
        "A devolução deve acontecer depois da data de início."
      );
      return;
    }

    if (!enderecoEntrega.trim()) {
      setErro("Informe o endereço de entrega.");
      return;
    }

    setSucesso(
      "Simulação concluída! Os dados do aluguel foram " +
        "validados no protótipo. Nenhum registro foi salvo."
    );
  }

  function limparFormulario() {
    setCliente("");
    setTipoSelecionado("");
    setDataInicio("");
    setDataDevolucao("");
    setEnderecoEntrega("");
    setErro("");
    setSucesso("");
  }

  return (
    <section className="novo-aluguel-pagina">
      <div className="novo-aluguel-cabecalho">
        <span className="secao-etiqueta">
          LOCAÇÃO DE EQUIPAMENTOS
        </span>

        <h1>Registrar Aluguel</h1>

        <p>
          Informe os dados do cliente, escolha o equipamento
          e defina o período da locação.
        </p>
      </div>

      <form
        className="novo-aluguel-painel"
        onSubmit={registrarAluguel}
      >
        <h2>Dados da locação</h2>

        <div className="form-grid">
          <label className="campo campo-largo">
            Nome do cliente
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Informe o nome do cliente"
              required
            />
          </label>

          <label className="campo campo-largo">
            Tipo de equipamento
            <select
              value={tipoSelecionado}
              onChange={(e) =>
                setTipoSelecionado(e.target.value)
              }
              required
            >
              <option value="">
                Selecione um equipamento
              </option>

              {tiposEquipamento.map((item) => (
                <option
                  key={item.idTipoEquipamento}
                  value={item.idTipoEquipamento}
                >
                  {item.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            Data e hora de início
            <input
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </label>

          <label className="campo">
            Previsão de devolução
            <input
              type="datetime-local"
              value={dataDevolucao}
              onChange={(e) => setDataDevolucao(e.target.value)}
              required
            />
          </label>

          <label className="campo campo-largo">
            Endereço de entrega
            <input
              type="text"
              value={enderecoEntrega}
              onChange={(e) =>
                setEnderecoEntrega(e.target.value)
              }
              placeholder="Rua, número, bairro e cidade"
              required
            />
          </label>
        </div>

        <div className="resumo-aluguel">
          <h3>Resumo do aluguel</h3>

          <div className="resumo-linha">
            <span>Valor da diária</span>
            <strong>
              {tipo ? formatarMoeda(diaria) : "—"}
            </strong>
          </div>

          <div className="resumo-linha">
            <span>Duração prevista</span>
            <strong>
              {dias > 0 ? `${dias} dia(s)` : "—"}
            </strong>
          </div>

          <div className="resumo-linha resumo-total">
            <span>Valor total previsto</span>
            <strong>
              {tipo && dias > 0
                ? formatarMoeda(total)
                : "—"}
            </strong>
          </div>
        </div>

        {erro && (
          <p className="clientes-mensagem erro" role="alert">
            {erro}
          </p>
        )}

        {sucesso && (
          <p
            className="clientes-mensagem sucesso"
            role="status"
          >
            {sucesso}
          </p>
        )}

        <div className="form-acoes">
          <button
            type="button"
            onClick={limparFormulario}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="botao-principal"
          >
            Registrar aluguel
          </button>
        </div>
      </form>
    </section>
  );
}

export default NovoAluguel;
