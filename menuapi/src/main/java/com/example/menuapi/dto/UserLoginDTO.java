// UserLoginDTO.java (new file)
package com.example.menuapi.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDTO(
    @NotBlank String username,
    @NotBlank String password
) {}
