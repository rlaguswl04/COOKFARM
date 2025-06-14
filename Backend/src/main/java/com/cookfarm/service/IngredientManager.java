package com.cookfarm.service;

import com.cookfarm.entity.Ingredient;
import org.springframework.stereotype.Service;
import com.cookfarm.repository.IngredientRepository;

import java.util.List;

@Service
public class IngredientManager {

    private final IngredientRepository ingredientRepository;

    public IngredientManager(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    // 전체 식재료 조회
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // 식재료 추가
    public void addIngredient(Ingredient ingredient) {
        ingredientRepository.save(ingredient);
    }

    // 식재료 삭제
    public void deleteIngredient(Ingredient ingredient) {
        ingredientRepository.delete(ingredient);
    }

    // 이름으로 식재료 조회 (옵션)
    public Ingredient findByName(String name) {
        return ingredientRepository.findByName(name);
    }
}

