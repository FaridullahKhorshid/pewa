package app.repository;

import app.entity.Game;
import app.entity.GameUser;
import app.entity.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;


@Repository
@Transactional
public class GameRepository {

    @PersistenceContext
    EntityManager entityManager;

    public List<Game> findAll() {
        TypedQuery<Game> namedQuery = entityManager.createNamedQuery("find_all_games", Game.class);
        return namedQuery.getResultList();
    }

    public List<Game> findAllOpenGames() {
        TypedQuery<Game> namedQuery = entityManager.createNamedQuery("find_all_open_games", Game.class);
        return namedQuery.getResultList();
    }

    public Game findById(int id){
        return entityManager.find(Game.class, id);
    }

    public Game update(Game game){
        return entityManager.merge(game);
    }

    public Game insert(Game game){
        entityManager.persist(game);
        entityManager.flush();
        return game;
    }

    public void deleteById(int id){
        Game game = findById(id);
        entityManager.remove(game);
    }

}
