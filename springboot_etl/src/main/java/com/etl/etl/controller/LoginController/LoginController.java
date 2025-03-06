package com.etl.etl.controller.LoginController;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Employee authenticateUser(@RequestBody Employee loginDetails) {
        // Fetch the employee by username
        Employee employee = employeeLoginRepository.findByUsername(loginDetails.getUsername());

        // Compare the raw password with the encoded password
        if (employee != null && passwordEncoder.matches(loginDetails.getPassword(), employee.getPassword())) {
            // Return the employee object if authentication is successful
            return employee;
        } else {
            return null; // Invalid credentials
        }
    }
}
