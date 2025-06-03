package com.senac.FixIt.service;

import com.senac.FixIt.dto.ComentarioDTO;
import com.senac.FixIt.models.Chamado;
import com.senac.FixIt.models.Comentario;
import com.senac.FixIt.models.Usuario;
import com.senac.FixIt.repository.ChamadoRepository;
import com.senac.FixIt.repository.ComentarioRepository;
import com.senac.FixIt.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ChamadoRepository chamadoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Comentario criarComentario(Integer chamadoId, ComentarioDTO dto) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new EntityNotFoundException("Chamado não encontrado"));

        Usuario autor = usuarioRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new EntityNotFoundException("Autor não encontrado"));

        Comentario comentario = new Comentario();
        comentario.setMensagem(dto.getMensagem());
        comentario.setDataComentario(LocalDateTime.now());
        comentario.setChamado(chamado);
        comentario.setAutor(autor);

        return comentarioRepository.save(comentario);
    }

    public List<Comentario> listarComentariosPorChamado(Integer chamadoId) {
        return comentarioRepository.findByChamadoId(chamadoId);
    }
}
