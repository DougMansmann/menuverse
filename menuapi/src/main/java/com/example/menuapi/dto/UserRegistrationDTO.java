package com.example.menuapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record UserRegistrationDTO(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank @Email String email,
        boolean copyGeneric
) {}