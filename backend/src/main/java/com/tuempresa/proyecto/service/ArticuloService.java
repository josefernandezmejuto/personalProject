package com.tuempresa.proyecto.service;

import com.tuempresa.proyecto.dto.ArticuloDTO;
import com.tuempresa.proyecto.model.Articulo;
import com.tuempresa.proyecto.repository.ArticuloRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticuloService {

    private final ArticuloRepository articuloRepository;

    public ArticuloService(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    public List<ArticuloDTO> obtenerTodos() {
        return articuloRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<ArticuloDTO> obtenerActivos() {
        return articuloRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public ArticuloDTO obtenerPorId(Long id) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id));
        return convertirADTO(articulo);
    }

    public ArticuloDTO guardar(ArticuloDTO dto) {
        Articulo articulo = convertirAEntidad(dto);
        if (articulo.getActivo() == null) {
            articulo.setActivo(true);
        }
        if (articulo.getDescuento() == null) {
            articulo.setDescuento(0.0);
        }
        Articulo guardado = articuloRepository.save(articulo);
        return convertirADTO(guardado);
    }

    public ArticuloDTO actualizar(Long id, ArticuloDTO dto) {
        Articulo existente = articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id));

        existente.setCodigo(dto.getCodigo());
        existente.setDescripcion(dto.getDescripcion());
        existente.setPrecioUnitario(dto.getPrecioUnitario());
        existente.setPrecioUrgente(dto.getPrecioUrgente());
        existente.setStockActual(dto.getStockActual());
        
        if (dto.getDescuento() != null) {
            existente.setDescuento(dto.getDescuento());
        }
        if (dto.getActivo() != null) {
            existente.setActivo(dto.getActivo());
        }

        Articulo actualizado = articuloRepository.save(existente);
        return convertirADTO(actualizado);
    }

    public void eliminar(Long id) {
        Articulo existente = articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id));
        existente.setActivo(false); // Borrado lógico
        articuloRepository.save(existente);
    }

    // Mapeos DTO <-> Entidad
    private ArticuloDTO convertirADTO(Articulo a) {
        ArticuloDTO dto = new ArticuloDTO();
        dto.setId(a.getId());
        dto.setCodigo(a.getCodigo());
        dto.setDescripcion(a.getDescripcion());
        dto.setPrecioUnitario(a.getPrecioUnitario());
        dto.setPrecioUrgente(a.getPrecioUrgente());
        dto.setStockActual(a.getStockActual());
        dto.setDescuento(a.getDescuento());
        dto.setActivo(a.getActivo());
        return dto;
    }

    private Articulo convertirAEntidad(ArticuloDTO dto) {
        Articulo a = new Articulo();
        a.setId(dto.getId());
        a.setCodigo(dto.getCodigo());
        a.setDescripcion(dto.getDescripcion());
        a.setPrecioUnitario(dto.getPrecioUnitario());
        a.setPrecioUrgente(dto.getPrecioUrgente());
        a.setStockActual(dto.getStockActual());
        a.setDescuento(dto.getDescuento() != null ? dto.getDescuento() : 0.0);
        a.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return a;
    }
}