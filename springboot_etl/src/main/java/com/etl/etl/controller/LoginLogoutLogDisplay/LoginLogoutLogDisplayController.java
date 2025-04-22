package com.etl.etl.controller.LoginLogoutLogDisplay;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.entities.login.LoginLogoutLog;
import com.etl.etl.service.LoginLogoutLogDisplayService.LoginLogoutLogDisplayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/login-logs")
public class LoginLogoutLogDisplayController {

    @Autowired
    private LoginLogoutLogDisplayService loginLogoutLogDisplayService;

    @GetMapping("/all")
    public List<LoginLogoutLog> getAllLogs() {
        return loginLogoutLogDisplayService.getAllLogs();  // Fetch all logs from the service
    }

    // Fetch LoginLogoutLog entries based on employee, date, and attendance
    @GetMapping("/filter")
    public List<LoginLogoutLog> getFilteredLogs(
            @RequestParam(required = false) String empUsername,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime toDate,
            @RequestParam(required = false) String empAttendance) {

        // Call the service method with the new fromDate and toDate parameters
        return loginLogoutLogDisplayService.getFilteredLogs(empUsername, fromDate, toDate, empAttendance);
    }
    // Get all employee usernames
    @GetMapping("/employees_username")
    public List<String> getAllEmployees() {
        List<Employee> projections = loginLogoutLogDisplayService.getAllEmployeeUsernames();
        return projections.stream()
                         .map(Employee::getUsername)  // Extract the username from each projection
                         .collect(Collectors.toList());
    }
}
