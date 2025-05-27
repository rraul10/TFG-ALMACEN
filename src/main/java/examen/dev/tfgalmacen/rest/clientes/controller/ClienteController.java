package examen.dev.tfgalmacen.rest.clientes.controller;

import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.CompraRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.storage.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final PedidoService pedidoService;
    private final StorageService storageService;

    @Autowired
    public ClienteController(ClienteService clienteService, PedidoService pedidoService, StorageService storageService) {
        this.clienteService = clienteService;
        this.pedidoService = pedidoService;
        this.storageService = storageService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<List<ClienteResponse>> getAllClientes() {
        List<ClienteResponse> clientes = clienteService.getAllClientes();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<ClienteResponse> getClienteById(@PathVariable Long id) {
        ClienteResponse cliente = clienteService.getById(id);
        return ResponseEntity.ok(cliente);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<ClienteResponse> createCliente(
            @RequestPart("cliente") ClienteRequest request,
            @RequestPart(value = "fotoDni", required = false) MultipartFile fotoDni
    ) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("===> Autenticación encontrada en SecurityContext:");
        System.out.println("    Principal: " + auth.getPrincipal());
        System.out.println("    Authorities: " + auth.getAuthorities());
        System.out.println("    Authenticated: " + auth.isAuthenticated());

        // LOG DE REQUEST
        System.out.println("===> Datos recibidos en 'cliente':");
        System.out.println("    userId: " + request.getUserId());
        System.out.println("    dni: " + request.getDni());
        System.out.println("    direccionEnvio: " + request.getDireccionEnvio());

        // LOG DE ARCHIVO
        if (fotoDni != null && !fotoDni.isEmpty()) {
            System.out.println("===> FotoDni recibida:");
            System.out.println("    Nombre original: " + fotoDni.getOriginalFilename());
            System.out.println("    Tipo: " + fotoDni.getContentType());
        } else {
            System.out.println("===> No se recibió fotoDni. Se usará default.jpg");
        }

        String nombreArchivo;

        if (fotoDni != null && !fotoDni.isEmpty()) {
            nombreArchivo = storageService.store(fotoDni);
        } else {
            nombreArchivo = "default.jpg";
        }

        request.setFotoDni(nombreArchivo);

        ClienteResponse response = clienteService.createCliente(request);

        System.out.println("===> Cliente creado correctamente con ID de usuario: " + request.getUserId());

        return ResponseEntity.status(201).body(response);
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<ClienteResponse> updateCliente(@PathVariable Long id, @RequestBody ClienteRequest clienteRequest) {
        ClienteResponse clienteActualizado = clienteService.updateCliente(id, clienteRequest);
        return ResponseEntity.ok(clienteActualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        clienteService.deleteCliente(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comprar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<PedidoResponse> comprarProducto(@PathVariable("id") Long id, @RequestBody CompraRequest request) {
        request.setClienteId(id);
        PedidoResponse response = pedidoService.crearCompraDesdeNombreProducto(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/mispedidos")
    @PreAuthorize("hasRole('CLIENTE') or hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<List<PedidoResponse>> getPedidosByCliente(@PathVariable Long id) {
        List<PedidoResponse> pedidos = pedidoService.getPedidosByClienteId(id);
        return ResponseEntity.ok(pedidos);
    }

}
