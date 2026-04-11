package contactapi.controller;

import contactapi.domain.Contact;
import contactapi.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import org.springframework.http.HttpStatus;
import java.nio.file.Files;
import java.nio.file.Paths;

import static contactapi.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.*;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
@Tag(name = "Contact Management", description = "APIs for managing contacts with CRUD operations and photo uploads")
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @Operation(summary = "Create a new contact", description = "Creates a new contact with the provided information. The contact ID is auto-generated.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Contact created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Contact.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Contact> createContact(
            @RequestBody
            @Schema(description = "Contact object to be created", example = "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"555-1234\"}")
            Contact contact){
        return ResponseEntity.created(URI.create("/contacts/userID")).body(contactService.createContact(contact));
    }

    @GetMapping
    @Operation(summary = "Get all contacts", description = "Retrieves a paginated list of all contacts. Default page size is 10.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contacts retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Page<Contact>> getContacts(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(value = "page", defaultValue = "0") int page,
            @Parameter(description = "Page size (number of records per page)", example = "10")
            @RequestParam(value = "size", defaultValue = "10") int size){
        return ResponseEntity.ok().body(contactService.getAllContacts(page,size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contact by ID", description = "Retrieves a specific contact by its unique identifier.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact found and returned",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Contact.class))),
            @ApiResponse(responseCode = "404", description = "Contact not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Contact> getContact(
            @Parameter(description = "Contact ID (UUID)", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable String id){
        return ResponseEntity.ok().body(contactService.getContact(id));
    }

    @PutMapping("/photo")
    @Operation(summary = "Upload contact photo", description = "Uploads a photo for a specific contact. Supports JPEG, PNG, and GIF formats. Max file size: 100MB.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Photo uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file format or contact ID not found"),
            @ApiResponse(responseCode = "413", description = "File too large"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<String> uploadPhoto(
            @Parameter(description = "Contact ID (UUID)", example = "550e8400-e29b-41d4-a716-446655440000")
            @RequestParam("id") String id,
            @Parameter(description = "Image file to upload (JPEG, PNG, or GIF)")
            @RequestParam("file") MultipartFile file){
        return ResponseEntity.ok().body(contactService.uploadPhoto(id, file));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete contact by ID", description = "Deletes a specific contact by its unique identifier.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Contact deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Contact not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteContact(
            @Parameter(description = "Contact ID (UUID)", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable String id) {
        contactService.deleteContact(contactService.getContact(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping(path = "/image/{filename}", produces = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE})
    @Operation(summary = "Get contact photo", description = "Retrieves a photo for a contact. Returns the image file in JPEG, PNG, or GIF format.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Photo retrieved successfully",
                    content = {@Content(mediaType = "image/jpeg"), @Content(mediaType = "image/png"), @Content(mediaType = "image/gif")}),
            @ApiResponse(responseCode = "404", description = "Photo not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<byte[]> getPhoto(
            @Parameter(description = "Photo filename", example = "contact_photo_123.jpg")
            @PathVariable String filename) {
        try {
            return ResponseEntity.ok().body(Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename)));
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
