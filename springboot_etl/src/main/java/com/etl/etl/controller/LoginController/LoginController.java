package com.etl.etl.controller.LoginController;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private EmployeeLoginRepository employeeLoginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
       public ResponseEntity<?> authenticateUser(@RequestBody Employee loginDetails) {
        // Fetch the employee by username
        Employee employee = employeeLoginRepository.findByUsername(loginDetails.getUsername());

        // Check if employee exists and password matches
        if (employee != null && passwordEncoder.matches(loginDetails.getPassword(), employee.getPassword())) {
            // Return the entire employee object in the response
            return ResponseEntity.ok(employee);  // Return success response with the full employee object
        } else {
            // If login fails, return a custom response or error message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");  // Return failure response
        }
    }
}
