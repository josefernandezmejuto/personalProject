package com.tuempresa.proyecto.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class FacturaDTO {

    private Long id;
    private String numeroFactura;
    private LocalDateTime fechaEmision;

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    private PersonaDTO cliente;

    @NotEmpty(message = "La factura debe incluir al menos un ítem")
    private List<DetalleFacturaDTO> detalles;

    private BigDecimal subtotal;
    private BigDecimal montoDescuentoTotal;
    private Boolean aplicaProntoPago = false;
    private Double porcentajeProntoPago = 5.0;
    private BigDecimal montoProntoPago;
    private BigDecimal montoIva;
    private BigDecimal total;
    private String estado;

    public FacturaDTO() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }

    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDateTime fechaEmision) { this.fechaEmision = fechaEmision; }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public PersonaDTO getCliente() { return cliente; }
    public void setCliente(PersonaDTO cliente) { this.cliente = cliente; }

    public List<DetalleFacturaDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleFacturaDTO> detalles) { this.detalles = detalles; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getMontoDescuentoTotal() { return montoDescuentoTotal; }
    public void setMontoDescuentoTotal(BigDecimal montoDescuentoTotal) { this.montoDescuentoTotal = montoDescuentoTotal; }

    public Boolean getAplicaProntoPago() { return aplicaProntoPago; }
    public void setAplicaProntoPago(Boolean aplicaProntoPago) { this.aplicaProntoPago = aplicaProntoPago; }

    public Double getPorcentajeProntoPago() { return porcentajeProntoPago; }
    public void setPorcentajeProntoPago(Double porcentajeProntoPago) { this.porcentajeProntoPago = porcentajeProntoPago; }

    public BigDecimal getMontoProntoPago() { return montoProntoPago; }
    public void setMontoProntoPago(BigDecimal montoProntoPago) { this.montoProntoPago = montoProntoPago; }

    public BigDecimal getMontoIva() { return montoIva; }
    public void setMontoIva(BigDecimal montoIva) { this.montoIva = montoIva; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}