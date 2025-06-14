package com.cookfarm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.cookfarm.entity.User;

@Entity
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private LocalDate addedDate;
    private LocalDate expiryDate;
    private String memo;

    // ✅ User 필드만 최소 추가
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Ingredient() {}

    public Ingredient(String name, String category, LocalDate addedDate, LocalDate expiryDate, String memo) {
        this.name = name;
        this.category = category;
        this.addedDate = addedDate;
        this.expiryDate = expiryDate;
        this.memo = memo;
    }

    public Long getId() {
        return id;
    }

    public String getName() { return name; }
    public String getCategory() { return category; }
    public LocalDate getAddedDate() { return addedDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public String getMemo() { return memo; }

    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setAddedDate(LocalDate addedDate) { this.addedDate = addedDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public void setMemo(String memo) { this.memo = memo; }

    // ✅ User 필드용 Getter / Setter만 추가
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
