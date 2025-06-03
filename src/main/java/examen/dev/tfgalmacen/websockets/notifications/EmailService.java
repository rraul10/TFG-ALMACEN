package examen.dev.tfgalmacen.websockets.notifications;

import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void notificarStockAgotado(Producto producto) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo("raulfernandez6106@gmail.com");
        mensaje.setSubject("Stock agotado: " + producto.getNombre());
        mensaje.setText("El producto \"" + producto.getNombre() + "\" se esta quedando sin stock.");

        mailSender.send(mensaje);
    }

    public void notificarCambioEstadoPedido(Pedido pedido, String mensaje) {
        SimpleMailMessage mensajeCorreo = new SimpleMailMessage();

        String destinatario = pedido.getCliente().getUser().getCorreo();

        mensajeCorreo.setTo(destinatario);
        mensajeCorreo.setSubject("Cambio de Estado de Pedido: " + pedido.getId());
        mensajeCorreo.setText(mensaje);

        mailSender.send(mensajeCorreo);
    }

    public void notificarRegistroExitoso(String destinatario, String nombre) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("¡Bienvenido al sistema del almacén!");
        mensaje.setText("Hola " + nombre + ",\n\nTu cuenta ha sido creada correctamente.\n\n¡Gracias por registrarte!");

        mailSender.send(mensaje);
    }

    public void enviarTicketPorEmail(String destinatario, ByteArrayOutputStream pdfStream) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(destinatario);
            helper.setSubject("Ticket de Compra");
            helper.setText("Gracias por su compra. Adjuntamos el ticket en PDF.");

            ByteArrayDataSource dataSource = new ByteArrayDataSource(pdfStream.toByteArray(), "application/pdf");
            helper.addAttachment("ticket.pdf", dataSource);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void notificarActualizacionPerfil(String destinatario, String nombre) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Actualización de perfil");
        mensaje.setText("Hola " + nombre + ",\n\nTu perfil ha sido actualizado correctamente.\n\n¡Gracias por mantener tu información al día!");
        mailSender.send(mensaje);
    }

}
