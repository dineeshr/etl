package com.etl.etl.repository.EmailSendRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etl.etl.entities.mailid.MailId;

public interface MailIdRepository extends JpaRepository<MailId, Long>{

}
