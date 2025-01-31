package com.etl.etl.entities.Reporting_DB;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reporting_Dashboard", schema = "Reporting_DB")
public class ReportingDashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application", nullable = true)
    private String application;

    @Column(name = "env", nullable = true)
    private String env;

    @Column(name = "Date_Time", nullable = true)
    private LocalDateTime dateTime;

    @Column(name = "Init_state", nullable = true)
    private String initState;

    @Column(name = "created_dt", nullable = true)
    private LocalDateTime createdDt;

    @Column(name = "prev", nullable = true)
    private LocalDateTime prev;

    // Change the emailSent to store 'SENT' or 'UNSENT' instead of a boolean
    @Column(name = "email_sent", nullable = true)
    private String emailSent = "UNSENT";  // Default to "UNSENT"

    // New columns
    @Column(name = "Current_state", nullable = true) 
    private String currentState;

    @Column(name = "Handle_by", nullable = true) 
    private String handleBy;

    @Column(name = "Fail_reason", nullable = true) 
    private String failReason;

    @Column(name = "Fix_method", nullable = true) 
    private String fixMethod;

    @Column(name = "Solved_dt", nullable = true) 
    private LocalDateTime solvedDt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getEnv() {
        return env;
    }

    public void setEnv(String env) {
        this.env = env;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getInitState() {
        return initState;
    }

    public void setInitState(String initState) {
        this.initState = initState;
    }

    public LocalDateTime getCreatedDt() {
        return createdDt;
    }

    public void setCreatedDt(LocalDateTime createdDt) {
        this.createdDt = createdDt;
    }

    public LocalDateTime getPrev() {
        return prev;
    }

    public void setPrev(LocalDateTime prev) {
        this.prev = prev;
    }

    // Getter and Setter for emailSent (now as a String)
    public String getEmailSent() {
        return emailSent;
    }

    public void setEmailSent(String emailSent) {
            this.emailSent = emailSent;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }

    public String getHandleBy() {
        return handleBy;
    }

    public void setHandleBy(String handleBy) {
        this.handleBy = handleBy;
    }

    public String getFailReason() {
        return failReason;
    }

    public void setFailReason(String failReason) {
        this.failReason = failReason;
    }

    public String getFixMethod() {
        return fixMethod;
    }

    public void setFixMethod(String fixMethod) {
        this.fixMethod = fixMethod;
    }

    public LocalDateTime getSolvedDt() {
        return solvedDt;
    }

    public void setSolvedDt(LocalDateTime solvedDt) {
        this.solvedDt = solvedDt;
    }
}
