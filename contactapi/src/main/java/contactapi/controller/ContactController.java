package contactapi.controller;

import contactapi.domain.Contact;
import contactapi.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static contactapi.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.*;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact){
        return ResponseEntity.created(URI.create("/contacts/userID")).body(contactService.createContact(contact));
    }

    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(@RequestParam(value = "page", defaultValue = "0") int page,
                                                     @RequestParam(value = "size", defaultValue = "10") int size){
        return ResponseEntity.ok().body(contactService.getAllContacts(page,size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContact(@PathVariable String id){
        return ResponseEntity.ok().body(contactService.getContact(id));
    }

    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file") MultipartFile file){
        return ResponseEntity.ok().body(contactService.uploadPhoto(id, file));
    }

    // JSON response will be sent back - we want to return an image below.
    @GetMapping(path = "/image/{filename}", produces = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE} )
    public byte[] getPhoto(@PathVariable String filename) throws IOException {
        return Files.readAllBytes(Paths.get( PHOTO_DIRECTORY + filename));
    }
}
