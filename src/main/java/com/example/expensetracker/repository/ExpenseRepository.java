package com.example.expensetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.expensetracker.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

}
