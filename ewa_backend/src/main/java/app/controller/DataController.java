package app.controller;

import app.entity.Game;
import app.entity.User;
import app.repository.GameRepository;
import app.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Tag(name = "Data", description = "Endpoint of Data that doesn't need authentication")
public class DataController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Get all open Games without login", description = "Returns all open Games for the lobby")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Game.class))))})
    @GetMapping("/active_games")
    public ResponseEntity<List<Game>> getOpenGames() {
        return ResponseEntity.ok(gameRepository.findAllOpenGames());
    }

    @Operation(summary = "Get all list of 4 top users", description = "Returns a list if users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = User.class))))})
    @GetMapping("/top_players/{limit}")
    public ResponseEntity<List<User>> getTopPlayer(@Parameter(description = "Limit of top player min 1", required = true) @PathVariable int limit) {

        List<User> users = userRepository.findAll().stream().filter(user -> user.getGames().stream().anyMatch(gu -> gu.getScore() > 0)).sorted((u1, u2) -> {
            int sum1 = u1.getGames().stream().mapToInt(o -> Math.toIntExact(o.getScore())).sum();
            int sum2 = u2.getGames().stream().mapToInt(o -> Math.toIntExact(o.getScore())).sum();
            return sum2 - sum1;
        }).collect(Collectors.toList());

        List<User> userList = (limit > users.size() ? users : users.subList(0, limit));

        return ResponseEntity.ok(userList);
    }

    @Operation(summary = "Get a list user history", description = "Returns a list of user games")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Game.class))))})
    @GetMapping("/game_history/{user_id}")
    public ResponseEntity<List<Game>> getUserGames(@Parameter(description = "Id of the User to be obtained", required = true) @PathVariable int user_id) {

        List<Game> games = gameRepository.findAll().stream().filter(g -> g.getUsers().stream().anyMatch(gu -> gu.getUserId() == user_id)).collect(Collectors.toList());

        return ResponseEntity.ok(games);
    }
}




