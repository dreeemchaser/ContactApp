package employeehub.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**", "/swagger-ui.html",
                                "/v3/api-docs/**", "/actuator/health",
                                "/employees/photo/**"
                        ).permitAll()

                        // Departments & Teams — HR_ADMIN / SUPER_ADMIN manage, others read
                        .requestMatchers(HttpMethod.GET, "/departments/**", "/teams/**").authenticated()
                        .requestMatchers("/departments/**", "/teams/**")
                                .hasAnyRole("HR_ADMIN", "SUPER_ADMIN")

                        // Employees — HR_ADMIN / SUPER_ADMIN manage, MANAGER reads
                        .requestMatchers(HttpMethod.GET, "/employees/**").authenticated()
                        .requestMatchers("/employees/**")
                                .hasAnyRole("HR_ADMIN", "SUPER_ADMIN")

                        // Documents — HR_ADMIN manages, employees upload/view own
                        .requestMatchers(HttpMethod.GET, "/documents").hasAnyRole("HR_ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/documents/{id}/verify", "/documents/{id}/reject")
                                .hasAnyRole("HR_ADMIN", "SUPER_ADMIN")

                        // Audit logs — HR_ADMIN / SUPER_ADMIN only
                        .requestMatchers("/audit-logs/**")
                                .hasAnyRole("HR_ADMIN", "SUPER_ADMIN")

                        // Salary — employees view own payslips, admins manage
                        .requestMatchers(HttpMethod.GET, "/salary/payslips/my").authenticated()
                        .requestMatchers("/salary/**")
                                .hasAnyRole("PAYROLL_ADMIN", "HR_ADMIN", "SUPER_ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
