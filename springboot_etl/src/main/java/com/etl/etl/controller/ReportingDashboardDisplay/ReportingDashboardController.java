package com.etl.etl.controller.ReportingDashboardDisplay;

import com.etl.etl.Projection.ReportingDashboardProjection;
import com.etl.etl.service.ReportingDashboardDisplay.ReportingDashboardDisplay;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
public class ReportingDashboardController {

    @Autowired
    private ReportingDashboardDisplay service;

    // Fetch all reports
    @GetMapping(value = "/reports/dashboard", produces = "application/json")
    @ResponseBody
    public List<ReportingDashboardProjection> getReports() {
        // Fetch all reports using the service
        return service.getAllReports();
    }

    // Fetch filtered reports
    @GetMapping(value = "/reports/dashboard/filter", produces = "application/json")
    @ResponseBody
    public List<ReportingDashboardProjection> getFilteredReports(
            @RequestParam String env,
            @RequestParam String application,
            @RequestParam String currentState) {  // Changed initState to currentState
        // Fetch filtered reports using the service based on currentState
        return service.getFilteredReports(env, application, currentState);
    }
    
}