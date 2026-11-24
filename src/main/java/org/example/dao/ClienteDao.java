package org.example.dao;

import org.example.models.pessoa.Email;
import org.example.models.pessoa.EnderecoEspecifico;
import org.example.models.pessoa.Pessoa;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.example.models.pessoa.*;

import org.models.Endereco;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ClienteDao {
    private final JdbcTemplate jdbc;
    ClienteDao(JdbcTemplate jdbc) {this.jdbc = jdbc; }

    private DDD getDDDById(int id){
        return jdbc.query(

            """
            SELECT * FROM "DDD"
            WHERE "idDDD" = ?;
            """,

            rs -> rs.next() ? new DDD(rs.getString("ddd")) : null,
            id
        );
    }

    private DDI getDDIById(int id){
        return jdbc.query(

            """
            SELECT * FROM "DDI"
            WHERE "idDDI" = ?;
            """,

            rs -> rs.next() ? new DDI(rs.getString("ddi")) : null,
            id
        );
    }

    private List<Telefone> getTelefonesByClienteId(int id) {
        return jdbc.query(

            """
            SELECT * FROM "TelefoneCliente"
            WHERE "idCliente" = ?;
            """,

            rs -> {
                List<Telefone> telefones = new ArrayList<>();
                while (rs.next()) {
                    telefones.add(new Telefone(
                            getDDDById(rs.getInt("idDDD")),
                            getDDIById(rs.getInt("idDDI")),
                            rs.getString("nroTelefone")
                    ));
                }
            return telefones;
            }, id
        );
    }

    private List<Email> getEmailsByClienteId(int id) {
        return jdbc.query(

            """
            SELECT * FROM "EmailCliente"
            WHERE "idCliente" = ?;
            """,

            rs -> {
                List<Email> emails = new ArrayList<>();
                while (rs.next()) {
                    String endereco = rs.getString("endEmail");
                    emails.add(new Email(endereco));
                }
                return emails;
            }, id
        );
    }

    private Pessoa build(ResultSet rs) throws SQLException {
        int id =  rs.getInt("idCliente");
        String nome = rs.getString("nome");

        boolean isFisica = rs.getBoolean("isFisica");
        String documentColumnName = isFisica ? "cpf" : "cnpj";
        String documento = rs.getString(documentColumnName);

        int idEndereco = rs.getInt("idEndereco");
        String numeroEndereco = rs.getString("numeroEndereco");
        String complementoEndereco = rs.getString("complementoEndereco");
        Endereco endereco = new Endereco();
        endereco.setId(idEndereco);
        EnderecoEspecifico enderecoEsp = new EnderecoEspecifico(
                endereco, numeroEndereco, complementoEndereco
        );

        List<Email> emails = getEmailsByClienteId(id);
        List<Telefone> telefones = getTelefonesByClienteId(id);

        return isFisica ?
            new PessoaFisica(nome, telefones, emails, enderecoEsp, documento) :
            new PessoaJuridica(nome, telefones, emails, enderecoEsp, documento);
    }

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
