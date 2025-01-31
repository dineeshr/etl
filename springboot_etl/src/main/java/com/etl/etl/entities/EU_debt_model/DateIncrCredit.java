package com.etl.etl.entities.EU_debt_model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "EUDateIncrCredit")
@Table(name = "eu_date_incr_Credit", schema = "EU_debt_model")
public class DateIncrCredit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sno;

    @Column(name = "created_dt",nullable = false)
    private LocalDateTime createdDt;

    @Column(name = "prev",nullable = false)
    private LocalDateTime prev;

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

