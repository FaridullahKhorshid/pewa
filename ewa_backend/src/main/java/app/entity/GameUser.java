package app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.*;


@Entity(name = "GameUser")
@Table(name = "Game_User", uniqueConstraints = {@UniqueConstraint(name = "UniqueGameAndUser", columnNames = {"user_id", "game_id"})})
@NamedQuery(name = "find_all_game_users", query = " select t from GameUser t")
public class GameUser {

    @Schema(description = "Unique identifier of the GameUser.", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @Schema(description = "Many to One relationship with Entity User", required = true)
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    private User user;

    @JsonIgnore
    @Schema(description = "Many to One relationship with Entity Game", required = true)
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Game game;

    @Transient
    @Schema(description = "User id who want to play the game.", example = "1", required = true)
    private int userId;

    @Transient
    @Schema(description = "Game id that user wants to play", example = "1", required = true)
    private int gameId;

    @Schema(description = "Score of the User in the Game", example = "1000", required = true, defaultValue = "0")
    @Column(name = "score")
    private Long score;

    public GameUser() {
    }

    public GameUser(Game game, User user, Long score) {
        this.game = game;
        this.user = user;
        this.score = score;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        if (user != null) {
            this.setUserId(user.getId());
        }
        this.user = user;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        if (game != null) {
            this.setGameId(game.getId());
        }
        this.game = game;
    }

    public Long getScore() {
        return score;
    }

    public void setScore(Long score) {
        this.score = score;
    }

    public int getGameId() {
        return this.game != null ? this.game.getId() : this.gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public int getUserId() {
        return this.user != null ? this.user.getId() : this.userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
