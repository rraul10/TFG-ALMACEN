package examen.dev.tfgalmacen.rest.pedido.controller;

import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        try {
            // Crear el pedido en la base de datos
            PedidoResponse created = pedidoService.create(request);
            logger.info("Pedido creado con éxito: {}", created);

            // Intentar generar el checkout de Stripe
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
    public ResponseEntity<List<PedidoResponse>> getPedidosByClienteId(@PathVariable Long clienteId) {
        logger.info("Recibiendo solicitud para obtener los pedidos del cliente con ID: {}", clienteId);
        List<PedidoResponse> pedidos = pedidoService.getPedidosByClienteId(clienteId);
        logger.info("Pedidos encontrados para cliente {}: {}", clienteId, pedidos.size());
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/estado/{id}")
    public ResponseEntity<PedidoResponse> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {

        PedidoResponse pedidoActualizado = pedidoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(pedidoActualizado);
    }
}
