package examen.dev.tfgalmacen.websockets.notifications;

import examen.dev.tfgalmacen.rest.productos.models.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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

}
