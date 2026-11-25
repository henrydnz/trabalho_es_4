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

const equipamentosIniciais = [
  {
    idEquipamento: 1,
    idTipoEquipamento: 1,
    modelo: "GSB 13 RE",
    fabricante: "Bosch",
    numeroPatrimonio: "PAT-001",
    isAlugado: false,
  },
  {
    idEquipamento: 2,
    idTipoEquipamento: 1,
    modelo: "HP1640",
    fabricante: "Makita",
    numeroPatrimonio: "PAT-002",
    isAlugado: false,
  },
  {
    idEquipamento: 3,
    idTipoEquipamento: 2,
    modelo: "GBH 2-28",
    fabricante: "Bosch",
    numeroPatrimonio: "PAT-003",
    isAlugado: false,
  },
  {
    idEquipamento: 4,
    idTipoEquipamento: 2,
    modelo: "HR2470",
    fabricante: "Makita",
    numeroPatrimonio: "PAT-004",
    isAlugado: false,
  },
  {
    idEquipamento: 5,
    idTipoEquipamento: 3,
    modelo: "400 L",
    fabricante: "Menegotti",
    numeroPatrimonio: "PAT-005",
    isAlugado: false,
  },
  {
    idEquipamento: 6,
    idTipoEquipamento: 4,
    modelo: "K3",
    fabricante: "Karcher",
    numeroPatrimonio: "PAT-006",
    isAlugado: false,
  },
  {
    idEquipamento: 7,
    idTipoEquipamento: 4,
    modelo: "K5",
    fabricante: "Karcher",
    numeroPatrimonio: "PAT-007",
    isAlugado: false,
  },
  {
    idEquipamento: 8,
    idTipoEquipamento: 5,
    modelo: "5007N",
    fabricante: "Makita",
    numeroPatrimonio: "PAT-008",
    isAlugado: false,
  },
];

export function obterTiposEquipamento() {
  return tiposEquipamento.map((tipo) => ({
    ...tipo,
  }));
}

export function obterEquipamentos() {
  try {
    const dados = localStorage.getItem(
      "equipass-equipamentos"
    );

    if (dados !== null) {
      const equipamentos = JSON.parse(dados);

      if (Array.isArray(equipamentos)) {
        return equipamentos;
      }
    }
  } catch {
    // Utiliza os equipamentos iniciais.
  }

  return equipamentosIniciais.map((equipamento) => ({
    ...equipamento,
  }));
}

export function salvarEquipamentos(equipamentos) {
  localStorage.setItem(
    "equipass-equipamentos",
    JSON.stringify(equipamentos)
  );
}

export function buscarEquipamentoPorId(id) {
  return (
    obterEquipamentos().find(
      (equipamento) =>
        String(equipamento.idEquipamento) === String(id)
    ) || null
  );
}

export function buscarTipoPorId(id) {
  return (
    tiposEquipamento.find(
      (tipo) =>
        String(tipo.idTipoEquipamento) === String(id)
    ) || null
  );
}

export function obterEquipamentosDisponiveis(
  idTipoEquipamento
) {
  return obterEquipamentos().filter(
    (equipamento) =>
      !equipamento.isAlugado &&
      (
        idTipoEquipamento == null ||
        String(equipamento.idTipoEquipamento) ===
          String(idTipoEquipamento)
      )
  );
}

export function atualizarDisponibilidade(
  idEquipamento,
  isAlugado
) {
  const equipamentos = obterEquipamentos();

  const equipamentoExiste = equipamentos.some(
    (equipamento) =>
      String(equipamento.idEquipamento) ===
      String(idEquipamento)
  );

  if (!equipamentoExiste) {
    return false;
  }

  const equipamentosAtualizados = equipamentos.map(
    (equipamento) =>
      String(equipamento.idEquipamento) ===
      String(idEquipamento)
        ? {
            ...equipamento,
            isAlugado,
          }
        : equipamento
  );

  salvarEquipamentos(equipamentosAtualizados);

  return true;
}