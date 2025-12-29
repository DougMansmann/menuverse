package com.example.menuapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SideItemDTO(
        Long id,

        @NotBlank String name,
        String type,
        @NotNull Integer daysBetween,
        java.time.LocalDate lastTime
   
) {}