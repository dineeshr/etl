package com.etl.etl.Poller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.etl.etl.repository.EmailSendRepository.EmailFetchRepository;
import com.etl.etl.repository.EmailSendRepository.ReportingDashboardFailedStatusRepository;
import com.etl.etl.service.EmailService.EmailSendService.EmailService;
import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import com.etl.etl.entities.login.Employee;
import java.util.List;

@Component
public class ReportingDashboardPoller {

    @Autowired
    private ReportingDashboardFailedStatusRepository reportingDashboardFailedStatusRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailFetchRepository employeeFetchRepository;  // Use EmployeeRepository

    // Poll the database every minute
    @Scheduled(fixedRate = 120000)  // Poll every second for testing; adjust for production
    public void pollForFailedRecords() {
        System.out.println("EmployeeFetchRepository: " + employeeFetchRepository);  // Debug log

        List<ReportingDashboard> failedRecords = reportingDashboardFailedStatusRepository.findByInitStateAndEmailSent("FAILED", "UNSENT");
        if (!failedRecords.isEmpty()) {
            // Fetch all employee emails from the Employee table
            List<Employee> employees = employeeFetchRepository.findAll();  // Get all employees

            // Check if employees list is not empty
            if (!employees.isEmpty()) {
                for (ReportingDashboard dashboard : failedRecords) {
                    // Construct the email subject and body
                    String subject = "Error Report - " + dashboard.getApplication() +" "+dashboard.getEnv();
                    String body = "Dear User,\n\nA new failure has been recorded in the Reporting Dashboard:\n\n" +
                            "Application: " + dashboard.getApplication() + "\n\n" +
                            "Environment: " + dashboard.getEnv() + "\n\n" +
                            "Date/Time: " + dashboard.getDateTime() + "\n\n" +
                            "Status: " + dashboard.getInitState() + "\n\n" +
                            "Prev: " + dashboard.getPrev() + "\n\n" +
                            "Created_dt: "+dashboard.getCreatedDt()+"\n\nTake necessary action on the record mentioned above!";

                    // Send the email to all employees
                    for (Employee employee : employees) {
                        emailService.sendEmail(employee.getEmpMail(), subject, body);
                    }

                    // After sending the email, update the emailSent flag to "SENT"
                    dashboard.setEmailSent("SENT");
                    reportingDashboardFailedStatusRepository.save(dashboard);  // Save the updated entity
                }
            } else {
                System.out.println("No employees found.");
            }
        } else {
            System.out.println("No failed records found.");
        }
    }
}
