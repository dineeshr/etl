package com.etl.etl.repository.EmployeeRepository;

import com.etl.etl.entities.login.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeLoginRepository extends JpaRepository<Employee, Long> {
    
    // Define the method to find employee by username and password
    Employee findByUsernameAndPassword(String username, String password);
}
