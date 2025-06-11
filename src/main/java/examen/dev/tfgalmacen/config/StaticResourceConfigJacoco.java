package examen.dev.tfgalmacen.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfigJacoco {
    @Bean(name = "staticResourceConfigJacocoBean")
    public WebMvcConfigurer staticResourceConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/jacoco/**")
                        .addResourceLocations("file:/C:/Users/raulf/TFG-ALMACEN/build/reports/jacoco/test/html/");
            }
        };
    }
}







