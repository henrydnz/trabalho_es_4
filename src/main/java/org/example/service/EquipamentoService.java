package org.example.service;

import org.example.dao.EquipamentoDao;
import org.example.models.aluguel.Equipamento;
import org.example.models.aluguel.TipoEquipamento;
import org.example.utils.Utils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipamentoService {
    private final EquipamentoDao equipamentoDao;

    public EquipamentoService(EquipamentoDao equipamentoDao) {
        this.equipamentoDao = equipamentoDao;
    }

    public Equipamento cadastrarEquipamento(Equipamento equipamento){
        if(equipamento == null
                || equipamento.getNumPatrimonio() <= 0
                || equipamento.getTipoEquipamento() == null
                || equipamento.getTipoEquipamento().getNome() == null
                || equipamento.getTipoEquipamento().getValorDiaria() == null
                || equipamento.getModelo() == null
                || equipamento.getModelo().getNome() == null
                || equipamento.getModelo().getFabricante() == null
                || equipamento.getModelo().getFabricante().getNome() == null)
            return null;

        equipamento.getTipoEquipamento().setNome(Utils.formatarStr(equipamento.getTipoEquipamento().getNome()));
        equipamento.getModelo().setNome(Utils.formatarStr(equipamento.getModelo().getNome()));
        equipamento.getModelo().getFabricante().setNome(Utils.formatarStr(equipamento.getModelo().getFabricante().getNome()));

        return equipamentoDao.cadastrarEquipamento(equipamento);
    }

    public List<Equipamento> listarEquipamentos(){
        return equipamentoDao.listarEquipamentos();
    }

    public List<TipoEquipamento> listarTipoEquipamentos(){
        return equipamentoDao.listarTipoEquipamentos();
    }

    public Equipamento buscarEquipamentoPorID(Integer id){
        return equipamentoDao.buscarEquipamentoPorID(id);
    }

    public List<Equipamento> listarEquipamentosDisponiveis() {
        return equipamentoDao.listarEquipamentosDisponiveis();
    }
}
