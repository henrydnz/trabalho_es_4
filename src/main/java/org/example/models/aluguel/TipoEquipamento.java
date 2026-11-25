package org.example.models.aluguel;

import java.io.Serializable;

public class TipoEquipamento implements Serializable {
    private String nome;
    private Double valorDiaria;

    public TipoEquipamento(String nome, Double valorDiaria) {
        this.nome = nome;
        this.valorDiaria = valorDiaria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getValorDiaria() {
        return valorDiaria;
    }

    public void setValorDiaria(Double valorDiaria) {
        this.valorDiaria = valorDiaria;
    }
}
