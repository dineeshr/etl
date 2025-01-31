package com.etl.etl.repository.EmailFormRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.etl.etl.entities.mailid.MailId;


@Repository
public interface EmailFormRepository extends JpaRepository<MailId,Long>{

}
