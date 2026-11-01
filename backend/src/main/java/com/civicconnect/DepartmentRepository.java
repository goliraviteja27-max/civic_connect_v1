package com.civicconnect;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DepartmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public DepartmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get all departments from MySQL.
    public List<Department> findAll() {
        String sql = """
            SELECT department_id, department_name, location
            FROM departments
            ORDER BY department_id ASC
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new Department(
                rs.getInt("department_id"),
                rs.getString("department_name"),
                rs.getString("location")
            )
        );
    }

    // Find department by ID.
    public Optional<Department> findById(int departmentId) {
        String sql = """
            SELECT department_id, department_name, location
            FROM departments
            WHERE department_id = ?
            """;

        try {
            Department department = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new Department(
                    rs.getInt("department_id"),
                    rs.getString("department_name"),
                    rs.getString("location")
                ),
                departmentId
            );
            return Optional.ofNullable(department);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // Find one department using its exact name.
    public Optional<Department> findByName(String departmentName) {
        String sql = """
            SELECT department_id, department_name, location
            FROM departments
            WHERE department_name = ?
            """;

        List<Department> departments = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new Department(
                rs.getInt("department_id"),
                rs.getString("department_name"),
                rs.getString("location")
            ),
            departmentName
        );

        return departments.stream().findFirst();
    }
}
