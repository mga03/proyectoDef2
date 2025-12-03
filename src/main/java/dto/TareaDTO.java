package dto;

import java.time.LocalDate;

public class TareaDTO {
    
    private Long id;
    private String titulo;
    private String descripcion;
    private String estado;
    private LocalDate fechaVencimiento;
    private Long proyectoId;
    
    // -------------------------------------------------------------------
    // Getters y Setters
    // -------------------------------------------------------------------
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    
    public Long getProyectoId() {
        return proyectoId;
    }
    
    public void setProyectoId(Long proyectoId) {
        this.proyectoId = proyectoId;
    }
}