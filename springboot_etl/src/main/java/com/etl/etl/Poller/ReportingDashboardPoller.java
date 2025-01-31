package com.etl.etl.Poller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.etl.etl.repository.EmailSendRepository.MailIdRepository;
import com.etl.etl.repository.EmailSendRepository.ReportingDashboardFailedStatusRepository;
import com.etl.etl.service.EmailService.EmailSendService.EmailService;
import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import java.util.List;

@Component
public class ReportingDashboardPoller {

    @Autowired
    private ReportingDashboardFailedStatusRepository reportingDashboardFailedStatusRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MailIdRepository mailIdRepository;

    // Poll the database every minute
    @Scheduled(fixedRate = 1000)  // 
    public void pollForFailedRecords() {
        // Fetch all records with status "FAILED" and where email has not been SENT
        List<ReportingDashboard> failedRecords = reportingDashboardFailedStatusRepository.findByInitStateAndEmailSent("FAILED", "UNSENT");
        if (!failedRecords.isEmpty()) {
            for (ReportingDashboard dashboard : failedRecords) {
                // Fetch the email from the MailId table
                mailIdRepository.findById(1L).ifPresent(mailId -> {
                    String subject = "Error Report - " + dashboard.getApplication() +" "+dashboard.getEnv();
                    String body = "Dear User,\n\nA new failure has been recorded in the Reporting Dashboard:\n\n" +
                            "Application: " + dashboard.getApplication() + "\n\n" +
                            "Environment: " + dashboard.getEnv() + "\n\n" +
                            "Date/Time: " + dashboard.getDateTime() + "\n\n" +
                            "Status: " + dashboard.getInitState() + "\n\n" +
                            "Prev: " + dashboard.getPrev() + "\n\n" +
                            "Created_dt: "+dashboard.getCreatedDt()+"\n\nTake necessary action on the record mentioned above !";

                    // Send the email
                    emailService.sendEmail(mailId.getMailId(), subject, body);

                    // After sending the email, update the emailSent flag
                    dashboard.setEmailSent("SENT");
                    reportingDashboardFailedStatusRepository.save(dashboard); // Save the updated entity
                });
            }
        } else {
            System.out.println("No failed records found.");
        }
    }
}

