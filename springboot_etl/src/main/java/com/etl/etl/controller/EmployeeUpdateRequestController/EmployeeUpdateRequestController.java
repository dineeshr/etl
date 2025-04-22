package com.etl.etl.controller.EmployeeUpdateRequestController;

import com.etl.etl.entities.EmployeeUpdateRequest.EmployeeUpdateRequest;
import com.etl.etl.service.EmployeeUpdateRequestService.EmployeeUpdateRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/update-requests")
public class EmployeeUpdateRequestController {

    @Autowired
    private EmployeeUpdateRequestService requestService;

    // Endpoint to submit an update request
    @PostMapping("/submit/{empId}")
    public ResponseEntity<EmployeeUpdateRequest> submitUpdateRequest(
            @PathVariable("empId") Long empId, 
            @RequestBody EmployeeUpdateRequest request) {
        try {
            EmployeeUpdateRequest submittedRequest = requestService.submitUpdateRequest(empId, request);
            return ResponseEntity.ok(submittedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null); // Bad request
        }
    }

    // Endpoint to get all pending update requests
    @GetMapping("/pending")
    public ResponseEntity<List<EmployeeUpdateRequest>> getPendingUpdateRequests() {
        List<EmployeeUpdateRequest> pendingRequests = requestService.getPendingUpdateRequests();
        if (pendingRequests.isEmpty()) {
            return ResponseEntity.status(404).body(null); // Not found
        }
        return ResponseEntity.ok(pendingRequests);
    }

    // Endpoint to get update request history for a specific employee (engineer)
    @GetMapping("/history/{empId}")
    public ResponseEntity<List<EmployeeUpdateRequest>> getEmployeeUpdateHistory(@PathVariable("empId") Long empId) {
        List<EmployeeUpdateRequest> history = requestService.getEmployeeUpdateHistory(empId);
        if (history.isEmpty()) {
            return ResponseEntity.status(404).body(null); // Not found
        }
        return ResponseEntity.ok(history);
    }

    // Endpoint to approve or reject an update request
    @PutMapping("/approve-reject/{requestId}")
    public ResponseEntity<String> handleApproval(@PathVariable("requestId") Long requestId, 
                                                 @RequestParam("approved") boolean approved) {
        try {
            requestService.handleApproval(requestId, approved);
            if (approved) {
                return ResponseEntity.ok("Request approved successfully.");
            } else {
                return ResponseEntity.ok("Request rejected successfully.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error handling update request."); // Bad request
        }
    }
    @GetMapping("/history/all")
public ResponseEntity<List<EmployeeUpdateRequest>> getAllUpdateHistory() {
    List<EmployeeUpdateRequest> history = requestService.getAllUpdateHistory();
    return ResponseEntity.ok(history);
}

}
