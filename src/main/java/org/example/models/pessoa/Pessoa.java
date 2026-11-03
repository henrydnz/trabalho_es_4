package org.example.models.pessoa;

import java.util.List;
import org.example.models.endereco.EnderecoEspecifico;

public abstract class Pessoa {
    protected String nome;
    protected List<Telefone> telefoneList;
    protected List<Email> emailList;
    protected EnderecoEspecifico endereco;

    public Pessoa(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico endereco) {
        this.nome = nome;
        this.telefoneList = telefoneList;
        this.emailList = emailList;
        this.endereco = endereco;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public EnderecoEspecifico getEndereco() {
        return endereco;
    }

    public void setEndereco(EnderecoEspecifico endereco) {
        this.endereco = endereco;
    }

    public List<Email> getEmailList() {
        return emailList;
    }

    public void setEmailList(List<Email> emailList) {
        this.emailList = emailList;
    }

    public List<Telefone> getTelefoneList() {
        return telefoneList;
    }

    public void setTelefoneList(List<Telefone> telefoneList) {
        this.telefoneList = telefoneList;
    }

    public abstract String getDocumento();
    public abstract void setDocumento(String documento);
}
