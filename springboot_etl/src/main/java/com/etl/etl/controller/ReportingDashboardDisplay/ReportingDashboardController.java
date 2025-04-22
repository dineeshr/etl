package com.etl.etl.controller.ReportingDashboardDisplay;

import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import com.etl.etl.service.ReportingDashboardDisplay.ReportingDashboardDisplay;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;


@Controller
public class ReportingDashboardController {

    @Autowired
    private ReportingDashboardDisplay service;

    // Fetch all reports (without projection)
    @GetMapping(value = "/reports/dashboard", produces = "application/json")
    @ResponseBody
    public List<ReportingDashboard> getReports() {
        // Fetch all reports using the service (now returns ReportingDashboard)
        return service.getAllReports();
    }

    // Fetch filtered reports (without projection)
    @GetMapping(value = "/reports/dashboard/filter", produces = "application/json")
    @ResponseBody
    public List<ReportingDashboard> getFilteredReports(
            @RequestParam String env,
            @RequestParam String application,
            @RequestParam String currentState) {
        // Fetch filtered reports using the service based on currentState (returns ReportingDashboard)
        return service.getFilteredReports(env, application, currentState);
    }
}
