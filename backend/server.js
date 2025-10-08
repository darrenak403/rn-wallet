// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import {sql} from "./config/db.js";
import rateLimiter from "./middleware/rateLimit.js";

dotenv.config();

const app = express();

app.use(rateLimiter); //apply rate limiter to all the routes
app.use(express.json()); //middleware to parse json body

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        create_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log("Database initalized successfully");
  } catch (error) {
    console.log("Error initializing database:", error);
    process.exit(1); //status code 1 means failure, 0 means success
  }
}

app.get("/", (req, res) => {
  res.send("Hello World 1232");
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const {userId} = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY create_at DESC
    `;

    res.status(200).json({
      status: "200",
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.log("Error getting the transactions", error);
    res.status(500).json({status: "500", message: "Internal Server Error"});
  }
});

app.post("/api/transactions", async (req, res) => {
  //titl, amount, category, user_id
  try {
    const {title, amount, category, user_id} = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res
        .status(400)
        .json({status: "400", message: "All fields are required"});
    }

    const transaction = await sql`
      INSERT INTO transactions (title, amount, category, user_id)
      VALUES (${title}, ${amount}, ${category}, ${user_id})
      RETURNING *
    `;
    console.log("Transaction created:", transaction);
    res.status(201).json({
      status: "201",
      message: "Transaction created successfully",
      transaction: transaction[0],
    });
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({status: "500", message: "Internal Server Error"});
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const {id} = req.params;

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: "404",
        message: "Transaction not found",
        transaction: [],
      });
    }

    res.status(200).json({
      status: "200",
      message: "Transaction deleted successfully",
      transaction: result[0],
    });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({status: "500", message: "Internal Server Error"});
  }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    //total balance
    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS balance
    FROM transactions
    WHERE user_id = ${userId}
    `;

    //money coming in
    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS income
    FROM transactions
    WHERE user_id = ${userId} AND amount > 0
    `;
    //money going out
    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS expenses
    FROM transactions
    WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      status: "200",
      message: "Summary fetched successfully",
      summary: {
        balance: balanceResult[0].balance,
        income: incomeResult[0].income,
        expenses: expenseResult[0].expenses,
      },
    });
  } catch (error) {
    console.log("Error getting the transactions summary", error);
    res.status(500).json({status: "500", message: "Internal Server Error"});
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
