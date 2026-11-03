package org.example.models.pessoa;

import org.example.models.endereco.EnderecoEspecifico;

import java.util.List;

public class PessoaJuridica extends Pessoa {
    private String cnpj;

    public PessoaJuridica(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico endereco, String cnpj) {
        super(nome, telefoneList, emailList, endereco);
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