package app.controller;

import app.authentication.JWToken;
import app.authentication.JWTokenInfo;
import app.entity.User;
import app.models.LoginUser;
import app.repository.UserRepository;
import com.google.common.hash.Hashing;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Auth endpoint, Insecured for login and account creation")
public class AuthenticationController {

    @Autowired
    private JWToken tokenGenerator;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<User> createAccount(@RequestBody LoginUser loginUser) throws AuthenticationException {
        String username = loginUser.getUsername();
        String password = loginUser.getPassword();

        if (userRepository.findByUsername(username) != null) {
            throw new AuthenticationException("Username already exists");
        }

        String encodedPassword = Hashing.sha256()
                .hashString(password, StandardCharsets.UTF_8)
                .toString();

        User newUser = new User(username, encodedPassword);
        newUser = userRepository.insert(newUser);

        // Generate token for new user
        String token = tokenGenerator.encode(Long.toString(newUser.getId()));

        return ResponseEntity.accepted()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> logIn(@RequestBody LoginUser loginUser) throws AuthenticationException {
        String username = loginUser.getUsername();
        String password = loginUser.getPassword();

        // Check if username exists
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new AuthenticationException("Incorrect username and/or password " + loginUser.getUsername() + " - " + loginUser.getPassword());
        }

        // Check if password correct
        String encodedPassword = Hashing.sha256()
                .hashString(password, StandardCharsets.UTF_8)
                .toString();
        if (!user.validateEncodedPassword(encodedPassword)) {
            throw new AuthenticationException("Incorrect username and/or password");
        }

        // User checks out
        String token = tokenGenerator.encode(Long.toString(user.getId()));

        return ResponseEntity.accepted()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(user);
    }

    @PostMapping(path = "/refresh-token", produces = "application/json")
    public ResponseEntity<Void> refreshToken(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, app.exceptions.AuthenticationException {
        String encodedToken = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (encodedToken == null || encodedToken.contains("null")) {
            throw new AuthenticationException("Cannot authenticate user");
        }

        encodedToken = encodedToken.replace("Bearer ", "");
        JWTokenInfo tokenInfo = tokenGenerator.decode(encodedToken, true);

        if (!tokenGenerator.isRenewable(tokenInfo)) {
            throw new AuthenticationException("Token is not renewable");
        }

        String tokenString = tokenGenerator.encode(tokenInfo.getEmail());

        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenString).build();
    }

}
