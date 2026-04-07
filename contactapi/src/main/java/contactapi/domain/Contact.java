package contactapi.domain;

import com.fasterxml.jackson.annotation.JsonInclude;

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
@JsonInclude(JsonInclude.Include.   NON_NULL)
@Table(name = "contacts")
public class Contact {

    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, nullable = false)
    private String id;

    private String name;
    private String email;
    private String title;
    private String phone;
    private String address;
    private String status;
    private String photoURL;
}
