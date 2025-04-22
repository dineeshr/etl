package com.etl.etl.service.ReportingDashboardDisplay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import com.etl.etl.repository.ReportingDashboard.ReportingDashboardDisplayRepository;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportingDashboardDisplay {

    @Autowired
    private ReportingDashboardDisplayRepository repository;

    // Fetch all reports (without projection)
    public List<ReportingDashboard> getAllReports() {
        return repository.findAllReports();
    }

    // Fetch filtered reports using the custom query (without projection)
    public List<ReportingDashboard> getFilteredReports(String env, String application, String currentState) {
        return repository.findByEnvAndApplicationAndCurrentState(env, application, currentState);
    }

    @Transactional
    public boolean updateDetailScreenDetails(Long id, String handleBy, String failReason, String fixMethod, String currentState) {
        int rowsAffected = repository.updateDetailScreenDetails(id, handleBy, failReason, fixMethod, currentState);
        return rowsAffected > 0 ? true : false;
    }

    // Fetch filtered reports using the custom query (without projection)
    public List<ReportingDashboard> getFilteredReportData(String handleBy, String env, String application, String currentState, LocalDateTime fromDate, LocalDateTime toDate) {
        return repository.findByReportScreenFilter(handleBy, env, application, currentState, fromDate, toDate);
    }
}
