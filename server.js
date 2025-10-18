import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expenseTracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// --- Mongoose Schemas ---

const expenseSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    email: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

const depositSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    email: { type: String, required: false },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
const Deposit = mongoose.model("Deposit", depositSchema);

// --- ROUTES ---

// ✅ EXPENSE CRUD ROUTES
app.get("/api/expense", async (req, res) => {
  try {
    const data = await Expense.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/api/expense", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: "Failed to create expense" });
  }
});

app.put("/api/expense/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Expense not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update expense" });
  }
});

app.delete("/api/expense/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete expense" });
  }
});

// ✅ DEPOSIT CRUD ROUTES
app.get("/api/deposit", async (req, res) => {
  try {
    const data = await Deposit.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deposits" });
  }
});

app.post("/api/deposit", async (req, res) => {
  try {
    const newDeposit = new Deposit(req.body);
    await newDeposit.save();
    res.status(201).json(newDeposit);
  } catch (err) {
    res.status(400).json({ error: "Failed to create deposit" });
  }
});

app.put("/api/deposit/:id", async (req, res) => {
  try {
    const updated = await Deposit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Deposit not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update deposit" });
  }
});

app.delete("/api/deposit/:id", async (req, res) => {
  try {
    const deleted = await Deposit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Deposit not found" });
    res.json({ message: "Deposit deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete deposit" });
  }
});

// --- Default Route ---
app.get("/", (req, res) => {
  res.send("✅ Expense & Deposit Tracker API is running...");
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
