package com.civicconnect;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get overall system metrics across all citizens and departments
    public Map<String, Object> getOverallStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total complaints
        Integer total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM issues", Integer.class);
        stats.put("totalIssues", total != null ? total : 0);

        // Status counts
        List<Map<String, Object>> statusRows = jdbcTemplate.queryForList(
                "SELECT status, COUNT(*) as count FROM issues GROUP BY status"
        );
        int reported = 0, inProgress = 0, resolved = 0;
        for (Map<String, Object> row : statusRows) {
            String status = ((String) row.get("status")).toUpperCase();
            int count = ((Number) row.get("count")).intValue();
            if (status.contains("PROGRESS")) inProgress += count;
            else if (status.contains("RESOLVED")) resolved += count;
            else reported += count;
        }
        stats.put("reportedCount", reported);
        stats.put("inProgressCount", inProgress);
        stats.put("resolvedCount", resolved);

        // Priority counts
        List<Map<String, Object>> priorityRows = jdbcTemplate.queryForList(
                "SELECT priority, COUNT(*) as count FROM issues GROUP BY priority"
        );
        int high = 0, medium = 0, low = 0;
        for (Map<String, Object> row : priorityRows) {
            String p = ((String) row.get("priority")).toUpperCase();
            int count = ((Number) row.get("count")).intValue();
            if (p.equals("HIGH")) high = count;
            else if (p.equals("MEDIUM")) medium = count;
            else if (p.equals("LOW")) low = count;
        }
        stats.put("highPriorityCount", high);
        stats.put("mediumPriorityCount", medium);
        stats.put("lowPriorityCount", low);

        // Department breakdown
        String deptSql = """
            SELECT d.department_id, d.department_name,
                   COUNT(i.issue_id) as total_issues,
                   SUM(CASE WHEN UPPER(i.status) = 'RESOLVED' THEN 1 ELSE 0 END) as resolved_issues
            FROM departments d
            LEFT JOIN issues i ON d.department_id = i.department_id
            GROUP BY d.department_id, d.department_name
            ORDER BY total_issues DESC
            """;
        List<Map<String, Object>> deptList = jdbcTemplate.queryForList(deptSql);
        stats.put("departments", deptList);

        return stats;
    }

    // Get specific statistics for a single department dashboard
    public Map<String, Object> getDepartmentStats(int departmentId) {
        Map<String, Object> stats = new HashMap<>();

        Integer total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM issues WHERE department_id = ?",
                Integer.class,
                departmentId
        );
        stats.put("totalAssigned", total != null ? total : 0);

        List<Map<String, Object>> statusRows = jdbcTemplate.queryForList(
                "SELECT status, COUNT(*) as count FROM issues WHERE department_id = ? GROUP BY status",
                departmentId
        );
        int reported = 0, inProgress = 0, resolved = 0;
        for (Map<String, Object> row : statusRows) {
            String status = ((String) row.get("status")).toUpperCase();
            int count = ((Number) row.get("count")).intValue();
            if (status.contains("PROGRESS")) inProgress += count;
            else if (status.contains("RESOLVED")) resolved += count;
            else reported += count;
        }
        stats.put("reportedCount", reported);
        stats.put("inProgressCount", inProgress);
        stats.put("resolvedCount", resolved);

        Integer highPriority = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM issues WHERE department_id = ? AND UPPER(priority) = 'HIGH'",
                Integer.class,
                departmentId
        );
        stats.put("highPriorityCount", highPriority != null ? highPriority : 0);

        return stats;
    }
}
