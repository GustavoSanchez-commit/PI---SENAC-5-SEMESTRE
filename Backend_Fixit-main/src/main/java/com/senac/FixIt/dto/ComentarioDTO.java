package com.senac.FixIt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComentarioDTO {
    @NotBlank
    private String mensagem;

    @NotNull
    private Integer autorId;
}
