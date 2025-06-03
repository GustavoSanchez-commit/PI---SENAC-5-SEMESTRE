package com.senac.FixIt.repository;

import com.senac.FixIt.models.Comentario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    List<Comentario> findByChamadoId(Integer chamadoId);

}

