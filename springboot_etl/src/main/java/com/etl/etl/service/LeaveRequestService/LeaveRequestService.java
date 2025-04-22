package com.etl.etl.service.LeaveRequestService;

import com.etl.etl.entities.LeaveRequest.LeaveRequest;
import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.LeaveRequestRepository.LeaveRequestRepository;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeLoginRepository employeeRepository;

    // Submit a leave request
    public LeaveRequest submitLeaveRequest(Long empId, LeaveRequest leaveRequest) {
        Optional<Employee> employeeOptional = employeeRepository.findById(empId);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            leaveRequest.setEmployee(employee);
            leaveRequest.setStatus("Pending");
            leaveRequest.setRequestTime(LocalDateTime.now());
            return leaveRequestRepository.save(leaveRequest);
        } else {
            throw new RuntimeException("Employee not found");
        }
    }

    // Get all leave requests (Pending, Approved, Rejected)
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();  // Retrieve all leave requests irrespective of status
    }

    // Get leave history of an employee (Engineer)
    public List<LeaveRequest> getEmployeeLeaveHistory(Long empId) {
        return leaveRequestRepository.findByEmployeeEmpId(empId);
    }

    // Approve or reject a leave request (For Manager)
    public void handleLeaveApproval(Long requestId, boolean approved, Long managerId) {
        Optional<LeaveRequest> leaveRequestOptional = leaveRequestRepository.findById(requestId);
        if (leaveRequestOptional.isPresent()) {
            LeaveRequest leaveRequest = leaveRequestOptional.get();
            // Update the leave request status to Approved or Rejected
            if (approved) {
                leaveRequest.setStatus("Approved");
            } else {
                leaveRequest.setStatus("Rejected");
            }
            leaveRequest.setApprovalTime(LocalDateTime.now());
            leaveRequest.setApprovedBy(getManagerName(managerId));
            leaveRequestRepository.save(leaveRequest);  // Save the updated leave request
        } else {
            throw new RuntimeException("Leave request not found");
        }
    }

    // Helper method to get manager's name
    private String getManagerName(Long managerId) {
        Optional<Employee> managerOptional = employeeRepository.findById(managerId);
        return managerOptional.isPresent() ? managerOptional.get().getEmpName() : "Unknown";
    }
}
