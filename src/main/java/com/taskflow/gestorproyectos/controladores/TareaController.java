package com.taskflow.gestorproyectos.controladores;


import com.taskflow.gestorproyectos.dto.TareaDTO;
import com.taskflow.gestorproyectos.modelo.Tarea;
import com.taskflow.gestorproyectos.servicios.TareaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/proyectos/{proyectoId}/tareas")
@CrossOrigin(origins = "*")
public class TareaController {
    
    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    // POST: Crear una nueva tarea en un proyecto especÃ­fico
    @PostMapping
    public ResponseEntity<TareaDTO> crearTarea(@PathVariable Long proyectoId, @RequestBody TareaDTO tareaDTO) {
        // Convertir DTO a Entidad
        Tarea tarea = new Tarea();
        tarea.setTitulo(tareaDTO.getTitulo());
        tarea.setDescripcion(tareaDTO.getDescripcion());
        tarea.setFechaVencimiento(tareaDTO.getFechaVencimiento());
        
        Tarea nuevaTarea = tareaService.crearTarea(proyectoId, tarea);
        
        // Convertir Entidad a DTO para la respuesta
        TareaDTO responseDTO = new TareaDTO();
        responseDTO.setId(nuevaTarea.getId());
        responseDTO.setTitulo(nuevaTarea.getTitulo());
        responseDTO.setProyectoId(nuevaTarea.getProyecto().getId());
        
        return ResponseEntity.ok(responseDTO);
    }

    // GET: Listar todas las tareas de un proyecto
    @GetMapping
    public ResponseEntity<List<TareaDTO>> obtenerTareasPorProyecto(@PathVariable Long proyectoId) {
        List<Tarea> tareas = tareaService.obtenerTareasPorProyecto(proyectoId);
        
        // Mapear Entidades a DTOs
        List<TareaDTO> dtos = tareas.stream().map(tarea -> {
            TareaDTO dto = new TareaDTO();
            dto.setId(tarea.getId());
            dto.setTitulo(tarea.getTitulo());
            dto.setEstado(tarea.getEstado().toString());
            dto.setProyectoId(proyectoId);
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    // ... Faltan los mÃ©todos PUT y DELETE para completar el CRUD de Tareas
}
