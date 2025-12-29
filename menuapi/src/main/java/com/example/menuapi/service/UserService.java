package com.example.menuapi.service;

// src/main/java/com/example/menuapi/service/UserService.java

import com.example.menuapi.entity.User;
import com.example.menuapi.repository.UserRepository;   
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;  // NEW: For atomicity in copying

import com.example.menuapi.repository.MainCourseRepository;  // NEW
import com.example.menuapi.repository.SideItemRepository;     // NEW
import com.example.menuapi.entity.MainCourse;                 // NEW
import com.example.menuapi.entity.SideItem;                   // NEW

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MainCourseRepository mainCourseRepository;  // NEW: Inject

    @Autowired
    private SideItemRepository sideItemRepository;      // NEW: Inject

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional  // NEW: Ensures copying is atomic
    public User registerUser(String username, String password, String email, boolean copyGeneric) {  // UPDATED: Add copyGeneric param
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username taken");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        User savedUser = userRepository.save(user);  // Save first

        // NEW: Copy logic if checkbox was checked
        if (copyGeneric) {
            Long genericUserId = 1L;

            // Copy MainCourses
            List<MainCourse> genericMainCourses = mainCourseRepository.findAllByUserId(genericUserId);
            for (MainCourse generic : genericMainCourses) {
                MainCourse copy = new MainCourse();
                copy.setName(generic.getName());
                copy.setDaysBetween(generic.getDaysBetween());
                copy.setLastTime(generic.getLastTime());
                copy.setCategory(generic.getCategory());
                copy.setOrigin(generic.getOrigin());
                copy.setMenuapi_id(generic.getMenuapi_id());
                copy.setNumsides(generic.getNumsides());
                copy.setUser(savedUser);  // Assign to new user
                mainCourseRepository.save(copy);
            }

            // Copy SideItems
            List<SideItem> genericSideItems = sideItemRepository.findAllByUserId(genericUserId);
            for (SideItem generic : genericSideItems) {
                SideItem copy = new SideItem();
                copy.setName(generic.getName());
                copy.setType(generic.getType());
                copy.setDaysBetween(generic.getDaysBetween());
                copy.setLastTime(generic.getLastTime());
                copy.setUser(savedUser);  // Assign to new user
                sideItemRepository.save(copy);
            }
        }

        return savedUser;
    }
}