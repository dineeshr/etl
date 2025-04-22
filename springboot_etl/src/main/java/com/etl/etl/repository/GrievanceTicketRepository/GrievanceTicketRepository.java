package com.etl.etl.repository.GrievanceTicketRepository;

import com.etl.etl.entities.grievance_ticket.GrievanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GrievanceTicketRepository extends JpaRepository<GrievanceTicket, Long> {

    // Custom query to select based on empId (long) from the Employee entity
    @Query("SELECT g FROM GrievanceTicket g WHERE g.employee.empId = :empId")
    List<GrievanceTicket> findByEmployeeEmpId(long empId);
}

