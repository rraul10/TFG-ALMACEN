package examen.dev.tfgalmacen.rest.clientes.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.CompraRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.storage.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final PedidoService pedidoService;
    private final StorageService storageService;

    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);


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
            @RequestPart("cliente") String clienteJson,
            @RequestPart(value = "fotoDni", required = false) MultipartFile fotoDni
    ) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        ClienteRequest request = mapper.readValue(clienteJson, ClienteRequest.class);

        if (fotoDni != null && !fotoDni.isEmpty()) {
            String nombreArchivo = storageService.store(fotoDni);
            request.setFotoDni(nombreArchivo);
        } else {
            request.setFotoDni("default.jpg");
        }

        ClienteResponse response = clienteService.createCliente(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> updateCliente(
            @PathVariable Long id,
            @RequestPart("cliente") String clienteJson,
            @RequestPart(value = "fotoDni", required = false) MultipartFile fotoDni) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        ClienteRequest clienteRequest = mapper.readValue(clienteJson, ClienteRequest.class);

        if (fotoDni != null && !fotoDni.isEmpty()) {
            String nombreArchivo = storageService.store(fotoDni);
            clienteRequest.setFotoDni(nombreArchivo);
        } else {
            clienteRequest.setFotoDni("default.jpg");
        }

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
    public ResponseEntity<List<PedidoResponse>> getPedidosByCliente(@PathVariable Long id) {
        logger.info("Consultando los pedidos para el cliente con ID: {}", id);
        List<PedidoResponse> pedidos = pedidoService.getPedidosByClienteId(id);
        logger.info("Pedidos encontrados para el cliente con ID {}: {}", id, pedidos.size());
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/user/{userId}")
    @PreAuthorize("hasRole('CLIENTE') or hasAnyRole('ADMIN','TRABAJADOR')")
    public ResponseEntity<ClienteResponse> updateClienteByUserId(
            @PathVariable Long userId,
            @RequestPart("cliente") String clienteJson,
            @RequestPart(value = "fotoDni", required = false) MultipartFile fotoDni
    ) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        ClienteRequest clienteRequest = mapper.readValue(clienteJson, ClienteRequest.class);

        if (fotoDni != null && !fotoDni.isEmpty()) {
            String nombreArchivo = storageService.store(fotoDni);
            clienteRequest.setFotoDni(nombreArchivo);
        }

        Cliente cliente = clienteService.getClienteEntityByUserId(userId);
        cliente.setDni(clienteRequest.getDni());
        cliente.setDireccionEnvio(clienteRequest.getDireccionEnvio());
        cliente.setFotoDni(clienteRequest.getFotoDni());

        // Guardar los cambios
        clienteService.updateClienteEntity(cliente);

        // Devolver la respuesta
        ClienteResponse clienteActualizado = clienteService.getByUserId(userId);
        return ResponseEntity.ok(clienteActualizado);
    }


    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR') or #userId == principal.id")
    public ResponseEntity<ClienteResponse> getClienteByUserId(@PathVariable Long userId) {
        ClienteResponse cliente = clienteService.getByUserId(userId);
        return ResponseEntity.ok(cliente);
    }
}
