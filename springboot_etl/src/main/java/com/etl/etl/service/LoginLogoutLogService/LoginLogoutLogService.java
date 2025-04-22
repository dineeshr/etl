package com.etl.etl.service.LoginLogoutLogService;

import com.etl.etl.entities.login.Employee;
import com.etl.etl.entities.login.LoginLogoutLog;
import com.etl.etl.repository.LoginLogoutLog.LoginLogoutLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LoginLogoutLogService {

    @Autowired
    private LoginLogoutLogRepository loginLogoutLogRepository;

    // This method is called when a user logs in
    public void logLogin(Employee employee) {
        // Create a new log entry for every login (new record)
        saveLoginLogoutLog(employee, LocalDateTime.now(), null); // login timestamp and null logout timestamp
        
        // Ensure attendance is marked as 'PRESENT' only if there are no existing log entries for today
        updateAttendanceStatus(employee, "PRESENT");  // Mark attendance as PRESENT when logged in
    }

    // This method is called when a user logs out
    public void logLogout(Employee employee) {
        // Find the latest log entry for this employee based on emp_id
        LoginLogoutLog log = loginLogoutLogRepository.findLatestLogByEmployee(employee.getEmpId());

        if (log != null) {
            if (log.getEmpAttendance().toString().equals("PRESENT") && log.getLoginTimestamp() != null && log.getLogoutTimestamp() == null) {
                // Set the logout timestamp only if login timestamp exists and logout timestamp is still null
                log.setLogoutTimestamp(LocalDateTime.now());
                log.setTimestamp(LocalDateTime.now()); // Set timestamp when log is updated
                loginLogoutLogRepository.save(log);  // Update the logout timestamp and timestamp column in the log entry
        

                updateDurationAndType(log); // Calculate duration and set duration type
            } else {
                // Log a warning or return an error if logout timestamp already exists or if the login is not found
                System.out.println("Logout attempt failed for user: " + employee.getEmpId() + " - No active session found.");
            }
        } else {
            // If no log entry exists for the employee, log a message
            System.out.println("No login record found for user: " + employee.getEmpId());
        }
    }

    // Helper method to save login/logout log
    private void saveLoginLogoutLog(Employee employee, LocalDateTime loginTimestamp, LocalDateTime logoutTimestamp) {
        LoginLogoutLog log = new LoginLogoutLog();
        log.setEmployee(employee);
        log.setEmpUsername(employee.getUsername());  // Store employee username
        log.setLoginTimestamp(loginTimestamp);  // Store login timestamp
        log.setLogoutTimestamp(logoutTimestamp);  // Store logout timestamp (null during login)
        log.setTimestamp(LocalDateTime.now());  // Set timestamp when log is created
        
        // Save the log entry (only contains timestamp and action)
        loginLogoutLogRepository.save(log);
    }

    // Helper method to update attendance status (Present only for now)
    public void updateAttendanceStatus(Employee employee, String status) {
        // Find today's logs for this employee (based on the date)
        List<LoginLogoutLog> logs = loginLogoutLogRepository.findLoginLogsByEmployeeAndDate(employee.getEmpId(), LocalDate.now());
        
        // If no logs exist for today, create an entry with the specified attendance status
        if (logs == null || logs.isEmpty()) {
            // Create a new log entry with null login and logout timestamps
            saveLoginLogoutLog(employee, null, null);
            // Fetch the most recent log entry for today
            logs = loginLogoutLogRepository.findLoginLogsByEmployeeAndDate(employee.getEmpId(), LocalDate.now());
        }

        // Check if the log exists and update attendance status only if it's not already marked as 'PRESENT'
        LoginLogoutLog log = logs.get(0); // Get the first log (most recent one for today)
        if (!"PRESENT".equals(log.getEmpAttendance())) {
            log.setEmpAttendance(status); // Update attendance status
            log.setTimestamp(LocalDateTime.now()); // Update timestamp when status is updated
            loginLogoutLogRepository.save(log); // Save the updated log entry
        }
    }

    // Helper method to update the duration and duration_type after a logout
    public void updateDurationAndType(LoginLogoutLog log) {
        if (log.getLoginTimestamp() != null && log.getLogoutTimestamp() != null) {
            // Calculate the duration in seconds
            long durationInSeconds = ChronoUnit.SECONDS.between(log.getLoginTimestamp(), log.getLogoutTimestamp());
            long duration = durationInSeconds;
            String durationType = "seconds";  // Default duration type

            // Check for minutes, hours, and days (we calculate progressively)
            if (durationInSeconds >= 60) {
                duration = ChronoUnit.MINUTES.between(log.getLoginTimestamp(), log.getLogoutTimestamp());
                durationType = "minutes";

                // Check if duration is greater than or equal to 60 minutes
                if (duration >= 60) {
                    duration = ChronoUnit.HOURS.between(log.getLoginTimestamp(), log.getLogoutTimestamp());
                    durationType = "hours";

                    // Check if duration is greater than or equal to 24 hours
                    if (duration >= 24) {
                        duration = ChronoUnit.DAYS.between(log.getLoginTimestamp(), log.getLogoutTimestamp());
                        durationType = "days";
                    }
                }
            }

            // Set the calculated duration and duration type in the log entry
            log.setDuration(duration);
            log.setDurationType(durationType);

            // Set the timestamp to the current time when updating the log entry
            log.setTimestamp(LocalDateTime.now());  // Set the timestamp to current time (when the log is updated)

            // Save the updated log entry with the duration, duration type, and timestamp
            loginLogoutLogRepository.save(log);
        }
    }
}
