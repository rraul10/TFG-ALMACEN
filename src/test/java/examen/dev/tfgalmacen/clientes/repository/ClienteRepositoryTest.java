package examen.dev.tfgalmacen.clientes.repository;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ClienteRepositoryTest {

    @Mock
    private ClienteRepository clienteRepository;

    private User user;
    private Cliente cliente;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .nombre("user1")
                .correo("user1@example.com")
                .password("password")
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .roles(Set.of(UserRole.CLIENTE))
                .build();

        cliente = Cliente.builder()
                .id(1L)
                .user(user)
                .dni("12345678A")
                .fotoDni("foto1.jpg")
                .direccionEnvio("Calle A")
                .deleted(false)
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .build();
    }


    @Test
    void testFindByUserId() {
        when(clienteRepository.findByUserId(1L)).thenReturn(cliente);

        Cliente foundCliente = clienteRepository.findByUserId(1L);

        assertNotNull(foundCliente);
        assertEquals(1L, foundCliente.getUser().getId());
        assertEquals("12345678A", foundCliente.getDni());
        assertEquals("foto1.jpg", foundCliente.getFotoDni());
        assertEquals("Calle A", foundCliente.getDireccionEnvio());

        verify(clienteRepository).findByUserId(1L);
    }
}
