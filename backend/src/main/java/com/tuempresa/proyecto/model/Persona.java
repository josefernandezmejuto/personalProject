package com.tuempresa.proyecto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "personas")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La cédula es obligatoria")
    @Column(unique = true, nullable = false)
    private String cedula;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Column(nullable = false)
    private String apellidos;

    @NotBlank(message = "El email es obligatorio")
    @Column(nullable = false)
    private String email;

    @NotBlank(message = "El teléfono celular es obligatorio")
    @Column(nullable = false)
    private String telefonoCelular;

    @NotBlank(message = "El teléfono fijo es obligatorio")
    @Column(nullable = false)
    private String telefonoFijo;

    @NotBlank(message = "El código postal es obligatorio")
    @Column(nullable = false)
    private String codigoPostal;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(nullable = false)
    private String ciudad;

    @NotBlank(message = "La provincia/estado es obligatoria")
    @Column(nullable = false)
    private String provinciaEstado;

    @NotBlank(message = "El país es obligatorio")
    @Column(nullable = false)
    private String pais;

    @NotBlank(message = "La urbanización es obligatoria")
    @Column(nullable = false)
    private String urbanizacion;

    @NotNull
    @Column(nullable = false)
    private Boolean activo = true;

    public Persona() {
    }

    public Persona(Long id, String cedula, String nombre, String apellidos, String email, String telefonoCelular,
            String telefonoFijo, String direccion, String codigoPostal, String ciudad, String provinciaEstado,
            String pais, String urbanizacion, Boolean activo) {
        this.id = id;
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.telefonoCelular = telefonoCelular;
        this.telefonoFijo = telefonoFijo;
        this.activo = activo;
        this.codigoPostal = codigoPostal;
        this.urbanizacion = urbanizacion;
        this.ciudad = ciudad;
        this.provinciaEstado = provinciaEstado;
        this.pais = pais;

    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefonoCelular() {
        return telefonoCelular;
    }

    public void setTelefonoCelular(String telefonoCelular) {
        this.telefonoCelular = telefonoCelular;
    }

    public String getTelefonoFijo() {
        return telefonoFijo;
    }

    public void setTelefonoFijo(String telefonoFijo) {
        this.telefonoFijo = telefonoFijo;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

   public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getProvinciaEstado() {
        return provinciaEstado;
    }

    public void setProvinciaEstado(String provinciaEstado) {
        this.provinciaEstado = provinciaEstado;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getUrbanizacion() {
        return urbanizacion;
    }

    public void setUrbanizacion(String urbanizacion) {
        this.urbanizacion = urbanizacion;
    }
}