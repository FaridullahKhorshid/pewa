package app.authentication;

import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;

public class PasswordEncoder {
    public static String encode(String text) {
        return Hashing.sha256()
                .hashString(text, StandardCharsets.UTF_8)
                .toString();
    }
}
