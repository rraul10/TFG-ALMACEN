package examen.dev.tfgalmacen.rest.trabajadores.controller;

import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.rest.trabajadores.exceptions.TrabajadorNotFoundException;
import examen.dev.tfgalmacen.rest.trabajadores.service.TrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabajadores")
@RequiredArgsConstructor
public class TrabajadorController {

    private final PedidoService pedidoService;

    private final TrabajadorService trabajadorService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<TrabajadorResponse>> getAll() {
        try {
            List<TrabajadorResponse> trabajadores = trabajadorService.getAll();
            return ResponseEntity.ok(trabajadores);
        } catch (TrabajadorNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<TrabajadorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trabajadorService.getTrabajadorById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TrabajadorResponse> create(@RequestBody TrabajadorRequest request) {
        return ResponseEntity.ok(trabajadorService.crearTrabajador(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TrabajadorResponse> update(@PathVariable Long id, @RequestBody TrabajadorRequest request) {
        return ResponseEntity.ok(trabajadorService.updateTrabajador(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trabajadorService.deleteTrabajador(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TRABAJADOR')")
    @PutMapping("/pedidos/{id}/estado")
    public ResponseEntity<PedidoResponse> actualizarEstadoPedido(
            @PathVariable Long id,
            @RequestParam EstadoPedido nuevoEstado) {

        PedidoResponse updatedPedido = pedidoService.actualizarEstadoPedido(id, nuevoEstado);
        return ResponseEntity.ok(updatedPedido);
    }


}

