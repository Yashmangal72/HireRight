package com.yash.hireright.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("\n========== JWT FILTER ==========");
        System.out.println("REQUEST: "
                + request.getMethod()
                + " "
                + request.getRequestURI());

        System.out.println("AUTH HEADER PRESENT: "
                + (authHeader != null));

        // No Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("NO BEARER TOKEN");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        System.out.println("TOKEN RECEIVED");

        try {

            // Validate token FIRST
            if (!jwtService.isTokenValid(token)) {

                System.out.println("TOKEN INVALID");

                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            System.out.println("EMAIL: " + email);
            System.out.println("ROLE: " + role);
            System.out.println("TOKEN VALID: true");

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println(
                        "AUTHENTICATED AS: " + email
                );

                System.out.println(
                        "AUTHORITY: ROLE_" + role
                );
            }

        } catch (Exception e) {

            System.out.println("JWT ERROR: "
                    + e.getMessage());

            SecurityContextHolder.clearContext();
        }


        filterChain.doFilter(request, response);
    }
}