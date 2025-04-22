package com.etl.etl.entities.login;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "login_logout_log", schema = "emp_details")
public class LoginLogoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id")
    private Employee employee; // Reference to Employee entity

    @Column(name = "emp_username")
    private String empUsername; // Store username of the employee

    @Column(name = "login_timestamp")
    private LocalDateTime loginTimestamp; // Store login timestamp

    @Column(name = "logout_timestamp")
    private LocalDateTime logoutTimestamp; // Store logout timestamp

    @Column(name = "emp_attendance")
    private String empAttendance; // Store attendance status (Present, Absent, etc.)

    @Column(name = "duration")
    private Long duration; // Store the duration of login session in minutes

    @Column(name = "duration_type")
    private String durationType; // Store the type of duration (seconds, minutes, hours, days)

    // New column "timestamp"
    @Column(name = "timestamp")
    private LocalDateTime timestamp; // Store timestamp of the log entry creation/update

    // Getters and Setters for all fields
    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getEmpUsername() {
        return empUsername;
    }

    public void setEmpUsername(String empUsername) {
        this.empUsername = empUsername;
    }

    public LocalDateTime getLoginTimestamp() {
        return loginTimestamp;
    }

    public void setLoginTimestamp(LocalDateTime loginTimestamp) {
        this.loginTimestamp = loginTimestamp;
    }

    public LocalDateTime getLogoutTimestamp() {
        return logoutTimestamp;
    }

    public void setLogoutTimestamp(LocalDateTime logoutTimestamp) {
        this.logoutTimestamp = logoutTimestamp;
    }

    public String getEmpAttendance() {
        return empAttendance;
    }

    public void setEmpAttendance(String empAttendance) {
        this.empAttendance = empAttendance;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getDurationType() {
        return durationType;
    }

    public void setDurationType(String durationType) {
        this.durationType = durationType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
