package com.cookfarm.repository;

import com.cookfarm.entity.Ingredient;
import com.cookfarm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    // 유저별 식재료 조회 (이거 중요!)
    List<Ingredient> findByUser(User user);

    // 이름으로 검색 (옵션 → 쓸 일 있으면 사용 가능)
    Ingredient findByName(String name);
}
