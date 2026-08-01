package com.tuempresa.proyecto.controller;

import com.tuempresa.proyecto.dto.FacturaDTO;
import com.tuempresa.proyecto.service.FacturaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    private final FacturaService facturaService;

    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

    @GetMapping
    public ResponseEntity<List<FacturaDTO>> listarTodas() {
        return ResponseEntity.ok(facturaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacturaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(facturaService.obtenerPorId(id));
    }

    @GetMapping("/siguiente-numero")
    public ResponseEntity<Map<String, String>> obtenerSiguienteNumero() {
        String siguiente = facturaService.generarSiguienteNumero();
        return ResponseEntity.ok(Map.of("numeroFactura", siguiente));
    }

    @PostMapping
    public ResponseEntity<FacturaDTO> crear(@Valid @RequestBody FacturaDTO dto) {
        return new ResponseEntity<>(facturaService.crearFactura(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/anular")
    public ResponseEntity<Void> anular(@PathVariable Long id) {
        facturaService.anularFactura(id);
        return ResponseEntity.noContent().build();
    }
}