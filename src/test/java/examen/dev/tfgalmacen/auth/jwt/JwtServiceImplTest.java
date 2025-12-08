package examen.dev.tfgalmacen.auth.jwt;

import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceImplTest {

    private JwtServiceImpl jwtService;

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtServiceImpl();

        Field secretField = JwtServiceImpl.class.getDeclaredField("jwtSigInKey");
        secretField.setAccessible(true);
        secretField.set(jwtService, "my-secret-key");

        Field expField = JwtServiceImpl.class.getDeclaredField("jwtExpiration");
        expField.setAccessible(true);
        expField.set(jwtService, 3600L);
    }

    @Test
    void testGenerateTokenAndExtractUserName() {
        User user = new User();
        user.setCorreo("juan@example.com");
        user.setRoles(Collections.singleton(UserRole.CLIENTE));

        String token = jwtService.generateToken(user);
        assertNotNull(token, "El token no debe ser nulo");

        String username = jwtService.extractUserName(token);
        assertEquals("juan@example.com", username, "El username extraído debe coincidir");
    }

    @Test
    void testTokenValidity() throws Exception {
        User user = new User();
        user.setCorreo("test@example.com");
        user.setRoles(Collections.singleton(UserRole.ADMIN));

        String token = jwtService.generateToken(user);
        assertTrue(jwtService.isTokenValid(token, user), "El token recién generado debe ser válido");

        Field expField = JwtServiceImpl.class.getDeclaredField("jwtExpiration");
        expField.setAccessible(true);
        expField.set(jwtService, -10L);

        String expiredToken = jwtService.generateToken(user);
        assertFalse(jwtService.isTokenValid(expiredToken, user), "El token expirado debe ser inválido");
    }


    @Test
    void testExtractUserName() throws Exception {
        User user = new User();
        user.setCorreo("claim@example.com");
        user.setRoles(Collections.singleton(UserRole.CLIENTE));

        Field expField = JwtServiceImpl.class.getDeclaredField("jwtExpiration");
        expField.setAccessible(true);
        expField.set(jwtService, 3600L);

        String token = jwtService.generateToken(user);

        String username = jwtService.extractUserName(token);
        assertEquals("claim@example.com", username);

        assertTrue(jwtService.isTokenValid(token, user));
    }

}
