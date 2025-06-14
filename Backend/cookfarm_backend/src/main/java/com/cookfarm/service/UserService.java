package com.cookfarm.service;

import com.cookfarm.entity.User;
import com.cookfarm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 회원가입
    public void register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 비밀번호 암호화 필요 시 추가
        userRepository.save(user);
    }

    // 로그인
    public User login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password)) {
                return user;  // 로그인 성공 시 사용자 반환
            }
        }
        throw new IllegalArgumentException("이메일 또는 비밀번호가 틀렸습니다.");
    }

    // 이하 생략 (조회, 수정, 삭제 메서드)
}

