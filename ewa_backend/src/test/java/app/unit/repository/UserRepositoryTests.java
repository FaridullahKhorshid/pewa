package app.unit.repository;

import app.authentication.PasswordEncoder;
import app.entity.User;
import app.repository.UserRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeAll
    public void setup() {
        this.testUser = userRepository.insert(new User("testUser", PasswordEncoder.encode("testPassword")));
    }

    @AfterAll
    public void teardown() {
        userRepository.deleteById(testUser.getId());
    }

    @Test
    public void insert() {
        User user = new User("name", PasswordEncoder.encode("Password"));
        User confirmation = userRepository.insert(user);
        assertEquals(user, confirmation);
        List<User> users = userRepository.findAll();
        assertTrue(users.contains(user));
    }

    @Test
    public void getUsers() {
        List<User> users = userRepository.findAll();
        assertTrue(users.contains(testUser));
    }

    @Test
    public void findById() {
        assertEquals(testUser.getId(), userRepository.findById(testUser.getId()).getId());
    }

    @Test
    public void findByUsername() {
        User foundByUsername = userRepository.findByUsername(testUser.getUsername());
        assertSame(testUser.getId(), foundByUsername.getId());
    }

    @Test
    public void deleteUser() {
        User toBeDeleted = userRepository.insert(new User("toBeDeleted", "testPassword"));
        userRepository.deleteById(toBeDeleted.getId());
        List<User> users = userRepository.findAll();
        assertFalse(users.contains(toBeDeleted));
    }

    @Test
    public void updateUser() {
        assertEquals("testUser", testUser.getUsername());
        testUser.setUsername("newUsername");
        User confirm = userRepository.update(testUser);
        assertEquals("newUsername", userRepository.findById(testUser.getId()).getUsername());
    }
}
