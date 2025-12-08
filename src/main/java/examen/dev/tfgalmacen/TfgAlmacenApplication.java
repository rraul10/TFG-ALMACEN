package examen.dev.tfgalmacen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import java.io.IOException;


@SpringBootApplication(scanBasePackages = "examen.dev.tfgalmacen")
public class TfgAlmacenApplication extends SpringBootServletInitializer {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(TfgAlmacenApplication.class, args);
        System.out.println("Accede a Swagger en: http://localhost:8080/swagger-ui/index.html#/");
        System.out.println("Accede a Jacoco en: http://localhost:8080/jacoco/index.html\n");
    }
}

