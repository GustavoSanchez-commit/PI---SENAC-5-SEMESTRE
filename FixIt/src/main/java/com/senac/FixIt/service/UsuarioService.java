package com.senac.FixIt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;

import com.senac.FixIt.models.Usuario;
import com.senac.FixIt.repository.UsuarioRepository;
import com.senac.FixIt.dto.LoginDTO;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para listar todos os usuários
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Método para buscar um usuário por ID
    public Optional<Usuario> getUsuarioById(int id) {
        return usuarioRepository.findById(id);
    }
    
    //Metodo para autenticar usuario 
    public ResponseEntity<?> login(LoginDTO loginDTO) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(loginDTO.getEmail());

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            if (usuario.getPassword().equals(loginDTO.getPassword())) {
                usuario.setPassword(null); // remove a senha da resposta
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
    }

    // Método para criar um novo usuário com verificação de duplicidade de email e telefone
    public Usuario createUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email já está em uso.");
        }

        if (usuarioRepository.existsByTelephone(usuario.getTelephone())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefone já está em uso.");
        }
        
        if (usuario.getRole() == null || usuario.getRole().isEmpty()) {
            usuario.setRole("Usuário");
        }


        return usuarioRepository.save(usuario);
    }

    // Método para atualizar um usuário
    public Optional<Usuario> updateUsuario(int id, Usuario usuarioDetails) {
        Optional<Usuario> existingUsuario = usuarioRepository.findById(id);

        if (existingUsuario.isPresent()) {
            Usuario usuario = existingUsuario.get();

            // Verifica se o novo email já existe em outro usuário
            if (!usuario.getEmail().equals(usuarioDetails.getEmail()) &&
                usuarioRepository.existsByEmail(usuarioDetails.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email já está em uso.");
            }

            // Verifica se o novo telefone já existe em outro usuário
            if (!usuario.getTelephone().equals(usuarioDetails.getTelephone()) &&
                usuarioRepository.existsByTelephone(usuarioDetails.getTelephone())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefone já está em uso.");
            }

            usuario.setName(usuarioDetails.getName());
            usuario.setEmail(usuarioDetails.getEmail());
            usuario.setPassword(usuarioDetails.getPassword());  // Corrigido: "setSenha" → "setPassword"
            usuario.setDepartment(usuarioDetails.getDepartment());  // Corrigido: "setCargo" → "setDepartment"
            usuario.setTelephone(usuarioDetails.getTelephone());

            return Optional.of(usuarioRepository.save(usuario));
        }

        return Optional.empty();
    }

    // Método para deletar um usuário
    public boolean deleteUsuario(int id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            usuarioRepository.delete(usuario.get());
            return true;
        }
        return false;
    }
}
