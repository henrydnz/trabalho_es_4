import { requisicao } from "./api";

import {
  montarCliente,
  montarEnderecoEspecifico,
  normalizarCliente,
  normalizarEndereco,
} from "./clientesService";

function dataAtual() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function calcularDias(dataInicio, dataFim) {
  if (!dataInicio || !dataFim) {
    return 0;
  }

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  if (
    Number.isNaN(inicio.getTime()) ||
    Number.isNaN(fim.getTime()) ||
    fim <= inicio
  ) {
    return 0;
  }

  const inicioDia = Date.parse(
    dataInicio.slice(0, 10) + "T00:00:00Z"
  );

  const fimDia = Date.parse(
    dataFim.slice(0, 10) + "T00:00:00Z"
  );

  return (fimDia - inicioDia) / 86400000;
}

export function normalizarAluguel(aluguel) {
  if (!aluguel) {
    return null;
  }

  const cliente = normalizarCliente(aluguel.cliente);

  const tipo = aluguel.tipoEquipamentoSolicitado;

  const equipamento = aluguel.equipamentoAlugado;

  let situacao = "Solicitado";

  if (aluguel.dataHoraDevolucao) {
    situacao = "Encerrado";
  } else if (aluguel.dataHoraEntrega) {
    situacao = "Em locação";
  }

  return {
    idAluguel: aluguel.idAluguel,

    idCliente: cliente?.idCliente ?? null,
    nomeCliente: cliente?.nome ?? "",
    documentoCliente: cliente?.documento ?? "",
    cliente,

    idTipoEquipamento: tipo?.nome ?? null,
    tipoEquipamento: tipo?.nome ?? "",
    valorDiaria: tipo?.valorDiaria ?? null,

    idEquipamento: equipamento?.numPatrimonio ?? null,

    equipamento: equipamento
      ? {
          idEquipamento: equipamento.numPatrimonio,
          numeroPatrimonio: equipamento.numPatrimonio,
          modelo: equipamento.modelo?.nome,
          fabricante: equipamento.modelo?.fabricante?.nome,
          isAlugado: equipamento.alugado,
        }
      : null,

    dataPedido: aluguel.dataPedido,

    dataHoraInicio: aluguel.dataHoraInicioLocacao,
    dataHoraFim: aluguel.dataHoraFimLocacao,
    dataHoraEntrega: aluguel.dataHoraEntrega,
    dataHoraDevolucao: aluguel.dataHoraDevolucao,

    enderecoEntrega: normalizarEndereco(
      aluguel.enderecoEspecifico
    ),

    diasPrevistos: calcularDias(
      aluguel.dataHoraInicioLocacao,
      aluguel.dataHoraFimLocacao
    ),

    valorTotal: aluguel.valorTotal,
    valorPago: aluguel.valorPago,

    situacao,
    ativo: aluguel.ativo,
  };
}

async function consultarLista(caminho) {
  try {
    const dados = await requisicao(caminho);

    if (dados == null) {
      return [];
    }

    if (!Array.isArray(dados)) {
      throw new Error("Resposta inesperada do servidor.");
    }

    return dados.map(normalizarAluguel);
  } catch (erro) {
    if (erro.status === 404) {
      return [];
    }

    throw erro;
  }
}

export async function obterAlugueis() {
  return consultarLista("/alugueis");
}

export async function buscarAlugueisPorCliente(idCliente) {
  return consultarLista(
    `/alugueis/cliente/${encodeURIComponent(idCliente)}`
  );
}

export async function buscarAluguelPorId(idAluguel) {
  try {
    const dados = await requisicao(
      `/alugueis/${encodeURIComponent(idAluguel)}`
    );

    return normalizarAluguel(dados);
  } catch (erro) {
    if (erro.status === 404) {
      return null;
    }

    throw erro;
  }
}

export async function cadastrarAluguel({
  cliente,
  tipo,
  dataInicio,
  dataFim,
  enderecoEntrega,
}) {
  const dados = {
    ativo: true,

    cliente: {
      ...montarCliente(cliente),
      idPessoa: cliente.idCliente,
    },

    tipoEquipamentoSolicitado: {
      nome: tipo.nome,
      valorDiaria: Number(tipo.valorDiaria),
    },

    enderecoEspecifico: montarEnderecoEspecifico(
      enderecoEntrega
    ),

    dataPedido: dataAtual(),

    dataHoraInicioLocacao: dataInicio,
    dataHoraFimLocacao: dataFim,
  };

  const resposta = await requisicao("/alugueis", {
    method: "POST",
    body: JSON.stringify(dados),
  });

  if (!resposta || resposta.idAluguel == null) {
    throw new Error("O servidor não confirmou o aluguel.");
  }

  return normalizarAluguel(resposta);
}

export async function registrarEntrega(
  idAluguel,
  idEquipamento,
  dataEntrega
) {
  const parametros = new URLSearchParams({
    dtEntrega: dataEntrega,
    idEquipamento: String(idEquipamento),
  });

  const dados = await requisicao(
    `/alugueis/${encodeURIComponent(idAluguel)}/entrega?${parametros}`,
    {
      method: "PUT",
    }
  );

  return normalizarAluguel(dados);
}

export async function registrarDevolucao(
  idAluguel,
  dataDevolucao,
  valorPago
) {
  const parametros = new URLSearchParams({
    dtDevolucao: dataDevolucao,
    valorPago: String(valorPago),
  });

  const dados = await requisicao(
    `/alugueis/${encodeURIComponent(idAluguel)}/devolucao?${parametros}`,
    {
      method: "PUT",
    }
  );

  return normalizarAluguel(dados);
}