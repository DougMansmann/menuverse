package com.example.menuapi.dto;

import java.util.List;

public record AcceptMenuRequest(
        List<Long> courseIds,   // existing
        List<Long> sideIds      // ← NEW: for sides
) {}