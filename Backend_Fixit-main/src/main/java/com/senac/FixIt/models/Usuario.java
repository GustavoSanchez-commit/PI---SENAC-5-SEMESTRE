package com.senac.FixIt.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = Usuario.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Usuario {
    
    public static final String TABLE_NAME = "usuario";
    
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Size(min = 1, max = 75)
    @Column(name = "name", nullable = false, length = 75)
    @NotBlank
    private String name;
    
    @Column(name = "email", nullable = false, unique = true)
    @Size(min = 5, max = 50)
    @NotBlank(message = "O e-mail não pode estar em branco")
    @Email(message = "O e-mail deve ser válido")
    private String email;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password", length = 60, nullable = false)
    @NotBlank
    @Size(min = 4, max = 100)
    private String password;
    
    @Column(name = "department", nullable = false)
    @NotBlank
    private String department;

    @Column(name = "telephone", length = 15, unique = true)
    private String telephone;

    @Column(name = "role", nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'user'")
    private String role;


}
