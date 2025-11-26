package examen.dev.tfgalmacen.rest.users.service;


import examen.dev.tfgalmacen.auth.dto.UserProfileResponse;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
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
        return userRepository.findAll().stream().map(user -> {

            UserResponse dto = new UserResponse(user);

            clienteRepository.findByUser(user).ifPresent(cliente -> {
                dto.setDni(cliente.getDni());
                dto.setFotoDni(cliente.getFotoDni());
                dto.setDireccionEnvio(cliente.getDireccionEnvio());
                dto.setRol("cliente");
            });

            trabajadorRepository.findByUser(user).ifPresent(trabajador -> {
                dto.setNumeroSeguridadSocial(trabajador.getNumeroSeguridadSocial());
                dto.setRol("trabajador");
            });

            if (dto.getRol() == null) {
                dto.setRol("admin");
            }

            return dto;
        }).collect(Collectors.toList());
    }





    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));
        return userMapper.toDto(user);
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        User user = userMapper.toEntity(userRequest);

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        user = userRepository.save(user);

        emailService.notificarRegistroExitoso(user.getCorreo(), user.getNombre());

        return userMapper.toDto(user);
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
        return new UserResponse(saved);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        user.setDeleted(true);
        userRepository.save(user);
    }
}

