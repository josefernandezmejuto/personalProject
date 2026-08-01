package com.tuempresa.proyecto.repository;

import com.tuempresa.proyecto.model.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByActivoTrue();
    Optional<Articulo> findByCodigo(String codigo);
}