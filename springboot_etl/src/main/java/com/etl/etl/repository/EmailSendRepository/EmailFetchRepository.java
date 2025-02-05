package com.etl.etl.repository.EmailSendRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.etl.etl.entities.login.Employee;

public interface EmailFetchRepository extends JpaRepository<Employee, Long> { }
