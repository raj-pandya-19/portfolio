package com.raj.portfolio.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    @Value("${portfolio.admin.username}")
    private String adminUsername;

    @Value("${portfolio.admin.password}")
    private String adminPassword;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        if (!adminUsername.equals(username)) {
            throw new UsernameNotFoundException("Admin user not found");
        }

        return User.builder()
                .username(adminUsername)
                .password(adminPassword)
                .roles("ADMIN")
                .build();
    }
}