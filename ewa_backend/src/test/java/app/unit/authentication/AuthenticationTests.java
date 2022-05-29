package app.unit.authentication;

import app.authentication.PasswordEncoder;
import app.controller.AuthenticationController;
import app.entity.User;
import app.models.LoginUser;
import app.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthenticationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    AuthenticationController authenticationController = new AuthenticationController();

    private User testUser1;
    LoginUser objectUser1;
    LoginUser objectUser2;


    @BeforeAll
    public void setup() {
        this.testUser1 = userRepository.insert(new User("testUser", PasswordEncoder.encode("testPassword")));
        objectUser1 = new LoginUser("username", "testUser");
        objectUser2 = new LoginUser("testUser", "testPassword");
        System.out.println(objectUser1);
    }

    @Test
    public void validateUserPassword() {
        String password = "password";
        String encoded = PasswordEncoder.encode(password);
        User user = new User("username", encoded);
        assertTrue(user.validateEncodedPassword(encoded));
    }

    @Test
    public void validateReceivingResponseEntityFromCreate() {
        String errorMessage = null;
        ResponseEntity answer = null;
        try {
            answer = authenticationController.createAccount(objectUser1);
        } catch (AuthenticationException e) {
            errorMessage =  e.getMessage();
        }
        assertTrue(answer.getStatusCode().value() == 202);
        assertFalse(answer.getHeaders().get("Authorization").isEmpty());
    }

    @Test
    public void validateReceivingResponseEntityWithBearerTokenOnLogin() {
        String errorMessage = null;
        ResponseEntity answer = null;
        try {
            answer = authenticationController.logIn(objectUser2);
        } catch (AuthenticationException e) {
            errorMessage =  e.getMessage();
        }
        assertTrue(answer.getStatusCode().value() == 202);
        assertFalse(answer.getHeaders().get("Authorization").isEmpty());
    }

    @Test
    public void validateCannotCreateAccountWithExistingUsername() {
        String errorMessage = null;
        try {
            authenticationController.createAccount(objectUser2);
        } catch (AuthenticationException e) {
            errorMessage =  e.getMessage();
        }
        assertTrue(errorMessage == "Username already exists");
    }

    @Test
    public void validateWrongLoginData() {
        String errorMessage = null;
        try {
            authenticationController.logIn(objectUser1);
        } catch (AuthenticationException e) {
            errorMessage =  e.getMessage();
        }
        assertTrue(errorMessage == "Incorrect username and/or password username - username");
    }

    @Test
    public void returnUserFromLogin() {
        String errorMessage = null;
        ResponseEntity answer = null;
        try {
            answer = authenticationController.logIn(objectUser2);
        } catch (AuthenticationException e) {
            errorMessage =  e.getMessage();
        }
        User returnedUser = (User) answer.getBody();
        assertTrue(returnedUser.equals(testUser1));
    }
}
