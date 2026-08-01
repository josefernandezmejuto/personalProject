package com.tuempresa.proyecto.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DetalleFacturaDTO {

    @NotNull(message = "El ID del artículo es obligatorio")
    private Long articuloId;

    private String descripcionPersonalizada;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    private BigDecimal precioUnitario;
    private Double descuento;
    private BigDecimal subtotal;

    public DetalleFacturaDTO() {}

    // Getters y Setters
    public Long getArticuloId() { return articuloId; }
    public void setArticuloId(Long articuloId) { this.articuloId = articuloId; }

    public String getDescripcionPersonalizada() { return descripcionPersonalizada; }
    public void setDescripcionPersonalizada(String descripcionPersonalizada) { this.descripcionPersonalizada = descripcionPersonalizada; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}