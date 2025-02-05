package com.etl.etl.controller.LoginController;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private EmployeeLoginRepository employeeLoginRepository;

    @PostMapping("/login")
    public Employee authenticateUser(@RequestBody Employee loginDetails) {
        // Fetch the employee by username and password (empDesignation is not needed here for login)
        Employee employee = employeeLoginRepository.findByUsernameAndPassword(
            loginDetails.getUsername(), loginDetails.getPassword());

        if (employee != null) {
            // Return the employee object including empDesignation if authentication is successful
            return employee;
        } else {
            return null; // Invalid credentials
        }
    }
}
