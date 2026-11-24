package org.example.models.pessoa;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "isFisica"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PessoaFisica.class, name = "true"),
        @JsonSubTypes.Type(value = PessoaJuridica.class, name = "false")
})
public abstract class Pessoa {
    protected String nome;
    protected List<Telefone> telefoneList;
    protected List<Email> emailList;
    protected EnderecoEspecifico endereco;
    protected Boolean isFisica;

    public  Pessoa() {}

    public Pessoa(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico endereco, Boolean isFisica) {
        this.nome = nome;
        this.telefoneList = telefoneList;
        this.emailList = emailList;
        this.endereco = endereco;
        this.isFisica = isFisica;
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

    public Boolean getFisica() {
        return isFisica;
    }

    public void setFisica(Boolean fisica) {
        isFisica = fisica;
    }
}