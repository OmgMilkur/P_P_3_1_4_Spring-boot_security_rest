package ru.kata.spring_boot_security_bootstrap.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring_boot_security_bootstrap.model.User;
import ru.kata.spring_boot_security_bootstrap.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestApiController {
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public RestApiController(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/users")
    public List<User> apiGetAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/getUser/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PutMapping("/edit")
    public ResponseEntity<User> editUser(@RequestBody User user) {
        userService.update(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable("id") Long id) {
        userService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/new")
    public ResponseEntity<Void> apiCreateUser(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public User getUserInfo(@AuthenticationPrincipal User user) {
        return modelMapper.map(userService.findById(user.getId()), User.class);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> apiDeleteUser(@RequestBody User user) {
        userService.delete(user.getId());
        return ResponseEntity.ok().build();
    }
}
