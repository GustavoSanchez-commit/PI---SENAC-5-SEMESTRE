package com.senac.FixIt.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Prioridade {
    ALTA, BAIXA, MEDIA, CRITICA;

    @JsonCreator
    public static Prioridade fromString(String value) {
        return Prioridade.valueOf(value.toUpperCase());
    }
}
