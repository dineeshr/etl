package com.etl.etl.controller.EmailChangeController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.etl.etl.service.EmailService.FormService.EmailFormService;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend to connect

@RestController
@RequestMapping("/api")  // Set API base path
public class EmailFormController {

    @Autowired
    private EmailFormService emailFormService;

    // Handle form submission to assign email (POST request)
    @PostMapping("/assignEmail")
    public ResponseEntity<Map<String, String>> assignEmail(@RequestBody Map<String, String> payload) {
        String senderEmail = payload.get("senderEmail"); // Get email from request body
        
        try {
            // Save the email in the database via the service
            emailFormService.assignEmail(senderEmail);

            // Return success response
            return ResponseEntity.ok(Map.of("message", "Email assigned successfully to: " + senderEmail));
        } catch (Exception e) {
            // Handle error and return error response
            return ResponseEntity.status(400).body(Map.of("message", "Error assigning email."));
        }
    }
}
