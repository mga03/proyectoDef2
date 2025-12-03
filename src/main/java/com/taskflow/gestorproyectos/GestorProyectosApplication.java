package com.taskflow.gestorproyectos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"configuracion", "controladores", "servicios"})
@EnableJpaRepositories(basePackages = "repositorio")
@EntityScan(basePackages = "modelo")
public class GestorProyectosApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestorProyectosApplication.class, args);
    }
}
