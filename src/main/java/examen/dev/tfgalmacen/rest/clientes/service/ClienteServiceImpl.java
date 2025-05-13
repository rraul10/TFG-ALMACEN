package examen.dev.tfgalmacen.rest.clientes.service;

import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.exceptions.ClienteNotFound;
import examen.dev.tfgalmacen.rest.clientes.mapper.ClienteMapper;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final UserRepository userRepository;
    private final ClienteMapper clienteMapper;


    @Override
    public List<ClienteResponse> getAllClientes() {
        return clienteRepository.findAll().stream()
                .map(clienteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClienteResponse getById(Long userId) {
        Cliente cliente = clienteRepository.findById(userId)
                .orElseThrow(() -> new ClienteNotFound("Cliente no encontrado"));

        return clienteMapper.toResponse(cliente);
    }

    @Override
    public ClienteResponse createCliente(ClienteRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ClienteNotFound("Usuario no encontrado"));

        Cliente cliente = clienteMapper.toEntity(request, user);
        Cliente savedCliente = clienteRepository.save(cliente);

        return clienteMapper.toResponse(savedCliente);
    }

    @Override
    public ClienteResponse updateCliente(Long id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNotFound("Cliente no encontrado"));

        cliente.setDni(request.getDni());
        cliente.setFotoDni(request.getFotoDni());
        cliente.setDireccionEnvio(request.getDireccionEnvio());

        Cliente updated = clienteRepository.save(cliente);
        return clienteMapper.toResponse(updated);
    }

    @Override
    public void deleteCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNotFound("Cliente no encontrado"));

        cliente.setDeleted(true);
        clienteRepository.save(cliente);
    }

    public Cliente getClienteEntityById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNotFound("Cliente no encontrado"));
    }

}

