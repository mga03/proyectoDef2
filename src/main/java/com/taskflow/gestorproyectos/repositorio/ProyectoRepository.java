package com.taskflow.gestorproyectos.repositorio;

import com.taskflow.gestorproyectos.modelo.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Hereda todos los mÃ©todos CRUD (save, findById, findAll, delete, etc.)
}
