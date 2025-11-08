package examen.dev.tfgalmacen.auth.users.service;

import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.UserProfileResponse;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@Slf4j
public class AuthUserServiceImpl implements AuthUserService {

    private final AuthUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClienteRepository clienteRepository;
    private final JwtService jwtService;

    @Autowired
    public AuthUserServiceImpl(AuthUserRepository userRepository,
                               @Lazy PasswordEncoder passwordEncoder,
                               ClienteRepository clienteRepository,
                               JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.clienteRepository = clienteRepository;
        this.jwtService = jwtService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UserNotFound {
        log.info("Cargando usuario por correo: {}", username);

        return userRepository.findByCorreo(username)
                .orElseThrow(() -> new UserNotFound("No se ha encontrado usuario con correo: " + username));
    }

    @Transactional
    public JwtAuthResponse registerCliente(RegisterClienteRequest request) {
        User usuario = new User();
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRoles(Set.of(UserRole.CLIENTE));
        userRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUser(usuario);
        cliente.setDni(request.getDni());
        cliente.setFotoDni(request.getFotoDni());
        cliente.setDireccionEnvio(request.getDireccionEnvio());
        clienteRepository.save(cliente);

        String token = jwtService.generateToken(usuario);

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(usuario.getId());
        profile.setNombre(usuario.getNombre());
        profile.setCorreo(usuario.getCorreo());
        profile.setRoles(usuario.getRoles());
        profile.setDni(cliente.getDni());
        profile.setFotoDni(cliente.getFotoDni());
        profile.setDireccionEnvio(cliente.getDireccionEnvio());

        return new JwtAuthResponse(token, profile);
    }



}

