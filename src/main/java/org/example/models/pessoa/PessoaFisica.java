package org.example.models.pessoa;

import java.util.List;

public class PessoaFisica extends Pessoa {
    private String cpf;

    public PessoaFisica() {}

    public PessoaFisica(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico endereco, String cpf) {
        super(nome, telefoneList, emailList, endereco, true);
        this.cpf = cpf;
    }

    @Override
    public String getDocumento() {return this.cpf;}
    @Override
    public void setDocumento(String documento) {
        this.cpf = documento;
    }
}