package org.example.models.aluguel;

public class TipoEquipamento {
    private String nome;
    private int quantidade;
    private double valorDiaria;

    public TipoEquipamento(String nome, int quantidade, double valorDiaria) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.valorDiaria = valorDiaria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getValorDiaria() {
        return valorDiaria;
    }

    public void setValorDiaria(double valorDiaria) {
        this.valorDiaria = valorDiaria;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
}
