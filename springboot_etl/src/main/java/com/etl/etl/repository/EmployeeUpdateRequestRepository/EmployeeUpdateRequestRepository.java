package com.etl.etl.repository.EmployeeUpdateRequestRepository;


import com.etl.etl.entities.EmployeeUpdateRequest.EmployeeUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeUpdateRequestRepository extends JpaRepository<EmployeeUpdateRequest, Long> {
    
    // Custom query to find requests with a particular status
    List<EmployeeUpdateRequest> findByStatus(String status);
    List<EmployeeUpdateRequest> findByEmployeeEmpId(Long empId);
    


    // Additional custom queries can be added here if needed
}
