package com.senac.FixIt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioResponseDTO {
    private int id;
    private String name;
    private String email;
    private String department;
    private String telephone;
    private String role;

}
