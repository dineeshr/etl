package com.etl.etl.service.EmployeeManagementService;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeManagementService {

    @Autowired
    private EmployeeLoginRepository employeeRepository;

    // Fetch all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Add a new employee
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // Delete an employee by ID
    public void deleteEmployee(Long empId) {
        employeeRepository.deleteById(empId);
    }
}

