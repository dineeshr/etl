package com.etl.etl.entities.grievance_ticket;

import jakarta.persistence.*;
import com.etl.etl.entities.login.Employee;  // Import the Employee entity

import java.util.Date;

@Entity
@Table(name = "grievance_ticket", schema = "emp_details")
public class GrievanceTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    @ManyToOne
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id")
    private Employee employee; // Reference to Employee entity

    @Column(name = "issue_description")
    private String issueDescription;

    @Column(name = "status")
    private String status;

    @Column(name = "date_raised")
    private Date dateRaised;

    @Column(name = "date_resolved")
    private Date dateResolved;

    // Getters and setters
    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDateRaised() {
        return dateRaised;
    }

    public void setDateRaised(Date dateRaised) {
        this.dateRaised = dateRaised;
    }

    public Date getDateResolved() {
        return dateResolved;
    }

    public void setDateResolved(Date dateResolved) {
        this.dateResolved = dateResolved;
    }
}
