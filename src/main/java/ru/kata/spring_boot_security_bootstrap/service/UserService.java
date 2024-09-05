package ru.kata.spring_boot_security_bootstrap.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ru.kata.spring_boot_security_bootstrap.model.Role;
import ru.kata.spring_boot_security_bootstrap.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    List<User> findAll();

    void save(User user);

    void update(User user);

    void delete(Long userId);

    User findById(Long userId);

    Role findRoleByName(String roleName);

    List<Role> findAllRoles();
}
