package com.etl.etl.repository.ReportingDashboard;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


@Repository
public class ReportingDashboardCleanupRepository {

    private final JdbcTemplate jdbcTemplate;

    // Constructor to inject JdbcTemplate
    public ReportingDashboardCleanupRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Method to truncate the reporting_dashboard table
    public void truncateTable() {
        String sql = "TRUNCATE TABLE reporting_db.reporting_dashboard";
        jdbcTemplate.execute(sql);
        System.out.println("Table reporting_db.reporting_dashboard truncated.");
    }

}