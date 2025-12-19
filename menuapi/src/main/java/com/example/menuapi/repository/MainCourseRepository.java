package com.example.menuapi.repository;

import com.example.menuapi.entity.MainCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MainCourseRepository extends JpaRepository<MainCourse, Long> {

    @NonNull
    @Override
    <S extends MainCourse> S save(@NonNull S entity);

    @Modifying
    @Query("UPDATE MainCourse m SET m.lastTime = :today WHERE m.id IN :ids")
    void updateLastTimeByIds(@Param("today") LocalDate today, @Param("ids") List<Long> ids);

    @Modifying
    @Query("UPDATE MainCourse m SET m.lastTime = :today WHERE m.id = :id")
    void updateLastTimeById(@Param("today") LocalDate today, @Param("id") Long id);

    // Example for findRandomExcludingIds (native query)
    @Query(value = """
        SELECT * FROM maincourse 
        WHERE user_id = :userId
        AND id NOT IN (:excludeIds)
        AND (last_time IS NULL 
            OR last_time + INTERVAL days_between DAY <= CURDATE())
        ORDER BY RAND() 
        LIMIT 1
        """, nativeQuery = true)
    MainCourse findRandomExcludingIds(@Param("userId") Long userId, List<Long> excludeIds);

    // Similarly for findRandom
    @Query(value = """
        SELECT * FROM maincourse 
        WHERE user_id = :userId
        AND (last_time IS NULL 
            OR last_time + INTERVAL days_between DAY <= CURDATE())
        ORDER BY RAND() 
        LIMIT :limit
        """, nativeQuery = true)
    List<MainCourse> findRandom(@Param("userId") Long userId, int limit);

    // For findOneRandom
    @Query(value = """
        SELECT * FROM maincourse 
        WHERE user_id = :userId
        AND (last_time IS NULL 
            OR last_time + INTERVAL days_between DAY <= CURDATE())
        ORDER BY RAND() 
        LIMIT 1
        """, nativeQuery = true)
    MainCourse findOneRandom(@Param("userId") Long userId);

    // Update update methods to include userId filter (for safety)
    @Modifying
    @Query("UPDATE MainCourse m SET m.lastTime = :today WHERE m.id IN :ids AND m.user.id = :userId")
    void updateLastTimeByIds(@Param("today") LocalDate today, @Param("ids") List<Long> ids, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE MainCourse m SET m.lastTime = :today WHERE m.id = :id AND m.user.id = :userId")
    void updateLastTimeById(@Param("today") LocalDate today, @Param("id") Long id, @Param("userId") Long userId);

    // Override findAll/findById to filter (or handle in service)
    @Query("SELECT m FROM MainCourse m WHERE m.user.id = :userId")
    List<MainCourse> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM MainCourse m WHERE m.id = :id AND m.user.id = :userId")
    Optional<MainCourse> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}