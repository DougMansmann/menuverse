package com.example.menuapi.service;

import com.example.menuapi.dto.SideItemDTO;
import com.example.menuapi.entity.SideItem;
import com.example.menuapi.entity.User;
import com.example.menuapi.repository.SideItemRepository;
import com.example.menuapi.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
@Transactional
public class SideItemService {

    private final SideItemRepository repo;

    // Inject UserRepository if needed
    @Autowired
    private UserRepository userRepository;

    public SideItemService(SideItemRepository repo) {
        this.repo = repo;
    }

    // Update findAll
    public List<SideItemDTO> findAll(Long userId) {
        return repo.findAllByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Update findById
    public SideItemDTO findById(Long id, Long userId) {
        return repo.findByIdAndUserId(id, userId).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Not found or access denied: " + id));
    }

    // Update create
    public SideItemDTO create(SideItemDTO dto, Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        SideItem entity = new SideItem();
        copyDtoToEntity(dto, entity);
        entity.setUser(user);
        entity = repo.save(entity);
        return toDTO(entity);
    }

    // Update update
    public SideItemDTO update(Long id, SideItemDTO dto, Long userId) {
        SideItem entity = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Not found or access denied: " + id));
        copyDtoToEntity(dto, entity);
        if (entity == null) {
            throw new RuntimeException("Failed to save entity");
        }
        entity = repo.save(entity);
        return toDTO(entity);
    }

    // Update delete
    public void delete(Long id, Long userId) {
        SideItem entity = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Not found or access denied: " + id));
        if (entity != null) {
            repo.delete(entity);
        }
    }

    // Update getRandomSidesExcluding
    public List<SideItemDTO> getRandomSidesExcluding(List<Long> excludeIds, int limit, Long userId) {
        List<Long> idsForQuery = (excludeIds == null || excludeIds.isEmpty()) ? List.of(-1L) : excludeIds.stream().distinct().toList();
        List<SideItem> candidates = repo.findAvailableSidesExcluding(userId, idsForQuery);

        System.out.println("Total candidates available: " + candidates.size());

        // Shuffle for randomness
        Collections.shuffle(candidates);

        List<SideItemDTO> selected = new ArrayList<>();
        Set<String> usedTypes = new HashSet<>();

        // First pass: pick one of each type if possible
        for (SideItem side : candidates) {
            if (selected.size() >= limit) break;

            String type = side.getType();
            // Treat null or blank types as unique (or group them if you prefer)
            String key = (type == null || type.trim().isEmpty()) ? null : type.trim().toLowerCase();

            if (key == null || !usedTypes.contains(key)) {
                selected.add(toDTO(side));
                if (key != null) {
                    usedTypes.add(key);
                }
            }
        }

        // Second pass: if we still need more, allow duplicates
        if (selected.size() < limit) {
            for (SideItem side : candidates) {
                if (selected.size() >= limit) break;
                // Skip if already selected (by ID) to avoid exact duplicates
                if (selected.stream().noneMatch(s -> s.id().equals(side.getId()))) {
                    selected.add(toDTO(side));
                }
            }
        }

        // Final limit just in case
        return selected.stream().limit(limit).toList();
    }
 

    // Update markSidesAsUsedToday
    public void markSidesAsUsedToday(LocalDate today, List<Long> sideIds, Long userId) {
        if (sideIds == null || sideIds.isEmpty()) return;
        repo.updateLastTimeByIds(today, sideIds, userId); // Pass userId
    }

    // ---- helpers ----
    private SideItemDTO toDTO(SideItem e) {
        return new SideItemDTO(e.getId(), e.getName(), e.getType(), e.getDaysBetween(), e.getLastTime());
    }

    private void copyDtoToEntity(SideItemDTO d, SideItem e) {
        e.setName(d.name());
        e.setType(d.type());
        e.setDaysBetween(d.daysBetween());
        e.setLastTime(d.lastTime());
    }
}
