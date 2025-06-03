package com.senac.FixIt.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = Comentario.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Comentario {

    public static final String TABLE_NAME = "comentario";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @NotBlank
    @Size(min = 1, max = 2000)
    @Column(name = "mensagem", nullable = false, length = 2000)
    private String mensagem;

    @Column(name = "data_comentario", nullable = false)
    private LocalDateTime dataComentario = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @ManyToOne
    @JoinColumn(name = "chamado_id", nullable = false)
    @JsonBackReference
    private Chamado chamado;

}
