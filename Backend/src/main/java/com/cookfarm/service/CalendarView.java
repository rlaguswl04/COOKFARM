package com.cookfarm.service;

import com.cookfarm.entity.Ingredient;
import org.springframework.stereotype.Service;
import com.cookfarm.repository.IngredientRepository;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CalendarView {

    private final IngredientRepository ingredientRepository;

    public CalendarView(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    // 1. 특정 날짜에 만료되는 식재료 조회
    public List<Ingredient> getIngredientsByDate(LocalDate date) {
        return ingredientRepository.findAll().stream()
                .filter(ingredient -> date.equals(ingredient.getExpiryDate()))
                .collect(Collectors.toList());
    }

    // 2. 유통기한이 지난 식재료 조회
    public List<Ingredient> getExpiredIngredients() {
        LocalDate today = LocalDate.now();
        return ingredientRepository.findAll().stream()
                .filter(ingredient -> ingredient.getExpiryDate().isBefore(today))
                .collect(Collectors.toList());
    }

    // 3. 달력용: 날짜별 식재료 Map<LocalDate, List<Ingredient>> 반환
    public Map<LocalDate, List<Ingredient>> getCalendarMap() {
        return ingredientRepository.findAll().stream()
                .collect(Collectors.groupingBy(Ingredient::getExpiryDate));
    }
}

