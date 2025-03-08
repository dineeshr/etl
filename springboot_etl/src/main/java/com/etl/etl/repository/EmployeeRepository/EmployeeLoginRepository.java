package com.etl.etl.repository.EmployeeRepository;

import com.etl.etl.entities.login.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeLoginRepository extends JpaRepository<Employee, Long> {
    
    // Optional: You can add custom queries if needed in the future
    // For example, finding an employee by username
    Employee findByUsername(String username);  // This method should work to find by username.

    // Get all employees sorted by name (ascending order)
    List<Employee> findAllByOrderByEmpNameAsc();

    // Fetch employees by their designation (filter by 'manager', 'engineer', etc.)
    List<Employee> findByEmpDesignation(String empDesignation);

        // Fetch all engineers, sorted by name in ascending order
        List<Employee> findAllByEmpDesignationOrderByEmpNameAsc(String empDesignation);
}
