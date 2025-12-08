package examen.dev.tfgalmacen.auth.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html").permitAll()
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()

                        // Archivos estáticos generados por Angular
                        .requestMatchers("/**/*.js",
                                "/**/*.css",
                                "/**/*.map",
                                "/**/*.ico",
                                "/**/*.png",
                                "/**/*.jpg",
                                "/**/*.svg",
                                "/**/*.woff2",
                                "/**/*.woff",
                                "/**/*.ttf").permitAll()

                        // Auth público
                        .requestMatchers("/auth/login", "/auth/register/**", "/auth/forgot-password", "/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // API productos
                        .requestMatchers("/api/productos/create").hasAnyRole("ADMIN","TRABAJADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyRole("ADMIN","TRABAJADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyRole("ADMIN","TRABAJADOR")
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()

                        // API pagos, uploads, jacoco
                        .requestMatchers("/api/payments/**", "/uploads/**", "/jacoco", "/jacoco/**").permitAll()

                        // API usuarios y clientes
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").authenticated()
                        .requestMatchers("/api/clientes/create").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")
                        .requestMatchers("/api/clientes/**").authenticated()
                        .requestMatchers("/api/trabajadores/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_TRABAJADOR")

                        // API pedidos
                        .requestMatchers(HttpMethod.POST, "/api/pedidos/**").hasAuthority("ROLE_CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/cliente/**").hasAnyAuthority("ROLE_CLIENTE","ROLE_ADMIN","ROLE_TRABAJADOR")
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/**").hasAnyAuthority("ROLE_ADMIN","ROLE_TRABAJADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/pedidos/**").hasAnyAuthority("ROLE_ADMIN","ROLE_TRABAJADOR")

                        // Cualquier otro request, dejarlo autenticado
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
