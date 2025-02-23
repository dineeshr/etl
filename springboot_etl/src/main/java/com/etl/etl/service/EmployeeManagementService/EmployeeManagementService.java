package com.etl.etl.service.EmployeeManagementService;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeManagementService {

    @Autowired
    private EmployeeLoginRepository employeeRepository;

    // Fetch all employees, ordered by empName
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllByOrderByEmpNameAsc();  // Ordered by employee name
    }

    // Add a new employee
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // Delete an employee by ID
    public void deleteEmployee(Long empId) {
        employeeRepository.deleteById(empId);
    }

    // Update an existing employee by ID
    public Employee updateEmployee(Long empId, Employee updatedEmployee) {
        // Check if the employee exists in the repository
        Optional<Employee> existingEmployeeOptional = employeeRepository.findById(empId);
        if (existingEmployeeOptional.isPresent()) {
            Employee existingEmployee = existingEmployeeOptional.get();

            // Update employee details
            existingEmployee.setEmpName(updatedEmployee.getEmpName());
            existingEmployee.setEmpMail(updatedEmployee.getEmpMail());
            existingEmployee.setEmpMobileNumber(updatedEmployee.getEmpMobileNumber());
            existingEmployee.setEmpDesignation(updatedEmployee.getEmpDesignation());
            existingEmployee.setUsername(updatedEmployee.getUsername());
            existingEmployee.setPassword(updatedEmployee.getPassword());

            // Save the updated employee
            return employeeRepository.save(existingEmployee);
        } else {
            // Throw an exception or handle case if employee doesn't exist
            throw new RuntimeException("Employee not found with ID: " + empId);
        }
    }

    // Fetch employees by designation (e.g., "manager") to show in the dropdown
// In EmployeeManagementService.java
public List<Employee> getEngineers() {
    return employeeRepository.findByEmpDesignation("engineer"); // Fetch only engineers
}

}
