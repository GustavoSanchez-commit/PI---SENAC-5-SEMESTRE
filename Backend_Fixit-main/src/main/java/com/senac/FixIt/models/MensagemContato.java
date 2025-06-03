package com.senac.FixIt.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = MensagemContato.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MensagemContato {

    public static final String TABLE_NAME = "contato";
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "nome", nullable = false, length = 75)
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 75, message = "O nome deve ter no máximo 75 caracteres")
    private String nome;

    @Column(name = "email", nullable = false, length = 100)
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres")
    private String email;

    @Column(name = "mensagem", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "A mensagem não pode estar em branco")
    private String mensagem;

}
