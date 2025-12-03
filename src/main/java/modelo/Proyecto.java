package modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "proyectos")
@Data
public class Proyecto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String descripcion;
    
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion = LocalDate.now();

    // Relación One-to-Many: Un Proyecto tiene muchas Tareas
    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Tarea> tareas = new HashSet<>();
    
    // NOTA: Para evitar ciclos infinitos en JSON, en un proyecto real 
    // se usan DTOs. Lombok @Data aquí podría causar problemas, 
    // pero lo dejamos por simplicidad inicial.
}