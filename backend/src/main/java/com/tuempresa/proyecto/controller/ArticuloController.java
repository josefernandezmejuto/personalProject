package com.tuempresa.proyecto.controller;

import com.tuempresa.proyecto.dto.ArticuloDTO;
import com.tuempresa.proyecto.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    private final ArticuloService articuloService;

    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
    }

    @GetMapping
    public ResponseEntity<List<ArticuloDTO>> listarTodos(@RequestParam(required = false, defaultValue = "false") boolean soloActivos) {
        if (soloActivos) {
            return ResponseEntity.ok(articuloService.obtenerActivos());
        }
        return ResponseEntity.ok(articuloService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticuloDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(articuloService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<ArticuloDTO> crear(@Valid @RequestBody ArticuloDTO dto) {
        return new ResponseEntity<>(articuloService.guardar(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticuloDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ArticuloDTO dto) {
        return ResponseEntity.ok(articuloService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        articuloService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}