package examen.dev.tfgalmacen.auth.users.service;

import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;




@Service
@Slf4j
public class AuthUserServiceImpl implements AuthUserService {

    private final AuthUserRepository userRepository;

    @Autowired
    public AuthUserServiceImpl(AuthUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UserNotFound {
        log.info("Cargando usuario por correo: {}", username);

        return userRepository.findByCorreo(username)
                .orElseThrow(() -> new UserNotFound("No se ha encontrado usuario con correo: " + username));
    }
}

