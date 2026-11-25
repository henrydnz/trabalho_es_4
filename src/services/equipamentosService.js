export function obterTiposEquipamento() {
  return [];
}

export function obterEquipamentos() {
  return [];
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
    obterTiposEquipamento().find(
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