package app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

@Entity(name = "User")
@Table(name = "User")
@NamedQuery(name = "find_all_users", query = " select u from User u")
public class User {

    @Schema(description = "Unique identifier of the User.", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    @Schema(description = "Unique username of the User.", example = "Hero420", required = true)
    private String username;

    @Column
    @NotBlank(message = "Game title is mandatory")
    @Schema(description = "Hashed password of the User.", example = "Hero420", required = true)
    private String hashedPw;

    @Schema(description = "One to Many relationship with Entity GameUser", required = false)
//    @JsonIgnore
    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "user",
            cascade = CascadeType.MERGE,
            orphanRemoval = true
    )
    private List<GameUser> games = new ArrayList<>();

    public User() {
    }

    public User(String username, String hashedPw) {
        this.username = username;
        this.hashedPw = hashedPw;
    }

    public boolean validateEncodedPassword(String givenPassword) {
        return Objects.equals(givenPassword, this.hashedPw);
    }

    public void addGame(Game game, Long score) {
        GameUser gameUser = new GameUser(game, this, score);
        games.add(gameUser);
        game.getUsers().add(gameUser);
    }

    public void removeGame(Game game) {
        for (Iterator<GameUser> iterator = games.iterator();
             iterator.hasNext(); ) {
            GameUser gameUser = iterator.next();

            if (gameUser.getUser().equals(this) &&
                    gameUser.getGame().equals(game)) {
                iterator.remove();
                gameUser.getGame().getUsers().remove(gameUser);
                gameUser.setUser(null);
                gameUser.setGame(null);
            }
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass())
            return false;

        User user = (User) o;
        return Objects.equals(username, user.username);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<GameUser> getGames() {
        return games;
    }
}
