package com.example.menuapi.controller;

import com.example.menuapi.dto.AcceptMenuRequest;
import com.example.menuapi.dto.MainCourseDTO;
import com.example.menuapi.service.MainCourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Adding these for user support
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.menuapi.entity.User; 

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MenuController {

    private final MainCourseService mainCourseService;

    // Helper method to get current user ID
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized"); // Or use ResponseStatusException
        }
        User user = (User) auth.getPrincipal(); // Assuming User is your UserDetails
        return user.getId();
    }

    public MenuController(MainCourseService mainCourseService) {
        this.mainCourseService = mainCourseService;
    }

    // GET http://localhost:8080/api/menu?days=5

    @GetMapping
    public ResponseEntity<List<MainCourseDTO>> getMenuForDays(
        @RequestParam(defaultValue = "7") int days) {
        Long userId = getCurrentUserId();
        List<MainCourseDTO> menu = mainCourseService.getMenuForDays(days, userId); // Pass userId
        return ResponseEntity.ok(menu);
    }

    // GET http://localhost:8080/api/menu/random
    @GetMapping("/random")
    public ResponseEntity<MainCourseDTO> getRandomMainCourse(
        @RequestParam(required = false) List<Long> excludeIds) {
        Long userId = getCurrentUserId();
        MainCourseDTO randomCourse = mainCourseService.getRandomMainCourseExcluding(excludeIds, userId); // Pass userId
        if (randomCourse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(randomCourse);
    }

    // POST http://localhost:8080/api/menu/accept
    @PostMapping("/accept")
    public ResponseEntity<Void> acceptMenu(
        @RequestBody AcceptMenuRequest request) {
        Long userId = getCurrentUserId();
        if (request.courseIds() == null || request.courseIds().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        mainCourseService.markAsUsedTodayWithSpread(request.courseIds(), request.sideIds(), userId); // Pass userId for validation
        return ResponseEntity.ok().build();
    }
}