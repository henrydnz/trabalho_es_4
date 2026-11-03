package org.example.models.aluguel;

public class Equipamento {
    private int numPatrimonio;
    private boolean isAlugado;
    private TipoEquipamento tipoEquipamento;

    public Equipamento(int numPatrimonio, boolean isAlugado, TipoEquipamento tipoEquipamento) {
        this.numPatrimonio = numPatrimonio;
        this.isAlugado = isAlugado;
        this.tipoEquipamento = tipoEquipamento;
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
}
