
package org.example.dao;

import org.example.models.aluguel.*;
import org.example.models.pessoa.EnderecoEspecifico;
import org.example.models.pessoa.Pessoa;
import org.models.Endereco;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AluguelDao {

    private final JdbcTemplate jdbc;
    private final ClienteDao clienteDao;
    private final EquipamentoDao equipamentoDao;

    public AluguelDao(JdbcTemplate jdbc, ClienteDao clienteDao, EquipamentoDao equipamentoDao) {
        this.jdbc = jdbc;
        this.clienteDao = clienteDao;
        this.equipamentoDao = equipamentoDao;
    }

    private static final String ALUGUEL_SELECT = """
        SELECT
            a."idAluguel",
            a."isAtivo",
            a."idCliente",

            a."idEndereco",
            a."numeroEndereco",
            a."complementoEndereco",

            a."dtPedido",
            a."dtIniLocacao",
            a."dtPrevistaDevolucao",
            a."dtEntrega",
            a."dtDevolucao",

            a."idEquipamento",
            a."valorAluguel",
            a."valorPago",

            te."nomeTipoEquipamento",
            te."valorDiaria"

        FROM "Aluguel" a

        JOIN "TipoEquipamento" te
            ON te."idTipoEquipamento" = a."idTipoEquipamento"
        """;

    private Timestamp toTimestamp(LocalDate data) {
        return data == null ? null : Timestamp.valueOf(data.atStartOfDay());
    }

    private Timestamp toTimestamp(LocalDateTime data) {
        return data == null ? null : Timestamp.valueOf(data);
    }

    private LocalDateTime getDateTime(ResultSet rs, String coluna) throws SQLException {
        Timestamp timestamp = rs.getTimestamp(coluna);
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private Double getDouble(ResultSet rs, String coluna) throws SQLException {
        double valor = rs.getDouble(coluna);
        return rs.wasNull() ? null : valor;
    }

    private List<Aluguel> buscarAlugueis(String sql, Object... args) {
        return jdbc.query(sql, (rs, rowNum) -> {
            int idCliente = rs.getInt("idCliente");
            Pessoa cliente = clienteDao.buscarClientePorID(idCliente);

            Endereco endereco = new Endereco();
            endereco.setId(rs.getInt("idEndereco"));

            EnderecoEspecifico enderecoEsp = new EnderecoEspecifico(
                    endereco,
                    rs.getString("numeroEndereco"),
                    rs.getString("complementoEndereco")
            );

            Integer idEquipamento = rs.getObject("idEquipamento", Integer.class);

            Equipamento equipamento = idEquipamento == null
                    ? null
                    : equipamentoDao.buscarEquipamentoPorID(idEquipamento);

            TipoEquipamento tipo = new TipoEquipamento(
                    rs.getString("nomeTipoEquipamento"),
                    rs.getDouble("valorDiaria")
            );

            LocalDateTime dataPedido = getDateTime(rs, "dtPedido");

            return new Aluguel(
                    rs.getInt("idAluguel"),
                    rs.getObject("isAtivo", Boolean.class),
                    cliente,
                    enderecoEsp,
                    equipamento,
                    tipo,
                    dataPedido == null ? null : dataPedido.toLocalDate(),
                    getDateTime(rs, "dtIniLocacao"),
                    getDateTime(rs, "dtPrevistaDevolucao"),
                    getDateTime(rs, "dtEntrega"),
                    getDateTime(rs, "dtDevolucao"),
                    getDouble(rs, "valorAluguel"),
                    getDouble(rs, "valorPago")
            );

        }, args);
    }

    private Aluguel primeiro(List<Aluguel> alugueis) {
        return alugueis.isEmpty() ? null : alugueis.getFirst();
    }

    @Transactional(readOnly = true)
    public List<Aluguel> listarAlugueis() { return buscarAlugueis(ALUGUEL_SELECT); }

    @Transactional(readOnly = true)
    public Aluguel buscarAluguelPorID(int id) {
        return primeiro(buscarAlugueis(
                ALUGUEL_SELECT + """
                WHERE a."idAluguel" = ?
                """,
                id
        ));
    }

    @Transactional(readOnly = true)
    public List<Aluguel> buscarAlugueisPorIDCliente(int id) {
        return buscarAlugueis(
                ALUGUEL_SELECT + """
                WHERE a."idCliente" = ?
                """,
                id
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

    @Transactional
    public Aluguel registrarEntregaAluguel(Integer id, LocalDateTime dtEntrega, Integer idEquipamento) {
        int equipamentoAtualizado = jdbc.update(

                """
                UPDATE "Equipamento"
                SET "isAlugado" = true
                WHERE "idEquipamento" = ?
                AND "isAlugado" = false
                """,

                idEquipamento
        );

        if (equipamentoAtualizado == 0) return null;

        int aluguelAtualizado = jdbc.update(

                """
                UPDATE "Aluguel"
                SET "dtEntrega" = ?,
                    "idEquipamento" = ?
                WHERE "idAluguel" = ?
                """,

                toTimestamp(dtEntrega),
                idEquipamento,
                id
        );

        if (aluguelAtualizado == 0) return null;

        return buscarAluguelPorID(id);
    }

    @Transactional
    public Aluguel registrarDevolucaoAluguel(Integer id, LocalDateTime dtDevolucao, Double valorPago) {
        Integer idEquipamento = jdbc.query(

                """
                SELECT "idEquipamento"
                FROM "Aluguel"
                WHERE "idAluguel" = ?
                """,

                rs -> {
                    if (!rs.next()) return null;
                    return rs.getObject("idEquipamento", Integer.class);
                },
                id
        );

        jdbc.update(
                """
                UPDATE "Aluguel"
                SET "dtDevolucao" = ?,
                    "valorPago" = ?,
                    "isAtivo" = false
                WHERE "idAluguel" = ?
                """,
                toTimestamp(dtDevolucao),
                valorPago,
                id
        );

        if (idEquipamento != null) {
            jdbc.update(
                    """
                    UPDATE "Equipamento"
                    SET "isAlugado" = false
                    WHERE "idEquipamento" = ?
                    """,
                    idEquipamento
            );
        }

        return buscarAluguelPorID(id);
    }

    @Transactional
    public Aluguel cadastrarAluguel(Aluguel aluguel) {
        Integer idTipo = obterIdTipoEquipamento(aluguel.getTipoEquipamentoSolicitado());

        Integer idAluguel = jdbc.queryForObject(
                """
                INSERT INTO "Aluguel"
                    (
                        "dtPedido",
                        "isAtivo",
                        "idCliente",
                        "idEndereco",
                        "numeroEndereco",
                        "complementoEndereco",
                        "dtIniLocacao",
                        "dtPrevistaDevolucao",
                        "dtEntrega",
                        "dtDevolucao",
                        "idTipoEquipamento",
                        "idEquipamento",
                        "valorAluguel",
                        "valorPago"
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING "idAluguel"
                """,

                Integer.class,

                toTimestamp(aluguel.getDataPedido()),
                aluguel.getAtivo(),
                aluguel.getCliente().getIdPessoa(),

                aluguel.getEnderecoEspecifico().getEndereco().getId(),
                aluguel.getEnderecoEspecifico().getNumeroEndereco(),
                aluguel.getEnderecoEspecifico().getComplemento(),

                toTimestamp(aluguel.getDataHoraInicioLocacao()),
                toTimestamp(aluguel.getDataHoraFimLocacao()),

                toTimestamp(aluguel.getDataHoraEntrega()),
                toTimestamp(aluguel.getDataHoraDevolucao()),

                idTipo,
                null,

                aluguel.getValorTotal(),
                aluguel.getValorPago()
        );

        aluguel.setIdAluguel(idAluguel);

        return aluguel;
    }
}
