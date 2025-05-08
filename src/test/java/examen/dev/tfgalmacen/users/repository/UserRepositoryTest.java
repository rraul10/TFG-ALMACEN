package examen.dev.tfgalmacen.users.repository;


import examen.dev.tfgalmacen.users.UserRole;
import examen.dev.tfgalmacen.users.models.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {

        user = User.builder()
                .nombre("Raul")
                .correo("raul@example.com")
                .password("password123")
                .roles(Set.of(UserRole.CLIENTE))
                .build();

        userRepository.save(user);
    }

    @Test
    void testFindByCorreo() {
        Optional<User> foundUser = userRepository.findByCorreo("raul@example.com");

        assertTrue(foundUser.isPresent());
        assertEquals("Raul", foundUser.get().getNombre());
    }

    @Test
    void testFindById() {
        Optional<User> foundUser = userRepository.findById(user.getId());

        assertTrue(foundUser.isPresent());
        assertEquals(user.getCorreo(), foundUser.get().getCorreo());
    }

    @Test
    void testFindByCorreoNotFound() {
        Optional<User> foundUser = userRepository.findByCorreo("noexistent@example.com");

        assertFalse(foundUser.isPresent());
    }

    @Test
    void testFindByIdNotFound() {
        Optional<User> foundUser = userRepository.findById(999L);

        assertFalse(foundUser.isPresent());
    }
}
