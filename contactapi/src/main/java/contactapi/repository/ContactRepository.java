package contactapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import contactapi.domain.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {
    Optional<Contact> findByEmail(String email);
}
