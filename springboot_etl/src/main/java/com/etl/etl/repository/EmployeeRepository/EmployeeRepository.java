package com.etl.etl.repository.EmployeeRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etl.etl.entities.login.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByUsernameAndPassword(String username, String password);
}
