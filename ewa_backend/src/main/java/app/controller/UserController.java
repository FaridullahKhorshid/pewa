package app.controller;

import app.entity.User;
import app.exceptions.PreConditionFailedException;
import app.exceptions.ResourceNotFoundException;
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

import javax.validation.Valid;
import java.util.List;

@RestController
@Tag(name = "User", description = "The User endpoint")
@SecurityRequirement(name = "Tetris")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Get all Users", description = "Returns all Users")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Succes", content = @Content(array = @ArraySchema(schema = @Schema(implementation = User.class))))})
    @GetMapping("/users")
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }


    @Operation(summary = "Get a User by Id", description = "Returns one User")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Success", content = @Content(schema = @Schema(implementation = User.class))), @ApiResponse(responseCode = "404", description = "Given ID doesn't match any users")})
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "Id of the User to be Obtained") @PathVariable int id) throws ResourceNotFoundException {
        User foundUser = userRepository.findById(id);
        if (foundUser == null) {
            throw new ResourceNotFoundException("Given ID doesn't match any users");
        }
        return ResponseEntity.ok(foundUser);
    }

    @Operation(summary = "Add a new User", description = "")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succes",
                    content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "400", description = "ID is already in use!")})
    @PostMapping("/users")
    public ResponseEntity<User> addNewUser(
            @Parameter(description = "User to be added",
                    required = true, schema = @Schema(implementation = User.class))
            @Valid @RequestBody User user) throws PreConditionFailedException {
        if (userRepository.findById(user.getId()) != null) {
            throw new PreConditionFailedException("ID is already in use!");
        }
        userRepository.insert(user);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Update an existing User by Id", description = "Makes changes to the User")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succes",
                    content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "404", description = "Given ID doesn't match any Users"),
            @ApiResponse(responseCode = "400", description = "Given ID doesn't match the updated User's ID")})
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateExistingUser(
            @Parameter(description = "Id of the User to be updated", required = true) @PathVariable int id,
            @Parameter(description = "User to be used for update",
                    required = true, schema = @Schema(implementation = User.class))
            @Valid @RequestBody User user) throws Exception {
        if (id != user.getId()) {
            throw new PreConditionFailedException("Given ID doesn't match the updated User's ID");
        }
        if (userRepository.findById(id) == null) {
            throw new ResourceNotFoundException("Given ID doesn't match any Users");
        }
        userRepository.insert(user);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Deletes a User by Id", description = "")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succes"),
            @ApiResponse(responseCode = "404", description = "Given ID doesn't match any Users")})
    @DeleteMapping("users/{id}")
    public void deleteUserById(
            @Parameter(description = "Id of the User to be Deleted", required = true) @PathVariable int id) throws ResourceNotFoundException {
        if (userRepository.findById(id) == null) {
            throw new ResourceNotFoundException("Given ID doesn't match any Users");
        }
        userRepository.deleteById(id);
    }
}
