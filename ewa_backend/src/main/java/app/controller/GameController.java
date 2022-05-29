package app.controller;

import app.entity.Game;
import app.entity.GameUser;
import app.entity.User;
import app.exceptions.PreConditionFailedException;
import app.exceptions.ResourceNotFoundException;
import app.repository.GameRepository;
import app.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Tag(name = "Game", description = "The Game endpoint")
@SecurityRequirement(name = "Tetris")
public class GameController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Get all Games", description = "Returns all Games")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Game.class))))})
    @GetMapping("/games")
    public ResponseEntity<List<Game>> getGames() {
        return ResponseEntity.ok(gameRepository.findAll());
    }

    @Operation(summary = "Get a Game by Id", description = "Returns a Game")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = Game.class)))
    })
    @GetMapping("/games/{id}")
    public ResponseEntity<Game> getGameById(
            @Parameter(description = "Id of the Game to be obtained", required = true) @PathVariable int id) throws ResourceNotFoundException {
        Game foundGame = gameRepository.findById(id);
        if (foundGame == null) {
            throw new ResourceNotFoundException("Given ID doesn't match any players");
        }
        return ResponseEntity.ok(foundGame);
    }

    @Operation(summary = "Add a new game to", description = "Returns a Game")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = Game.class))), @ApiResponse(responseCode = "404", description = "Given ID doesn't match any User")})
    @PostMapping("/games")
    public ResponseEntity<Game> addNewGame(@RequestBody Game game) throws Exception {

        User user = userRepository.findById(game.getUserId());

        if (user == null) {
            throw new ResourceNotFoundException("User of id " + game.getUserId() + " does not exist");
        }

        game.setCreatedBy(user);

        Game newGame = gameRepository.insert(game);
//
//        user.addGame(newGame, (long) 0);
//        userRepository.update(user);

        return ResponseEntity.ok(newGame);
    }

    @Operation(summary = "Add a User to an existing Game", description = "Return a Game after update")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = Game.class))),
            @ApiResponse(responseCode = "404", description = "Given ID doesn't match any User or Game"),
            @ApiResponse(responseCode = "400", description = "The Game already has 2 players or User is already in Game")})
    @PutMapping("/games/add_user")
    public ResponseEntity<Game> addUserToGame(@RequestBody GameUser gameUser) throws ResourceNotFoundException, PreConditionFailedException {

        User user = userRepository.findById(gameUser.getUserId());

        if (user == null) {
            throw new ResourceNotFoundException("User of id: " + gameUser.getUserId() + " does not exist.");
        }

        Game game = gameRepository.findById(gameUser.getGameId());

        if (game == null) {
            throw new ResourceNotFoundException("Game of id: " + gameUser.getGameId() + " does not exist.");
        }

        if (game.getUsers().size() >= 2) {
            throw new PreConditionFailedException("The game already has 2 players playing it.");
        }

        GameUser userFound = game.getUsers().stream().findFirst().orElse(null);

        if (userFound != null) {
            if (userFound.getUserId() == gameUser.getUserId()) {
                throw new PreConditionFailedException("User of id: " + gameUser.getUserId() + " is already in the game.");
            }
        }

        user.addGame(game, (long) 0);

        userRepository.insert(user);

        Game updatedGame = gameRepository.findById(gameUser.getGameId());
        if (updatedGame.getUsers().size() >= 2) {
            updatedGame.setOpenStatus(false);
            game = gameRepository.update(updatedGame);
        }

        return ResponseEntity.ok(game);
    }

    @Operation(summary = "Update the score of the GameUser", description = "Returns a Game after update")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = Game.class))),
            @ApiResponse(responseCode = "404", description = "Given ID doesn't match any User or Game")})
    @PutMapping("/games/")
    public ResponseEntity<Game> updateExistingGame(
            @Parameter(description = "Id of the Game to update", required = true) @RequestBody GameUser gameUser) throws Exception {

        User user = userRepository.findById(gameUser.getUserId());

        if (user == null) {
            throw new ResourceNotFoundException("User of id: " + gameUser.getUserId() + " does not exist.");
        }

        Game game = gameRepository.findById(gameUser.getGameId());

        if (game == null) {
            throw new ResourceNotFoundException("Game of id: " + gameUser.getGameId() + " does not exist.");
        }

        Optional<GameUser> gameUser1 = game.getUsers().stream().filter(a -> a.getUserId() == user.getId()).findFirst();
        if (gameUser1.isEmpty()) {
            throw new ResourceNotFoundException("This GameUser does not exist");
        }
        gameUser1.get().setScore(gameUser.getScore());
        userRepository.update(user);

        return ResponseEntity.ok(game);
    }

    @Operation(summary = "Delete Game", description = "Deletes the game by GameId")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = Game.class))),
            @ApiResponse(responseCode = "404", description = "Given ID doesn't match any Game")})
    @DeleteMapping("games/{id}")
    public void deleteGameById(
            @Parameter(description = "Id of the Game to be deleted", required = true) @PathVariable int id
    ) throws ResourceNotFoundException {

        Game game = gameRepository.findById(id);

        if (game == null) {
            throw new ResourceNotFoundException("Game of id: " + id + " does not exist.");
        }

        gameRepository.deleteById(id);
    }

    @Operation(summary = "Update to be finished", description = "Returns a Game after update")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = Game.class))),
            @ApiResponse(responseCode = "404", description = "Given game id doesn't match any games!")})
    @PutMapping("/games/finish/{id}")
    public ResponseEntity<Game> finishGame(@Parameter(description = "Id of the game that should be finished", required = true) @PathVariable int id) throws ResourceNotFoundException {

        Game foundGame = gameRepository.findById(id);

        if (foundGame == null) {
            throw new ResourceNotFoundException("Given ID doesn't match any games");
        }

        foundGame.setGameFinished(true);

        Game game = gameRepository.update(foundGame);

        return ResponseEntity.ok(game);
    }
}
