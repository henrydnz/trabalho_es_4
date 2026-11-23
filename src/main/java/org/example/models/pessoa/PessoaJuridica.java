package org.example.models.pessoa;

import java.util.List;

public class PessoaJuridica extends Pessoa {
    private String cnpj;

    public PessoaJuridica() {}

    public PessoaJuridica(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico endereco, String cnpj) {
        super(nome, telefoneList, emailList, endereco, false);
        this.cnpj = cnpj;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    @Override
    public String getDocumento() {
        return this.cnpj;
    }

    @Override
    public void setDocumento(String documento) {
        this.cnpj = documento;
    }
}