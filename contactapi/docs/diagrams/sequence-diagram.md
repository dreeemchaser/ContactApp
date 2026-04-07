# Sequence Diagrams

## Create Contact Flow

```mermaid
sequenceDiagram
    participant Client
    participant ContactController
    participant ContactService
    participant ContactRepository
    participant Database

    Client->>ContactController: POST /contacts (Contact data)
    ContactController->>ContactService: createContact(Contact)
    ContactService->>ContactRepository: save(Contact)
    ContactRepository->>Database: INSERT INTO contacts
    Database-->>ContactRepository: Contact saved
    ContactRepository-->>ContactService: Contact
    ContactService-->>ContactController: Contact
    ContactController-->>Client: 201 Created (Contact)
```

## Get Contacts Flow

```mermaid
sequenceDiagram
    participant Client
    participant ContactController
    participant ContactService
    participant ContactRepository
    participant Database

    Client->>ContactController: GET /contacts?page=0&size=10
    ContactController->>ContactService: getAllContacts(0, 10)
    ContactService->>ContactRepository: findAll(PageRequest)
    ContactRepository->>Database: SELECT * FROM contacts ORDER BY name LIMIT 10
    Database-->>ContactRepository: Contact list
    ContactRepository-->>ContactService: Page<Contact>
    ContactService-->>ContactController: Page<Contact>
    ContactController-->>Client: 200 OK (Contact page)
```

## Get Single Contact Flow

```mermaid
sequenceDiagram
    participant Client
    participant ContactController
    participant ContactService
    participant ContactRepository
    participant Database

    Client->>ContactController: GET /contacts/{id}
    ContactController->>ContactService: getContact(id)
    ContactService->>ContactRepository: findById(id)
    ContactRepository->>Database: SELECT * FROM contacts WHERE id = ?
    Database-->>ContactRepository: Contact or null
    ContactRepository-->>ContactService: Optional<Contact>
    alt Contact found
        ContactService-->>ContactController: Contact
        ContactController-->>Client: 200 OK (Contact)
    else Contact not found
        ContactService-->>ContactController: RuntimeException
        ContactController-->>Client: 404 Not Found
    end
```

## Upload Photo Flow

```mermaid
sequenceDiagram
    participant Client
    participant ContactController
    participant ContactService
    participant ContactRepository
    participant FileSystem
    participant Database

    Client->>ContactController: PUT /contacts/photo (id, file)
    ContactController->>ContactService: uploadPhoto(id, file)
    ContactService->>ContactRepository: findById(id)
    ContactRepository->>Database: SELECT * FROM contacts WHERE id = ?
    Database-->>ContactRepository: Contact
    ContactRepository-->>ContactService: Contact
    ContactService->>FileSystem: Save file to PHOTO_DIRECTORY
    FileSystem-->>ContactService: File saved
    ContactService->>ContactRepository: save(Contact with photoURL)
    ContactRepository->>Database: UPDATE contacts SET photoURL = ? WHERE id = ?
    Database-->>ContactRepository: Contact updated
    ContactRepository-->>ContactService: Contact
    ContactService-->>ContactController: photoURL
    ContactController-->>Client: 200 OK (photoURL)
```

## Get Photo Flow

```mermaid
sequenceDiagram
    participant Client
    participant ContactController
    participant FileSystem

    Client->>ContactController: GET /contacts/image/{filename}
    ContactController->>FileSystem: Read file from PHOTO_DIRECTORY/{filename}
    FileSystem-->>ContactController: Image bytes
    ContactController-->>Client: 200 OK (image/jpeg|png|gif)
```

These sequence diagrams illustrate the main interaction flows in the Contact API. The application follows a typical layered architecture with the controller handling HTTP requests, the service containing business logic, the repository managing data access, and external systems like the database and file system providing persistence.