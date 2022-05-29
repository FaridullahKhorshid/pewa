package app.repository;

import app.entity.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;


@Repository
@Transactional
public class UserRepository {

    @PersistenceContext
    EntityManager entityManager;

    public List<User> findAll() {
        return entityManager.createNamedQuery("find_all_users", User.class).getResultList();
    }

    public User findById(int id) {
        return entityManager.find(User.class, id);
    }

    public User findByUsername(String username) {
        List<User> test = entityManager.createQuery("SELECT u FROM User u WHERE u.username = '" + username + "'", User.class).getResultList();
        if (test.isEmpty()) return null;
        return test.get(0);
    }

    public User update(User user) {
        return entityManager.merge(user);
    }

    public User insert(User user) {
        return entityManager.merge(user);
    }

    public User deleteById(int id) {
        User user = findById(id);
        entityManager.remove(user);
        return user;
    }
}
