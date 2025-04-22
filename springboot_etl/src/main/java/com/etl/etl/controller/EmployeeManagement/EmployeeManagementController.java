package com.etl.etl.controller.EmployeeManagement;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.service.EmployeeManagementService.EmployeeManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeManagementController {

    @Autowired
    private EmployeeManagementService employeeService;

    // Get all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();  // Fetch all employees, ordered by name
    }

    // Add a new employee
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeService.addEmployee(employee);
    }

    // Delete an employee by ID
    @DeleteMapping("/{empId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long empId) {
        Employee deletedEmployee = employeeService.deleteEmployee(empId);  // Call service to delete the employee
        if (deletedEmployee != null) {
            // Return a response containing the empId and empName of the deleted employee
            String responseMessage = "Employee with ID: " + deletedEmployee.getEmpId() + " and Name: " + deletedEmployee.getEmpName() + " deleted successfully.";
            return ResponseEntity.ok(responseMessage);  // Return 200 OK with the message
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found.");  // Return 404 if employee is not found
        }
    }

    // Update an existing employee by ID
    @PutMapping("/{empId}")
    public Employee updateEmployee(@PathVariable Long empId, @RequestBody Employee updatedEmployee) {
        return employeeService.updateEmployee(empId, updatedEmployee);
    }

    @GetMapping("/{designation}")
    public List<Employee> getEmployeesByDesignation(@PathVariable String designation) {
        return employeeService.getEmployeesByDesignation(designation);
    }
}
