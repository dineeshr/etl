package com.etl.etl.repository.LoginLogoutLog;

import com.etl.etl.entities.login.LoginLogoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoginLogoutLogRepository extends JpaRepository<LoginLogoutLog, Long> {

    @Query("SELECT l FROM LoginLogoutLog l WHERE l.employee.empId = :empId AND l.empAttendance = 'PRESENT' AND l.logoutTimestamp IS NULL ORDER BY l.loginTimestamp DESC")
    LoginLogoutLog findLatestLogByEmployee(Long empId);

    // Custom query to get a log entry for a given employee and specific date
    @Query("SELECT l FROM LoginLogoutLog l WHERE l.employee.empId = :empId AND CAST(l.loginTimestamp AS DATE) = :date ORDER BY l.loginTimestamp DESC")
    List<LoginLogoutLog> findLoginLogsByEmployeeAndDate(@Param("empId") Long empId, @Param("date") LocalDate date);
    
}
