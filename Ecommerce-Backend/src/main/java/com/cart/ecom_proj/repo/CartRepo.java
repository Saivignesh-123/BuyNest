package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepo extends JpaRepository<Cart, Integer> {
    List<Cart> findByUsername(String username);
    void deleteByUsernameAndProductId(String username, int productId);
}