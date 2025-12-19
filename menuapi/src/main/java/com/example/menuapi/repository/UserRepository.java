package com.example.menuapi.repository;

// src/main/java/com/example/menuapi/repository/UserRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.menuapi.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}