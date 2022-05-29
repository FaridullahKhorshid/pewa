package app.unit.repository;

import app.entity.GameUser;
import app.repository.GameUserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GameUserRepositoryTests {

    @Autowired
    private GameUserRepository gameUserRepository;

    private GameUser gameUser;

    @BeforeAll
    public void setUp() {
        this.gameUser = gameUserRepository.insert(new GameUser());
    }

    @Test
    @Transactional
    public void findAll() {
        List<GameUser> gameUsers = gameUserRepository.findAll();
        assertEquals(gameUser.getId(), gameUsers.get(0).getId());
    }

    @Test
    public void findById() {
        GameUser found = gameUserRepository.findById(gameUser.getId());
        assertEquals(gameUser.getId(), found.getId());
    }

    @Test
    public void update() {
        gameUser.setScore(12L);
        gameUserRepository.update(gameUser);
        GameUser found = gameUserRepository.findById(gameUser.getId());
        assertEquals(12L, found.getScore());
    }

    @Test
    public void insert() {
        GameUser newGU = new GameUser();
        newGU.setScore(99L);
        newGU = gameUserRepository.insert(newGU);
        GameUser found = gameUserRepository.findById(newGU.getId());
        assertEquals(newGU.getId(), found.getId());
        assertEquals(99L, found.getScore());
    }

    @Test
    public void deleteById() {
        GameUser newGU = new GameUser();
        newGU.setScore(99L);
        newGU = gameUserRepository.insert(newGU);
        gameUserRepository.deleteById(newGU.getId());
        List<GameUser> gameUsers = gameUserRepository.findAll();
        assertFalse(gameUsers.contains(newGU));
    }
}
