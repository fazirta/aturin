import express from 'express';
import {
    getAllIncomeCategories,
    createIncomeCategory,
    deleteIncomeCategory,
    editIncomeCategory,
    getAllExpenseCategories,
    createExpenseCategory,
    deleteExpenseCategory,
    editExpenseCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/incomeCategories/:userId', getAllIncomeCategories);
router.get('/expenseCategories/:userId', getAllExpenseCategories);

router.post('/incomeCategory', createIncomeCategory);
router.put('/incomeCategory/:id', editIncomeCategory);
router.delete('/incomeCategory/:id', deleteIncomeCategory);

router.post('/expenseCategory', createExpenseCategory);
router.put('/expenseCategory/:id', editExpenseCategory);
router.delete('/expenseCategory/:id', deleteExpenseCategory);



export default router
