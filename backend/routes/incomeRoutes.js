import express from 'express';

import { getAllIncomeByUserId, createIncome, editIncome, deleteIncome } from '../controllers/incomeController.js';

const router = express.Router();

router.get('/incomes/user/:userId', getAllIncomeByUserId);
router.post('/incomes', createIncome);
router.put('/income/:id', editIncome);
router.delete('/income/:id', deleteIncome);

export default router