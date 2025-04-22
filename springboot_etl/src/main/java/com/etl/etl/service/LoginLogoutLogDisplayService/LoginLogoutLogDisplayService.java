package com.etl.etl.service.LoginLogoutLogDisplayService;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.entities.login.LoginLogoutLog;
import com.etl.etl.repository.EmployeeRepository.EmployeeLoginRepository;
import com.etl.etl.repository.LoginLogoutLogDisplayRepository.LoginLogoutLogDisplayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LoginLogoutLogDisplayService {

    @Autowired
    private LoginLogoutLogDisplayRepository loginLogoutLogDisplayRepository;

    @Autowired
    private EmployeeLoginRepository employeeRepository;

    
    public List<LoginLogoutLog> getAllLogs() {
        return loginLogoutLogDisplayRepository.findAll(); // This will fetch all logs
    }
    // Filter logs by empUsername, date range (fromDate, toDate), and empAttendance
    public List<LoginLogoutLog> getFilteredLogs(String empUsername, LocalDateTime fromDate, LocalDateTime toDate, String empAttendance) {
        // Ensure fromDate and toDate are properly set
        LocalDateTime fromDateTimeStart = fromDate != null ? fromDate : null;
        LocalDateTime toDateTimeEnd = toDate != null ? toDate : null;
    
        // Case where empUsername, fromDate, toDate, and empAttendance are all provided
        if (empUsername != null && fromDateTimeStart != null && toDateTimeEnd != null && empAttendance != null) {
            return loginLogoutLogDisplayRepository.findByEmpUsernameAndTimestampBetweenAndEmpAttendance(
                    empUsername, fromDateTimeStart, toDateTimeEnd, empAttendance);
        }
        // Case where only empUsername and date range (fromDate to toDate) are provided
        else if (empUsername != null && fromDateTimeStart != null && toDateTimeEnd != null) {
            return loginLogoutLogDisplayRepository.findByEmpUsernameAndTimestampBetween(
                    empUsername, fromDateTimeStart, toDateTimeEnd);
        }
        // Case where only empUsername and empAttendance are provided
        else if (empUsername != null && empAttendance != null) {
            return loginLogoutLogDisplayRepository.findByEmpUsernameAndEmpAttendance(
                    empUsername, empAttendance);
        }
        // Case where only date range (fromDate to toDate) and empAttendance are provided
        else if (fromDateTimeStart != null && toDateTimeEnd != null && empAttendance != null) {
            return loginLogoutLogDisplayRepository.findByTimestampBetweenAndEmpAttendance(
                    fromDateTimeStart, toDateTimeEnd, empAttendance);
        }
        // Case where only date range (fromDate to toDate) is provided
        else if (fromDateTimeStart != null && toDateTimeEnd != null) {
            return loginLogoutLogDisplayRepository.findByTimestampBetween(fromDateTimeStart, toDateTimeEnd);
        }
        // Case where only empUsername is provided
        else if (empUsername != null) {
            return loginLogoutLogDisplayRepository.findByEmpUsername(empUsername);
        }
        // Case where only empAttendance is provided
        else if (empAttendance != null) {
            return loginLogoutLogDisplayRepository.findByEmpAttendance(empAttendance);
        }
        // Return an empty list if no parameters are provided
        else {
            return new ArrayList<>();
        }
    }

    // Get all employees (usernames)
    public List<Employee> getAllEmployeeUsernames() {
        return employeeRepository.findAllUsernamesProjection();  // Fetching only usernames using the projection
    }
}
