package com.etl.etl.controller.ReportScreen;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import com.etl.etl.entities.login.Employee;
import com.etl.etl.service.EmployeeManagementService.EmployeeManagementService;
import com.etl.etl.service.ReportingDashboardDisplay.ReportingDashboardDisplay;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
public class ReportScreenController {

    @Autowired
    private EmployeeManagementService employeeService;

    @Autowired
    private ReportingDashboardDisplay reportingDashboardService;

    @GetMapping(value = "/reportscreen/details", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, List<String>>> getReportScreenDetails() {
        List<Employee> engineers = employeeService.getEmployeesByDesignation("engineer");
        List<ReportingDashboard> datas = reportingDashboardService.getAllReports();
        List<String> engineerList = engineers.stream().map(engineer -> engineer.getEmpName()).distinct().collect(Collectors.toList());
        List<String> environmentList = datas.stream().map(obj -> obj.getEnv()).distinct().collect(Collectors.toList());
        List<String> applicationList = datas.stream().map(obj -> obj.getApplication()).distinct().collect(Collectors.toList());
        List<String> currentStateList = datas.stream().map(obj -> obj.getCurrentState()).distinct().collect(Collectors.toList());
        Map<String, List<String>> responseMap = new HashMap<>();
        responseMap.put("engineerList", engineerList);
        responseMap.put("environmentList", environmentList);
        responseMap.put("applicationList", applicationList);
        responseMap.put("currentStateList", currentStateList);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping(value = "/reportscreen/pdfdata", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, List<ReportingDashboard>>> getFilteredReportData(@RequestParam(required = false) String handleBy, @RequestParam(required = false) String environment, @RequestParam(required = false) String application, @RequestParam(required = false) String status, @RequestParam String fromDate, @RequestParam String toDate) {
        // Convert date strings to LocalDateTime
        LocalDateTime fromDateTime = LocalDateTime.parse(fromDate);
        LocalDateTime toDateTime = LocalDateTime.parse(toDate);
        // Handle null values for optional filters
        List<ReportingDashboard> filteredReportData = reportingDashboardService.getFilteredReportData(
            handleBy != null && !handleBy.isEmpty() ? handleBy : null, 
            environment != null && !environment.isEmpty() ? environment : null,
            application != null && !application.isEmpty() ? application : null,
            status != null && !status.isEmpty() ? status : null, fromDateTime, toDateTime);
        // Prepare the response
        Map<String, List<ReportingDashboard>> responseMap = new HashMap<>();
        responseMap.put("filteredReportData", filteredReportData);
        return ResponseEntity.ok(responseMap);
    }
}
