package examen.dev.tfgalmacen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import java.io.IOException;


@SpringBootApplication(scanBasePackages = "examen.dev.tfgalmacen")
public class TfgAlmacenApplication extends SpringBootServletInitializer {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(TfgAlmacenApplication.class, args);
        System.out.println("Accede a Swagger en: https://tfg-almacen-1.onrender.com/swagger-ui/index.html#/");
        System.out.println("Accede a Jacoco en: https://tfg-almacen-1.onrender.com/jacoco/index.html\n");
    }
}

