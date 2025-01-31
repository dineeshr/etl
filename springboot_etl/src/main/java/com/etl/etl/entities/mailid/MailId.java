package com.etl.etl.entities.mailid;
import jakarta.persistence.*;

@Entity
@Table(name = "mailid", schema = "mailid")
public class MailId {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(name = "mailid",nullable = false)
private String mailid;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMailId() {
        return mailid;
    }

    public void setMailId(String mailid) {
        this.mailid = mailid;
    }



}

