package org.example.models.pessoa;

public class Telefone {
    private DDD nroDDD;
    private DDI nroDDI;

    private String nroFone;

    public Telefone(DDD nroDDD, DDI nroDDI, String nroFone) {
        this.nroDDD = nroDDD;
        this.nroDDI = nroDDI;
        this.nroFone = nroFone;
    }

    public DDD getNroDDD() {
        return nroDDD;
    }

    public void setNroDDD(DDD nroDDD) {
        this.nroDDD = nroDDD;
    }

    public String getNroFone() {
        return nroFone;
    }

    public void setNroFone(String nroFone) {
        this.nroFone = nroFone;
    }

    public DDI getNroDDI() {
        return nroDDI;
    }

    public void setNroDDI(DDI nroDDI) {
        this.nroDDI = nroDDI;
    }
}
