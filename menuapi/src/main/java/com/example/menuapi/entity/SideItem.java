package com.example.menuapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "sideitem")
public class SideItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;
    private String type;
    private String description;

    @NotNull
    @Column(name = "days_between", nullable = false)
    private Integer daysBetween;

    @Column(name = "last_time")
    private LocalDate lastTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ---- getters & setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDaysBetween() { return daysBetween; }
    public void setDaysBetween(Integer daysBetween) { this.daysBetween = daysBetween; }

    public LocalDate getLastTime() { return lastTime; }
    public void setLastTime(LocalDate lastTime) { this.lastTime = lastTime; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    // new user getter/setter
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
