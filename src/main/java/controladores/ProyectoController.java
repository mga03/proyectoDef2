package controladores;

import dto.ProyectoDTO;
import modelo.Proyecto;
import servicios.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {
    
    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    // POST: Crear un nuevo proyecto
    @PostMapping
    public ResponseEntity<ProyectoDTO> crearProyecto(@RequestBody ProyectoDTO proyectoDTO) {
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(proyectoDTO.getNombre());
        proyecto.setDescripcion(proyectoDTO.getDescripcion());
        
        Proyecto nuevoProyecto = proyectoService.crearProyecto(proyecto);
        
        ProyectoDTO responseDTO = new ProyectoDTO();
        responseDTO.setId(nuevoProyecto.getId());
        responseDTO.setNombre(nuevoProyecto.getNombre());
        responseDTO.setDescripcion(nuevoProyecto.getDescripcion());
        responseDTO.setFechaCreacion(nuevoProyecto.getFechaCreacion());
        
        return ResponseEntity.ok(responseDTO);
    }

    // GET: Listar todos los proyectos
    @GetMapping
    public ResponseEntity<List<ProyectoDTO>> obtenerTodosLosProyectos() {
        List<Proyecto> proyectos = proyectoService.obtenerTodosLosProyectos();
        
        List<ProyectoDTO> dtos = proyectos.stream().map(proyecto -> {
            ProyectoDTO dto = new ProyectoDTO();
            dto.setId(proyecto.getId());
            dto.setNombre(proyecto.getNombre());
            dto.setDescripcion(proyecto.getDescripcion());
            dto.setFechaCreacion(proyecto.getFechaCreacion());
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    // GET: Obtener un proyecto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProyectoDTO> obtenerProyectoPorId(@PathVariable Long id) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        
        ProyectoDTO dto = new ProyectoDTO();
        dto.setId(proyecto.getId());
        dto.setNombre(proyecto.getNombre());
        dto.setDescripcion(proyecto.getDescripcion());
        dto.setFechaCreacion(proyecto.getFechaCreacion());
        
        return ResponseEntity.ok(dto);
    }

    // PUT: Actualizar un proyecto
    @PutMapping("/{id}")
    public ResponseEntity<ProyectoDTO> actualizarProyecto(@PathVariable Long id, @RequestBody ProyectoDTO proyectoDTO) {
        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(proyectoDTO.getNombre());
        proyecto.setDescripcion(proyectoDTO.getDescripcion());
        
        Proyecto proyectoActualizado = proyectoService.actualizarProyecto(id, proyecto);
        
        ProyectoDTO responseDTO = new ProyectoDTO();
        responseDTO.setId(proyectoActualizado.getId());
        responseDTO.setNombre(proyectoActualizado.getNombre());
        responseDTO.setDescripcion(proyectoActualizado.getDescripcion());
        responseDTO.setFechaCreacion(proyectoActualizado.getFechaCreacion());
        
        return ResponseEntity.ok(responseDTO);
    }

    // DELETE: Eliminar un proyecto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProyecto(@PathVariable Long id) {
        proyectoService.eliminarProyecto(id);
        return ResponseEntity.noContent().build();
    }
}
