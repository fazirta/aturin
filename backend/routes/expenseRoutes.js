import express from 'express';

import { getAllExpenseByUserId, createExpense, editExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.get('/expense/user/:userId', getAllExpenseByUserId);
router.post('/expense', createExpense);
router.put('/expense/:id', editExpense);
router.delete('/expense/:id', deleteExpense);

export default router