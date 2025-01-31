package com.etl.etl.service.EmailService.FormService;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etl.etl.entities.mailid.MailId;
import com.etl.etl.repository.EmailFormRepository.EmailFormRepository;

@Service
public class EmailFormService {
    @Autowired
    private EmailFormRepository mailIdRepository;

    // Method to either insert or update the email in the first row
    public void assignEmail(String senderEmail) {
        // Check if the first row exists
        System.out.println("assignEmail called********************************************");
        Optional<MailId> existingEmail = mailIdRepository.findById(1L);  // Assuming first row ID is 1

        if (existingEmail.isPresent()) {
            // If the first row exists, update the email
            MailId mailId = existingEmail.get();
            mailId.setMailId(senderEmail);  // Update the email
            mailIdRepository.save(mailId);  // Save the updated email
        } else {
            // If no row exists, create a new one with ID 1 (or auto-generate if using auto-increment)
            MailId mailId = new MailId();
            mailId.setMailId(senderEmail);  // Set the email
            mailIdRepository.save(mailId);  // Save the new email (this will create the first row)
        }
    }
}
