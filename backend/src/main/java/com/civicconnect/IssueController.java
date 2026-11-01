package com.civicconnect;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueRepository issueRepository;
    private final DepartmentRouter departmentRouter;

    public IssueController(
            IssueRepository issueRepository,
            DepartmentRouter departmentRouter) {
        this.issueRepository = issueRepository;
        this.departmentRouter = departmentRouter;
    }

    // Citizen reports a new complaint
    @PostMapping
    public ResponseEntity<?> reportIssue(
            @RequestBody Map<String, Object> request) {

        try {
            String description =
                    request.get("description") instanceof String
                    ? ((String) request.get("description")).trim()
                    : null;

            String location =
                    request.get("location") instanceof String
                    ? ((String) request.get("location")).trim()
                    : null;

            Object userIdValue = request.get("userId");

            if (description == null || description.isBlank()
                    || location == null || location.isBlank()
                    || userIdValue == null) {
                return ResponseEntity.badRequest().body(
                    Map.of("error",
                        "Description, location and userId are required.")
                );
            }

            int userId = Integer.parseInt(userIdValue.toString());

            if (userId <= 0) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid userId.")
                );
            }

            // Automatic rule-based categorization
            String category = CategoryMatcher.findCategory(description);

            // Automatic rule-based priority engine
            String priority =
                    PriorityEngine.calculatePriority(description, category);

            // Automatic dynamic department routing
            Department department =
                    departmentRouter.findDepartment(category);

            String status = "REPORTED";

            Issue issue = new Issue(
                    0,
                    description,
                    location,
                    category,
                    priority,
                    status,
                    userId,
                    department.getDepartmentId()
            );

            // Returns generated issue ID
            int issueId = issueRepository.reportIssue(issue);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message", "Complaint reported successfully",
                    "issueId", issueId,
                    "category", category,
                    "priority", priority,
                    "department", department.getDepartmentName(),
                    "departmentId", department.getDepartmentId(),
                    "location", location,
                    "status", status
                )
            );

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Invalid userId.")
            );

        } catch (IllegalStateException e) {
            return ResponseEntity.internalServerError().body(
                Map.of("error",
                    "Could not assign the department or retrieve the complaint ID.")
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("error",
                    "An unexpected error occurred while reporting the complaint.")
            );
        }
    }

    // Preview category, priority and department before submitting
    @PostMapping("/preview")
    public ResponseEntity<?> previewIssue(@RequestBody Map<String, String> request) {
        String description = request.get("description");
        if (description == null || description.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Description is required."));
        }

        String category = CategoryMatcher.findCategory(description);
        String priority = PriorityEngine.calculatePriority(description, category);
        Department department = departmentRouter.findDepartment(category);

        return ResponseEntity.ok(Map.of(
                "category", category,
                "priority", priority,
                "department", department.getDepartmentName(),
                "departmentId", department.getDepartmentId()
        ));
    }

    // List all issues with optional filtering
    @GetMapping
    public List<Issue> getIssues(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String status) {

        if (userId != null) {
            return issueRepository.findByUserId(userId);
        }

        if (departmentId != null) {
            if (status != null && !status.isBlank()) {
                return issueRepository.findByDepartmentIdAndStatus(departmentId, status);
            }
            return issueRepository.findByDepartmentId(departmentId);
        }

        return issueRepository.findAll();
    }

    // Get specific complaint by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getIssueById(@PathVariable int id) {
        Optional<Issue> issue = issueRepository.findById(id);
        if (issue.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Complaint not found with ID: " + id));
        }
        return ResponseEntity.ok(issue.get());
    }

    // Get all complaints for a citizen
    @GetMapping("/user/{userId}")
    public List<Issue> getUserIssues(@PathVariable int userId) {
        return issueRepository.findByUserId(userId);
    }

    // Get all complaints for a department
    @GetMapping("/department/{departmentId}")
    public List<Issue> getDepartmentIssues(
            @PathVariable int departmentId,
            @RequestParam(required = false) String status) {

        if (status != null && !status.isBlank()) {
            return issueRepository.findByDepartmentIdAndStatus(departmentId, status);
        }
        return issueRepository.findByDepartmentId(departmentId);
    }

    // Update complaint status (REPORTED -> IN PROGRESS -> RESOLVED)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateIssueStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> request) {

        String newStatus = request.get("status");

        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Status is required (e.g., 'IN PROGRESS', 'RESOLVED', 'REPORTED')."));
        }

        String normalizedStatus = newStatus.trim().toUpperCase();
        if (!normalizedStatus.equals("REPORTED")
                && !normalizedStatus.equals("IN PROGRESS")
                && !normalizedStatus.equals("RESOLVED")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid status. Allowed values: REPORTED, IN PROGRESS, RESOLVED"));
        }

        Optional<Issue> existing = issueRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Complaint not found with ID: " + id));
        }

        int updated = issueRepository.updateStatus(id, normalizedStatus);
        if (updated == 1) {
            Issue updatedIssue = issueRepository.findById(id).orElse(null);
            return ResponseEntity.ok(Map.of(
                    "message", "Status updated successfully",
                    "issueId", id,
                    "status", normalizedStatus,
                    "issue", updatedIssue != null ? updatedIssue : Map.of()
            ));
        }

        return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to update status."));
    }
}
