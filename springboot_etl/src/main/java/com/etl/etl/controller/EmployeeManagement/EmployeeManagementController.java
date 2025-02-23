package com.etl.etl.controller.EmployeeManagement;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.service.EmployeeManagementService.EmployeeManagementService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void deleteEmployee(@PathVariable Long empId) {
        employeeService.deleteEmployee(empId);
    }

    // Update an existing employee by ID
    @PutMapping("/{empId}")
    public Employee updateEmployee(@PathVariable Long empId, @RequestBody Employee updatedEmployee) {
        return employeeService.updateEmployee(empId, updatedEmployee);
    }

    // Get employees by designation (e.g., manager)
// In EmployeeManagementController.java
@GetMapping("/designation/engineer")
public List<Employee> getEngineers() {
    return employeeService.getEngineers();
}

}
