package examen.dev.tfgalmacen.trabajadores.controller;

import examen.dev.tfgalmacen.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.trabajadores.service.TrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabajadores")
@RequiredArgsConstructor
public class TrabajadorController {

    private final TrabajadorService trabajadorService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<TrabajadorResponse>> getAll() {
        return ResponseEntity.ok(trabajadorService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<TrabajadorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trabajadorService.getTrabajador(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TrabajadorResponse> crear(@RequestBody TrabajadorRequest request) {
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
}

