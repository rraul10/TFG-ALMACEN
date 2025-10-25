package examen.dev.tfgalmacen.auth.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()
                        .requestMatchers("/auth/login", "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/productos", "/api/productos/**").permitAll()
                        .requestMatchers("/api/payments/**").permitAll()
                        .requestMatchers("/api/users/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")
                        .requestMatchers("/api/clientes/create").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")
                        .requestMatchers("/api/clientes/**").authenticated()
                        .requestMatchers("/api/trabajadores/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")
                        .requestMatchers(HttpMethod.POST, "/api/pedidos/**").hasAuthority("ROLE_CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")
                        .requestMatchers("/uploads/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")
                        .requestMatchers("/jacoco", "/jacoco/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}


