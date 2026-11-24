package org.example.dao;

import org.example.models.pessoa.Pessoa;

import java.util.List;

import org.models.Bairro;
import org.models.Cidade;
import org.models.Endereco;
import org.models.Logradouro;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ClienteDao {
    private final JdbcTemplate jdbc;
    ClienteDao(JdbcTemplate jdbc) {this.jdbc = jdbc; }

    public Pessoa getPessoaById(int id){
        String sql = """
        SELECT * FROM "Cliente"
        WHERE "idCliente" = ?;
        """;

        return jdbc.query(sql, rs -> {
            Pessoa cliente = null;

            if (rs.next()) {
                boolean isPessoaFisica = rs.getBoolean("isFisica");

                if (isPessoaFisica) {

                }

                String nome = rs.getString("nome");



            }
            return cliente;
        }, id);



    }

    public Pessoa getPessoaByDocumento(String documento){
        return null;
    }

    public List<Pessoa> getPessoas(){
        return null;
    }

    public boolean createPessoa(Pessoa pessoa){
        return false;
    }

}
