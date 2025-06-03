package com.senac.FixIt.config;

import com.senac.FixIt.models.Usuario;
import com.senac.FixIt.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class DataInitializer {
    
    @Autowired
    private BCryptPasswordEncoder encoder;

    @Bean
    public CommandLineRunner loadInitialData(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.count() == 0) {

                Usuario admin = new Usuario();
                admin.setName("Administrador");
                admin.setEmail("admin@fixit.com");
                admin.setPassword(encoder.encode("admin")); 
                admin.setDepartment("ti");
                admin.setRole("admin");

                Usuario tecnico1 = new Usuario();
                tecnico1.setName("Guilherme");
                tecnico1.setEmail("guilherme@fixit.com");
                tecnico1.setPassword(encoder.encode("guilherme")); 
                tecnico1.setDepartment("suporte");
                tecnico1.setRole("technician");

                Usuario tecnico2 = new Usuario();
                tecnico2.setName("Caio");
                tecnico2.setEmail("caio@fixit.com");
                tecnico2.setPassword(encoder.encode("caio")); 
                tecnico2.setDepartment("suporte");
                tecnico2.setRole("technician");

                Usuario tecnico3 = new Usuario();
                tecnico3.setName("Gustavo");
                tecnico3.setEmail("gustavo@fixit.com");
                tecnico3.setPassword(encoder.encode("gustavo")); 
                tecnico3.setDepartment("suporte");
                tecnico3.setRole("technician");

                Usuario tecnico4 = new Usuario();
                tecnico4.setName("Mariana");
                tecnico4.setEmail("mariana@fixit.com");
                tecnico4.setPassword(encoder.encode("mariana")); 
                tecnico4.setDepartment("suporte");
                tecnico4.setRole("technician");

                usuarioRepository.save(admin);
                usuarioRepository.save(tecnico1);
                usuarioRepository.save(tecnico2);
                usuarioRepository.save(tecnico3);
                usuarioRepository.save(tecnico4);

                System.out.println("✅ Admin e técnicos cadastrados com sucesso.");
            }
        };
    }
}

