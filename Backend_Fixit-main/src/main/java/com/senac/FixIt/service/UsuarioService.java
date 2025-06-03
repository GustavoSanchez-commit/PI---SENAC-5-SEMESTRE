package com.senac.FixIt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;

import com.senac.FixIt.models.Usuario;
import com.senac.FixIt.repository.UsuarioRepository;
import com.senac.FixIt.dto.LoginDTO;
import com.senac.FixIt.dto.UsuarioResponseDTO;
import com.senac.FixIt.dto.UsuarioUpdateDTO;

import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    // Método para listar todos os usuários
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Método para buscar um usuário por ID
    public Optional<Usuario> getUsuarioById(int id) {
        return usuarioRepository.findById(id);
    }
    
    public ResponseEntity<?> login(LoginDTO loginDTO) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(loginDTO.getEmail());

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            if (passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
                UsuarioResponseDTO responseDTO = new UsuarioResponseDTO(
                    usuario.getId(),
                    usuario.getName(),
                    usuario.getEmail(),
                    usuario.getDepartment(),
                    usuario.getTelephone(),
                    usuario.getRole()
                );
                return ResponseEntity.ok(responseDTO);
                       
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
    }

    public UsuarioResponseDTO createUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email já está em uso.");
        }
    
        if (usuarioRepository.existsByTelephone(usuario.getTelephone())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefone já está em uso.");
        }
    
        if (usuario.getRole() == null || usuario.getRole().isEmpty()) {
            usuario.setRole("Usuário");
        }
    
        // 🔐 Criptografar a senha
        String senhaCriptografada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(senhaCriptografada);
    
        Usuario saved = usuarioRepository.save(usuario);
    
        return new UsuarioResponseDTO(
            saved.getId(),
            saved.getName(),
            saved.getEmail(),
            saved.getDepartment(),
            saved.getTelephone(),
            saved.getRole()
        );
    }
    
public Optional<Usuario> updateUsuario(int id, UsuarioUpdateDTO usuarioDetails) {
    Optional<Usuario> existingUsuario = usuarioRepository.findById(id);

    if (existingUsuario.isPresent()) {
        Usuario usuario = existingUsuario.get();

        if (usuarioDetails.getName() != null && !usuarioDetails.getName().isBlank()) {
            usuario.setName(usuarioDetails.getName());
        }

        if (usuarioDetails.getEmail() != null && !usuarioDetails.getEmail().isBlank()) {
            if (!usuario.getEmail().equals(usuarioDetails.getEmail()) &&
                usuarioRepository.existsByEmail(usuarioDetails.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email já está em uso.");
            }
            usuario.setEmail(usuarioDetails.getEmail());
        }

        if (usuarioDetails.getTelephone() != null && !usuarioDetails.getTelephone().isBlank()) {
            if (!usuario.getTelephone().equals(usuarioDetails.getTelephone()) &&
                usuarioRepository.existsByTelephone(usuarioDetails.getTelephone())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefone já está em uso.");
            }
            usuario.setTelephone(usuarioDetails.getTelephone());
        }

        if (usuarioDetails.getDepartment() != null && !usuarioDetails.getDepartment().isBlank()) {
            usuario.setDepartment(usuarioDetails.getDepartment());
        }

        if (usuarioDetails.getPassword() != null && !usuarioDetails.getPassword().isBlank()) {
            String senhaCriptografada = passwordEncoder.encode(usuarioDetails.getPassword());
            usuario.setPassword(senhaCriptografada);
        }

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
