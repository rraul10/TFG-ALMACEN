package examen.dev.tfgalmacen.rest.pedido.repository;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PedidoRepositoryTest {

    @Autowired
    private PedidoRepository pedidoRepository;

    private Pedido pedido1;
    private Pedido pedido2;

    @BeforeEach
    void setUp() {
        Cliente cliente1 = new Cliente();
        cliente1.setId(1L);

        Cliente cliente2 = new Cliente();
        cliente2.setId(2L);

        pedido1 = new Pedido();
        pedido1.setCliente(cliente1);
        pedido1.setEstado(EstadoPedido.PENDIENTE);
        pedido1.setFecha(LocalDateTime.now());
        pedido1.setDeleted(false);

        pedido2 = new Pedido();
        pedido2.setCliente(cliente2);
        pedido2.setEstado(EstadoPedido.PENDIENTE);
        pedido2.setFecha(LocalDateTime.now());
        pedido2.setDeleted(true);

        pedidoRepository.save(pedido1);
        pedidoRepository.save(pedido2);
    }


    @Test
    @Transactional
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
