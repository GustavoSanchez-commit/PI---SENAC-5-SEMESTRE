package com.senac.FixIt.controllers;

import com.senac.FixIt.models.MensagemContato;
import com.senac.FixIt.repository.MensagemContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contato")
public class MensagemContatoController {

    private final MensagemContatoRepository repository;

    public MensagemContatoController(MensagemContatoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<String> receberMensagem(@RequestBody MensagemContato mensagem) {
        repository.save(mensagem);
        return ResponseEntity.ok("Mensagem recebida com sucesso!");
    }
}
