package org.example.models.aluguel;

import java.io.Serializable;

public class Modelo implements Serializable {
    private String nome;
    private Fabricante fabricante;

    public Modelo() {}
    public Modelo(String nome, Fabricante fabricante) {
        this.nome = nome;
        this.fabricante = fabricante;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Fabricante getFabricante() {
        return fabricante;
    }

    public void setFabricante(Fabricante fabricante) {
        this.fabricante = fabricante;
    }
}
