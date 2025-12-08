package examen.dev.tfgalmacen.websockets.notifications;

import com.lowagie.text.DocumentException;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TicketServiceTest {

    private TicketService ticketService;

    @BeforeEach
    void setUp() {
        ticketService = new TicketService();
    }

    @Test
    void testGenerarTicketPDF() throws DocumentException {
        // Crear datos de prueba
        examen.dev.tfgalmacen.rest.productos.models.Producto producto = new Producto();
        producto.setNombre("Laptop Gamer");

        LineaVenta linea = new LineaVenta();
        linea.setProducto(producto);
        linea.setCantidad(2);
        linea.setPrecioUnitario(1500.50);

        Pedido pedido = new Pedido();
        pedido.setId(123L);
        pedido.setFecha(LocalDateTime.now());
        pedido.setLineasVenta(List.of(linea));

        ByteArrayOutputStream pdfStream = ticketService.generarTicketPDF(pedido);

        assertNotNull(pdfStream, "El PDF generado no debe ser nulo");
        assertTrue(pdfStream.size() > 0, "El PDF generado debe tener contenido");

        System.out.println("PDF generado con tamaño: " + pdfStream.size() + " bytes");
    }
}
