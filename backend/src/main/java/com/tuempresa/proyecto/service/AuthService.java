package com.tuempresa.proyecto.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.tuempresa.proyecto.dto.LoginRequest;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class AuthService {

    // Cambia esto en producción por una variable de entorno segura
    private static final String SECRET_KEY = "mi_clave_secreta_super_oculta"; 

    public String authenticateAndGenerateToken(LoginRequest loginRequest) {
        // Validamos tus credenciales del paso anterior
        if ("admin".equals(loginRequest.getUsername()) && "password123".equals(loginRequest.getPassword())) {
            
            // Si son válidas, fabricamos el JWT cifrado
            Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
            
            return JWT.create()
                    .withSubject(loginRequest.getUsername())
                    .withIssuer("tuempresa")
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + 86400000)) // Expira en 24 horas
                    .sign(algorithm);
        }
        
        // Si falla, devolvemos null
        return null;
    }
}