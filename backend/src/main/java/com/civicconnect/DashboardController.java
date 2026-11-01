package com.civicconnect;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardRepository dashboardRepository;

    public DashboardController(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    // Get general dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOverallStats() {
        return ResponseEntity.ok(dashboardRepository.getOverallStats());
    }

    // Get specific department officer dashboard statistics
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Map<String, Object>> getDepartmentStats(@PathVariable int departmentId) {
        return ResponseEntity.ok(dashboardRepository.getDepartmentStats(departmentId));
    }
}
