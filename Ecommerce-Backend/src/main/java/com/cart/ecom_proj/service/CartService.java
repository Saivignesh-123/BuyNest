package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Cart;
import com.cart.ecom_proj.repo.CartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    public List<Cart> getCartByUsername(String username) {
        return cartRepo.findByUsername(username);
    }

    public Cart addToCart(Cart cart) {
        return cartRepo.save(cart);
    }

    @Transactional
    public void removeFromCart(String username, int productId) {
        cartRepo.deleteByUsernameAndProductId(username, productId);
    }

    public void clearCart(String username) {
        List<Cart> items = cartRepo.findByUsername(username);
        cartRepo.deleteAll(items);
    }
}