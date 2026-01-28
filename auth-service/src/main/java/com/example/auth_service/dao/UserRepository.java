package com.example.auth_service.dao;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.auth_service.beans.*;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
