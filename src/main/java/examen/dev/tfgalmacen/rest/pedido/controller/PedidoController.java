package examen.dev.tfgalmacen.rest.pedido.controller;

import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> getAll() {
        return ResponseEntity.ok(pedidoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@RequestBody PedidoRequest request) {
        PedidoResponse created = pedidoService.create(request);
        String checkoutUrl = pedidoService.createStripeCheckout(request);

        Map<String, String> response = new HashMap<>();
        response.put("pedidoId", created.getId().toString());
        response.put("url", checkoutUrl);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponse> update(@PathVariable Long id, @RequestBody PedidoRequest request) {
        PedidoResponse updated = pedidoService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
