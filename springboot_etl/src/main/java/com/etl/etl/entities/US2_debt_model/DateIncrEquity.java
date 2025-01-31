package com.etl.etl.entities.US2_debt_model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "US2DateIncrEquity")
@Table(name = "US2_date_incr_Equity", schema = "US2_debt_model")
public class DateIncrEquity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sno;

    @Column(name = "created_dt",nullable = false)
    private LocalDateTime createdDt;

    @Column(name = "prev",nullable = false)
    private LocalDateTime prev;

    // Getters and Setters

    public int getSno() {
        return sno;
    }

    public void setSno(int sno) {
        this.sno = sno;
    }

    public LocalDateTime getCreatedDt() {
        return createdDt;
    }

    public void setCreatedDt(LocalDateTime createdDt) {
        this.createdDt = createdDt;
    }

    public LocalDateTime getPrev() {
        return prev;
    }

    public void setPrev(LocalDateTime prev) {
        this.prev = prev;
    }
}

