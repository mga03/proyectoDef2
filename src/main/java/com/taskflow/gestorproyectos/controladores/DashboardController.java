package com.taskflow.gestorproyectos.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    
    @GetMapping(value = {"/dashboard", "/dashboard/**"})
    public String forwardToDashboard() {
        return "forward:/dashboard.html";
    }
}

