package com.taskflow.gestorproyectos.servicios;

import com.taskflow.gestorproyectos.modelo.Proyecto;
import com.taskflow.gestorproyectos.modelo.Tarea;
import com.taskflow.gestorproyectos.repositorio.ProyectoRepository;
import com.taskflow.gestorproyectos.repositorio.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TareaService {
    
    private final TareaRepository tareaRepository;
    private final ProyectoRepository proyectoRepository;

    public TareaService(TareaRepository tareaRepository, ProyectoRepository proyectoRepository) {
        this.tareaRepository = tareaRepository;
        this.proyectoRepository = proyectoRepository;
    }

    public Tarea crearTarea(Long proyectoId, Tarea tarea) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
            .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado con ID: " + proyectoId));
        
        tarea.setProyecto(proyecto);
        return tareaRepository.save(tarea);
    }

    public List<Tarea> obtenerTareasPorProyecto(Long proyectoId) {
        return tareaRepository.findByProyectoId(proyectoId);
    }
    
    // ... otros mÃ©todos CRUD (obtenerPorId, actualizar, eliminar)
}
