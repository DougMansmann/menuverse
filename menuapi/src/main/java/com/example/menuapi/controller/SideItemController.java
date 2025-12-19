package com.example.menuapi.controller;

import com.example.menuapi.dto.SideItemDTO;
import com.example.menuapi.service.SideItemService;
import jakarta.validation.Valid;

//import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
//import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.menuapi.entity.User; 

//import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/api/sides")
@CrossOrigin(origins = "http://localhost:3000")  // optional but nice to have
public class SideItemController {

    private final SideItemService service;

        // Helper method to get current user ID
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized"); // Or use ResponseStatusException
        }
        User user = (User) auth.getPrincipal(); // Assuming User is your UserDetails
        return user.getId();
    }
    
    public SideItemController(SideItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<SideItemDTO> getAll() {
        Long userId = getCurrentUserId();
        return service.findAll(userId);
    }

    @GetMapping("/{id}")
    public SideItemDTO getOne(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return service.findById(id, userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SideItemDTO create(@Valid @RequestBody SideItemDTO dto) {
        Long userId = getCurrentUserId();
        return service.create(dto, userId);
    }

    @PutMapping("/{id}")
    public SideItemDTO update(@PathVariable Long id, @Valid @RequestBody SideItemDTO dto) {
        Long userId = getCurrentUserId();
        return service.update(id, dto, userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        service.delete(id, userId);
    }

    @GetMapping("/random")
    public ResponseEntity<List<SideItemDTO>> getRandomSides(
        @RequestParam(defaultValue = "1") int limit,
        @RequestParam(name = "excludeIds", required = false) List<Long> excludeIds) {
        Long userId = getCurrentUserId();
        if (limit <= 0) limit = 1;
        if (limit > 20) limit = 20;
        if (excludeIds == null) {
            excludeIds = List.of();
        }
        List<SideItemDTO> sides = service.getRandomSidesExcluding(excludeIds, limit, userId);
        return ResponseEntity.ok(sides);
    }

}
