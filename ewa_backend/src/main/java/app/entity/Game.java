package app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "game")
@NamedQueries({
        @NamedQuery(name = "find_all_games",
                query = " select g from Game g"),
        @NamedQuery(name = "find_all_open_games",
                query = " select g from Game g where g.openStatus = true AND g.multiPlayer = true AND g.gameFinished = false")
})
public class Game {

    @Schema(description = "Unique identifier of the Game.", example = "1", required = true)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Transient
    @Schema(description = "User id who created the game.", example = "1", required = true)
    private int userId;

    @Schema(description = "Is the game joinable", example = "true", required = true, defaultValue = "1")
    private boolean openStatus;

    @JsonIgnore
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    private User createdBy;

    @NotBlank(message = "Game title is mandatory")
    @Schema(description = "Game title.", example = "Tetris game", required = true)
    private String title;

    @Schema(description = "Is a game multi player game or single player", example = "true", required = true, defaultValue = "true")
    private Boolean multiPlayer = true;

    @Schema(description = "Is game fished or not", example = "false", required = true, defaultValue = "false")
    private Boolean gameFinished = false;

    @Schema(description = "One to Many relationship with Entity GameUser.")
    @OneToMany(
            mappedBy = "game",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<GameUser> users = new ArrayList<>();

    public Game() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isOpenStatus() {
        return openStatus;
    }

    public void setOpenStatus(boolean openStatus) {
        this.openStatus = openStatus;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int createdBy) {
        this.userId = createdBy;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.setUserId(createdBy.getId());
        this.createdBy = createdBy;
    }

    public List<GameUser> getUsers() {
        return users;
    }

    public void setUsers(List<GameUser> users) {
        this.users = users;
    }

    public Boolean getMultiPlayer() {
        return multiPlayer;
    }

    public void setMultiPlayer(Boolean multiPlayer) {
        this.multiPlayer = multiPlayer;
    }

    public Boolean getGameFinished() {
        return gameFinished;
    }

    public void setGameFinished(Boolean gameFinished) {
        this.gameFinished = gameFinished;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", userId=" + userId +
                ", openStatus=" + openStatus +
                ", createdBy=" + createdBy +
                ", title='" + title + '\'' +
                ", multiPlayer='" + multiPlayer + '\'' +
                ", gameFinished='" + gameFinished + '\'' +
                ", users=" + users +
                '}';
    }
}
