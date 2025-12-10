package com.taskflow.gestorproyectos.repositorio;

import com.taskflow.gestorproyectos.modelo.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    
    // MÃ©todo para buscar todas las tareas de un proyecto especÃ­fico
    List<Tarea> findByProyectoId(Long proyectoId);
}
