// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import {sql} from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json()); //middleware to parse json body

//our custom simple middleware
// app.use((req, res, next) => {
//   console.log("Hey we hit a req, the method is ", req.method);
//   next();
// });

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

// app.get("/api/transactions", async (req, res) => {

// });

app.post("/api/transactions", async (req, res) => {
  //titl, amount, category, user_id
  try {
    const {title, amount, category, user_id} = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({message: "All fields are required"});
    }

    const transaction = await sql`
      INSERT INTO transactions (title, amount, category, user_id)
      VALUES (${title}, ${amount}, ${category}, ${user_id})
      RETURNING *
    `;
    console.log("Transaction created:", transaction);
    res
      .status(201)
      .json({
        message: "Transaction created successfully",
        transaction: transaction[0],
      });
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({message: "Server Error"});
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
