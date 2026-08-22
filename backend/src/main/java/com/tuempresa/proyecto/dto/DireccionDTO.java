package com.tuempresa.proyecto.dto;

import jakarta.validation.constraints.NotBlank;

public class DireccionDTO {

    @NotBlank(message = "El código postal es obligatorio")
    private String codigoPostal;

    @NotBlank(message = "La urbanización es obligatoria")
    private String urbanizacion;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;

    @NotBlank(message = "La provincia/estado es obligatoria")
    private String provinciaEstado;

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    public DireccionDTO() {
    }

    // Getters y Setters
    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }

    public String getUrbanizacion() { return urbanizacion; }
    public void setUrbanizacion(String urbanizacion) { this.urbanizacion = urbanizacion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getProvinciaEstado() { return provinciaEstado; }
    public void setProvinciaEstado(String provinciaEstado) { this.provinciaEstado = provinciaEstado; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
}