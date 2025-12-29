package com.example.menuapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MainCourseDTO(
        Long id,

        @NotBlank String name,
        @NotNull Integer daysBetween,
        java.time.LocalDate lastTime,
        String category,
        String origin,
        Integer menuapi_id,
        Integer numsides
) {}