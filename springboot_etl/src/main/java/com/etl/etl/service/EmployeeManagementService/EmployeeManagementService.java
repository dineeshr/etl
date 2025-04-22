package com.etl.etl.service.EmployeeManagementService;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeManagementService {

    @Autowired
    private EmployeeLoginRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Autowire PasswordEncoder

    // Fetch all employees, ordered by empName
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllByOrderByEmpNameAsc();  // Ordered by employee name
    }

    // Add a new employee
    public Employee addEmployee(Employee employee) {
        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(employee.getPassword());
        employee.setPassword(hashedPassword);
        return employeeRepository.save(employee);
    }

    // Delete an employee by ID
    public Employee deleteEmployee(Long empId) {
        // Check if the employee exists first
        Optional<Employee> employeeOptional = employeeRepository.findById(empId);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            
            // Delete the employee
            employeeRepository.deleteById(empId);
            
            // Return the deleted employee for response in the controller
            return employee;
        }
        // Return null if employee not found
        return null;
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

            // Only hash the password if it is updated
            if (!existingEmployee.getPassword().equals(updatedEmployee.getPassword())) {
                String hashedPassword = passwordEncoder.encode(updatedEmployee.getPassword());
                existingEmployee.setPassword(hashedPassword);
            }

            // Save the updated employee
            return employeeRepository.save(existingEmployee);
        } else {
            // Handle case where employee doesn't exist
            throw new RuntimeException("Employee not found with ID: " + empId);
        }
    }

    // Fetch employees by designation (e.g., "manager") to show in the dropdown
    public List<Employee> getEmployeesByDesignation(String designation) {
        return employeeRepository.findByEmpDesignation(designation); // Fetch only engineers
    }
}
