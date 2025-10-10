// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {initDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimit.js";

import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start(); //start the cron job

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(rateLimiter); //apply rate limiter to all the routes
app.use(express.json()); //middleware to parse json body

const PORT = process.env.PORT || 5001;
 
app.get("/api/health", (req, res) => {
  res.status(200).json({status: "ok"});
});

app.use("/api/transactions", transactionsRoute);
// app.use("/api/products", transactionsRoute); //future route

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
