package com.taskflow.gestorproyectos.configuracion;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Obliga a cargar index.html al entrar a la raíz /
        registry.addViewController("/")
                .setViewName("forward:/index.html");
    }
}