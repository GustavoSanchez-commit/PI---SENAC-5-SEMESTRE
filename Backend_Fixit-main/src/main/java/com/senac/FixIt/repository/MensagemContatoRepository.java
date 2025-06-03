package com.senac.FixIt.repository;

import com.senac.FixIt.models.MensagemContato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensagemContatoRepository extends JpaRepository<MensagemContato, Integer> {
}
