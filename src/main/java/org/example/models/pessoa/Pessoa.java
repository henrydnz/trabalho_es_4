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
    protected Integer idPessoa;
    protected String nome;
    protected List<Telefone> telefoneList;
    protected List<Email> emailList;
    protected EnderecoEspecifico enderecoEspecifico;
    protected Boolean isFisica;

    public  Pessoa() {}

    public Pessoa(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico enderecoEspecifico, Boolean isFisica) {
        this.nome = nome;
        this.telefoneList = telefoneList;
        this.emailList = emailList;
        this.enderecoEspecifico = enderecoEspecifico;
        this.isFisica = isFisica;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public EnderecoEspecifico getEnderecoEspecifico() { return enderecoEspecifico; }
    public void setEnderecoEspecifico(EnderecoEspecifico enderecoEspecifico) { this.enderecoEspecifico = enderecoEspecifico; }
    public List<Email> getEmailList() {
        return emailList;
    }
    public void setEmailList(List<Email> emailList) {
        this.emailList = emailList;
    }
    public void addEmail(String email){ this.emailList.add(new Email(email)); }
    public List<Telefone> getTelefoneList() {
        return telefoneList;
    }
    public void setTelefoneList(List<Telefone> telefoneList) {
        this.telefoneList = telefoneList;
    }
    public void addTelefone(String DDI, String DDD, String telefone){
        this.telefoneList.add(new Telefone(new DDD(DDD), new DDI(DDI), telefone));
    }
    public abstract String getDocumento();
    public abstract void setDocumento(String documento);
    public Boolean getFisica() {
        return isFisica;
    }
    public void setFisica(Boolean fisica) {
        isFisica = fisica;
    }

    public void setIdPessoa(Integer id) {  this.idPessoa = id; }
    public Integer getIdPessoa() { return this.idPessoa; }
}