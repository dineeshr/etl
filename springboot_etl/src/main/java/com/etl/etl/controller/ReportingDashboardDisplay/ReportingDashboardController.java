package com.etl.etl.controller.ReportingDashboardDisplay;

import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
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

    // This method will display the reports page with the filter form
    @GetMapping(value = "/reports", produces = "application/json")
    @ResponseBody
    public List<ReportingDashboard> getReports() {
        // Fetch all reports
        return service.getAllReports();
    }

    // This method will handle the form submission and fetch filtered data
    @GetMapping(value = "/reports/filter", produces = "application/json")
    @ResponseBody
    public List<ReportingDashboard> getFilteredReports(
            @RequestParam String env,
            @RequestParam String application,
            @RequestParam String initState) {

        // Fetch filtered reports based on the provided filters
        return service.getFilteredReports(env, application, initState);
    }
}
