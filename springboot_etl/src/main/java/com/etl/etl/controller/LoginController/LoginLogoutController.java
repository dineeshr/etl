package com.etl.etl.controller.LoginController;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import com.etl.etl.service.LoginLogoutLogService.LoginLogoutLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginLogoutController {

    @Autowired
    private EmployeeLoginRepository employeeLoginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LoginLogoutLogService loginLogoutService;

    // Handle user login
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Employee loginDetails) {
        // Check if the provided login details are valid
        Employee employee = employeeLoginRepository.findByUsername(loginDetails.getUsername());

        // If employee exists and the password matches
        if (employee != null && passwordEncoder.matches(loginDetails.getPassword(), employee.getPassword())) {
            // Log the login event
            System.out.println(employee);
            loginLogoutService.logLogin(employee);

            // Return the entire employee object as a response
            return ResponseEntity.ok(employee);
        } else {
            // Return error if login fails (invalid credentials)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // Handle user logout
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody Employee loginDetails) {
        // Fetch employee by empId (not by username)
        Employee employee = employeeLoginRepository.findByEmpId(loginDetails.getEmpId());  // Fetch by empId
    
        // If employee is found
        if (employee != null) {
            // Log the logout event
            loginLogoutService.logLogout(employee);
    
            // Return success message
            return ResponseEntity.ok("Logout successful");
        } else {
            // Return error if employee does not exist
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        }
    }
    
}
