package com.raj.portfolio.config;

import com.raj.portfolio.security.AdminUserDetailsService;
import com.raj.portfolio.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AdminUserDetailsService adminUserDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AdminUserDetailsService adminUserDetailsService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.adminUserDetailsService = adminUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // =========================
                // DISABLE CSRF
                // =========================
                .csrf(csrf -> csrf.disable())

                // =========================
                // ENABLE CORS
                // =========================
                .cors(Customizer.withDefaults())

                // =========================
                // JWT = STATELESS
                // =========================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC GET ENDPOINTS
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/projects/**",
                                "/api/skills/**",
                                "/api/experiences/**",
                                "/api/education/**",
                                "/api/certificates/**",
                                "/api/about/**",
                                "/api/media/**",
                                "/api/hello",
                                "/api/training/**",
                                "/api/social-links/**",
                                "/api/learning/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // =========================
                        // PUBLIC CONTACT SUBMISSION
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/contact"
                        ).permitAll()

                        // =========================
                        // PUBLIC ADMIN LOGIN
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login"
                        ).permitAll()

                        // =========================
                        // ADMIN-ONLY CONTACT ACCESS
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/contact",
                                "/api/contact/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // ADMIN-ONLY CREATE
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/projects",
                                "/api/skills",
                                "/api/experiences",
                                "/api/education",
                                "/api/certificates",
                                "/api/about",
                                "/api/social-links",
                                "/api/training",
                                "/api/learning"
                        ).hasRole("ADMIN")

                        // =========================
                        // ADMIN-ONLY UPDATE
                        // =========================
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/projects/**",
                                "/api/skills/**",
                                "/api/experiences/**",
                                "/api/education/**",
                                "/api/certificates/**",
                                "/api/about/**",
                                "/api/social-links/**",
                                "/api/training/**",
                                "/api/learning/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // ADMIN-ONLY DELETE
                        // =========================
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/projects/**",
                                "/api/skills/**",
                                "/api/experiences/**",
                                "/api/education/**",
                                "/api/certificates/**",
                                "/api/about/**",
                                "/api/social-links/**",
                                "/api/training/**",
                                "/api/learning/**",
                                "/api/media/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // ADMIN-ONLY FILE UPLOADS
                        // =========================

                        .requestMatchers(HttpMethod.POST,
                                "/api/uploads/image",
                                "/api/uploads/pdf",
                                "/api/uploads/resume"
                        ).hasRole("ADMIN")

                        .requestMatchers("/uploads/**").permitAll()

                        .anyRequest().authenticated()
                        // =========================
                        // EVERYTHING ELSE
                        // =========================
                )

                // =========================
                // JWT FILTER
                // =========================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(adminUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }
}