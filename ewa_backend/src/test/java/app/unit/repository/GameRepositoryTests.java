package app.unit.repository;

import app.entity.Game;
import app.repository.GameRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GameRepositoryTests {

    @Autowired
    private GameRepository gameRepository;

    private Game testGame;

    @BeforeAll
    public void setUp() {
        Game testGame = new Game();
        testGame.setTitle("testGame");
        this.testGame = gameRepository.insert(testGame);
    }

    @AfterAll
    public void tearDown() {
        gameRepository.deleteById(testGame.getId());
    }

    @Test
    @Transactional
    public void insert() {
        Game game = new Game();
        Game confirmation = gameRepository.insert(game);
        assertEquals(game, confirmation);
        List<Game> games = gameRepository.findAll();
        assertTrue(games.contains(game));
    }

    @Test
    @Transactional
    public void findAll() {
        List<Game> games = gameRepository.findAll();
        assertEquals(testGame.getTitle(), games.get(0).getTitle());
        assertEquals(testGame.getId(), games.get(0).getId());
    }

    @Test
    public void findById() {
        Game foundById = gameRepository.findById(testGame.getId());
        assertEquals(testGame.getId(), foundById.getId());
    }

    @Test
    public void deleteById() {
        Game toBeDeleted = gameRepository.insert(new Game());
        gameRepository.deleteById(toBeDeleted.getId());
        List<Game> games = gameRepository.findAll();
        assertFalse(games.contains(toBeDeleted));
    }

    @Test
    @Transactional
    public void findOpenGames() {
        Game game1 = new Game();
        Game game2 = new Game();
        Game game3 = new Game();
        Game game4 = new Game();
        game1.setOpenStatus(false);
        game2.setOpenStatus(false);
        game3.setOpenStatus(true);
        game4.setOpenStatus(true);
        gameRepository.insert(game1);
        gameRepository.insert(game2);
        gameRepository.insert(game3);
        gameRepository.insert(game4);

        List<Game> games = gameRepository.findAllOpenGames();

        assertFalse(games.contains(game1));
        assertFalse(games.contains(game2));
        assertTrue(games.contains(game3));
        assertTrue(games.contains(game4));
    }

    @Test
    public void update() {
        testGame.setTitle("new Title");
        gameRepository.update(testGame);
        assertEquals("new Title", gameRepository.findById(testGame.getId()).getTitle());
    }

}
