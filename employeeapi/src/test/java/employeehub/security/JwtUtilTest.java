package employeehub.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    void generateToken_shouldContainEmailAsSubject() {
        String token = jwtUtil.generateToken("john@test.com", "EMPLOYEE");

        assertThat(jwtUtil.extractUsername(token)).isEqualTo("john@test.com");
    }

    @Test
    void generateToken_shouldContainRoleClaim() {
        String token = jwtUtil.generateToken("john@test.com", "HR_ADMIN");

        assertThat(jwtUtil.extractRole(token)).isEqualTo("HR_ADMIN");
    }

    @Test
    void isTokenValid_shouldReturnTrue_forMatchingUser() {
        String token = jwtUtil.generateToken("john@test.com", "EMPLOYEE");
        UserDetails userDetails = new User("john@test.com", "password", Collections.emptyList());

        assertThat(jwtUtil.isTokenValid(token, userDetails)).isTrue();
    }

    @Test
    void isTokenValid_shouldReturnFalse_forDifferentUser() {
        String token = jwtUtil.generateToken("john@test.com", "EMPLOYEE");
        UserDetails userDetails = new User("other@test.com", "password", Collections.emptyList());

        assertThat(jwtUtil.isTokenValid(token, userDetails)).isFalse();
    }

    @Test
    void isTokenValid_shouldThrow_forExpiredToken() {
        ReflectionTestUtils.setField(jwtUtil, "expiration", -1000L);
        String token = jwtUtil.generateToken("john@test.com", "EMPLOYEE");
        UserDetails userDetails = new User("john@test.com", "password", Collections.emptyList());

        assertThatThrownBy(() -> jwtUtil.isTokenValid(token, userDetails))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }

    @Test
    void extractUsername_shouldThrow_forMalformedToken() {
        assertThatThrownBy(() -> jwtUtil.extractUsername("not.a.valid.token"))
                .isInstanceOf(Exception.class);
    }
}
