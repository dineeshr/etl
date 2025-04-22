package com.etl.etl.service.GrievanceTicketService;

import com.etl.etl.entities.grievance_ticket.GrievanceTicket;
import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import com.etl.etl.repository.GrievanceTicketRepository.GrievanceTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GrievanceTicketService {

    @Autowired
    private GrievanceTicketRepository ticketRepository;
    @Autowired
    private EmployeeLoginRepository employeeRepository;
    // Raise a new ticket with the empId
    public GrievanceTicket raiseTicket(Long empId, GrievanceTicket ticket) {
        // Set the status to "OPEN" when the ticket is raised
        ticket.setStatus("OPEN");

        // Fetch the employee based on empId
        Optional<Employee> employeeOptional = employeeRepository.findById(empId);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            
            // Set the employee for the ticket
            ticket.setEmployee(employee);

            // Save the ticket and return it
            return ticketRepository.save(ticket);
        } else {
            // If employee is not found, throw an exception
            throw new RuntimeException("Employee with empId " + empId + " not found");
        }
    }

    // Resolve a ticket based on ticketId
    public GrievanceTicket resolveTicket(Long ticketId) {
        // Find the ticket by its ID, and throw an exception if not found
        GrievanceTicket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Set the status to "RESOLVED" and the dateResolved
        ticket.setStatus("RESOLVED");
        ticket.setDateResolved(new java.util.Date());

        // Save and return the updated ticket
        return ticketRepository.save(ticket);
    }
    public GrievanceTicket rejectTicket(Long ticketId) {
        // Find the ticket by its ID, and throw an exception if not found
        GrievanceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    
        // Set the status to "REJECTED" and the dateRejected
        ticket.setStatus("REJECTED");
        ticket.setDateResolved(new java.util.Date());  // Optional, if you want to store the rejection date
    
        // Save and return the updated ticket
        return ticketRepository.save(ticket);
    }
    // Fetch all tickets from the repository
    public List<GrievanceTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Fetch tickets based on employee id
    public List<GrievanceTicket> getTicketsByEmployeeId(Long empId) {
        return ticketRepository.findByEmployeeEmpId(empId); // Assuming you have the `empId` column in the database
    }
}
