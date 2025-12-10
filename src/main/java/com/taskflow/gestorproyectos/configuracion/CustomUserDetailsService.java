package com.taskflow.gestorproyectos.configuracion;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Simular que el usuario "admin" siempre existe en el sistema
        if ("admin".equals(username)) {
            // Devolvemos un usuario vÃ¡lido con contraseÃ±a vacÃ­a (ya la validamos en el Controller)
            return new User("admin", "", new ArrayList<>());
        } else {
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }
    }
}
