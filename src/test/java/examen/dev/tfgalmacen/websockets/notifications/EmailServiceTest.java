package examen.dev.tfgalmacen.websockets.notifications;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    private Producto producto;
    private Pedido pedido;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setNombre("Producto de prueba");

        pedido = new Pedido();
        pedido.setId(123L);
        pedido.setCliente(new Cliente());
        pedido.getCliente().setUser(new User());
        pedido.getCliente().getUser().setCorreo("cliente@dominio.com");
    }

    @Test
    void notificarStockAgotado_debeEnviarCorreo() {
        emailService.notificarStockAgotado(producto);

        verify(mailSender).send((SimpleMailMessage) org.mockito.ArgumentMatchers.any());
    }

    @Test
    void notificarCambioEstadoPedido_debeEnviarCorreo() {
        String mensaje = "El estado de su pedido ha cambiado.";

        emailService.notificarCambioEstadoPedido(pedido, mensaje);

        verify(mailSender).send((SimpleMailMessage) org.mockito.ArgumentMatchers.any());
    }

    @Test
    void notificarRegistroExitoso_debeEnviarCorreo() {
        emailService.notificarRegistroExitoso("usuario@dominio.com", "Juan");

        verify(mailSender).send((SimpleMailMessage) org.mockito.ArgumentMatchers.any());
    }
}
