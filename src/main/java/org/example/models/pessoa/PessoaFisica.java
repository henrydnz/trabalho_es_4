package org.example.models.pessoa;

import org.example.models.endereco.EnderecoEspecifico;

import java.util.List;

public class PessoaFisica extends Pessoa {
    private String cpf;

    public PessoaFisica(String nome, List<Telefone> telefoneList, List<Email> emailList, EnderecoEspecifico endereco, String cpf) {
        super(nome, telefoneList, emailList, endereco);
        this.cpf = cpf;
    }

    @Override
    public String getDocumento() {
        return this.cpf;
    }

    @Override
    public void setDocumento(String documento) {
        this.cpf = documento;
    }
}
