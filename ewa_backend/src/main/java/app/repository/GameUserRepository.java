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
public class GameUserRepository {

    @PersistenceContext
    EntityManager entityManager;

    public List<GameUser> findAll() {
        TypedQuery<GameUser> namedQuery = entityManager.createNamedQuery("find_all_game_users", GameUser.class);
        return namedQuery.getResultList();
    }

    public GameUser findById(int id){
        return entityManager.find(GameUser.class, id);
    }

    public GameUser update(GameUser gameUser){
        return entityManager.merge(gameUser);
    }
    public GameUser insert(GameUser gameUser){
        return entityManager.merge(gameUser);
    }

    public void deleteById(int id){
        GameUser gameUser = findById(id);
        entityManager.remove(gameUser);
    }
}
