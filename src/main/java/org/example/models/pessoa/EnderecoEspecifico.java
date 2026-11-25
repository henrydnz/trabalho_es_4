package org.example.models.pessoa;

import org.models.Endereco;

import java.io.Serializable;

public class EnderecoEspecifico implements Serializable {
    private Endereco endereco;
    private String numeroEndereco;
    private String complemento;

    public EnderecoEspecifico(Endereco endereco,  String numeroEndereco, String complemento) {
        this.endereco = endereco;
        this.numeroEndereco = numeroEndereco;
        this.complemento = complemento;
    }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getNumeroEndereco() { return numeroEndereco; }
    public void setNumeroEndereco(String numeroEndereco) { this.numeroEndereco = numeroEndereco; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }
}
