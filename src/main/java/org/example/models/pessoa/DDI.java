package org.example.models.pessoa;

import java.io.Serializable;

public class DDI implements Serializable {
    private String nroDDI;

    public DDI() {}

    public DDI(String nroDDI) {
        this.nroDDI = nroDDI;
    }
    public String getNroDDI() {
        return nroDDI;
    }
    public void setNroDDI(String nroDDI) { this.nroDDI =  nroDDI; }
}
