package com.etl.etl.repository.EmailSendRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.etl.etl.entities.Reporting_DB.ReportingDashboard;
import java.util.List;

public interface ReportingDashboardFailedStatusRepository extends JpaRepository<ReportingDashboard, Long> {
    List<ReportingDashboard> findByInitStateAndEmailSent(String initState, String emailSent);
}
