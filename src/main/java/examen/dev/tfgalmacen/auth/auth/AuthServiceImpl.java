package examen.dev.tfgalmacen.auth.auth;

import examen.dev.tfgalmacen.auth.dto.*;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import lombok.RequiredArgsConstructor;
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

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(user.getId());
        profile.setNombre(user.getNombre());
        profile.setCorreo(user.getCorreo());
        profile.setRoles(user.getRoles());

        return new JwtAuthResponse(token, profile);
    }



    @Override
    public JwtAuthResponse login(UserLoginRequest request) {
        User user = userRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String token = jwtService.generateToken(user);

        // Crear el perfil base
        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(user.getId());
        profile.setNombre(user.getNombre());
        profile.setCorreo(user.getCorreo());
        profile.setRoles(user.getRoles());
        profile.setApellidos(user.getApellidos());
        profile.setTelefono(user.getTelefono());
        profile.setCiudad(user.getCiudad());
        profile.setFoto(user.getFoto());

        clienteRepository.findByUser(user).ifPresent(cliente -> {
            profile.setDni(cliente.getDni());
            profile.setFotoDni(cliente.getFotoDni());
            profile.setDireccionEnvio(cliente.getDireccionEnvio());
        });


        return new JwtAuthResponse(token, profile);
    }

    @Override
    public JwtAuthResponse registerCliente(RegisterClienteRequest request) {
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
