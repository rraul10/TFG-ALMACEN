package examen.dev.tfgalmacen.auth.auth;

import examen.dev.tfgalmacen.auth.dto.*;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ClienteRepository clienteRepository;

    @Override
    public JwtAuthResponse register(RegisterUserRequest request) {
        logger.debug("Iniciando el registro de usuario con correo: {}", request.getCorreo());

        // Crear el objeto de usuario
        User user = new User();
        user.setNombre(request.getNombre());
        user.setApellidos(request.getApellidos());
        user.setCorreo(request.getCorreo());
        user.setTelefono(request.getTelefono());
        user.setCiudad(request.getCiudad());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        logger.info("Usuario creado: {}", user);

        // Determinar el rol del usuario
        UserRole role = UserRole.CLIENTE;
        if (request.getRole() != null) {
            try {
                role = UserRole.valueOf(request.getRole());
                logger.info("Rol asignado: {}", role);
            } catch (IllegalArgumentException e) {
                logger.warn("Rol no válido recibido: {}", request.getRole());
            }
        }

        user.setRoles(Collections.singleton(role));
        user.setCreated(LocalDateTime.now());
        user.setUpdated(LocalDateTime.now());
        user.setDeleted(false);

        // Guardar el usuario en la base de datos
        try {
            userRepository.save(user);
            logger.info("Usuario registrado con éxito con ID: {}", user.getId());
        } catch (Exception e) {
            logger.error("Error al registrar el usuario: {}", e.getMessage());
            throw new RuntimeException("Error al registrar el usuario");
        }

        // Enviar notificación por email
        emailService.notificarRegistroExitoso(user.getCorreo(), user.getNombre());

        // Generar el token JWT
        String token = jwtService.generateToken((UserDetails) user);
        logger.debug("Token JWT generado para el usuario con correo: {}", user.getCorreo());

        // Crear el perfil de usuario para la respuesta
        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(user.getId());
        profile.setNombre(user.getNombre());
        profile.setApellidos(user.getApellidos());
        profile.setCorreo(user.getCorreo());
        profile.setTelefono(user.getTelefono());
        profile.setCiudad(user.getCiudad());
        profile.setRoles(user.getRoles());
        profile.setRol(role.name());

        logger.debug("Perfil de usuario creado: {}", profile);

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
        usuario.setApellidos(request.getApellidos());
        usuario.setCorreo(request.getCorreo());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setCiudad(request.getCiudad());
        usuario.setRoles(Collections.singleton(UserRole.CLIENTE));
        usuario.setCreated(LocalDateTime.now());
        usuario.setUpdated(LocalDateTime.now());
        usuario.setDeleted(false);

        userRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUser(usuario);
        cliente.setDni(request.getDni());
        cliente.setDireccionEnvio(request.getDireccionEnvio());
        cliente.setFotoDni(request.getFotoDni());
        clienteRepository.save(cliente);

        String token = jwtService.generateToken(usuario);

        emailService.notificarRegistroExitoso(usuario.getCorreo(), usuario.getNombre());

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(usuario.getId());
        profile.setNombre(usuario.getNombre());
        profile.setApellidos(usuario.getApellidos());
        profile.setCorreo(usuario.getCorreo());
        profile.setTelefono(usuario.getTelefono());
        profile.setCiudad(usuario.getCiudad());
        profile.setRoles(usuario.getRoles());
        profile.setDni(cliente.getDni());
        profile.setFotoDni(cliente.getFotoDni());
        profile.setDireccionEnvio(cliente.getDireccionEnvio());


        return new JwtAuthResponse(token, profile);
    }

}
