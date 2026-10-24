
package com.example.expensetracker.service;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private Expense expense;

    @BeforeEach
    void setUp() {
        expense = new Expense();
        expense.setId(1L);
        expense.setDescription("Groceries");
        expense.setAmount(new BigDecimal("45.50"));
        expense.setCategory("Food");
        expense.setDate(LocalDate.of(2026, 10, 24));
    }

    // Test 1: Get all expenses
    @Test
    void testGetAllExpenses() {

        when(expenseRepository.findAll())
            .thenReturn(Arrays.asList(expense));

        List<Expense> expenses =
            expenseService.getAllExpenses();

        assertEquals(1, expenses.size());
        assertEquals("Groceries",
                     expenses.get(0).getDescription());

        verify(expenseRepository).findAll();
    }

    // Test 2: Get an expense by ID
    @Test
    void testGetExpenseById() {

        when(expenseRepository.findById(1L))
            .thenReturn(Optional.of(expense));

        Expense result =
            expenseService.getExpenseById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Groceries", result.getDescription());

        verify(expenseRepository).findById(1L);
    }

    // Test 3: Add an expense
    @Test
    void testAddExpense() {

        when(expenseRepository.save(any(Expense.class)))
            .thenAnswer(invocation -> {
                Expense saved = invocation.getArgument(0);
                saved.setId(1L);
                return saved;
            });

        Expense newExpense = new Expense();
        newExpense.setDescription("Gas");
        newExpense.setAmount(new BigDecimal("35.00"));
        newExpense.setCategory("Transportation");
        newExpense.setDate(LocalDate.of(2026, 10, 24));

        Expense savedExpense =
            expenseService.addExpense(newExpense);

        assertNotNull(savedExpense.getId());
        assertEquals("Gas", savedExpense.getDescription());
        assertEquals(new BigDecimal("35.00"),
                     savedExpense.getAmount());

        verify(expenseRepository).save(any(Expense.class));
    }

    // Test 4: Update an expense
    @Test
    void testUpdateExpense() {

        when(expenseRepository.findById(1L))
            .thenReturn(Optional.of(expense));

        when(expenseRepository.save(any(Expense.class)))
            .thenAnswer(invocation ->
                invocation.getArgument(0));

        Expense updatedExpense = new Expense();
        updatedExpense.setDescription("Weekly Groceries");
        updatedExpense.setAmount(new BigDecimal("60.00"));
        updatedExpense.setCategory("Food");
        updatedExpense.setDate(LocalDate.of(2026, 10, 24));

        Expense result =
            expenseService.updateExpense(1L, updatedExpense);

        assertEquals("Weekly Groceries",
                     result.getDescription());

        assertEquals(new BigDecimal("60.00"),
                     result.getAmount());

        verify(expenseRepository).save(expense);
    }

    // Test 5: Delete an expense
    @Test
    void testDeleteExpense() {

        when(expenseRepository.findById(1L))
            .thenReturn(Optional.of(expense));

        expenseService.deleteExpense(1L);

        verify(expenseRepository).delete(expense);
    }

    // Test 6: Expense not found
    @Test
    void testExpenseNotFound() {

        when(expenseRepository.findById(99L))
            .thenReturn(Optional.empty());

        assertThrows(
            ResponseStatusException.class,
            () -> expenseService.getExpenseById(99L)
        );

        verify(expenseRepository).findById(99L);
    }
}
