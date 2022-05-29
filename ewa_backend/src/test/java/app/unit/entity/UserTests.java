package app.unit.entity;

import app.entity.Game;
import app.entity.GameUser;
import app.entity.User;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserTests {

    @Test
    public void addGame() {
        User user = new User();
        Game game = new Game();
        user.addGame(game, 12L);

        List<GameUser> games = user.getGames();

        assertEquals(user.getId(), games.get(0).getUserId());
    }

    @Test
    public void removeGame() {
        User user = new User();
        Game game = new Game();
        Game game2 = new Game();
        user.addGame(game, 12L);
        user.addGame(game2, 36L);

        user.removeGame(game);

        List<GameUser> games = user.getGames();
        assertEquals(game2.getId(), games.get(0).getGameId());
    }
}
