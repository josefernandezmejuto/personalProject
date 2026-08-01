package com.tuempresa.proyecto.service;

import com.tuempresa.proyecto.dto.DetalleFacturaDTO;
import com.tuempresa.proyecto.dto.FacturaDTO;
import com.tuempresa.proyecto.dto.PersonaDTO;
import com.tuempresa.proyecto.model.Articulo;
import com.tuempresa.proyecto.model.DetalleFactura;
import com.tuempresa.proyecto.model.Factura;
import com.tuempresa.proyecto.model.Persona;
import com.tuempresa.proyecto.repository.ArticuloRepository;
import com.tuempresa.proyecto.repository.FacturaRepository;
import com.tuempresa.proyecto.repository.PersonaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacturaService {

    private final FacturaRepository facturaRepository;
    private final PersonaRepository personaRepository;
    private final ArticuloRepository articuloRepository;

    public FacturaService(FacturaRepository facturaRepository,
                          PersonaRepository personaRepository,
                          ArticuloRepository articuloRepository) {
        this.facturaRepository = facturaRepository;
        this.personaRepository = personaRepository;
        this.articuloRepository = articuloRepository;
    }

    public List<FacturaDTO> obtenerTodas() {
        return facturaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public FacturaDTO obtenerPorId(Long id) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con ID: " + id));
        return convertirADTO(factura);
    }

    public String generarSiguienteNumero() {
        Long maxId = facturaRepository.findMaxId();
        long siguiente = (maxId != null) ? maxId + 1 : 1;
        return String.format("FAC-%06d", siguiente);
    }

    @Transactional
    public FacturaDTO crearFactura(FacturaDTO dto) {
        Persona cliente = personaRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + dto.getClienteId()));

        Factura factura = new Factura();
        factura.setNumeroFactura(generarSiguienteNumero());
        factura.setFechaEmision(LocalDateTime.now());
        factura.setCliente(cliente);
        factura.setAplicaProntoPago(dto.getAplicaProntoPago() != null ? dto.getAplicaProntoPago() : false);
        factura.setPorcentajeProntoPago(dto.getPorcentajeProntoPago() != null ? dto.getPorcentajeProntoPago() : 5.0);
        factura.setEstado("Pagada");

        BigDecimal acumuladoSubtotal = BigDecimal.ZERO;
        BigDecimal acumuladoDescuento = BigDecimal.ZERO;

        for (DetalleFacturaDTO dDto : dto.getDetalles()) {
            Articulo articulo = articuloRepository.findById(dDto.getArticuloId())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + dDto.getArticuloId()));

            if (articulo.getStockActual() < dDto.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el artículo: " + articulo.getDescripcion());
            }

            // Descontar inventario
            articulo.setStockActual(articulo.getStockActual() - dDto.getCantidad());
            articuloRepository.save(articulo);

            DetalleFactura detalle = new DetalleFactura();
            detalle.setArticulo(articulo);
            detalle.setCantidad(dDto.getCantidad());
            detalle.setPrecioUnitario(articulo.getPrecioUnitario());
            
            String desc = (dDto.getDescripcionPersonalizada() != null && !dDto.getDescripcionPersonalizada().trim().isEmpty())
                    ? dDto.getDescripcionPersonalizada().trim()
                    : articulo.getDescripcion();
            detalle.setDescripcionPersonalizada(desc);

            double pctDesc = (dDto.getDescuento() != null) ? dDto.getDescuento() : articulo.getDescuento();
            detalle.setDescuento(pctDesc);

            BigDecimal brutoLinea = articulo.getPrecioUnitario().multiply(BigDecimal.valueOf(dDto.getCantidad()));
            BigDecimal descLinea = brutoLinea.multiply(BigDecimal.valueOf(pctDesc / 100.0));
            BigDecimal subtotalLinea = brutoLinea.subtract(descLinea);

            detalle.setSubtotal(subtotalLinea);

            acumuladoSubtotal = acumuladoSubtotal.add(brutoLinea);
            acumuladoDescuento = acumuladoDescuento.add(descLinea);

            factura.agregarDetalle(detalle);
        }

        factura.setSubtotal(acumuladoSubtotal);
        factura.setMontoDescuentoTotal(acumuladoDescuento);

        BigDecimal baseParcial = acumuladoSubtotal.subtract(acumuladoDescuento);

        BigDecimal montoProntoPago = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(factura.getAplicaProntoPago())) {
            montoProntoPago = baseParcial.multiply(BigDecimal.valueOf(factura.getPorcentajeProntoPago() / 100.0));
        }
        factura.setMontoProntoPago(montoProntoPago);

        BigDecimal baseImponible = baseParcial.subtract(montoProntoPago);
        BigDecimal montoIva = baseImponible.multiply(BigDecimal.valueOf(0.16)).setScale(2, RoundingMode.HALF_UP);
        factura.setMontoIva(montoIva);

        BigDecimal total = baseImponible.add(montoIva).setScale(2, RoundingMode.HALF_UP);
        factura.setTotal(total);

        Factura guardada = facturaRepository.save(factura);
        return convertirADTO(guardada);
    }

    @Transactional
    public void anularFactura(Long id) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con ID: " + id));

        if ("Anulada".equals(factura.getEstado())) {
            throw new RuntimeException("La factura ya se encuentra anulada.");
        }

        // Revertir inventario de artículos
        for (DetalleFactura detalle : factura.getDetalles()) {
            Articulo articulo = detalle.getArticulo();
            articulo.setStockActual(articulo.getStockActual() + detalle.getCantidad());
            articuloRepository.save(articulo);
        }

        factura.setEstado("Anulada");
        facturaRepository.save(factura);
    }

    private FacturaDTO convertirADTO(Factura f) {
        FacturaDTO dto = new FacturaDTO();
        dto.setId(f.getId());
        dto.setNumeroFactura(f.getNumeroFactura());
        dto.setFechaEmision(f.getFechaEmision());
        dto.setClienteId(f.getCliente().getId());

        PersonaDTO cDto = new PersonaDTO();
        cDto.setId(f.getCliente().getId());
        cDto.setCedula(f.getCliente().getCedula());
        cDto.setNombre(f.getCliente().getNombre());
        cDto.setApellidos(f.getCliente().getApellidos());
        dto.setCliente(cDto);

        List<DetalleFacturaDTO> detallesDto = f.getDetalles().stream().map(d -> {
            DetalleFacturaDTO dDto = new DetalleFacturaDTO();
            dDto.setArticuloId(d.getArticulo().getId());
            dDto.setDescripcionPersonalizada(d.getDescripcionPersonalizada());
            dDto.setCantidad(d.getCantidad());
            dDto.setPrecioUnitario(d.getPrecioUnitario());
            dDto.setDescuento(d.getDescuento());
            dDto.setSubtotal(d.getSubtotal());
            return dDto;
        }).collect(Collectors.toList());

        dto.setDetalles(detallesDto);
        dto.setSubtotal(f.getSubtotal());
        dto.setMontoDescuentoTotal(f.getMontoDescuentoTotal());
        dto.setAplicaProntoPago(f.getAplicaProntoPago());
        dto.setPorcentajeProntoPago(f.getPorcentajeProntoPago());
        dto.setMontoProntoPago(f.getMontoProntoPago());
        dto.setMontoIva(f.getMontoIva());
        dto.setTotal(f.getTotal());
        dto.setEstado(f.getEstado());
        return dto;
    }
}