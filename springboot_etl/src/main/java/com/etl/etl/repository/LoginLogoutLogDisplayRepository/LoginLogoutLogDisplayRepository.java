package com.etl.etl.repository.LoginLogoutLogDisplayRepository;

import com.etl.etl.entities.login.LoginLogoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LoginLogoutLogDisplayRepository extends JpaRepository<LoginLogoutLog, Long> {

    // Custom query for filtering by empUsername, timestamp between fromDate and toDate, and empAttendance
    @Query("SELECT l FROM LoginLogoutLog l WHERE " +
           "(:empUsername IS NULL OR l.empUsername = :empUsername) AND " +
           "(:empAttendance IS NULL OR l.empAttendance = :empAttendance) AND " +
           "(:fromDate IS NULL OR l.timestamp >= :fromDate) AND " +  // No need to cast timestamp
           "(:toDate IS NULL OR l.timestamp <= :toDate)")              // No need to cast timestamp
    List<LoginLogoutLog> findByEmpUsernameAndTimestampBetweenAndEmpAttendance(
            @Param("empUsername") String empUsername,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("empAttendance") String empAttendance);

    // Custom query for filtering by empUsername and timestamp between fromDate and toDate
    @Query("SELECT l FROM LoginLogoutLog l WHERE " +
           "(:empUsername IS NULL OR l.empUsername = :empUsername) AND " +
           "(:fromDate IS NULL OR l.timestamp >= :fromDate) AND " +  // No need to cast timestamp
           "(:toDate IS NULL OR l.timestamp <= :toDate)")              // No need to cast timestamp
    List<LoginLogoutLog> findByEmpUsernameAndTimestampBetween(
            @Param("empUsername") String empUsername,
            @Param("fromDate") LocalDateTime fromDate,  
            @Param("toDate") LocalDateTime toDate);  

    // Custom query for filtering by empUsername and empAttendance
    @Query("SELECT l FROM LoginLogoutLog l WHERE " +
           "(:empUsername IS NULL OR l.empUsername = :empUsername) AND " +
           "(:empAttendance IS NULL OR l.empAttendance = :empAttendance)")
    List<LoginLogoutLog> findByEmpUsernameAndEmpAttendance(
            @Param("empUsername") String empUsername,
            @Param("empAttendance") String empAttendance);

    // Custom query for filtering by timestamp between fromDate and toDate, and empAttendance
    @Query("SELECT l FROM LoginLogoutLog l WHERE " +
           "(:fromDate IS NULL OR l.timestamp >= :fromDate) AND " +  // No need to cast timestamp
           "(:toDate IS NULL OR l.timestamp <= :toDate) AND " +      // No need to cast timestamp
           "(:empAttendance IS NULL OR l.empAttendance = :empAttendance)")
    List<LoginLogoutLog> findByTimestampBetweenAndEmpAttendance(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("empAttendance") String empAttendance);

    // Custom query for filtering by timestamp (date part)
    @Query("SELECT l FROM LoginLogoutLog l WHERE " +
           "(:fromDate IS NULL OR l.timestamp >= :fromDate) AND " +  // No need to cast timestamp
           "(:toDate IS NULL OR l.timestamp <= :toDate)")              // No need to cast timestamp
    List<LoginLogoutLog> findByTimestampBetween(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    // Custom query for filtering by empUsername
    List<LoginLogoutLog> findByEmpUsername(String empUsername);

    // Find logs by attendance
    List<LoginLogoutLog> findByEmpAttendance(String empAttendance);
}
