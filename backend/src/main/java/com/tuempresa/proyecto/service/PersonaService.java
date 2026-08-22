package com.tuempresa.proyecto.service;

import com.tuempresa.proyecto.dto.PersonaDTO;
import com.tuempresa.proyecto.model.Persona;
import com.tuempresa.proyecto.repository.PersonaRepository;
import com.tuempresa.proyecto.dto.DireccionDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;

    public PersonaService(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    public List<PersonaDTO> obtenerTodas() {
        return personaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<PersonaDTO> obtenerActivas() {
        return personaRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public PersonaDTO obtenerPorId(Long id) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));
        return convertirADTO(persona);
    }

    public PersonaDTO guardar(PersonaDTO dto) {
        Persona persona = convertirAEntidad(dto);
        if (persona.getActivo() == null) {
            persona.setActivo(true);
        }
        Persona guardada = personaRepository.save(persona);
        return convertirADTO(guardada);
    }

    public PersonaDTO actualizar(Long id, PersonaDTO dto) {
        Persona existente = personaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));

        existente.setCedula(dto.getCedula());
        existente.setNombre(dto.getNombre());
        existente.setApellidos(dto.getApellidos());
        existente.setEmail(dto.getEmail());
        existente.setTelefonoCelular(dto.getTelefonoCelular());
        existente.setTelefonoFijo(dto.getTelefonoFijo());
        if (dto.getActivo() != null) {
            existente.setActivo(dto.getActivo());
        }
        if (dto.getDireccion() != null) {
            existente.setCodigoPostal(dto.getDireccion().getCodigoPostal());
            existente.setCiudad(dto.getDireccion().getCiudad());
            existente.setProvinciaEstado(dto.getDireccion().getProvinciaEstado());
            existente.setPais(dto.getDireccion().getPais());
            existente.setUrbanizacion(dto.getDireccion().getUrbanizacion());
        }
        Persona actualizada = personaRepository.save(existente);
        return convertirADTO(actualizada);
    }

    public void eliminar(Long id) {
        Persona existente = personaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));
        existente.setActivo(false); // Borrado lógico
        personaRepository.save(existente);
    }

    // Mapeos auxiliares DTO <-> Entidad
    private PersonaDTO convertirADTO(Persona p) {
        PersonaDTO dto = new PersonaDTO();
        dto.setId(p.getId());
        dto.setCedula(p.getCedula());
        dto.setNombre(p.getNombre());
        dto.setApellidos(p.getApellidos());
        dto.setEmail(p.getEmail());
        dto.setTelefonoCelular(p.getTelefonoCelular());
        dto.setTelefonoFijo(p.getTelefonoFijo());
        if (p.getCodigoPostal() != null || p.getCiudad() != null || p.getProvinciaEstado() != null
                || p.getPais() != null || p.getUrbanizacion() != null) {
            DireccionDTO direccionDTO = new DireccionDTO();
            direccionDTO.setCodigoPostal(p.getCodigoPostal());
            direccionDTO.setCiudad(p.getCiudad());
            direccionDTO.setProvinciaEstado(p.getProvinciaEstado());
            direccionDTO.setPais(p.getPais());
            direccionDTO.setUrbanizacion(p.getUrbanizacion());
            dto.setDireccion(direccionDTO);
        }
        dto.setActivo(p.getActivo());
        return dto;
    }

    private Persona convertirAEntidad(PersonaDTO dto) {
        Persona p = new Persona();
        p.setId(dto.getId());
        p.setCedula(dto.getCedula());
        p.setNombre(dto.getNombre());
        p.setApellidos(dto.getApellidos());
        p.setEmail(dto.getEmail());
        p.setTelefonoCelular(dto.getTelefonoCelular());
        p.setTelefonoFijo(dto.getTelefonoFijo());
        if (dto.getDireccion() != null) {
            p.setCodigoPostal(dto.getDireccion().getCodigoPostal());
            p.setCiudad(dto.getDireccion().getCiudad());
            p.setProvinciaEstado(dto.getDireccion().getProvinciaEstado());
            p.setPais(dto.getDireccion().getPais());
            p.setUrbanizacion(dto.getDireccion().getUrbanizacion());
        }
        p.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return p;
    }
}