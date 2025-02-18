package com.etl.etl.repository.ReportingDashboard.Projection;

import java.time.LocalDateTime;

public interface ReportingDashboardProjection {
    Long getId();
    String getApplication();
    LocalDateTime getCreatedDt();
    LocalDateTime getDateTime();
    String getEnv();
    LocalDateTime getPrev();
    String getCurrentState();  // Fetch currentState instead of initState
}
