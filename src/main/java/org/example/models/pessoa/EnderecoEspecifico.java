package org.example.models.pessoa;

import org.models.Endereco;

public class EnderecoEspecifico {
    private Endereco endereco;
    private String numeroEndereco;
    private String complemento;

    public Endereco getIdEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public String getNumeroEndereco() {
        return numeroEndereco;
    }

    public void setNumeroEndereco(String numeroEndereco) {
        this.numeroEndereco = numeroEndereco;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }
}
