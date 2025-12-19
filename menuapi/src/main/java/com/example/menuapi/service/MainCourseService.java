package com.example.menuapi.service;

import com.example.menuapi.dto.MainCourseDTO;
import com.example.menuapi.entity.MainCourse;
import com.example.menuapi.entity.User;
import com.example.menuapi.repository.MainCourseRepository;
import com.example.menuapi.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@Transactional
public class MainCourseService {

    private final MainCourseRepository mainCourseRepository;
    private final SideItemService SideItemService;

    // Inject UserRepository if needed
    @Autowired
    private UserRepository userRepository;

    public MainCourseService(MainCourseRepository mainCourseRepository, SideItemService SideItemService) {
        this.mainCourseRepository = mainCourseRepository;
        this.SideItemService = SideItemService;
    }
    // Called by /api/menu?days=…
    public List<MainCourseDTO> getMenuForDays(int days, Long userId) {
        int limit = Math.max(1, Math.min(days, 50));
        return mainCourseRepository.findRandom(userId, limit).stream()
                .map(this::toDTO)
                .toList();
    }

    // Called by /api/menu/random
    public MainCourseDTO getRandomMainCourseExcluding(List<Long> excludeIds, Long userId) {
        if (excludeIds == null) excludeIds = Collections.emptyList();
        MainCourse entity = mainCourseRepository.findRandomExcludingIds(userId, excludeIds);
        return entity != null ? toDTO(entity) : null;
    }

    // Update findAll
    public List<MainCourseDTO> findAll(Long userId) {
        return mainCourseRepository.findAllByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Update findById
    public MainCourseDTO findById(Long id, Long userId) {
        return mainCourseRepository.findByIdAndUserId(id, userId).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Not found or access denied: " + id));
    }

    // Update create
    public MainCourseDTO create(MainCourseDTO dto, @NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MainCourse entity = new MainCourse();
        copyDtoToEntity(dto, entity);
        entity.setUser(user); // Set owner
        entity = mainCourseRepository.save(entity);
        return toDTO(entity);
    }

    // Update update
    public MainCourseDTO update(Long id, MainCourseDTO dto, Long userId) {
        MainCourse entity = mainCourseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Not found or access denied: " + id));
        copyDtoToEntity(dto, entity);
        if (entity == null) {
            throw new RuntimeException("Failed to save entity");
        }
        entity = mainCourseRepository.save(entity);
        return toDTO(entity);
    }

    // Update delete
    public void delete(Long id, Long userId) {
        MainCourse entity = mainCourseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Not found or access denied: " + id));
        if (entity != null) {
            mainCourseRepository.delete(entity);
        }
    }

    // Update markAsUsedTodayWithSpread
    public void markAsUsedTodayWithSpread(List<Long> courseIds, List<Long> sideIds, Long userId) {
        if (courseIds == null || courseIds.isEmpty()) return;
        List<Long> validIds = courseIds.stream().filter(Objects::nonNull).distinct().toList();
        if (validIds.isEmpty()) return;
        LocalDate baseDate = LocalDate.now();
        for (int i = 0; i < validIds.size(); i++) {
            mainCourseRepository.updateLastTimeById(baseDate.plusDays(i), validIds.get(i), userId); // Pass userId
            SideItemService.markSidesAsUsedToday(baseDate.plusDays(i), sideIds, userId); // Pass userId
        }
    }

    // ---- helpers ----
    private MainCourseDTO toDTO(MainCourse e) {
        return new MainCourseDTO(e.getId(), e.getName(), 
                e.getDaysBetween(), e.getLastTime(), e.getCategory(), e.getOrgin(), e.getMenuapi_id(), e.getNumsides());
    }

    private void copyDtoToEntity(MainCourseDTO d, MainCourse e) {
        e.setName(d.name());
        e.setDaysBetween(d.daysBetween());
        e.setLastTime(d.lastTime());
        e.setCategory(d.category());
        e.setOrgin(d.orgin());
        e.setMenuapi_id(d.menuapi_id());
        e.setNumsides(d.numsides());
    }
}
