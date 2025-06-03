package com.senac.FixIt.repository;

import com.senac.FixIt.models.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Integer> {

    List<Chamado> findByStatus(String status);

    List<Chamado> findByPrioridade(String prioridade);

    List<Chamado> findByStatusAndPrioridade(String status, String prioridade);

    List<Chamado> findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCase(String titulo, String descricao);

    @Query("SELECT c FROM Chamado c " +
       "JOIN c.usuario u " +
       "WHERE (:status IS NULL OR c.status = :status) " +
       "AND (:prioridade IS NULL OR c.prioridade = :prioridade) " +
       "AND (:departamento IS NULL OR u.department = :departamento)")
List<Chamado> filterChamados(@Param("status") String status,
                             @Param("prioridade") String prioridade,
                             @Param("departamento") String departamento);

}
