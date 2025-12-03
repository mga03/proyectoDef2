package repositorio;

import modelo.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    
    // Método para buscar todas las tareas de un proyecto específico
    List<Tarea> findByProyectoId(Long proyectoId);
}