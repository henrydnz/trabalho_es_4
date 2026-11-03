package org.example.dao;

import org.example.models.aluguel.Aluguel;

import java.time.LocalDateTime;
import java.util.List;

public class AluguelDao {
    AluguelDao() {}

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

    public boolean updateNumeroPatrimonio(int aluguelId, int numeroPatrimonio) {
        return false;
    }

    public boolean updateEntrega(int aluguelId, LocalDateTime dataEntrega) {
        return false;
    }

    public boolean updateDevolucao(int aluguelId, LocalDateTime dataDevolucao) {
        return false;
    }
}
