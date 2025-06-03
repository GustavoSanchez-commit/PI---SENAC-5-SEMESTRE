package com.senac.FixIt.controllers;

import com.senac.FixIt.models.Chamado;
import com.senac.FixIt.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    @Autowired
    private ChamadoService chamadoService;

    // 🔍 Buscar todos os chamados
    @GetMapping
    public List<Chamado> getAllChamados() {
        return chamadoService.getAllChamados();
    }

    // 🔍 Buscar chamado por ID
    @GetMapping("/{id}")
    public ResponseEntity<Chamado> getChamadoById(@PathVariable int id) {
        return chamadoService.getChamadoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ➕ Criar novo chamado
    @PostMapping
    public Chamado createChamado(@RequestBody Chamado chamado) {
        return chamadoService.createChamado(chamado);
    }

    // ✏️ Atualizar chamado
    @PutMapping("/{id}")
    public ResponseEntity<Chamado> updateChamado(@PathVariable int id, @RequestBody Chamado chamado) {
        return chamadoService.updateChamado(id, chamado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ❌ Deletar chamado
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChamado(@PathVariable int id) {
        boolean deleted = chamadoService.deleteChamado(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔍 Buscar por título ou descrição (filtro de texto)
    @GetMapping("/buscar")
    public List<Chamado> searchChamados(@RequestParam("q") String query) {
        return chamadoService.searchChamados(query);
    }

    // 🎯 Filtro por status, prioridade e departamento
    @GetMapping("/filtrar")
    public List<Chamado> filterChamados(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioridade,
            @RequestParam(required = false) String departamento) {
        return chamadoService.filterChamados(status, prioridade, departamento);
    }
}
