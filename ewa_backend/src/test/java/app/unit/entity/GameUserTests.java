package app.unit.entity;

import app.entity.GameUser;
import app.entity.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class GameUserTests {

    @Test
    public void setUser() {
        GameUser gameUser = new GameUser();
        User user = new User();
        gameUser.setUser(user);
        assertEquals(user, gameUser.getUser());
        gameUser.setUser(null);
        assertNull(gameUser.getUser());
    }
}
