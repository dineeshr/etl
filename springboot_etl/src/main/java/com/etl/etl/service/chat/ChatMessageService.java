package com.etl.etl.service.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.etl.etl.entities.chat.ChatMessages;
import com.etl.etl.repository.chat.ChatMessageRepository;

import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public List<ChatMessages> getMessagesByIssueId(Long issueId) {
        return chatMessageRepository.findByIssueIdOrderByTimestampAsc(issueId);
    }

    @Transactional
    public ChatMessages saveMessage(ChatMessages chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    @Transactional
    public void deleteMessagesByIssueId(Long issueId) {
        chatMessageRepository.deleteByIssueId(issueId);
    }
}
