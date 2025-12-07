package examen.dev.tfgalmacen.websockets.notifications;

import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    private JavaMailSender mailSender;
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        emailService = new EmailService(mailSender);
    }

    @Test
    void testNotificarStockAgotado() {
        Producto producto = new Producto();
        producto.setNombre("Laptop Gamer");

        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.notificarStockAgotado(producto);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage msg = captor.getValue();
        assertEquals("Stock agotado: Laptop Gamer", msg.getSubject());
        assertTrue(msg.getText().contains("Laptop Gamer"));
    }

    @Test
    void testNotificarRegistroExitoso() {
        String email = "test@example.com";
        String nombre = "Juan";

        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.notificarRegistroExitoso(email, nombre);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage msg = captor.getValue();
        assertEquals(email, msg.getTo()[0]);
        assertTrue(msg.getText().contains("Hola Juan"));
    }

    @Test
    void testEnviarTicketPorEmail() throws Exception {
        String destinatario = "cliente@example.com";
        ByteArrayOutputStream pdf = new ByteArrayOutputStream();
        pdf.write("TEST PDF CONTENT".getBytes());

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.enviarTicketPorEmail(destinatario, pdf);

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void testNotificarCambioEstadoPedido() {
        User user = new User();
        user.setCorreo("cliente@example.com");

        Cliente cliente = new Cliente();
        cliente.setUser(user);

        Pedido pedido = new Pedido();
        pedido.setId(1L);
        pedido.setCliente(cliente);

        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        emailService.notificarCambioEstadoPedido(pedido, "Pedido enviado");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage msg = captor.getValue();
        assertEquals("cliente@example.com", msg.getTo()[0]);
        assertTrue(msg.getText().contains("Pedido enviado"));
    }
}
