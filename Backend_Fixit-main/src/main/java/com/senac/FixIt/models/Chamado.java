package com.senac.FixIt.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = Chamado.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Chamado {

    public static final String TABLE_NAME = "chamado";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @Column(name = "codigo", unique = true)
    private String codigo;

    @NotBlank
    @Size(min = 3, max = 100)
    @Column(name = "titulo", nullable = false, length = 100)
    private String titulo;

    @NotBlank
    @Size(min = 5, max = 1000)
    @Column(name = "descricao", nullable = false, length = 1000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusChamado status = StatusChamado.ABERTO;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridade", nullable = false, length = 20)
    private Prioridade prioridade = Prioridade.BAIXA;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(name = "data_fechamento")
    private LocalDateTime dataFechamento;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // criador do chamado

    @ManyToOne
    @JoinColumn(name = "tecnico_id")
    private Usuario tecnico; // técnico atribuído (pode ser null inicialmente)

    @OneToMany(mappedBy = "chamado", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Comentario> comentarios = new ArrayList<>();

}
