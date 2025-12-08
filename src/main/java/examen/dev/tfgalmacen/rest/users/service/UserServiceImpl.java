package examen.dev.tfgalmacen.rest.users.service;


import examen.dev.tfgalmacen.auth.dto.UserProfileResponse;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.trabajadores.repository.TrabajadorRepository;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.mapper.UserMapper;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final ClienteRepository clienteRepository;
    private final TrabajadorRepository trabajadorRepository;


    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, EmailService emailService, PasswordEncoder passwordEncoder, ClienteRepository clienteRepository, TrabajadorRepository trabajadorRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.clienteRepository = clienteRepository;
        this.trabajadorRepository = trabajadorRepository;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
            UserResponse dto = new UserResponse();
            dto.setId(user.getId());
            dto.setNombre(user.getNombre());
            dto.setCorreo(user.getCorreo());
            dto.setRoles(user.getRoles());

            String rolPrincipal = user.getRoles().stream()
                    .sorted() // ordena por nombre enum
                    .findFirst()
                    .map(Enum::name)
                    .orElse("CLIENTE");
            dto.setRol(rolPrincipal);

            dto.setApellidos(user.getApellidos());
            dto.setTelefono(user.getTelefono());
            dto.setCiudad(user.getCiudad());
            dto.setFoto(user.getFoto());

            clienteRepository.findByUserId(user.getId()).ifPresent(cliente -> {
                dto.setDni(cliente.getDni() != null ? cliente.getDni() : "");
                dto.setFotoDni(cliente.getFotoDni() != null ? cliente.getFotoDni() : "");
                dto.setDireccionEnvio(cliente.getDireccionEnvio() != null ? cliente.getDireccionEnvio() : "");
            });

            trabajadorRepository.findByUserId(user.getId()).ifPresent(trabajador -> {
                dto.setNumeroSeguridadSocial(trabajador.getNumeroSeguridadSocial() != null ? trabajador.getNumeroSeguridadSocial() : "");
            });

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setCorreo(user.getCorreo());
        dto.setRoles(user.getRoles());

        dto.setRol(user.getRoles().stream()
                .findFirst()
                .map(Enum::name)
                .orElse("CLIENTE"));

        dto.setApellidos(user.getApellidos());
        dto.setTelefono(user.getTelefono());
        dto.setCiudad(user.getCiudad());
        dto.setFoto(user.getFoto());

        clienteRepository.findByUserId(user.getId()).ifPresentOrElse(cliente -> {
            dto.setDni(cliente.getDni() != null ? cliente.getDni() : "");
            dto.setFotoDni(cliente.getFotoDni() != null ? cliente.getFotoDni() : "");
            dto.setDireccionEnvio(cliente.getDireccionEnvio() != null ? cliente.getDireccionEnvio() : "");
        }, () -> {
            dto.setDni(""); dto.setFotoDni(""); dto.setDireccionEnvio("");
        });

        trabajadorRepository.findByUserId(user.getId()).ifPresentOrElse(trabajador -> {
            dto.setNumeroSeguridadSocial(trabajador.getNumeroSeguridadSocial() != null ? trabajador.getNumeroSeguridadSocial() : "");
        }, () -> dto.setNumeroSeguridadSocial(""));

        return dto;
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        User user = userMapper.toEntity(userRequest);

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        user = userRepository.save(user);

        String rol = userRequest.getRoles().stream()
                .findFirst()
                .map(Enum::name)
                .orElse("CLIENTE");
        if ("CLIENTE".equals(rol)) {
            Cliente cliente = Cliente.builder()
                    .user(user)
                    .dni(userRequest.getDni())
                    .fotoDni(userRequest.getFotoDni())
                    .direccionEnvio(userRequest.getDireccionEnvio())
                    .build();

            Cliente savedCliente = clienteRepository.save(cliente);

        } else if ("TRABAJADOR".equals(rol)) {
            Trabajador trabajador = Trabajador.builder()
                    .user(user)
                    .numeroSeguridadSocial(userRequest.getNumeroSeguridadSocial())
                    .build();
            trabajadorRepository.save(trabajador);
        }

        return getUserById(user.getId());
    }



    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setNombre(request.getNombre());
        user.setApellidos(request.getApellidos());
        user.setCorreo(request.getCorreo());
        user.setTelefono(request.getTelefono());
        user.setCiudad(request.getCiudad());
        user.setFoto(request.getFoto());
        user.setUpdated(LocalDateTime.now());
        User saved = userRepository.save(user);

        String rol = request.getRoles() != null && !request.getRoles().isEmpty()
                ? request.getRoles().iterator().next().name()
                : "CLIENTE";

        if ("CLIENTE".equals(rol)) {
            Cliente cliente = clienteRepository.findByUserId(saved.getId())
                    .orElse(Cliente.builder().user(saved).build());
            cliente.setDni(request.getDni());
            cliente.setFotoDni(request.getFotoDni());
            cliente.setDireccionEnvio(request.getDireccionEnvio());
            clienteRepository.save(cliente);
        } else if ("TRABAJADOR".equals(rol)) {
            Trabajador trabajador = trabajadorRepository.findByUserId(saved.getId())
                    .orElse(Trabajador.builder().user(saved).build());
            trabajador.setNumeroSeguridadSocial(request.getNumeroSeguridadSocial());
            trabajadorRepository.save(trabajador);
        }

        return getUserById(saved.getId());
    }



    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        user.setDeleted(true);
        userRepository.save(user);
    }
}

