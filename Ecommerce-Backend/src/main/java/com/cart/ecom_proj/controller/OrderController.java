package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Place order — any logged in user
    @PostMapping("/orders/{username}")
    public ResponseEntity<?> placeOrder(@PathVariable String username) {
        try {
            Order order = orderService.placeOrder(username);
            return new ResponseEntity<>(order, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get my orders — any logged in user
    @GetMapping("/orders/{username}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String username) {
        return new ResponseEntity<>(orderService.getUserOrders(username), HttpStatus.OK);
    }

    // Get ALL orders — admin only
    @GetMapping("/admin/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
    }

    // Update order status — admin only
    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable int orderId,
            @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(orderId, status);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Cancel order
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable int orderId) {
        try {
            orderService.cancelOrder(orderId);
            return new ResponseEntity<>("Order cancelled!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}