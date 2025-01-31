package com.etl.etl.service.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.etl.etl.repository.ReportingDashboard.ReportingDashboardCleanupRepository;

@Component
public class ReportingDashboardCleanup {

    private final ReportingDashboardCleanupRepository reportingDashboardCleanupRepository;

    public ReportingDashboardCleanup(ReportingDashboardCleanupRepository reportingDashboardCleanupRepository) {
        this.reportingDashboardCleanupRepository = reportingDashboardCleanupRepository;
    }

    // Cron expression to run the task at midnight on the 1st day of every month
    @Scheduled(cron = "0 0 0 1 * ?")
    public void truncateTable() {
        reportingDashboardCleanupRepository.truncateTable();
        System.out.println("Monthly cleanup executed successfully.");
    }
}