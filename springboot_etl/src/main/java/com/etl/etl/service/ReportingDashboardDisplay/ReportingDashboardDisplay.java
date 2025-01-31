package com.etl.etl.service.ReportingDashboardDisplay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import com.etl.etl.repository.ReportingDashboard.ReportingDashboardDisplayRepository;
import java.util.List;

@Service
public class ReportingDashboardDisplay {
    @Autowired
    private ReportingDashboardDisplayRepository repository;

    // Method to get all reports (no filtering)
    public List<ReportingDashboard> getAllReports() {
        return repository.findAll();
    }

    // Method to get filtered reports based on parameters
    public List<ReportingDashboard> getFilteredReports(String env, String application, String initState) {
        return repository.findByEnvAndApplicationAndInitState(env, application, initState);
    }
}