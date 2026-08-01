package com.tuempresa.proyecto.controller;

import com.tuempresa.proyecto.dto.LoginRequest;
import com.tuempresa.proyecto.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        // 1. Llamamos al servicio para que intente autenticar y nos devuelva el token si todo va bien
        String token = authService.authenticateAndGenerateToken(loginRequest);
        Map<String, Object> response = new HashMap<>();

        if (token != null) {
            // 2. Si el token existe, la autenticación fue un éxito
            response.put("success", true);
            response.put("message", "¡Inicio de sesión correcto!");
            response.put("token", token); // <-- Aquí le inyectamos el JWT que irá hacia Angular
            return ResponseEntity.ok(response); 
        } else {    
            // 3. Si es null, las credenciales eran incorrectas
            response.put("success", false);
            response.put("message", "Usuario o contraseña incorrectos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); 
        }
    }
}