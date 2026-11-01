package com.civicconnect;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody Map<String, String> request) {

        String name = request.get("name");
        String email = request.get("email");
        String phone = request.get("phone");
        String password = request.get("password");

        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || phone == null || phone.isBlank()
                || password == null || password.length() < 8) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            "Enter name, email, phone and a password of at least 8 characters."
                    ));
        }

        String hashedPassword = passwordEncoder.encode(password);

        try {
            int rows = userRepository.registerUser(
                    name.trim(),
                    email.trim(),
                    phone.trim(),
                    hashedPassword
            );

            if (rows == 1) {
                // Fetch the user to return user ID as well
                Optional<User> createdUser = userRepository.findByEmail(email.trim());
                int userId = createdUser.map(User::getUserId).orElse(0);

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of(
                                "message", "Registration successful",
                                "userId", userId,
                                "name", name.trim(),
                                "email", email.trim()
                        ));
            }

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Registration failed"));

        } catch (org.springframework.dao.DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "This email is already registered"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "An unexpected error occurred during registration."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email and password are required."));
        }

        Optional<User> userOptional = userRepository.findByEmail(email.trim());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password."));
        }

        User user = userOptional.get();
        boolean passwordValid = false;

        // Try BCrypt match first
        if (user.getPassword() != null) {
            if (passwordEncoder.matches(password, user.getPassword()) || user.getPassword().equals(password)) {
                passwordValid = true;
            }
        }

        if (!passwordValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password."));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "userId", user.getUserId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone()
        ));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable int userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found with ID: " + userId));
        }

        User user = userOptional.get();
        return ResponseEntity.ok(Map.of(
                "userId", user.getUserId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone()
        ));
    }
}
