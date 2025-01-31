package com.etl.etl.repository.ReportingDashboard;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etl.etl.entities.Reporting_DB.ReportingDashboard;

import java.util.List;

public interface ReportingDashboardDisplayRepository extends JpaRepository<ReportingDashboard, Long> {

    List<ReportingDashboard> findByEnvAndApplicationAndInitState(String env, String application, String initState);
}
