package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Cart;
import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.model.OrderItem;
import com.cart.ecom_proj.repo.CartRepo;
import com.cart.ecom_proj.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private CartRepo cartRepo;

    @Transactional
    public Order placeOrder(String username) {
        List<Cart> cartItems = cartRepo.findByUsername(username);

        if (cartItems.isEmpty())
            throw new RuntimeException("Cart is empty!");

        List<OrderItem> orderItems = cartItems.stream().map(cart -> {
            OrderItem item = new OrderItem();
            item.setProductId(cart.getProductId());
            item.setProductName(cart.getProductName());
            item.setPrice(cart.getPrice());
            item.setQuantity(cart.getQuantity());
            return item;
        }).collect(Collectors.toList());

        double total = cartItems.stream()
                .mapToDouble(c -> c.getPrice() * c.getQuantity())
                .sum();

        Order order = new Order();
        order.setUsername(username);
        order.setItems(orderItems);
        order.setTotalAmount(total);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepo.save(order);
        cartRepo.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getUserOrders(String username) {
        return orderRepo.findByUsername(username);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAllByOrderByOrderDateDesc();
    }

    public Order updateOrderStatus(int orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setStatus(status);
        return orderRepo.save(order);
    }

    public void cancelOrder(int orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setStatus("CANCELLED");
        orderRepo.save(order);
    }
}