package com.tuempresa.proyecto.repository;

import com.tuempresa.proyecto.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {
    List<Persona> findByActivoTrue();
    Optional<Persona> findByCedula(String cedula);
}