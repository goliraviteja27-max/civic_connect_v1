package com.civicconnect;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "CivicConnect Backend",
                "version", "1.0.0",
                "database", "MySQL (civicconnect)"
        );
    }
}