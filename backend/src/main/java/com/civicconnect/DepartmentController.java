package com.civicconnect;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final DepartmentAccountRepository departmentAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public DepartmentController(
            DepartmentRepository departmentRepository,
            DepartmentAccountRepository departmentAccountRepository,
            PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.departmentAccountRepository = departmentAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable int id) {
        Optional<Department> department = departmentRepository.findById(id);
        if (department.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Department not found with ID: " + id));
        }
        return ResponseEntity.ok(department.get());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDepartment(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required."));
        }

        Optional<DepartmentAccount> accountOpt = departmentAccountRepository.findByUsername(username.trim());
        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid department username or password."));
        }

        DepartmentAccount account = accountOpt.get();
        boolean valid = false;

        if (account.getPassword() != null) {
            // Support both plain text seeded passwords (e.g., '1234') and BCrypt hashes
            if (account.getPassword().equals(password) || passwordEncoder.matches(password, account.getPassword())) {
                valid = true;
            }
        }

        if (!valid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid department username or password."));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Department login successful",
                "accountId", account.getAccountId(),
                "username", account.getUsername(),
                "departmentId", account.getDepartmentId(),
                "departmentName", account.getDepartmentName(),
                "location", account.getLocation()
        ));
    }
}
