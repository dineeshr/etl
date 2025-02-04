package com.etl.etl.entities.login;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "emp_detail", schema = "emp_details")
public class Employee {

    @Id
    @Column(name = "emp_id")  // Assuming there is an 'emp_id' as the primary key in the table.
    private Long empId;

    @Column(name = "emp_name")
    private String empName;

    @Column(name = "emp_mail")
    private String empMail;

    @Column(name = "emp_mobileNumber")
    private String empMobileNumber;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    // Getters and Setters
    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getEmpMail() {
        return empMail;
    }

    public void setEmpMail(String empMail) {
        this.empMail = empMail;
    }

    public String getEmpMobileNumber() {
        return empMobileNumber;
    }

    public void setEmpMobileNumber(String empMobileNumber) {
        this.empMobileNumber = empMobileNumber;
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
}
