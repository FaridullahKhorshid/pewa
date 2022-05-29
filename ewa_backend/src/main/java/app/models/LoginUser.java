package app.models;

import io.swagger.v3.oas.annotations.media.Schema;

public class LoginUser {

    @Schema(description = "Unique username of the User.", example = "Hero420", required = true)
    private String username;

    @Schema(description = "Unique password of the User.", example = "Tesjdsj12@", required = true)
    private String password;

    public LoginUser(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
