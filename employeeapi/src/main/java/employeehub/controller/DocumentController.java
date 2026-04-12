package employeehub.controller;

import employeehub.domain.Document;
import employeehub.domain.enums.DocumentType;
import employeehub.dto.ApiResponse;
import employeehub.repository.EmployeeRepository;
import employeehub.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Tag(name = "Documents")
public class DocumentController {

    private final DocumentService documentService;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/upload")
    @Operation(summary = "Upload a document")
    public ResponseEntity<ApiResponse<Document>> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam DocumentType type,
            @RequestParam("file") MultipartFile file) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(documentService.upload(employee.getId(), type, file)));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current employee's documents")
    public ResponseEntity<ApiResponse<List<Document>>> getMy(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(documentService.getMy(employee.getId())));
    }

    @GetMapping
    @Operation(summary = "Get all documents (HR_ADMIN only)")
    public ResponseEntity<ApiResponse<List<Document>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(documentService.getAll()));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download a document")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        byte[] data = documentService.download(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document\"")
                .body(data);
    }

    @PatchMapping("/{id}/verify")
    @Operation(summary = "Verify a document (HR only)")
    public ResponseEntity<ApiResponse<Document>> verify(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var verifier = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(documentService.verify(id, verifier.getId())));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject a document (HR only)")
    public ResponseEntity<ApiResponse<Document>> reject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var verifier = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(documentService.reject(id, verifier.getId())));
    }
}
