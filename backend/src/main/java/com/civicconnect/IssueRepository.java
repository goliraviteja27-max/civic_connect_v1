package com.civicconnect;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class IssueRepository {

    private final JdbcTemplate jdbcTemplate;

    public IssueRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Issue> issueRowMapper = (rs, rowNum) -> {
        Issue issue = new Issue();
        issue.setIssueId(rs.getInt("issue_id"));
        issue.setDescription(rs.getString("description"));
        issue.setLocation(rs.getString("location"));
        issue.setCategory(rs.getString("category"));
        issue.setPriority(rs.getString("priority"));
        issue.setStatus(rs.getString("status"));
        issue.setUserId(rs.getInt("user_id"));
        issue.setDepartmentId(rs.getInt("department_id"));

        try {
            issue.setDepartmentName(rs.getString("department_name"));
        } catch (Exception ignored) {}

        try {
            issue.setUserName(rs.getString("user_name"));
        } catch (Exception ignored) {}

        try {
            issue.setUserPhone(rs.getString("user_phone"));
        } catch (Exception ignored) {}

        return issue;
    };

    // Save a complaint and return its generated issue ID.
    public int reportIssue(Issue issue) {

        String sql = """
            INSERT INTO issues
            (description, location, category, priority, status,
             user_id, department_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                sql, Statement.RETURN_GENERATED_KEYS
            );

            ps.setString(1, issue.getDescription());
            ps.setString(2, issue.getLocation());
            ps.setString(3, issue.getCategory());
            ps.setString(4, issue.getPriority());
            ps.setString(5, issue.getStatus());
            ps.setInt(6, issue.getUserId());
            ps.setInt(7, issue.getDepartmentId());

            return ps;
        }, keyHolder);

        if (rows != 1 || keyHolder.getKey() == null) {
            throw new IllegalStateException(
                "Complaint saved without a generated issue ID."
            );
        }

        return keyHolder.getKey().intValue();
    }

    // Retrieve an issue by its ID with department and citizen information.
    public Optional<Issue> findById(int issueId) {
        String sql = """
            SELECT i.issue_id, i.description, i.location, i.category,
                   i.priority, i.status, i.user_id, i.department_id,
                   d.department_name, u.name AS user_name, u.phone AS user_phone
            FROM issues i
            LEFT JOIN departments d ON i.department_id = d.department_id
            LEFT JOIN users u ON i.user_id = u.user_id
            WHERE i.issue_id = ?
            """;

        try {
            Issue issue = jdbcTemplate.queryForObject(sql, issueRowMapper, issueId);
            return Optional.ofNullable(issue);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // Retrieve all complaints in system.
    public List<Issue> findAll() {
        String sql = """
            SELECT i.issue_id, i.description, i.location, i.category,
                   i.priority, i.status, i.user_id, i.department_id,
                   d.department_name, u.name AS user_name, u.phone AS user_phone
            FROM issues i
            LEFT JOIN departments d ON i.department_id = d.department_id
            LEFT JOIN users u ON i.user_id = u.user_id
            ORDER BY i.issue_id DESC
            """;

        return jdbcTemplate.query(sql, issueRowMapper);
    }

    // Retrieve all complaints for a citizen.
    public List<Issue> findByUserId(int userId) {

        String sql = """
            SELECT i.issue_id, i.description, i.location, i.category,
                   i.priority, i.status, i.user_id, i.department_id,
                   d.department_name, u.name AS user_name, u.phone AS user_phone
            FROM issues i
            LEFT JOIN departments d ON i.department_id = d.department_id
            LEFT JOIN users u ON i.user_id = u.user_id
            WHERE i.user_id = ?
            ORDER BY i.issue_id DESC
            """;

        return jdbcTemplate.query(sql, issueRowMapper, userId);
    }

    // Retrieve all complaints assigned to a department.
    public List<Issue> findByDepartmentId(int departmentId) {
        String sql = """
            SELECT i.issue_id, i.description, i.location, i.category,
                   i.priority, i.status, i.user_id, i.department_id,
                   d.department_name, u.name AS user_name, u.phone AS user_phone
            FROM issues i
            LEFT JOIN departments d ON i.department_id = d.department_id
            LEFT JOIN users u ON i.user_id = u.user_id
            WHERE i.department_id = ?
            ORDER BY i.issue_id DESC
            """;

        return jdbcTemplate.query(sql, issueRowMapper, departmentId);
    }

    // Retrieve complaints assigned to a department filtered by status.
    public List<Issue> findByDepartmentIdAndStatus(int departmentId, String status) {
        String sql = """
            SELECT i.issue_id, i.description, i.location, i.category,
                   i.priority, i.status, i.user_id, i.department_id,
                   d.department_name, u.name AS user_name, u.phone AS user_phone
            FROM issues i
            LEFT JOIN departments d ON i.department_id = d.department_id
            LEFT JOIN users u ON i.user_id = u.user_id
            WHERE i.department_id = ? AND UPPER(i.status) = UPPER(?)
            ORDER BY i.issue_id DESC
            """;

        return jdbcTemplate.query(sql, issueRowMapper, departmentId, status);
    }

    // Update status of an issue (e.g. REPORTED -> IN PROGRESS -> RESOLVED)
    public int updateStatus(int issueId, String status) {
        String sql = """
            UPDATE issues
            SET status = ?
            WHERE issue_id = ?
            """;

        return jdbcTemplate.update(sql, status, issueId);
    }
}
