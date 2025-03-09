package com.etl.etl.repository.ReportingDashboard;

import com.etl.etl.Projection.ReportingDashboardProjection;
import com.etl.etl.entities.Reporting_DB.ReportingDashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReportingDashboardDisplayRepository extends JpaRepository<ReportingDashboard, Long> {

    // Custom query to fetch specific fields (including currentState) using the projection
    @Query("SELECT r FROM ReportingDashboard r")
    List<ReportingDashboardProjection> findAllProjectedBy();

    // Custom query to fetch filtered reports with the given parameters, including currentState
    @Query("SELECT r.id AS id, r.application AS application, r.createdDt AS createdDt, r.dateTime AS dateTime, r.env AS env, r.prev AS prev, r.currentState AS currentState " +
           "FROM ReportingDashboard r WHERE r.env = :env AND r.application = :application AND r.currentState = :currentState")
    List<ReportingDashboardProjection> findByEnvAndApplicationAndCurrentState(String env, String application, String currentState);
}
