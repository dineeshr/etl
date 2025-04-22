package com.etl.etl.controller.LeaveRequestController;

import com.etl.etl.entities.LeaveRequest.LeaveRequest;
import com.etl.etl.service.LeaveRequestService.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    // Endpoint to submit a leave request
    @PostMapping("/submit/{empId}")
    public LeaveRequest submitLeaveRequest(@PathVariable Long empId, @RequestBody LeaveRequest leaveRequest) {
        // This method will accept a leave request and associate it with the employee by empId
        return leaveRequestService.submitLeaveRequest(empId, leaveRequest);
    }

    // Endpoint to get all leave requests (Pending, Approved, and Rejected)
    @GetMapping("/all")
    public List<LeaveRequest> getAllLeaveRequests() {
        // This method will retrieve all leave requests, including pending, approved, and rejected.
        return leaveRequestService.getAllLeaveRequests();
    }

    // Endpoint to get an employee's leave history
    @GetMapping("/history/{empId}")
    public List<LeaveRequest> getEmployeeLeaveHistory(@PathVariable Long empId) {
        // This method will retrieve all leave requests for a specific employee by empId.
        return leaveRequestService.getEmployeeLeaveHistory(empId);
    }

    // Endpoint to approve or reject a leave request (For manager)
    @PutMapping("/approve-reject/{requestId}/{managerId}")
    public void handleLeaveApproval(@PathVariable Long requestId, @PathVariable Long managerId, @RequestParam boolean approved) {
        // This method will allow managers to approve or reject leave requests.
        leaveRequestService.handleLeaveApproval(requestId, approved, managerId);
    }

}
