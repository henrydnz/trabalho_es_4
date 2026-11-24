package org.example.dao;

import org.example.models.aluguel.Equipamento;
import org.example.models.aluguel.TipoEquipamento;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class EquipamentoDao {
    private final JdbcTemplate jdbc;
    EquipamentoDao (JdbcTemplate jdbc) {this.jdbc = jdbc;}

    public List<Equipamento> getEquipamentosDisponiveis() {
        return null;
    }

    public List<Equipamento> getEquipamentos() {
        return null;
    }

    public List<TipoEquipamento> getTiposEquipamento() {
        return null;
    }

    public Equipamento getEquipamentoById(int id) {
        return null;
    }
}
