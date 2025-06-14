package com.cookfarm.repository;

import com.cookfarm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 사용자 찾기 (로그인용)
    Optional<User> findByEmail(String email);

    // 이메일 중복 여부 체크 (회원가입 시)
    boolean existsByEmail(String email);
}
