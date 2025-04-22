package com.etl.etl.entities.chat;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages", schema = "chat")
public class ChatMessages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long issueId;  // Relate message to a specific issue

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false, length = 2000) // Chat messages can be long
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public ChatMessages() {
        this.timestamp = LocalDateTime.now();
    }

    public ChatMessages(Long issueId, String sender, String message) {
        this.issueId = issueId;
        this.sender = sender;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
}
