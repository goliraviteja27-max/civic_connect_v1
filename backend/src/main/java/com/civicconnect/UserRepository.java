package com.civicconnect;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int registerUser(String name, String email, String phone, String hashedPassword) {
        String sql = """
            INSERT INTO users (name, email, phone, password)
            VALUES (?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql, name, email, phone, hashedPassword);
    }

    public Optional<User> findByEmail(String email) {
        String sql = """
            SELECT user_id, name, email, phone, password
            FROM users
            WHERE email = ?
            """;
        try {
            User user = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new User(
                    rs.getInt("user_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("phone"),
                    rs.getString("password")
                ),
                email
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(int userId) {
        String sql = """
            SELECT user_id, name, email, phone
            FROM users
            WHERE user_id = ?
            """;
        try {
            User user = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new User(
                    rs.getInt("user_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("phone")
                ),
                userId
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
