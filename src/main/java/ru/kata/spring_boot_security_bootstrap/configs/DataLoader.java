package ru.kata.spring_boot_security_bootstrap.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring_boot_security_bootstrap.model.Role;
import ru.kata.spring_boot_security_bootstrap.model.User;
import ru.kata.spring_boot_security_bootstrap.repository.RoleRepository;
import ru.kata.spring_boot_security_bootstrap.repository.UserRepository;

import java.util.Set;

@Component
public class DataLoader implements ApplicationRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Role role = new Role(1L, "ROLE_USER");
        Role role2 = new Role(2L, "ROLE_ADMIN");
        User user = new User("admin", "admin", "25",
                "admin@mail.ru", passwordEncoder.encode("admin"));
        User user2 = new User("user", "user", "25",
                "user@mail.ru", passwordEncoder.encode("user"));
        user.setRoles(Set.of(role2));
        user2.setRoles(Set.of(role));
        roleRepository.save(role);
        roleRepository.save(role2);
        userRepository.save(user);
        userRepository.save(user2);
    }
}
