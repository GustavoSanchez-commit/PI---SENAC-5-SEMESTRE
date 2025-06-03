package com.senac.FixIt.service;

import com.senac.FixIt.models.Chamado;
import com.senac.FixIt.repository.ChamadoRepository;
import java.time.format.DateTimeFormatter;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChamadoService {

    @Autowired
    private ChamadoRepository chamadoRepository;

    // 🔍 Buscar todos os chamados
    public List<Chamado> getAllChamados() {
        return chamadoRepository.findAll();
    }

    // 🔍 Buscar chamado por ID
    public Optional<Chamado> getChamadoById(int id) {
        return chamadoRepository.findById(id);
    }

    public Chamado createChamado(Chamado chamado) {


        Chamado salvo = chamadoRepository.save(chamado);

        String prioridadeInicial = salvo.getPrioridade().name().substring(0, 1);
        String dataInvertida = salvo.getDataCriacao().format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        String id = String.valueOf(salvo.getId());

        String codigo = String.format("%s-%s-%s", prioridadeInicial,  dataInvertida, id);
        salvo.setCodigo(codigo);

        return chamadoRepository.save(salvo);
    }

    // 🛠️ Atualizar chamado existente
    public Optional<Chamado> updateChamado(int id, Chamado chamadoDetails) {
        Optional<Chamado> optionalChamado = chamadoRepository.findById(id);

        if (optionalChamado.isPresent()) {
            Chamado chamado = optionalChamado.get();


            chamado.setStatus(chamadoDetails.getStatus());
            chamado.setComentarios(chamadoDetails.getComentarios());
            chamado.setTecnico(chamadoDetails.getTecnico());
            chamado.setDataFechamento(chamadoDetails.getDataFechamento());

            return Optional.of(chamadoRepository.save(chamado));
        }

        return Optional.empty();
    }

    // ❌ Deletar chamado
    public boolean deleteChamado(int id) {
        Optional<Chamado> chamado = chamadoRepository.findById(id);
        if (chamado.isPresent()) {
            chamadoRepository.delete(chamado.get());
            return true;
        }
        return false;
    }

    public List<Chamado> searchChamados(String query) {
        
        throw new UnsupportedOperationException("Unimplemented method 'searchChamados'");
    }

    public List<Chamado> filterChamados(String status, String prioridade, String departamento) {
        List<Chamado> todosChamados = chamadoRepository.findAll();
    
        return todosChamados.stream()
                .filter(c -> status == null || c.getStatus().name().equalsIgnoreCase(status))
                .filter(c -> prioridade == null || c.getPrioridade().name().equalsIgnoreCase(prioridade))
                .filter(c -> departamento == null || 
                    (c.getUsuario() != null && c.getUsuario().getDepartment() != null &&
                     c.getUsuario().getDepartment().equalsIgnoreCase(departamento)))
                .collect(Collectors.toList());
    }
    

}
