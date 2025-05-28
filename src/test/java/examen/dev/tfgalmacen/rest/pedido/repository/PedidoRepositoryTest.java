package examen.dev.tfgalmacen.rest.pedido.repository;

import examen.dev.tfgalmacen.TfgAlmacenApplication;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = TfgAlmacenApplication.class, properties = "spring.profiles.active=test")
@Transactional
public class PedidoRepositoryTest {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UserRepository userRepository;

    private Pedido pedido1;
    private Pedido pedido2;

    @BeforeEach
    void setUp() {
        // Crear y guardar User 1
        User user1 = new User();
        user1.setNombre("Usuario Uno");
        user1.setCorreo("usuario1@example.com");         // <--- requerido
        user1.setPassword("password123");                // <--- requerido
        user1 = userRepository.save(user1);

        // Crear y guardar User 2
        User user2 = new User();
        user2.setNombre("Usuario Dos");
        user2.setCorreo("usuario2@example.com");         // <--- requerido
        user2.setPassword("password456");                // <--- requerido
        user2 = userRepository.save(user2);

        // Crear y guardar Cliente 1
        Cliente cliente1 = new Cliente();
        cliente1.setUser(user1);
        cliente1.setDni("12345678A");
        cliente1.setDireccionEnvio("Calle Falsa 123");
        cliente1.setDeleted(false);
        cliente1.setCreated(LocalDateTime.now());
        cliente1.setUpdated(LocalDateTime.now());
        cliente1 = clienteRepository.save(cliente1);

        // Crear y guardar Cliente 2
        Cliente cliente2 = new Cliente();
        cliente2.setUser(user2);
        cliente2.setDni("87654321B");
        cliente2.setDireccionEnvio("Avenida Siempreviva 742");
        cliente2.setDeleted(false);
        cliente2.setCreated(LocalDateTime.now());
        cliente2.setUpdated(LocalDateTime.now());
        cliente2 = clienteRepository.save(cliente2);

        // Pedido activo
        pedido1 = new Pedido();
        pedido1.setCliente(cliente1);
        pedido1.setEstado(EstadoPedido.PENDIENTE);
        pedido1.setFecha(LocalDateTime.now());
        pedido1.setDeleted(false);
        pedido1 = pedidoRepository.save(pedido1);

        // Pedido eliminado
        pedido2 = new Pedido();
        pedido2.setCliente(cliente2);
        pedido2.setEstado(EstadoPedido.PENDIENTE);
        pedido2.setFecha(LocalDateTime.now());
        pedido2.setDeleted(true);
        pedido2 = pedidoRepository.save(pedido2);
    }


    @Test
    void testFindByIdAndDeletedFalse() {
        Optional<Pedido> result = pedidoRepository.findByIdAndDeletedFalse(pedido1.getId());

        assertTrue(result.isPresent(), "El pedido debería ser encontrado");
        assertEquals(pedido1.getId(), result.get().getId(), "El ID del pedido debería coincidir");
        assertFalse(result.get().isDeleted(), "El pedido no debería estar eliminado");
    }

    @Test
    void testFindByIdAndDeletedFalseNotFound() {
        Optional<Pedido> result = pedidoRepository.findByIdAndDeletedFalse(pedido2.getId());

        assertFalse(result.isPresent(), "El pedido no debería ser encontrado");
    }

    @Test
    void testFindAllByDeletedFalse() {
        List<Pedido> pedidos = pedidoRepository.findAllByDeletedFalse();

        assertEquals(1, pedidos.size(), "Debe haber solo un pedido no eliminado");
        assertFalse(pedidos.get(0).isDeleted(), "El pedido no debería estar eliminado");
    }
}
