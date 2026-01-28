package com.example.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.auth_service.beans.User;
import com.example.auth_service.dao.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Register User (Encrypt Password)
    public User register(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    // ✅ Login User (Verify Password)
    public User authenticate(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null); // 🔥 FIXED

        if (user == null) {
            return null;
        }

        // compare raw password with hashed password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return null;
        }

        return user;
    }

    // ✅ Check if email exists (used in register)
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent(); // 🔥 NEW
    }
}
