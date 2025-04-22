package com.etl.etl.service.EmployeeUpdateRequestService;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.entities.EmployeeUpdateRequest.EmployeeUpdateRequest;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import com.etl.etl.repository.EmployeeUpdateRequestRepository.EmployeeUpdateRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeUpdateRequestService {

    @Autowired
    private EmployeeUpdateRequestRepository requestRepository;

    @Autowired
    private EmployeeLoginRepository employeeRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Submit an update request
    public EmployeeUpdateRequest submitUpdateRequest(Long empId, EmployeeUpdateRequest request) {
        Optional<Employee> employeeOptional = employeeRepository.findById(empId);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            request.setEmployee(employee); // Set the empId explicitly
            request.setStatus("Pending");
            request.setRequestTime(LocalDateTime.now());
            return requestRepository.save(request);
        } else {
            throw new RuntimeException("Employee not found");
        }
    }

    // Get all pending update requests
    public List<EmployeeUpdateRequest> getPendingUpdateRequests() {
        return requestRepository.findByStatus("Pending");
    }

    // Get update history for a specific employee (Engineer)
    public List<EmployeeUpdateRequest> getEmployeeUpdateHistory(Long empId) {
        return requestRepository.findByEmployeeEmpId(empId); // Custom query to get update requests for a specific employee
    }

    // Approve or reject an update request
    public void handleApproval(Long requestId, boolean approved) {
        Optional<EmployeeUpdateRequest> requestOptional = requestRepository.findById(requestId);
        if (requestOptional.isPresent()) {
            EmployeeUpdateRequest request = requestOptional.get();
            
            // If approved, update the employee information with the new data
            if (approved) {
                Optional<Employee> employeeOptional = employeeRepository.findById(request.getEmployee().getEmpId());
                if (employeeOptional.isPresent()) {
                    Employee employee = employeeOptional.get();
    
                    // Log the previous values before updating (for auditing purposes)
                    String previousEmpName = employee.getEmpName();
                    String previousEmpMail = employee.getEmpMail();
                    String previousEmpMobileNumber = employee.getEmpMobileNumber();
                    String previousUsername = employee.getUsername();
                    String previousPassword = employee.getPassword();
    
                    // Update the employee's data with the requested changes
                    if (request.getEmpName() != null) {
                        employee.setEmpName(request.getEmpName());
                    }
                    if (request.getEmpMail() != null) {
                        employee.setEmpMail(request.getEmpMail());
                    }
                    if (request.getEmpMobileNumber() != null) {
                        employee.setEmpMobileNumber(request.getEmpMobileNumber());
                    }
                    if (request.getUsername() != null) {
                        employee.setUsername(request.getUsername());
                    }
                    if (request.getPassword() != null) {
                        // Hash the password using BCrypt before saving, even if it's rejected later
                        String encodedPassword = passwordEncoder.encode(request.getPassword());
                        employee.setPassword(encodedPassword);
                    }
    
                    // Save the updated employee entity
                    employeeRepository.save(employee);
    
                    // Log the update in the request table
                    request.setStatus("Approved");
                    request.setApprovalTime(LocalDateTime.now());
                    request.setUpdateTimestamp(LocalDateTime.now());  // Set the update timestamp
                    
                    // Optionally, store the previous values for auditing/logging
                    request.setEmpName(previousEmpName);
                    request.setEmpMail(previousEmpMail);
                    request.setEmpMobileNumber(previousEmpMobileNumber);
                    request.setUsername(previousUsername);
                    request.setPassword(previousPassword);
                } else {
                    throw new RuntimeException("Employee not found");
                }
    
            } else {
                // If rejected, still hash the password before saving it (to prevent storing plain text password)
                if (request.getPassword() != null) {
                    String encodedPassword = passwordEncoder.encode(request.getPassword());
                    request.setPassword(encodedPassword);
                }
                
                // If rejected, simply update the status to "Rejected"
                request.setStatus("Rejected");
                request.setApprovalTime(LocalDateTime.now());
            }
    
            // Save the request record (this will store the log)
            requestRepository.save(request);
        } else {
            throw new RuntimeException("Update request not found");
        }
    }
    
    public List<EmployeeUpdateRequest> getAllUpdateHistory() {
        return requestRepository.findAll();  // Fetch all update requests from the repository
    }
}
