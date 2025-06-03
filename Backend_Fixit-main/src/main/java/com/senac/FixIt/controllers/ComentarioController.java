package com.senac.FixIt.controllers;

import com.senac.FixIt.dto.ComentarioDTO;
import com.senac.FixIt.models.Comentario;
import com.senac.FixIt.service.ComentarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chamados/{chamadoId}/comentarios")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @PostMapping
    public Comentario criarComentario(
            @PathVariable Integer chamadoId,
            @RequestBody @Valid ComentarioDTO dto) {
        return comentarioService.criarComentario(chamadoId, dto);
    }

    @GetMapping
    public List<Comentario> listarPorChamado(@PathVariable Integer chamadoId) {
        return comentarioService.listarComentariosPorChamado(chamadoId);
    }
}

