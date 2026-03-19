package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Cart;
import com.cart.ecom_proj.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/cart/{username}")
    public ResponseEntity<List<Cart>> getCart(@PathVariable String username) {
        return new ResponseEntity<>(cartService.getCartByUsername(username), HttpStatus.OK);
    }

    @PostMapping("/cart")
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {
        return new ResponseEntity<>(cartService.addToCart(cart), HttpStatus.CREATED);
    }

    @DeleteMapping("/cart/{username}/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable String username,
                                                 @PathVariable int productId) {
        cartService.removeFromCart(username, productId);
        return new ResponseEntity<>("Removed from cart!", HttpStatus.OK);
    }

    @DeleteMapping("/cart/clear/{username}")
    public ResponseEntity<String> clearCart(@PathVariable String username) {
        cartService.clearCart(username);
        return new ResponseEntity<>("Cart cleared!", HttpStatus.OK);
    }
}