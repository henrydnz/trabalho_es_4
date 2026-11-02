package org.example.models.endereco;

public class EnderecoEspecifico {
    private Endereco endereco;
    private int numero;
    private String complemento;

    public EnderecoEspecifico(Endereco endereco, int numero, String complemento) {
        this.endereco = endereco;
        this.numero = numero;
        this.complemento = complemento;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }
}
