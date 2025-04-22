package com.etl.etl.controller.DetailScreen;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.etl.etl.entities.chat.ChatMessages;
import com.etl.etl.service.ReportingDashboardDisplay.ReportingDashboardDisplay;
import com.etl.etl.service.chat.ChatMessageService;
import com.etl.etl.service.geminiai.GeminiAIService;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
public class DetailScreenController {

    @Autowired
    private ReportingDashboardDisplay reportingDashboardService;

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private GeminiAIService geminiAIService;

    @PostMapping(value = "/detail/update/{id}", produces = "application/json")
    public ResponseEntity<String> updateDetailScreenDetails(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String handleBy = requestBody.get("handleBy");
        String failReason = requestBody.get("failReason");
        String fixMethod = requestBody.get("fixMethod");
        String currentState = requestBody.get("currentState");
        boolean updated = reportingDashboardService.updateDetailScreenDetails(id, handleBy, failReason, fixMethod, currentState);
        chatMessageService.deleteMessagesByIssueId(id);
        if (updated) {
            return ResponseEntity.ok("Report updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to update report");
        }
    }

    // Get all messages for an issue
    @GetMapping("/chat/{issueId}")
    public ResponseEntity<List<ChatMessages>> getChatMessages(@PathVariable Long issueId) {
        return ResponseEntity.ok(chatMessageService.getMessagesByIssueId(issueId));
    }

    // Send a new message
    @PostMapping("/chat/send")
    public ResponseEntity<ChatMessages> sendMessage(@RequestBody Map<String, String> requestBody) {
        Long issueId = Long.parseLong(requestBody.get("issueId"));
        String sender = requestBody.get("sender");
        String message = requestBody.get("message");
        ChatMessages chatMessage = new ChatMessages(issueId, sender, message);
        ChatMessages savedMessage = chatMessageService.saveMessage(chatMessage);
        return ResponseEntity.ok(savedMessage);
    }

    @PostMapping("/ai/fix-suggestion")
    public ResponseEntity<String> getFixSuggestion(@RequestBody Map<String, String> requestBody) {
        String issueDescription = requestBody.get("issueDescription");
        if (issueDescription == null || issueDescription.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Issue description is required.");
        }
        String suggestion = geminiAIService.getFixSuggestion(issueDescription);
        return ResponseEntity.ok(suggestion);
    }
}
