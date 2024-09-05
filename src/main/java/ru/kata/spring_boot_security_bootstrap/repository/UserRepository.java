package ru.kata.spring_boot_security_bootstrap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring_boot_security_bootstrap.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
