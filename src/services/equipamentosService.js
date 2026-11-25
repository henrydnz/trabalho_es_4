import { requisicao } from "./api";

function normalizarTipo(tipo) {
  return {
    idTipoEquipamento: tipo.nome,
    nome: tipo.nome,
    valorDiaria: tipo.valorDiaria,
  };
}

function normalizarEquipamento(equipamento) {
  return {
    idEquipamento: equipamento.numPatrimonio,
    numeroPatrimonio: equipamento.numPatrimonio,
    isAlugado: equipamento.alugado,
    idTipoEquipamento: equipamento.tipoEquipamento?.nome,
    tipoEquipamento: equipamento.tipoEquipamento?.nome,
    modelo: equipamento.modelo?.nome,
    fabricante: equipamento.modelo?.fabricante?.nome,
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

    return dados;
  } catch (erro) {
    if (erro.status === 404) {
      return [];
    }

    throw erro;
  }
}

export async function obterTiposEquipamento() {
  const tipos = await consultarLista(
    "/equipamentos/tipos"
  );

  return tipos.map(normalizarTipo);
}

export async function obterEquipamentos() {
  const equipamentos = await consultarLista(
    "/equipamentos"
  );

  return equipamentos.map(normalizarEquipamento);
}

export async function buscarEquipamentoPorId(id) {
  try {
    const equipamento = await requisicao(
      `/equipamentos/${encodeURIComponent(id)}`
    );

    return normalizarEquipamento(equipamento);
  } catch (erro) {
    if (erro.status === 404) {
      return null;
    }

    throw erro;
  }
}

export async function buscarTipoPorId(id) {
  const tipos = await obterTiposEquipamento();

  return (
    tipos.find(
      (tipo) =>
        String(tipo.idTipoEquipamento) === String(id)
    ) || null
  );
}

export async function obterEquipamentosDisponiveis(
  idTipoEquipamento
) {
  const equipamentos = await consultarLista(
    "/equipamentos/disponiveis"
  );

  return equipamentos
    .map(normalizarEquipamento)
    .filter(
      (equipamento) =>
        !equipamento.isAlugado &&
        (
          idTipoEquipamento == null ||
          String(equipamento.idTipoEquipamento) ===
            String(idTipoEquipamento)
        )
    );
}