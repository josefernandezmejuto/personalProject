package com.tuempresa.proyecto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "facturas")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroFactura;

    @Column(nullable = false)
    private LocalDateTime fechaEmision = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Persona cliente;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleFactura> detalles = new ArrayList<>();

    @NotNull
    private BigDecimal subtotal = BigDecimal.ZERO;

    @NotNull
    private BigDecimal montoDescuentoTotal = BigDecimal.ZERO;

    private Boolean aplicaProntoPago = false;

    private Double porcentajeProntoPago = 5.0;

    private BigDecimal montoProntoPago = BigDecimal.ZERO;

    @NotNull
    private BigDecimal montoIva = BigDecimal.ZERO;

    @NotNull
    private BigDecimal total = BigDecimal.ZERO;

    @Column(nullable = false)
    private String estado = "Pagada"; // Pagada, Anulada

    public Factura() {}

    public void agregarDetalle(DetalleFactura detalle) {
        detalles.add(detalle);
        detalle.setFactura(this);
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }

    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDateTime fechaEmision) { this.fechaEmision = fechaEmision; }

    public Persona getCliente() { return cliente; }
    public void setCliente(Persona cliente) { this.cliente = cliente; }

    public List<DetalleFactura> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleFactura> detalles) { this.detalles = detalles; }

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