package com.etl.etl.repository.chat;

import com.etl.etl.entities.chat.ChatMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessages, Long> {
    List<ChatMessages> findByIssueIdOrderByTimestampAsc(Long issueId);

    void deleteByIssueId(Long issueId);
}
