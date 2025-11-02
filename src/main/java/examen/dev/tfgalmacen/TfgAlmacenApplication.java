package examen.dev.tfgalmacen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@SpringBootApplication(scanBasePackages = "examen.dev.tfgalmacen")
public class TfgAlmacenApplication extends SpringBootServletInitializer {

    public static void main(String[] args) throws IOException {
        // Carga manual de .env
        loadEnv();

        SpringApplication.run(TfgAlmacenApplication.class, args);
        System.out.println("Accede a Swagger en: http://localhost:8080/swagger-ui/index.html#/");
        System.out.println("Accede a Jacoco en: http://localhost:8080/jacoco/index.html\n");
    }

    private static void loadEnv() throws IOException {
        Properties props = new Properties();
        FileInputStream fis = new FileInputStream(".env");
        props.load(fis);
        fis.close();

        // Variables disponibles para Spring
        System.setProperty("jwt.secret", props.getProperty("JWT_SECRET"));
        System.setProperty("jwt.expiration", "3600");
        System.setProperty("spring.datasource.username", props.getProperty("DB_USER"));
        System.setProperty("spring.datasource.password", props.getProperty("DB_PASSWORD"));
        System.setProperty("spring.mail.username", props.getProperty("EMAIL_USER"));
        System.setProperty("spring.mail.password", props.getProperty("EMAIL_PASSWORD"));
        System.setProperty("stripe.secret.key", props.getProperty("STRIPE_SECRET_KEY"));
    }
}

