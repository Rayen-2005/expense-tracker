

const API_URL = "/api/expenses";

let editingExpenseId = null;
let categoryChart = null;
let allExpenses = [];

// Load application
document.addEventListener("DOMContentLoaded", () => {
    setTodayDate();
    loadExpenses();

    document.getElementById("expenseForm")
        .addEventListener("submit", saveExpense);

    document.getElementById("searchInput")
        .addEventListener("input", filterExpenses);

    document.getElementById("categoryFilter")
        .addEventListener("change", filterExpenses);
});


// Set current date
function setTodayDate() {
    const today = new Date();

    const date =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    document.getElementById("date").value = date;
}

// Load expenses
async function loadExpenses() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load expenses");
        }

        allExpenses = await response.json();

        updateDashboard(allExpenses);
		updateCategoryChart(allExpenses);
        filterExpenses();

    } catch (error) {
        console.error(error);
        alert("Could not load expenses.");
    }
}

// Display expenses in the table
function renderExpenses(expenses) {
    const tableBody =
        document.getElementById("expenseTableBody");

    tableBody.innerHTML = "";

    expenses.forEach(expense => {
        const row = document.createElement("tr");

        const values = [
            expense.description,
            "$" + Number(expense.amount).toFixed(2),
            expense.category,
            expense.date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";

        editButton.addEventListener("click", () => {
            editExpense(expense);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteExpense(expense.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        row.appendChild(actions);
        tableBody.appendChild(row);
    });
}

// Search and filter expenses

function filterExpenses() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    const search = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;

    const filteredExpenses = allExpenses.filter(expense => {
        const description = (expense.description || "")
            .toLowerCase();

        const matchesSearch = description.includes(search);

        const matchesCategory =
            category === "All" || expense.category === category;

        return matchesSearch && matchesCategory;
    });

    renderExpenses(filteredExpenses);
}


// Add or update expense
async function saveExpense(event) {
    event.preventDefault();

    const expense = {
        description: document.getElementById("description")
            .value.trim(),

        amount: Number(
            document.getElementById("amount").value
        ),

        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    if (!expense.description ||
        !Number.isFinite(expense.amount) ||
        expense.amount <= 0 ||
        !expense.date) {
        alert("Please enter valid expense information.");
        return;
    }

    const isEditing = editingExpenseId !== null;

    const url = isEditing
        ? `${API_URL}/${editingExpenseId}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        if (!response.ok) {
            throw new Error("Failed to save expense");
        }

        resetForm();
        await loadExpenses();

        alert(isEditing
            ? "Expense updated successfully!"
            : "Expense added successfully!");

    } catch (error) {
        console.error(error);
        alert("Could not save expense.");
    }
}

// Edit existing expense
function editExpense(expense) {
    editingExpenseId = expense.id;

    document.getElementById("description").value =
        expense.description;

    document.getElementById("amount").value =
        expense.amount;

    document.getElementById("category").value =
        expense.category;

    document.getElementById("date").value =
        expense.date;

    document.querySelector(
        "#expenseForm button[type='submit']"
    ).textContent = "Update Expense";

    document.getElementById("expenseForm")
        .scrollIntoView({ behavior: "smooth" });
}

// Delete expense
async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete expense");
        }

        if (editingExpenseId === id) {
            resetForm();
        }

        await loadExpenses();

    } catch (error) {
        console.error(error);
        alert("Could not delete expense.");
    }
}

// Reset expense form
function resetForm() {
    editingExpenseId = null;

    document.getElementById("expenseForm").reset();

    setTodayDate();

    document.querySelector(
        "#expenseForm button[type='submit']"
    ).textContent = "Add Expense";
}

// Calculate dashboard information
function updateDashboard(expenses) {

    const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    const today = new Date();

    const currentMonth =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0");

    const monthlyTotal = expenses
        .filter(expense =>
            expense.date &&
            expense.date.startsWith(currentMonth)
        )
        .reduce(
            (sum, expense) => sum + Number(expense.amount),
            0
        );

    const categoryTotals = {};

    expenses.forEach(expense => {
        const category = expense.category;

        categoryTotals[category] =
            (categoryTotals[category] || 0) +
            Number(expense.amount);
    });

    let topCategory = "None";
    let highestAmount = 0;

    for (const [category, amount]
        of Object.entries(categoryTotals)) {

        if (amount > highestAmount) {
            highestAmount = amount;
            topCategory = category;
        }
    }

    document.getElementById("totalExpenses").textContent =
        "$" + total.toFixed(2);

    document.getElementById("monthlyExpenses").textContent =
        "$" + monthlyTotal.toFixed(2);

    document.getElementById("transactionCount").textContent =
        expenses.length;

    document.getElementById("topCategory").textContent =
        topCategory;
}


function updateCategoryChart(expenses) {

    const canvas = document.getElementById("categoryChart");
    const emptyMessage =
        document.getElementById("chartEmptyMessage");

    if (!canvas || !emptyMessage) {
        console.error("Chart HTML elements not found.");
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded.");
        emptyMessage.textContent = "Unable to load spending chart.";
        emptyMessage.style.display = "block";
        return;
    }

    // Calculate spending by category
    const categoryTotals = {};

    expenses.forEach(expense => {
        const category = expense.category || "Other";
        const amount = Number(expense.amount) || 0;

        categoryTotals[category] =
            (categoryTotals[category] || 0) + amount;
    });

    const categories = Object.keys(categoryTotals)
        .filter(category => categoryTotals[category] > 0);

    const amounts = categories.map(
        category => categoryTotals[category]
    );

    // Remove the old chart
    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }

    // Handle empty database
    if (categories.length === 0) {
        canvas.style.display = "none";
        emptyMessage.style.display = "block";
        emptyMessage.textContent =
            "Add some expenses to see your spending breakdown.";
        return;
    }

    canvas.style.display = "block";
    emptyMessage.style.display = "none";

    // Chart colors
    const colors = {
        Food: "#4263eb",
        Transportation: "#20c997",
        Shopping: "#fab005",
        Entertainment: "#ae3ec9",
        Bills: "#fa5252",
        Other: "#868e96"
    };

    categoryChart = new Chart(canvas, {
        type: "doughnut",

        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: categories.map(
                    category => colors[category] || "#748ffc"
                ),
                borderWidth: 3,
                borderColor: "#ffffff"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ": $" +
                                Number(context.raw).toFixed(2);
                        }
                    }
                }
            }
        }
    });
}



