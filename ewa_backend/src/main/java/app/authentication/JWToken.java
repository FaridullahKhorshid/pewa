package app.authentication;

import app.exceptions.AuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Calendar;
import java.util.Date;

@Component
public class JWToken {
    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.pass-phrase}")
    private String passphrase;

    @Value("${jwt.expiration-seconds}")
    private int expiration;

    @Value("${jwt.refresh-expiration-seconds}")
    private int refreshExpiration;

    public String encode(String id) {
        Key key = getKey(passphrase);

        return Jwts.builder()
                .claim(Claims.SUBJECT, id)
                .setIssuer(issuer)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public JWTokenInfo decode(String encodedToken, boolean expiration) throws AuthenticationException {
        try {
            Key key = getKey(passphrase);
            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(passphrase.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(encodedToken);

            Claims claims = jws.getBody();

            return generateTokenInfo(claims);
        } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException | SignatureException e) {
            throw new AuthenticationException(e.getMessage());
        } catch (ExpiredJwtException e) {
            if(!expiration) {
                throw new AuthenticationException(e.getMessage());
            } else {
                return generateTokenInfo(e.getClaims());
            }
        }
    }

    private JWTokenInfo generateTokenInfo(Claims claims) {
        JWTokenInfo info = new JWTokenInfo();
        info.setEmail(claims.get(Claims.SUBJECT).toString());
        info.setExpiration(claims.getExpiration());
        info.setIssuedAt(claims.getIssuedAt());
        return info;
    }

    private static Key getKey(String pass) {
        byte[] hmacKey = pass.getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(hmacKey, SignatureAlgorithm.HS256.getJcaName());
    }

    public boolean isRenewable(JWTokenInfo tokenInfo) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(tokenInfo.getIssuedAt());
        cal.add(Calendar.SECOND, refreshExpiration);
        return cal.getTime().compareTo(new Date()) > 0;
    }
}
