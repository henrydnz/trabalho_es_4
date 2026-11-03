package org.example.models.aluguel;

public class Modelo {
    private String nome;
    private Fabricante fabricante;

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
