package com.etl.etl.repository.ReportingDashboard;

import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface ReportingDashboardDisplayRepository extends JpaRepository<ReportingDashboard, Long> {

    // Custom query to fetch all fields without projection
    @Query("SELECT r FROM ReportingDashboard r")
    List<ReportingDashboard> findAllReports();

    // Custom query to fetch filtered reports with the given parameters without projection
    @Query("SELECT r FROM ReportingDashboard r WHERE r.env = :env AND r.application = :application AND r.currentState = :currentState")
    List<ReportingDashboard> findByEnvAndApplicationAndCurrentState(String env, String application, String currentState);

    @Modifying
    @Transactional
    @Query("UPDATE ReportingDashboard r SET r.handleBy = :handleBy, r.failReason = :failReason, r.fixMethod = :fixMethod, r.currentState = :currentState, r.solvedDt = CURRENT_TIMESTAMP WHERE r.id = :id")
    int updateDetailScreenDetails(@Param("id") Long id, @Param("handleBy") String handleBy, @Param("failReason") String failReason, @Param("fixMethod") String fixMethod, @Param("currentState") String currentState);

    @Query("SELECT r FROM ReportingDashboard r WHERE (:handleBy IS NULL OR r.handleBy = :handleBy) AND (:env IS NULL OR r.env = :env) AND (:application IS NULL OR r.application = :application) AND (:currentState IS NULL OR r.currentState = :currentState) AND r.dateTime BETWEEN :fromDate AND :toDate")
    List<ReportingDashboard> findByReportScreenFilter(String handleBy, String env, String application,
            String currentState, LocalDateTime fromDate, LocalDateTime toDate);
}
