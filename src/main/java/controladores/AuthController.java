package controladores;

import configuracion.CustomUserDetailsService;
import configuracion.JwtUtil;
import dto.AuthResponse;
import dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // ELIMINADO EL MÉTODO DE REGISTRO (@PostMapping("/register"))

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest authenticationRequest) throws Exception {
        
        // 1. Comprobación manual HARDCODED (Usuario: admin, Contraseña: 123456)
        if ("admin".equals(authenticationRequest.getUsername()) && 
            "123456".equals(authenticationRequest.getPassword())) {
            
            // 2. Cargamos los detalles del usuario hardcodeado (ver paso 2)
            final UserDetails userDetails = userDetailsService.loadUserByUsername("admin");
            
            // 3. Generamos el token
            final String jwt = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(jwt));
        } else {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }
}