package examen.dev.tfgalmacen.rest.clientes.service;

import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;

import java.util.List;

public interface ClienteService {
    List<ClienteResponse> getAllClientes();

    ClienteResponse getById(Long userId);

    ClienteResponse createCliente(ClienteRequest request);

    ClienteResponse updateCliente(Long id, ClienteRequest request);

    void deleteCliente(Long id);

    Cliente getClienteEntityById(Long id);

    ClienteResponse getByUserId(Long userId);

}


