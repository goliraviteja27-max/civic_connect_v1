package com.civicconnect;

public class DepartmentAccount {

    private int accountId;
    private String username;
    private String password;
    private int departmentId;
    private String departmentName;
    private String location;

    public DepartmentAccount() {
    }

    public DepartmentAccount(int accountId, String username, String password, int departmentId, String departmentName, String location) {
        this.accountId = accountId;
        this.username = username;
        this.password = password;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.location = location;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
