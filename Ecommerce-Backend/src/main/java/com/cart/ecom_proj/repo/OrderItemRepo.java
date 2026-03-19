package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {
}