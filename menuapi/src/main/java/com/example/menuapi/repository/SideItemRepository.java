package com.example.menuapi.repository;

import com.example.menuapi.entity.SideItem;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SideItemRepository extends JpaRepository<SideItem, Long> {

 
    // Add to findAvailableSidesExcluding
    @Query(value = """
        SELECT * FROM sideitem s
        WHERE s.user_id = :userId
        AND s.id NOT IN (:excludeIds)
        AND (s.last_time IS NULL 
            OR DATE_ADD(s.last_time, INTERVAL s.days_between DAY) <= CURRENT_DATE)
        ORDER BY RAND()
        LIMIT 100
        """, nativeQuery = true)
    List<SideItem> findAvailableSidesExcluding(@Param("userId") Long userId, @Param("excludeIds") List<Long> excludeIds);
        // Update updateLastTimeByIds
    @Modifying
    @Transactional
    @Query("UPDATE SideItem s SET s.lastTime = :today WHERE s.id IN :ids AND s.user.id = :userId")
    void updateLastTimeByIds(@Param("today") LocalDate today, @Param("ids") List<Long> ids, @Param("userId") Long userId);

    // Add filtered finds
    @Query("SELECT s FROM SideItem s WHERE s.user.id = :userId")
    List<SideItem> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM SideItem s WHERE s.id = :id AND s.user.id = :userId")
    Optional<SideItem> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}