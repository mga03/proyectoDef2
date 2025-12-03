package repositorio;

import modelo.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Hereda todos los métodos CRUD (save, findById, findAll, delete, etc.)
}