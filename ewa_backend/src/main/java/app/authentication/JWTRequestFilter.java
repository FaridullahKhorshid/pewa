package app.authentication;

import app.exceptions.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

@Component
public class JWTRequestFilter extends OncePerRequestFilter {

    /* All paths that do not start with /rest/auth/ are secure */
    private static final Set<String> SECURE_PATHS = Set.of("/user", "/games");

    @Autowired
    JWToken jwToken = new JWToken();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String path = request.getServletPath();
            if (HttpMethod.OPTIONS.matches(request.getMethod()) ||
                    SECURE_PATHS.stream().noneMatch(path::startsWith)) {
                filterChain.doFilter(request, response);
                return;
            }

            // get the encoded token string from the authorization request header
            String encodedToken = request.getHeader(HttpHeaders.AUTHORIZATION);

            if (encodedToken == null) {
                throw new AuthenticationException("Cannot authenticate user");
            }

            encodedToken = encodedToken.replace("Bearer ", "");
            JWTokenInfo tokenInfo = jwToken.decode(encodedToken, false);

            // Future chain members might use token info (see the example that tries to delete a user)
            request.setAttribute(tokenInfo.KEY,tokenInfo);

            filterChain.doFilter(request, response);

        } catch(AuthenticationException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication error");
        }
    }
}
