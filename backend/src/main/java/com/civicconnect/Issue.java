package com.civicconnect;

public class Issue {

    private int issueId;
    private String description;
    private String location;
    private String category;
    private String priority;
    private String status;
    private int userId;
    private int departmentId;

    // Additional display fields for convenience in API responses
    private String departmentName;
    private String userName;
    private String userPhone;

    public Issue() {
    }

    public Issue(
            int issueId,
            String description,
            String location,
            String category,
            String priority,
            String status,
            int userId,
            int departmentId) {

        this.issueId = issueId;
        this.description = description;
        this.location = location;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.userId = userId;
        this.departmentId = departmentId;
    }

    public Issue(
            int issueId,
            String description,
            String location,
            String category,
            String priority,
            String status,
            int userId,
            int departmentId,
            String departmentName,
            String userName,
            String userPhone) {

        this.issueId = issueId;
        this.description = description;
        this.location = location;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.userId = userId;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.userName = userName;
        this.userPhone = userPhone;
    }

    public int getIssueId() {
        return issueId;
    }

    public void setIssueId(int issueId) {
        this.issueId = issueId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }
}
