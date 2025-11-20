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
        try (FileInputStream fis = new FileInputStream(".env")) {
            props.load(fis);
        }

        setSystemPropertyIfExists("jwt.secret", props.getProperty("JWT_SECRET"));
        setSystemPropertyIfExists("jwt.expiration", "3600");
        setSystemPropertyIfExists("spring.datasource.username", props.getProperty("DB_USER"));
        setSystemPropertyIfExists("spring.datasource.password", props.getProperty("DB_PASSWORD"));
        setSystemPropertyIfExists("spring.mail.username", props.getProperty("EMAIL_USER"));
        setSystemPropertyIfExists("spring.mail.password", props.getProperty("EMAIL_PASSWORD"));
        setSystemPropertyIfExists("stripe.secret.key", props.getProperty("STRIPE_SECRET_KEY"));
    }

    private static void setSystemPropertyIfExists(String key, String value) {
        if (value != null) {
            System.setProperty(key, value);
        } else {
            System.out.println("⚠ Warning: La variable " + key + " no está definida en .env");
        }
    }

}

