package org.example.models.pessoa;

import java.io.Serializable;

public class DDD implements Serializable {
    private String nroDDD;

    public DDD(String nroDDD) {
        this.nroDDD = nroDDD;
    }
    public String getNroDDD() {
        return nroDDD;
    }
    public void setNroDDD(String nroDDD) {
        this.nroDDD = nroDDD;
    }
}
