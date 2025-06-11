package examen.dev.tfgalmacen.websockets.notifications;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class TicketService {

    public ByteArrayOutputStream generarTicketPDF(Pedido pedido) throws DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();

        PdfWriter.getInstance(document, outputStream);
        document.open();

        document.add(new Paragraph("Ticket de Compra"));
        document.add(new Paragraph("Pedido: " + pedido.getId()));
        document.add(new Paragraph("Fecha: " + pedido.getFecha().toString()));
        document.add(new Paragraph("---------------------------"));

        for (LineaVenta linea : pedido.getLineasVenta()) {
            document.add(new Paragraph(
                    linea.getProducto().getNombre() +
                            " - Cantidad: " + linea.getCantidad() +
                            " - Precio Unitario: " + linea.getPrecioUnitario()
            ));
        }

        document.add(new Paragraph("---------------------------"));
        double total = pedido.getLineasVenta().stream()
                .mapToDouble(l -> l.getCantidad() * l.getPrecioUnitario())
                .sum();
        document.add(new Paragraph("Total: " + total));

        document.close();
        return outputStream;
    }
}
