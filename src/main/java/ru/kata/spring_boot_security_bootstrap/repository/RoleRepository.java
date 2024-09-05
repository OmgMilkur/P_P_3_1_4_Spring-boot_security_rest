package ru.kata.spring_boot_security_bootstrap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring_boot_security_bootstrap.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
