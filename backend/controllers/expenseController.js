import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getAllExpenseByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const expenses = await prisma.expense.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                category: true
            }
        });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expense:", error);
        res.status(500).json({ error: "Error fetching expenses" });
    }
};

export const createExpense = async (req, res) => {
    const { deskripsi, amount, userId, categoryId, createdAt } = req.body;

    try {
        const newExpense = await prisma.expense.create({
            data: {
                deskripsi,
                amount,
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
                createdAt: new Date(createdAt)
            }
        });
        res.status(201).json(newExpense);
    } catch (error) {
        console.error("Error creating Expense:", error);
        res.status(500).json({ error: "Error creating Expense" });
    }
};

export const editExpense = async (req, res) => {
    const { id } = req.params;
    const { deskripsi, amount, userId, categoryId, createdAt } = req.body;

    try {
        const updatedExpense = await prisma.expense.update({
            where: {
                id: parseInt(id),
            },
            data: {
                deskripsi,
                amount,
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
                createdAt : new Date(createdAt)
            }
        });
        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error("Error updating Expense:", error);
        res.status(500).json({ error: "Error updating Expense" });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.expense.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting Expense:", error);
        res.status(500).json({ error: "Error deleting Expense" });
    }
};
