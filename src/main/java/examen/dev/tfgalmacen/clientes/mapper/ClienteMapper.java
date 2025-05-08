package examen.dev.tfgalmacen.clientes.mapper;


import examen.dev.tfgalmacen.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.clientes.models.Cliente;
import examen.dev.tfgalmacen.users.models.User;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequest request, User user) {
        return Cliente.builder()
                .dni(request.getDni())
                .fotoDni(request.getFotoDni())
                .direccionEnvio(request.getDireccionEnvio())
                .user(user)
                .build();
    }

    public ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .userId(cliente.getUser().getId())
                .dni(cliente.getDni())
                .fotoDni(cliente.getFotoDni())
                .direccionEnvio(cliente.getDireccionEnvio())
                .build();
    }
}


