package com.senac.FixIt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.senac.FixIt.models.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Método para verificar se o e-mail já existe
    boolean existsByEmail(String email);

    // Método para buscar um usuário pelo e-mail
    Optional<Usuario> findByEmail(String email);

    boolean existsByTelephone(String telephone);
    
}
