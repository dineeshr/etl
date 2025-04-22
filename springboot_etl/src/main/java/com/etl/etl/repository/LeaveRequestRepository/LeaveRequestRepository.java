package com.etl.etl.repository.LeaveRequestRepository;

import com.etl.etl.entities.LeaveRequest.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByEmployeeEmpId(Long empId);  // Get leave requests for a specific employee
    }
