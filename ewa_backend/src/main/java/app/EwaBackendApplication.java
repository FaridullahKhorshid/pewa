package app;

import app.authentication.PasswordEncoder;
import app.entity.User;
import app.repository.UserRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Ewa tetris Application API", version = "1.0", description = "This is a Spring Boot RESTful Api for EWA tetris."))
@SecurityScheme(name = "Tetris", description = "Get token from auth endpoint!", scheme = "Bearer", type = SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER)
public class EwaBackendApplication implements CommandLineRunner {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    UserRepository repository;

    public static void main(String[] args) {
        SpringApplication.run(EwaBackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("User id 1 -> {}", repository.insert(
                new User("Faridullah", PasswordEncoder.encode("pass")))
        );
        logger.info("User id 1 -> {}", repository.insert(
                new User("Thomas", PasswordEncoder.encode("pass")))
        );
        logger.info("User id 1 -> {}", repository.insert(
                new User("Bram", PasswordEncoder.encode("pass")))
        );
        logger.info("Found Users -> {}", repository.findAll());
    }

}
