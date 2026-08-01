package com.tuempresa.proyecto.repository;

import com.tuempresa.proyecto.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    Optional<Factura> findByNumeroFactura(String numeroFactura);

    @Query("SELECT MAX(f.id) FROM Factura f")
    Long findMaxId();
}