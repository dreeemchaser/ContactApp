package contactapi.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(name = "contacts")
@Schema(description = "Contact entity representing a person in the contact list")
public class Contact {

    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, nullable = false)
    @Schema(description = "Unique identifier (UUID) for the contact", example = "550e8400-e29b-41d4-a716-446655440000")
    private String id;

    @Schema(description = "Full name of the contact", example = "John Doe")
    private String name;

    @Schema(description = "Email address of the contact", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Job title or position", example = "Software Engineer")
    private String title;

    @Schema(description = "Phone number of the contact", example = "+1-555-123-4567")
    private String phone;

    @Schema(description = "Street address of the contact", example = "123 Main St, City, State 12345")
    private String address;

    @Schema(description = "Status of the contact (e.g., active, inactive)", example = "active")
    private String status;

    @Schema(description = "URL or filename of the contact's photo", example = "john_doe_photo.jpg")
    private String photoURL;
}
