package com.etl.etl.controller.LoginController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeRepository;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public boolean authenticateUser(@RequestBody Employee loginDetails) {
        // Debugging log to check the received login details
        System.out.println("Received username: " + loginDetails.getUsername());
        System.out.println("Received password: " + loginDetails.getPassword());

        Employee employee = employeeRepository.findByUsernameAndPassword(
            loginDetails.getUsername(), loginDetails.getPassword());

        if (employee != null) {
            return true;  // Authentication successful
        } else {
            return false; // Invalid credentials
        }
    }
}

