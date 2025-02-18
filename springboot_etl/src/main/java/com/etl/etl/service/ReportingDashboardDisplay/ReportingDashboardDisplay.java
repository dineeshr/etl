package com.etl.etl.service.ReportingDashboardDisplay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.etl.etl.repository.ReportingDashboard.ReportingDashboardDisplayRepository;
import com.etl.etl.repository.ReportingDashboard.Projection.ReportingDashboardProjection;

import java.util.List;

@Service
public class ReportingDashboardDisplay {

    @Autowired
    private ReportingDashboardDisplayRepository repository;

    // Fetch all reports using the custom query
    public List<ReportingDashboardProjection> getAllReports() {
        return repository.findAllProjectedBy();
    }

    // Fetch filtered reports using the custom query (using currentState instead of initState)
    public List<ReportingDashboardProjection> getFilteredReports(String env, String application, String currentState) {
        return repository.findByEnvAndApplicationAndCurrentState(env, application, currentState);
    }
}
