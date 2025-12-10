package com.taskflow.gestorproyectos.repositorio;


import com.taskflow.gestorproyectos.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // MÃ©todo para buscar un usuario por su nombre de usuario, clave para el login
    Optional<Usuario> findByUsername(String username);
}
