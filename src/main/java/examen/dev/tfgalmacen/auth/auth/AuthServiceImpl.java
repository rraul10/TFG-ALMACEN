package examen.dev.tfgalmacen.auth.auth;

import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ClienteRepository clienteRepository;


    @Override
    public JwtAuthResponse register(RegisterUserRequest request) {
        User user = new User();
        user.setNombre(request.getNombre());
        user.setCorreo(request.getCorreo());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(request.getRole() != null ? request.getRole() : UserRole.CLIENTE));
        user.setCreated(LocalDateTime.now());
        user.setUpdated(LocalDateTime.now());
        user.setDeleted(false);

        userRepository.save(user);
        emailService.notificarRegistroExitoso(user.getCorreo(), user.getNombre());

        String token = jwtService.generateToken((UserDetails) user);
        return new JwtAuthResponse(token);
    }

    @Override
    public JwtAuthResponse login(UserLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
        );

        User user = userRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        String token = jwtService.generateToken((UserDetails) user);
        return new JwtAuthResponse(token);
    }

    @Override
    public JwtAuthResponse registerCliente(RegisterClienteRequest request) {
        // Primero, creamos el usuario
        User usuario = new User();
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRoles(Collections.singleton(UserRole.CLIENTE));
        usuario.setCreated(LocalDateTime.now());
        usuario.setUpdated(LocalDateTime.now());
        usuario.setDeleted(false);

        userRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUser(usuario);  
        cliente.setDni(request.getDni());
        cliente.setFotoDni(request.getFotoDni());
        cliente.setDireccionEnvio(request.getDireccionEnvio());

        clienteRepository.save(cliente);

        String token = jwtService.generateToken(usuario);

        emailService.notificarRegistroExitoso(usuario.getCorreo(), usuario.getNombre());

        return new JwtAuthResponse(token);
    }
}
