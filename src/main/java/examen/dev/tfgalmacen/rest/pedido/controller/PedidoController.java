package examen.dev.tfgalmacen.rest.pedido.controller;

import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.repository.PedidoRepository;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.websockets.notifications.TicketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    private final PedidoService pedidoService;
    private final PedidoRepository pedidoRepository;
    private final TicketService ticketService;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> getAll() {
        logger.info("Recibiendo solicitud para obtener todos los pedidos.");
        List<PedidoResponse> pedidos = pedidoService.getAll();
        logger.info("Pedidos obtenidos: {}", pedidos.size());
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> getById(@PathVariable Long id) {
        logger.info("Recibiendo solicitud para obtener pedido con ID: {}", id);
        PedidoResponse pedido = pedidoService.getById(id);
        logger.info("Pedido obtenido: {}", pedido);
        return ResponseEntity.ok(pedido);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PedidoRequest request) {
        logger.info("Recibiendo solicitud para crear un pedido con datos: {}", request);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            logger.warn("Authentication es null");
        } else {
            logger.info("Usuario autenticado (getName): {}", auth.getName());
            logger.info("Es anónimo? {}", auth.getAuthorities().isEmpty());
            logger.info("Roles/Authorities: {}", auth.getAuthorities());
        }

        try {
            String userEmail = auth.getName(); // aquí puede ser "anonymousUser"
            Long authenticatedUserId = pedidoService.getUserIdByEmail(userEmail);

            logger.info("Usuario autenticado email: {}, userId: {}", userEmail, authenticatedUserId);

            PedidoResponse created = pedidoService.create(request, authenticatedUserId);
            logger.info("Pedido creado con éxito: {}", created);

            String checkoutUrl = pedidoService.createStripeCheckout(created);
            logger.info("URL de Stripe para el checkout: {}", checkoutUrl);

            Map<String, String> response = new HashMap<>();
            response.put("pedidoId", created.getId().toString());
            response.put("url", checkoutUrl);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error al crear el pedido: {}", e.getMessage(), e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al crear el pedido: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponse> update(@PathVariable Long id, @RequestBody PedidoRequest request) {
        logger.info("Actualizando el pedido con ID: {} con datos: {}", id, request);
        PedidoResponse updated = pedidoService.update(id, request);
        logger.info("Pedido actualizado: {}", updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("Eliminando el pedido con ID: {}", id);
        pedidoService.delete(id);
        logger.info("Pedido con ID: {} eliminado", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLIENTE','ROLE_ADMIN','ROLE_TRABAJADOR')")
    public ResponseEntity<List<PedidoResponse>> getPedidosByClienteId(@PathVariable Long clienteId) {
        List<PedidoResponse> pedidos = pedidoService.getPedidosByClienteId(clienteId);
        return ResponseEntity.ok(pedidos);
    }


    @PutMapping("/estado/{id}")
    public ResponseEntity<PedidoResponse> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {

        PedidoResponse pedidoActualizado = pedidoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(pedidoActualizado);
    }

    @PostMapping("/{id}/confirmar-pago")
    @Transactional
    public ResponseEntity<String> confirmarPago(@PathVariable Long id) {
        try {
            Pedido pedido = pedidoRepository.findByIdWithLineasVentaAndProducto(id)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

            ByteArrayOutputStream pdf = ticketService.generarTicketPDF(pedido);

            logger.info("Generando PDF de tamaño {} bytes para el pedido {}", pdf.size(), id);

            String correo = pedido.getCliente().getUser().getCorreo();
            logger.info("Intentando enviar ticket al correo: {}", correo);

            emailService.enviarTicketPorEmail(correo, pdf);

            return ResponseEntity.ok("PDF enviado");

        } catch (Exception e) {
            logger.error("Error al enviar ticket del pedido {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error al enviar el ticket: " + e.getMessage());
        }
    }
}
