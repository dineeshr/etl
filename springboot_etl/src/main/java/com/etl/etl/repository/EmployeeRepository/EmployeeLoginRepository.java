package com.etl.etl.repository.EmployeeRepository;

import com.etl.etl.entities.login.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeLoginRepository extends JpaRepository<Employee, Long> {
    
    // Define the method to find employee by username and password
    Employee findByUsernameAndPassword(String username, String password);

    // Optional: You can add custom queries if needed in the future
    // For example, finding an employee by username
    Employee findByUsername(String username);
}
