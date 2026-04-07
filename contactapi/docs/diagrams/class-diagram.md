# Class Diagram

```mermaid
classDiagram
    class Application {
        +main(String[] args)
    }

    class Contact {
        -String id
        -String name
        -String email
        -String title
        -String phone
        -String address
        -String status
        -String photoURL
        +getId()
        +setId(String)
        +getName()
        +setName(String)
        +getEmail()
        +setEmail(String)
        +getTitle()
        +setTitle(String)
        +getPhone()
        +setPhone(String)
        +getAddress()
        +setAddress(String)
        +getStatus()
        +setStatus(String)
        +getPhotoURL()
        +setPhotoURL(String)
    }

    class ContactRepository {
        +findAll(Pageable) Page~Contact~
        +findById(String) Optional~Contact~
        +findByEmail(String) Optional~Contact~
        +save(Contact) Contact
        +deleteById(String)
        +existsById(String) boolean
        +count() long
    }

    class ContactService {
        -ContactRepository contactRepository
        +getAllContacts(int, int) Page~Contact~
        +getContact(String) Contact
        +createContact(Contact) Contact
        +deleteContact(Contact)
        +uploadPhoto(String, MultipartFile) String
    }

    class ContactController {
        -ContactService contactService
        +createContact(Contact) ResponseEntity~Contact~
        +getContacts(int, int) ResponseEntity~Page~Contact~~
        +getContact(String) ResponseEntity~Contact~
        +uploadPhoto(String, MultipartFile) ResponseEntity~String~
        +getPhoto(String) byte[]
    }

    Application --> ContactService
    ContactService --> ContactRepository
    ContactRepository --> Contact
    ContactController --> ContactService
```

This diagram shows the main classes and their relationships in the Contact API application. The application uses Spring Boot's dependency injection to wire the components together. The `Contact` entity is annotated with JPA annotations for database persistence, while the `ContactRepository` extends `JpaRepository` for data access operations. The `ContactService` contains business logic, and the `ContactController` handles HTTP requests and responses.