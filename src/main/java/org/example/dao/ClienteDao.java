package org.example.dao;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.example.models.pessoa.*;
import org.models.Endereco;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ClienteDao {
    private final JdbcTemplate jdbc;
    ClienteDao(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private List<Pessoa> buscarClientes(String sql, Object... args) {
        List<Pessoa> pessoas = jdbc.query(sql, (rs, rowNum) -> {

            int id = rs.getInt("idCliente");
            String nome = rs.getString("nome");

            boolean isFisica = rs.getBoolean("isFisica");
            String documento = rs.getString(isFisica ? "cpf" : "cnpj");

            int idEndereco = rs.getInt("idEndereco");
            String numeroEndereco = rs.getString("numeroEndereco");
            String complementoEndereco = rs.getString("complementoEndereco");

            Endereco endereco = new Endereco();
            endereco.setId(idEndereco);

            EnderecoEspecifico enderecoEsp = new EnderecoEspecifico(
                    endereco, numeroEndereco, complementoEndereco
            );

            List<Email> emails = new ArrayList<>();
            List<Telefone> telefones = new ArrayList<>();

            Pessoa pessoa = isFisica
                    ? new PessoaFisica(nome, telefones, emails, enderecoEsp, documento)
                    : new PessoaJuridica(nome, telefones, emails, enderecoEsp, documento);

            pessoa.setIdPessoa(id);

            return pessoa;

        }, args);

        if(pessoas.isEmpty()) return pessoas;

        Map<Integer, Pessoa> pessoasPorId = new HashMap<>();
        Integer[] ids = new Integer[pessoas.size()];
        StringBuilder placeholders = new StringBuilder();

        for (int i = 0; i < pessoas.size(); i++) {
            Pessoa pessoa = pessoas.get(i);
            int id = pessoa.getIdPessoa();
            pessoasPorId.put(id, pessoa);
            ids[i] = id;

            if (i > 0) placeholders.append(", ");
            placeholders.append("?");
        }

        adicionarEmails(pessoasPorId, ids, placeholders);
        adicionarTelefones(pessoasPorId, ids, placeholders);

        return pessoas;
    }

    private void adicionarEmails(Map<Integer, Pessoa> pessoasPorId, Object[] ids, StringBuilder placeholders) {
        jdbc.query(
                """
                SELECT "idCliente", "endEmail"
                FROM "EmailCliente"
                WHERE "idCliente" IN (
                """ + placeholders + ")",

                rs -> {
                    Pessoa pessoa = pessoasPorId.get(rs.getInt("idCliente"));
                    if (pessoa != null) pessoa.addEmail(rs.getString("endEmail"));
                },
                ids
        );
    }

    private void adicionarTelefones(Map<Integer, Pessoa> pessoasPorId, Object[] ids, StringBuilder placeholders) {
        jdbc.query(
                """
                SELECT
                    tc."idCliente",
                    tc."nroTelefone",
                    ddd."ddd",
                    ddi."ddi"
                FROM "TelefoneCliente" tc
        
                LEFT JOIN "DDD" ddd
                    ON ddd."idDDD" = tc."idDDD"
        
                LEFT JOIN "DDI" ddi
                    ON ddi."idDDI" = tc."idDDI"
        
                WHERE tc."idCliente" IN (
                """ + placeholders + ")",

                rs -> {
                    Pessoa pessoa = pessoasPorId.get(rs.getInt("idCliente"));

                    if (pessoa != null) {
                        pessoa.addTelefone(
                                rs.getString("ddd"),
                                rs.getString("ddi"),
                                rs.getString("nroTelefone")
                        );
                    }
                },
                ids
        );
    }

    private Pessoa primeiro(List<Pessoa> pessoas) {
        return pessoas.isEmpty() ? null : pessoas.getFirst();
    }

    @Transactional(readOnly = true)
    public Pessoa buscarClientePorID(int id) {
        return primeiro(buscarClientes(
            """
            SELECT * FROM "Cliente"
            WHERE "idCliente" = ?
            """,
            id
        ));
    }

    @Transactional(readOnly = true)
    public Pessoa buscarClientePorCPF(String cpf) {
        return primeiro(buscarClientes(
            """
            SELECT * FROM "Cliente"
            WHERE "cpf" = ?
            """,
            cpf
        ));
    }

    @Transactional(readOnly = true)
    public Pessoa buscarClientePorCNPJ(String cnpj) {
        return primeiro(buscarClientes(
            """
            SELECT * FROM "Cliente"
            WHERE "cnpj" = ?
            """,
            cnpj
        ));
    }

    @Transactional(readOnly = true)
    public List<Pessoa> listarClientes() {
        return buscarClientes(
            """
            SELECT * FROM "Cliente"
            """
        );
    }

    private Integer clienteExiste(Pessoa cliente){
        if(cliente == null) return null;

        String where = cliente.getFisica() ?
            " \"cpf\" = ?" :
            " \"cnpj\" = ?";

        return jdbc.query(

            """
            SELECT * FROM "Cliente"
            WHERE""" + where,

            rs -> {
                if(rs.next()) return rs.getInt("idCliente");
                return null;
            },
            cliente.getDocumento()
        );
    }

    private void cadastrarEmails(Integer id, List<Email> emails){
        List<Object[]> args = new ArrayList<>();

        for (Email email : emails) {
            args.add(new Object[]{
                    id,
                    email.getEmail()
            });
        }

        jdbc.batchUpdate(
                """
                INSERT INTO "EmailCliente" ("idCliente", "endEmail")
                VALUES (?, ?)
                """,
                args
        );
    }

    // PRESSUPOE QUE TODOS OS DDD E TODOS OS DDI ESTAO ADICIONADOS NA DB
    private void cadastrarTelefones(Integer id, List<Telefone> telefones){
        List<Object[]> args = new ArrayList<>();

        for (Telefone telefone : telefones) {
            args.add(new Object[]{
                    id,
                    telefone.getNroDDD().getNroDDD(),
                    telefone.getNroDDI().getNroDDI(),
                    telefone.getNroFone()
            });
        }

        jdbc.batchUpdate(
                """
                INSERT INTO "TelefoneCliente"
                    ("idCliente", "idDDD", "idDDI", "nroTelefone")
                VALUES (
                    ?,
                    (SELECT "idDDD" FROM "DDD" WHERE "ddd" = ?),
                    (SELECT "idDDI" FROM "DDI" WHERE "ddi" = ?),
                    ?
                )
                """,
                args
        );
    }

    @Transactional
    public Pessoa cadastrarCliente(Pessoa cliente){
        Integer idCliente = clienteExiste(cliente);

        if(idCliente != null) {
            cliente.setIdPessoa(idCliente);
            return cliente;
        }

        idCliente = jdbc.queryForObject(
            """
            INSERT INTO "Cliente"
                ("nome", "idEndereco", "numeroEndereco",
                 "complementoEndereco", "cpf", "cnpj", "isFisica")
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING "idCliente";
            """,

            Integer.class,

            cliente.getNome(),
            cliente.getEnderecoEspecifico().getEndereco().getId(),
            cliente.getEnderecoEspecifico().getNumeroEndereco(),
            cliente.getEnderecoEspecifico().getComplemento(),
            cliente.getFisica() ? cliente.getDocumento() : null,
            cliente.getFisica() ? null : cliente.getDocumento(),
            cliente.getFisica()
        );

        cadastrarEmails(idCliente, cliente.getEmailList());
        cadastrarTelefones(idCliente, cliente.getTelefoneList());

        cliente.setIdPessoa(idCliente);

        return cliente;
    }
}
