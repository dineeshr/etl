package com.etl.etl.controller.GrievanceTicketController;

import com.etl.etl.entities.grievance_ticket.GrievanceTicket;
import com.etl.etl.service.GrievanceTicketService.GrievanceTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class GrievanceTicketController {

    @Autowired
    private GrievanceTicketService ticketService;


        @PostMapping("/raise/{empId}")
    public GrievanceTicket raiseTicket(@PathVariable Long empId, @RequestBody GrievanceTicket ticket) {
        // Associate the employee by empId with the grievance ticket

        // Raise the ticket and return the result
        return ticketService.raiseTicket(empId,ticket);
    }

    @PutMapping("/resolve/{ticketId}")
    public GrievanceTicket resolveTicket(@PathVariable Long ticketId) {
        return ticketService.resolveTicket(ticketId);
    }
    @PutMapping("/reject/{ticketId}")
    public GrievanceTicket rejectTicket(@PathVariable Long ticketId) {
        return ticketService.rejectTicket(ticketId);
    }
    @GetMapping("/")
    public List<GrievanceTicket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/employee/{empId}")
    public List<GrievanceTicket> getTicketsByEmployeeId(@PathVariable Long empId) {
        return ticketService.getTicketsByEmployeeId(empId);
    }
}

