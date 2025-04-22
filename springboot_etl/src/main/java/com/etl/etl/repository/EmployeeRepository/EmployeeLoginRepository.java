package com.etl.etl.repository.EmployeeRepository;

import com.etl.etl.entities.login.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EmployeeLoginRepository extends JpaRepository<Employee, Long> {
    
    // Define the method to find employee by username and password
    Employee findByUsernameAndPassword(String username, String password);
    Employee findByEmpId(Long empId);

    // Optional: You can add custom queries if needed in the future
    // For example, finding an employee by username
    Employee findByUsername(String username);

    // Get all employees sorted by name (ascending order)
    List<Employee> findAllByOrderByEmpNameAsc();

    // Fetch all engineers, sorted by name in ascending order
    List<Employee> findByEmpDesignation(String empDesignation);

    @Query("SELECT e FROM Employee e ORDER BY e.empName ASC")
    List<Employee> findAllUsernamesProjection();
}
