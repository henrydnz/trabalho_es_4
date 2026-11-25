package org.example.models.aluguel;

import java.io.Serializable;

public class Equipamento implements Serializable {
    private int numPatrimonio;
    private boolean isAlugado;
    private TipoEquipamento tipoEquipamento;
    private Modelo modelo;
    private Integer idEquipamento;

    public Equipamento() {}

    public Equipamento(int numPatrimonio, boolean isAlugado, TipoEquipamento tipoEquipamento, Modelo modelo) {
        this.numPatrimonio = numPatrimonio;
        this.isAlugado = isAlugado;
        this.tipoEquipamento = tipoEquipamento;
        this.modelo = modelo;
    }

    public int getNumPatrimonio() {
        return numPatrimonio;
    }

    public void setNumPatrimonio(int numPatrimonio) {
        this.numPatrimonio = numPatrimonio;
    }

    public boolean isAlugado() {
        return isAlugado;
    }

    public void setAlugado(boolean alugado) {
        isAlugado = alugado;
    }

    public TipoEquipamento getTipoEquipamento() {
        return tipoEquipamento;
    }

    public void setTipoEquipamento(TipoEquipamento tipoEquipamento) {
        this.tipoEquipamento = tipoEquipamento;
    }

    public Modelo getModelo() {
        return modelo;
    }

    public void setModelo(Modelo modelo) {
        this.modelo = modelo;
    }

    public Integer getIdEquipamento() {
        return idEquipamento;
    }

    public void setIdEquipamento(Integer idEquipamento) {
        this.idEquipamento = idEquipamento;
    }
}
