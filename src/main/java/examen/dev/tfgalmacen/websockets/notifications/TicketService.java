package examen.dev.tfgalmacen.websockets.notifications;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
public class TicketService {

    private static final Color PRIMARY_COLOR = new Color(99, 102, 241);
    private static final Color ACCENT_COLOR = new Color(6, 182, 212);
    private static final Color DARK_BG = new Color(15, 23, 42);
    private static final Color CARD_BG = new Color(30, 41, 59);
    private static final Color TEXT_COLOR = new Color(248, 250, 252);
    private static final Color TEXT_MUTED = new Color(148, 163, 184);

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("€#,##0.00");
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public ByteArrayOutputStream generarTicketPDF(Pedido pedido) throws DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 40, 40, 60, 60);
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);

        writer.setPageEvent(new HeaderFooterPageEvent());

        document.open();

        addHeader(document);

        document.add(new Paragraph("\n"));

        addOrderInfo(document, pedido);

        document.add(new Paragraph("\n"));

        addDivider(document, PRIMARY_COLOR);

        document.add(new Paragraph("\n"));

        addProductsTable(document, pedido);

        document.add(new Paragraph("\n"));

        addDivider(document, ACCENT_COLOR);

        document.add(new Paragraph("\n"));

        addSummary(document, pedido);

        document.add(new Paragraph("\n\n"));

        addFooterMessage(document);

        document.close();
        return outputStream;
    }

    private void addHeader(Document document) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1, 4});

        PdfPCell logoCell = new PdfPCell();
        logoCell.setBorder(Rectangle.NO_BORDER);
        logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        logoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        logoCell.setBackgroundColor(new Color(240, 240, 255));
        logoCell.setPadding(15);
        logoCell.setBorderWidthLeft(4);
        logoCell.setBorderColorLeft(PRIMARY_COLOR);

        Font logoFont = new Font(Font.HELVETICA, 48, Font.BOLD, PRIMARY_COLOR);
        Paragraph logoPara = new Paragraph("⚡", logoFont);
        logoPara.setAlignment(Element.ALIGN_CENTER);
        logoCell.addElement(logoPara);

        PdfPCell textCell = new PdfPCell();
        textCell.setBorder(Rectangle.NO_BORDER);
        textCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        textCell.setPaddingLeft(20);

        Font titleFont = new Font(Font.HELVETICA, 32, Font.BOLD, PRIMARY_COLOR);
        Paragraph title = new Paragraph("TechStore", titleFont);
        title.setSpacingAfter(5);

        Font subtitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL, TEXT_MUTED);
        Paragraph subtitle = new Paragraph("PREMIUM ELECTRONICS", subtitleFont);
        subtitle.setSpacingAfter(8);

        Font ticketFont = new Font(Font.HELVETICA, 14, Font.BOLD, ACCENT_COLOR);
        Paragraph ticketTitle = new Paragraph("TICKET DE COMPRA", ticketFont);

        textCell.addElement(title);
        textCell.addElement(subtitle);
        textCell.addElement(ticketTitle);

        headerTable.addCell(logoCell);
        headerTable.addCell(textCell);

        document.add(headerTable);
    }

    private void addOrderInfo(Document document, Pedido pedido) throws DocumentException {
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setWidths(new float[]{1, 1});

        Font labelFont = new Font(Font.HELVETICA, 10, Font.BOLD, TEXT_MUTED);
        Font valueFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.BLACK);

        PdfPCell pedidoLabelCell = createInfoCell("Nº PEDIDO", labelFont, Element.ALIGN_LEFT);
        PdfPCell pedidoValueCell = createInfoCell("#" + String.format("%06d", pedido.getId()), valueFont, Element.ALIGN_LEFT);

        PdfPCell fechaLabelCell = createInfoCell("FECHA", labelFont, Element.ALIGN_RIGHT);
        PdfPCell fechaValueCell = createInfoCell(pedido.getFecha().format(DATE_FORMAT), valueFont, Element.ALIGN_RIGHT);

        infoTable.addCell(pedidoLabelCell);
        infoTable.addCell(fechaLabelCell);
        infoTable.addCell(pedidoValueCell);
        infoTable.addCell(fechaValueCell);

        document.add(infoTable);
    }


    private PdfPCell createInfoCell(String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(alignment);
        cell.setPadding(8);
        cell.setBackgroundColor(new Color(250, 250, 255));
        return cell;
    }

    private void addDivider(Document document, Color color) throws DocumentException {
        PdfPTable divider = new PdfPTable(1);
        divider.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setBorderWidthBottom(2);
        cell.setBorderColorBottom(color);
        cell.setFixedHeight(1);

        divider.addCell(cell);
        document.add(divider);
    }

    private void addProductsTable(Document document, Pedido pedido) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3, 1, 1.2f, 1.2f});
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD, Color.WHITE);

        addTableHeader(table, "PRODUCTO", headerFont);
        addTableHeader(table, "CANT.", headerFont);
        addTableHeader(table, "PRECIO", headerFont);
        addTableHeader(table, "SUBTOTAL", headerFont);

        Font productFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
        Font priceFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK);

        boolean alternate = false;
        for (LineaVenta linea : pedido.getLineasVenta()) {
            Color rowColor = alternate ? new Color(250, 250, 255) : Color.WHITE;

            double subtotal = linea.getCantidad() * linea.getPrecioUnitario();

            addTableCell(table, linea.getProducto().getNombre(), productFont, Element.ALIGN_LEFT, rowColor);
            addTableCell(table, String.valueOf(linea.getCantidad()), productFont, Element.ALIGN_CENTER, rowColor);
            addTableCell(table, CURRENCY_FORMAT.format(linea.getPrecioUnitario()), priceFont, Element.ALIGN_RIGHT, rowColor);
            addTableCell(table, CURRENCY_FORMAT.format(subtotal), priceFont, Element.ALIGN_RIGHT, rowColor);

            alternate = !alternate;
        }

        document.add(table);
    }

    private void addTableHeader(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(PRIMARY_COLOR);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(10);
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }

    private void addTableCell(PdfPTable table, String text, Font font, int alignment, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(10);
        cell.setBackgroundColor(bgColor);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setBorderWidthBottom(1);
        cell.setBorderColorBottom(new Color(230, 230, 240));
        table.addCell(cell);
    }

    private void addSummary(Document document, Pedido pedido) throws DocumentException {
        double subtotal = pedido.getLineasVenta().stream()
                .mapToDouble(l -> l.getCantidad() * l.getPrecioUnitario())
                .sum();

        double iva = subtotal * 0.21;
        double total = subtotal + iva;

        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(50);
        summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        summaryTable.setWidths(new float[]{2, 1});

        Font labelFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.BLACK);
        Font valueFont = new Font(Font.HELVETICA, 11, Font.BOLD, Color.BLACK);
        Font totalFont = new Font(Font.HELVETICA, 14, Font.BOLD, Color.WHITE);

        addSummaryRow(summaryTable, "Subtotal:", CURRENCY_FORMAT.format(subtotal), labelFont, valueFont, Color.WHITE);

        addSummaryRow(summaryTable, "IVA (21%):", CURRENCY_FORMAT.format(iva), labelFont, valueFont, Color.WHITE);

        PdfPCell totalLabelCell = new PdfPCell(new Phrase("TOTAL:", totalFont));
        totalLabelCell.setBorder(Rectangle.NO_BORDER);
        totalLabelCell.setBackgroundColor(PRIMARY_COLOR);
        totalLabelCell.setPadding(12);
        totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell totalValueCell = new PdfPCell(new Phrase(CURRENCY_FORMAT.format(total), totalFont));
        totalValueCell.setBorder(Rectangle.NO_BORDER);
        totalValueCell.setBackgroundColor(ACCENT_COLOR);
        totalValueCell.setPadding(12);
        totalValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        summaryTable.addCell(totalLabelCell);
        summaryTable.addCell(totalValueCell);

        document.add(summaryTable);
    }

    private void addSummaryRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont, Color bgColor) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setBackgroundColor(bgColor);
        labelCell.setPadding(8);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setBackgroundColor(bgColor);
        valueCell.setPadding(8);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addFooterMessage(Document document) throws DocumentException {
        Font messageFont = new Font(Font.HELVETICA, 11, Font.ITALIC, TEXT_MUTED);
        Font contactFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_MUTED);

        Paragraph thankYou = new Paragraph("¡Gracias por tu compra!", messageFont);
        thankYou.setAlignment(Element.ALIGN_CENTER);
        thankYou.setSpacingAfter(8);

        Paragraph contact = new Paragraph("Para cualquier consulta: info@techstore.com | +34 900 123 456", contactFont);
        contact.setAlignment(Element.ALIGN_CENTER);

        PdfPTable messageBox = new PdfPTable(1);
        messageBox.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOX);
        cell.setBorderWidth(1);
        cell.setBorderColor(new Color(220, 220, 240));
        cell.setBackgroundColor(new Color(250, 250, 255));
        cell.setPadding(15);
        cell.addElement(thankYou);
        cell.addElement(contact);

        messageBox.addCell(cell);
        document.add(messageBox);
    }

    static class HeaderFooterPageEvent extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();

            Font pageFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_MUTED);
            Phrase footer = new Phrase("Página " + writer.getPageNumber(), pageFont);

            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    footer,
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 10,
                    0);
        }
    }
}