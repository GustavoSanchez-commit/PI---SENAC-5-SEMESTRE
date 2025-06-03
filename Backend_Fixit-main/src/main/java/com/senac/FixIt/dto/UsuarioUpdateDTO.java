
package com.senac.FixIt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioUpdateDTO {
    private String name;
    private String email;
    private String telephone;
    private String department;
    private String password;
}
