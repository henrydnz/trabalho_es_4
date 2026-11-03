package org.example.models.aluguel;

import org.example.models.endereco.EnderecoEspecifico;
import org.example.models.pessoa.Pessoa;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Aluguel {
    private Pessoa cliente;
    private EnderecoEspecifico endereco;

    private Equipamento equipamentoAlugado;
    private TipoEquipamento tipoEquipamentoSolicitado;

    private LocalDate dataPedido;
    private LocalDateTime dataHoraInicioLocacao;
    private LocalDateTime dataHoraFimLocacao;
    private LocalDateTime dataHoraEntrega;
    private LocalDateTime dataHoraDevolucao;

    private double valorTotal;

    public Aluguel(Pessoa cliente, EnderecoEspecifico endereco,
                   Equipamento equipamentoAlugado, TipoEquipamento tipoEquipamentoSolicitado,
                   LocalDate dataPedido, LocalDateTime dataHoraInicioLocacao,
                   LocalDateTime dataHoraFimLocacao, LocalDateTime dataHoraEntrega,
                   LocalDateTime dataHoraDevolucao, double valorTotal
    ) {
        this.cliente = cliente;
        this.endereco = endereco;
        this.equipamentoAlugado = equipamentoAlugado;
        this.tipoEquipamentoSolicitado = tipoEquipamentoSolicitado;
        this.dataPedido = dataPedido;
        this.dataHoraInicioLocacao = dataHoraInicioLocacao;
        this.dataHoraFimLocacao = dataHoraFimLocacao;
        this.dataHoraEntrega = dataHoraEntrega;
        this.dataHoraDevolucao = dataHoraDevolucao;
        this.valorTotal = valorTotal;
    }

    public Pessoa getCliente() {
        return cliente;
    }

    public void setCliente(Pessoa cliente) {
        this.cliente = cliente;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
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

    public EnderecoEspecifico getEndereco() {
        return endereco;
    }

    public void setEndereco(EnderecoEspecifico endereco) {
        this.endereco = endereco;
    }
}
