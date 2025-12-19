package com.example.menuapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;



@Entity
@Table(name = "maincourse")

public class MainCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(name = "days_between", nullable = false)
    private Integer daysBetween;

    @Column(name = "last_time")
    private LocalDate lastTime;

    @Column(name = "category")
    private String category;    
    
    @Column(name = "orgin")
    private String orgin;   

    @Column(name = "menuapi_id")
    private Integer menuapi_id;

    @Column(name = "numsides")
    private Integer numsides; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ---- getters & setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getDaysBetween() { return daysBetween; }
    public void setDaysBetween(Integer daysBetween) { this.daysBetween = daysBetween; }

    public LocalDate getLastTime() { return lastTime; }
    public void setLastTime(LocalDate lastTime) { this.lastTime = lastTime; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOrgin() { return orgin; }
    public void setOrgin(String orgin) { this.orgin = orgin; }  

    public Integer getMenuapi_id() { return menuapi_id; }
    public void setMenuapi_id(Integer menuapi_id) { this.menuapi_id = menuapi_id; } 

    public Integer getNumsides() { return numsides; }
    public void setNumsides(Integer numsides) { this.numsides = numsides; }

    // ADDDED user getter/setter
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}