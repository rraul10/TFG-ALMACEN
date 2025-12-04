package examen.dev.tfgalmacen.rest.clientes.repository;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class ClienteRepositoryTest {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void testFindByUserId() {
        User user = User.builder()
                .nombre("user1")
                .correo("user1@example.com")
                .password("password")
                .roles(Set.of(UserRole.CLIENTE))
                .build();

        entityManager.persist(user);

        Cliente cliente = Cliente.builder()
                .user(user)
                .dni("12345678A")
                .fotoDni("foto.jpg")
                .direccionEnvio("Calle A")
                .build();

        entityManager.persist(cliente);
        entityManager.flush();

        Optional<Cliente> found = clienteRepository.findByUserId(user.getId());

        assertTrue(found.isPresent());
        assertEquals("12345678A", found.get().getDni());
    }

    @Test
    void testFindByUserCorreo() {
        User user = User.builder()
                .nombre("user2")
                .correo("user2@example.com")
                .password("password")
                .roles(Set.of(UserRole.CLIENTE))
                .build();
        entityManager.persist(user);

        Cliente cliente = Cliente.builder()
                .user(user)
                .dni("87654321B")
                .fotoDni("foto2.jpg")
                .direccionEnvio("Calle B")
                .build();
        entityManager.persist(cliente);
        entityManager.flush();

        Optional<Cliente> found = clienteRepository.findByUserCorreo("user2@example.com");
        assertTrue(found.isPresent());
        assertEquals("87654321B", found.get().getDni());
    }
}
