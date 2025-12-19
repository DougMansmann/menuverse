package com.example.menuapi.controller;

import com.example.menuapi.dto.MainCourseDTO;
import com.example.menuapi.service.MainCourseService;
import jakarta.validation.Valid;

//import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
//import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//import java.util.Collections;
import java.util.List;

import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
import com.example.menuapi.entity.User; 

@RestController
@RequestMapping("/api/maincourse")
public class MainCourseController {

    private final MainCourseService service;

    private Long getCurrentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
        throw new RuntimeException("Unauthorized"); // Or use ResponseStatusException
    }
    User user = (User) auth.getPrincipal(); // Assuming User is your UserDetails
    return user.getId();
}

    public MainCourseController(MainCourseService service) {
        this.service = service;
    }

    @GetMapping
    public List<MainCourseDTO> getAll() {
        Long userId = getCurrentUserId();
        return service.findAll(userId); // Filter by userId
    }

    @GetMapping("/{id}")
    public MainCourseDTO getOne(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return service.findById(id, userId); // Filter by userId
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MainCourseDTO create(@Valid @RequestBody MainCourseDTO dto) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return service.create(dto, userId); // Filter by userId
    }

    @PutMapping("/{id}")
    public MainCourseDTO update(@PathVariable Long id, @Valid @RequestBody MainCourseDTO dto) {
        Long userId = getCurrentUserId();
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return service.update(id, dto, userId); // Filter by userId
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        service.delete(id, userId); // Filter by userId
    }
}
