package org.example.dao;

import org.example.models.aluguel.*;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class EquipamentoDao {
    private final JdbcTemplate jdbc;
    EquipamentoDao (JdbcTemplate jdbc) {this.jdbc = jdbc;}


    private static final String EQUIPAMENTO_SELECT = """
        SELECT
            e."nroPatrimonio",
            e."isAlugado",
            me."nomeModeloEquipamento",
            f."nomeFabricante",
            te."nomeTipoEquipamento",
            te."valorDiaria"

        FROM "Equipamento" e

        JOIN "ModeloEquipamento" me
            ON me."idModeloEquipamento" = e."idModeloEquipamento"

        JOIN "Fabricante" f
            ON f."idFabricante" = me."idFabricante"

        JOIN "TipoEquipamento" te
            ON te."idTipoEquipamento" = e."idTipoEquipamento"
        """;

    private List<Equipamento> buscarEquipamentos(String sql, Object... args) {
        return jdbc.query(sql, (rs, rowNum) -> {
            Fabricante fabricante = new Fabricante(rs.getString("nomeFabricante"));

            Modelo modelo = new Modelo(
                    rs.getString("nomeModeloEquipamento"),
                    fabricante
            );

            TipoEquipamento tipo = new TipoEquipamento(
                    rs.getString("nomeTipoEquipamento"),
                    rs.getDouble("valorDiaria")
            );

            return new Equipamento(
                    rs.getInt("nroPatrimonio"),
                    rs.getBoolean("isAlugado"),
                    tipo,
                    modelo
            );

        }, args);
    }


    @Transactional(readOnly = true)
    public List<Equipamento> listarEquipamentos() {
        return buscarEquipamentos(EQUIPAMENTO_SELECT);
    }

    @Transactional(readOnly = true)
    public List<TipoEquipamento> listarTipoEquipamentos() {
        return jdbc.query(

                """
                SELECT *
                FROM "TipoEquipamento"
                """,

                (rs, rowNum) -> new TipoEquipamento(
                        rs.getString("nomeTipoEquipamento"),
                        rs.getDouble("valorDiaria")
                )
        );
    }

    private Equipamento primeiro(List<Equipamento> equipamentos){
        return equipamentos.isEmpty() ? null : equipamentos.getFirst();
    }

    @Transactional(readOnly = true)
    public Equipamento buscarEquipamentoPorID(int id){
        return primeiro(buscarEquipamentos(
                EQUIPAMENTO_SELECT + """
                WHERE e."idEquipamento" = ?
                """,
                id
        ));
    }

    @Transactional(readOnly = true)
    public List<Equipamento> listarEquipamentosDisponiveis() {
        return buscarEquipamentos(
                EQUIPAMENTO_SELECT + """
                WHERE e."isAlugado" = false
                """
        );
    }

    private Integer obterIdFabricante(Fabricante fabricante) {
        List<Integer> ids = jdbc.query(
                """
                SELECT "idFabricante"
                FROM "Fabricante"
                WHERE "nomeFabricante" = ?
                """,
                (rs, rowNum) -> rs.getInt("idFabricante"),
                fabricante.getNome()
        );

        if (!ids.isEmpty()) return ids.getFirst();

        return jdbc.queryForObject(
                """
                INSERT INTO "Fabricante" ("nomeFabricante")
                VALUES (?)
                RETURNING "idFabricante"
                """,
                Integer.class,
                fabricante.getNome()
        );
    }

    private Integer obterIdTipoEquipamento(TipoEquipamento tipo) {

        return jdbc.queryForObject(
                """
                SELECT "idTipoEquipamento"
                FROM "TipoEquipamento"
                WHERE "nomeTipoEquipamento" = ?
                """,
                Integer.class,
                tipo.getNome()
        );
    }

    private Integer obterIdModelo(Modelo modelo, Integer idFabricante) {

        List<Integer> ids = jdbc.query(
                """
                SELECT "idModeloEquipamento"
                FROM "ModeloEquipamento"
                WHERE "nomeModeloEquipamento" = ?
                AND "idFabricante" = ?
                """,
                (rs, rowNum) -> rs.getInt("idModeloEquipamento"),
                modelo.getNome(),
                idFabricante
        );

        if (!ids.isEmpty()) return ids.getFirst();

        return jdbc.queryForObject(
                """
                INSERT INTO "ModeloEquipamento"
                    ("idFabricante", "nomeModeloEquipamento")
                VALUES (?, ?)
                RETURNING "idModeloEquipamento"
                """,
                Integer.class,
                idFabricante,
                modelo.getNome()
        );
    }

    @Transactional
    public Equipamento cadastrarEquipamento(Equipamento equipamento) {
        Fabricante fabricante = equipamento.getModelo().getFabricante();
        Modelo modelo = equipamento.getModelo();
        TipoEquipamento tipo = equipamento.getTipoEquipamento();

        Integer idFabricante = obterIdFabricante(fabricante);
        Integer idModelo = obterIdModelo(modelo, idFabricante);
        Integer idTipo = obterIdTipoEquipamento(tipo);

        jdbc.update(
                """
                INSERT INTO "Equipamento"
                    ("idModeloEquipamento", "idTipoEquipamento",
                     "nroPatrimonio", "isAlugado")
                VALUES (?, ?, ?, ?)
                """,

                idModelo,
                idTipo,
                equipamento.getNumPatrimonio(),
                equipamento.isAlugado()
        );

        return equipamento;
    }

}
