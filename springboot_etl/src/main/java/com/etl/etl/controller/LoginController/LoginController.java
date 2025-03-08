package com.etl.etl.controller.LoginController;

import com.etl.etl.Projection.EmployeeLoginProjection;
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
    public EmployeeLoginProjection authenticateUser(@RequestBody Employee loginDetails) {
        // Fetch the employee by username
        Employee employee = employeeLoginRepository.findByUsername(loginDetails.getUsername());

        // Check if employee exists and password matches
        if (employee != null && passwordEncoder.matches(loginDetails.getPassword(), employee.getPassword())) {
            // Return the employee projection with selected fields
            return new EmployeeLoginProjection() {
                @Override
                public Long getEmpId() {
                    return employee.getEmpId();
                }

                @Override
                public String getEmpName() {
                    return employee.getEmpName();
                }

                @Override
                public String getEmpDesignation() {
                    return employee.getEmpDesignation();
                }
            };
        } else {
            return null; // Invalid credentials
        }
    }
}
