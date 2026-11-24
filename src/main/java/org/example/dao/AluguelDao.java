package org.example.dao;

import org.example.models.aluguel.Aluguel;

import java.time.LocalDateTime;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AluguelDao {
    private final JdbcTemplate jdbc;
    public AluguelDao (JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public boolean createAluguel(Aluguel aluguel) {
        return false;
    }

    public List<Aluguel> getAlugueis() {
        return null;
    }

    public Aluguel getAluguelById(int id) {
        return null;
    }

    public Aluguel getAluguelByClienteId(int id) {
        return null;
    }

    public boolean updateAddEquipamento(int aluguelId, int numeroPatrimonio) {
        return false;
    }

    public boolean updateEntrega(int aluguelId, LocalDateTime dataEntrega) {
        return false;
    }

    public boolean updateDevolucao(int aluguelId, LocalDateTime dataDevolucao) {
        return false;
    }
}
