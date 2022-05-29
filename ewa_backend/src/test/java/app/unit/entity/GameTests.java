package app.unit.entity;

import app.entity.Game;
import app.entity.GameUser;
import app.entity.User;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class GameTests {

    @Test
    public void setId() {
        Game game = new Game();
        game.setId(12);
        assertEquals(12, game.getId());
    }

    @Test
    public void setOpenStatus() {
        Game game = new Game();
        game.setOpenStatus(false);
        assertFalse(game.isOpenStatus());
    }

    @Test
    public void setTitle() {
        Game game = new Game();
        game.setTitle("Test title");
        assertEquals("Test title", game.getTitle());
    }

    @Test
    public void setUserId() {
        Game game = new Game();
        game.setUserId(12);
        assertEquals(12, game.getUserId());
    }

    @Test
    public void setCreatedBy() {
        Game game = new Game();
        game.setCreatedBy(new User("name", "pass"));
        assertEquals("name", game.getCreatedBy().getUsername());
    }

    @Test
    public void setUsers() {
        List<GameUser> users = new ArrayList<>();
        users.add(new GameUser());
        Game game = new Game();
        game.setUsers(users);
        assertEquals(1, game.getUsers().size());
    }
}
