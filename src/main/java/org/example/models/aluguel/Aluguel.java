package org.example.models.aluguel;

import org.example.models.pessoa.EnderecoEspecifico;
import org.example.models.pessoa.Pessoa;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Aluguel implements Serializable {
    private Integer idAluguel;
    private Boolean isAtivo;

    private Pessoa cliente;
    private EnderecoEspecifico enderecoEspecifico;

    private Equipamento equipamentoAlugado;
    private TipoEquipamento tipoEquipamentoSolicitado;

    private LocalDate dataPedido;
    private LocalDateTime dataHoraInicioLocacao;
    private LocalDateTime dataHoraFimLocacao;
    private LocalDateTime dataHoraEntrega;
    private LocalDateTime dataHoraDevolucao;

    private Double valorTotal;
    private Double valorPago;

    public Aluguel() {
    }

    // 2. Construtor completo (ideal para o AluguelDAO montar o objeto vindo do SELECT)
    public Aluguel(Integer idAluguel, Boolean isAtivo, Pessoa cliente, EnderecoEspecifico enderecoEspecifico,
                   Equipamento equipamentoAlugado, TipoEquipamento tipoEquipamentoSolicitado,
                   LocalDate dataPedido, LocalDateTime dataHoraInicioLocacao,
                   LocalDateTime dataHoraFimLocacao, LocalDateTime dataHoraEntrega,
                   LocalDateTime dataHoraDevolucao, Double valorTotal, Double valorPago) {
        this.idAluguel = idAluguel;
        this.isAtivo = isAtivo;
        this.cliente = cliente;
        this.enderecoEspecifico = enderecoEspecifico;
        this.equipamentoAlugado = equipamentoAlugado;
        this.tipoEquipamentoSolicitado = tipoEquipamentoSolicitado;
        this.dataPedido = dataPedido;
        this.dataHoraInicioLocacao = dataHoraInicioLocacao;
        this.dataHoraFimLocacao = dataHoraFimLocacao;
        this.dataHoraEntrega = dataHoraEntrega;
        this.dataHoraDevolucao = dataHoraDevolucao;
        this.valorTotal = valorTotal;
        this.valorPago = valorPago;
    }

    public Aluguel(Pessoa cliente, EnderecoEspecifico enderecoEspecifico,
                   TipoEquipamento tipoEquipamentoSolicitado, LocalDate dataPedido,
                   LocalDateTime dataHoraInicioLocacao, LocalDateTime dataHoraFimLocacao,
                   Double valorTotal) {
        this.isAtivo = true;
        this.cliente = cliente;
        this.enderecoEspecifico = enderecoEspecifico;
        this.tipoEquipamentoSolicitado = tipoEquipamentoSolicitado;
        this.dataPedido = dataPedido;
        this.dataHoraInicioLocacao = dataHoraInicioLocacao;
        this.dataHoraFimLocacao = dataHoraFimLocacao;
        this.valorTotal = valorTotal;
    }

    public Boolean getAtivo() {
        return isAtivo;
    }

    public void setAtivo(Boolean ativo) {
        isAtivo = ativo;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Integer getIdAluguel() {
        return idAluguel;
    }

    public void setIdAluguel(Integer idAluguel) {
        this.idAluguel = idAluguel;
    }

    public Pessoa getCliente() {
        return cliente;
    }

    public void setCliente(Pessoa cliente) {
        this.cliente = cliente;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public LocalDateTime getDataHoraDevolucao() {
        return dataHoraDevolucao;
    }

    public void setDataHoraDevolucao(LocalDateTime dataHoraDevolucao) {
        this.dataHoraDevolucao = dataHoraDevolucao;
    }

    public LocalDateTime getDataHoraEntrega() {
        return dataHoraEntrega;
    }

    public void setDataHoraEntrega(LocalDateTime dataHoraEntrega) {
        this.dataHoraEntrega = dataHoraEntrega;
    }

    public LocalDateTime getDataHoraFimLocacao() {
        return dataHoraFimLocacao;
    }

    public void setDataHoraFimLocacao(LocalDateTime dataHoraFimLocacao) {
        this.dataHoraFimLocacao = dataHoraFimLocacao;
    }

    public LocalDateTime getDataHoraInicioLocacao() {
        return dataHoraInicioLocacao;
    }

    public void setDataHoraInicioLocacao(LocalDateTime dataHoraInicioLocacao) {
        this.dataHoraInicioLocacao = dataHoraInicioLocacao;
    }

    public LocalDate getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDate dataPedido) {
        this.dataPedido = dataPedido;
    }

    public TipoEquipamento getTipoEquipamentoSolicitado() {
        return tipoEquipamentoSolicitado;
    }

    public void setTipoEquipamentoSolicitado(TipoEquipamento tipoEquipamentoSolicitado) {
        this.tipoEquipamentoSolicitado = tipoEquipamentoSolicitado;
    }

    public Equipamento getEquipamentoAlugado() {
        return equipamentoAlugado;
    }

    public void setEquipamentoAlugado(Equipamento equipamentoAlugado) {
        this.equipamentoAlugado = equipamentoAlugado;
    }

    public EnderecoEspecifico getEnderecoEspecifico() {
        return enderecoEspecifico;
    }

    public void setEnderecoEspecifico(EnderecoEspecifico endereco) {
        this.enderecoEspecifico = endereco;
    }

    public Double getValorPago() {
        return valorPago;
    }

    public void setValorPago(Double valorPago) {
        this.valorPago = valorPago;
    }
}
