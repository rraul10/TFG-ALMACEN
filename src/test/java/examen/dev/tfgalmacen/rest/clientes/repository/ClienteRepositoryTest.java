package examen.dev.tfgalmacen.rest.clientes.repository;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DataJpaTest
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

        Optional<Cliente> found = clienteRepository.findByUserId(user.getId());

        assertTrue(found.isPresent());
        assertEquals("12345678A", found.get().getDni());
    }
}
