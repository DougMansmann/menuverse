package com.example.menuapi.controller;

// src/main/java/com/example/menuapi/controller/AuthController.java

import jakarta.validation.Valid; // Important for validation
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.menuapi.dto.JwtResponse;
import com.example.menuapi.dto.UserLoginDTO;
import com.example.menuapi.dto.UserRegistrationDTO;
import com.example.menuapi.service.UserService;
import com.example.menuapi.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDTO dto) {
        userService.registerUser(dto.username(), dto.password(), dto.email(), dto.copyGeneric());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(), dto.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtil.generateToken(dto.username());

        return ResponseEntity.ok(new JwtResponse(jwt));
    }
}