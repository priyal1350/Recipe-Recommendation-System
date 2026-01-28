package com.example.auth_service.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.auth_service.beans.User;
import com.example.auth_service.service.UserService;
import com.example.auth_service.util.JwtUtil;
import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER USER (DTO instead of Entity)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        if (req.getEmail() == null || req.getPasswordHash() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email and password are required"
            ));
        }

        if (userService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email already registered"
            ));
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPasswordHash(req.getPasswordHash()); // raw password (will be encoded)
        user.setDietPreference(req.getDietPreference());
        user.setAgeGroup(req.getAgeGroup());

        User savedUser = userService.register(user);

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully ✅",
                "userId", savedUser.getUserId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail()
        ));
    }

    // ✅ LOGIN USER (DTO instead of Map)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        User user = userService.authenticate(req.getEmail(), req.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Invalid email or password"
            ));
        }

        // 🔥 Generate JWT Token WITH userId (for .NET)
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", user.getUserId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }
}
