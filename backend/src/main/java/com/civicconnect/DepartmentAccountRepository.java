package com.civicconnect;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class DepartmentAccountRepository {

    private final JdbcTemplate jdbcTemplate;

    public DepartmentAccountRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<DepartmentAccount> findByUsername(String username) {
        String sql = """
            SELECT da.account_id, da.username, da.password, da.department_id,
                   d.department_name, d.location
            FROM department_accounts da
            JOIN departments d ON da.department_id = d.department_id
            WHERE da.username = ?
            """;
        try {
            DepartmentAccount account = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new DepartmentAccount(
                    rs.getInt("account_id"),
                    rs.getString("username"),
                    rs.getString("password"),
                    rs.getInt("department_id"),
                    rs.getString("department_name"),
                    rs.getString("location")
                ),
                username
            );
            return Optional.ofNullable(account);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
