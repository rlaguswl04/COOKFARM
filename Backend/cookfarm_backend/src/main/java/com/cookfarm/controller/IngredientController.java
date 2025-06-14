package com.cookfarm.controller;

import com.cookfarm.entity.Ingredient;
import com.cookfarm.entity.User;
import com.cookfarm.repository.IngredientRepository;
import com.cookfarm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin(origins = "http://localhost:3000")
public class IngredientController {

    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;

    @Autowired
    public IngredientController(IngredientRepository ingredientRepository, UserRepository userRepository) {
        this.ingredientRepository = ingredientRepository;
        this.userRepository = userRepository;
    }

    // ✅ 식재료 추가 (특정 User 소속으로 추가) → POST /api/ingredients/add/{userId}
    @PostMapping("/add/{userId}")
    public String addIngredient(@PathVariable Long userId, @RequestBody Map<String, Object> body) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Ingredient ingredient = new Ingredient();
        ingredient.setName((String) body.get("name"));
        ingredient.setCategory((String) body.get("category"));
        ingredient.setAddedDate(LocalDate.parse((String) body.get("addedDate")));
        ingredient.setExpiryDate(LocalDate.parse((String) body.get("expiryDate")));
        // 여기! description -> memo로 직접 매핑
        ingredient.setMemo((String) body.get("description"));
        ingredient.setUser(user);
        ingredientRepository.save(ingredient);
        return "식재료 추가 성공!";
    }


    // ✅ 유저별 식재료 전체 조회 → GET /api/ingredients/user/{userId}
    @GetMapping("/user/{userId}")
    public List<Ingredient> getUserIngredients(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return ingredientRepository.findByUser(user);
    }

    // ✅ 식재료 삭제 → DELETE /api/ingredients/{ingredientId}
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long id) {
        ingredientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ 모든 식재료 조회 (관리용 or 테스트용) → GET /api/ingredients/all
    @GetMapping("/all")
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // ✅ 식재료 수정 → PUT /api/ingredients/{ingredientId}
    @PutMapping("/{ingredientId}")
    public String updateIngredient(@PathVariable Long ingredientId, @RequestBody Ingredient updatedIngredient) {
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        ingredient.setName(updatedIngredient.getName());
        ingredient.setCategory(updatedIngredient.getCategory());
        ingredient.setAddedDate(updatedIngredient.getAddedDate());
        ingredient.setExpiryDate(updatedIngredient.getExpiryDate());
        ingredient.setMemo(updatedIngredient.getMemo());

        ingredientRepository.save(ingredient);

        return "식재료 수정 성공!";
    }
}
