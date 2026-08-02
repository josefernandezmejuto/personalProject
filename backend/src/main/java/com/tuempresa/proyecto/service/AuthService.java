package com.tuempresa.proyecto.service;

import com.tuempresa.proyecto.config.JwtUtil;
import com.tuempresa.proyecto.dto.JwtResponse;
import com.tuempresa.proyecto.dto.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;

    public AuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public JwtResponse login(LoginRequest request) {
        // Validamos con credenciales de prueba (admin / password123 o 123)
        if ("admin".equals(request.getUsername()) && "password123".equals(request.getPassword())) {
            String token = jwtUtil.generarToken(request.getUsername());
            return new JwtResponse(token);
        }
        
        throw new RuntimeException("Usuario o contraseña incorrectos.");
    }
}