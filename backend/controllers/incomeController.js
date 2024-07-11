import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getAllIncomeByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const incomes = await prisma.income.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                category: true
            }
        });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Error fetching incomes:", error);
        res.status(500).json({ error: "Error fetching incomes" });
    }
};

export const createIncome = async (req, res) => {
    const { no_pembelian, nama_pembeli, jumlah_pembelian, userId, categoryId } = req.body;

    try {
        const newIncome = await prisma.income.create({
            data: {
                no_pembelian,
                nama_pembeli,
                jumlah_pembelian: Number(jumlah_pembelian),
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
            }
        });
        res.status(201).json(newIncome);
    } catch (error) {
        console.error("Error creating income:", error);
        res.status(500).json({ error: "Error creating income" });
    }
};

export const editIncome = async (req, res) => {
    const { id } = req.params;
    const { no_pembelian, nama_pembeli, jumlah_pembelian, amount, userId, categoryId, createdAt } = req.body;

    try {
        const updatedIncome = await prisma.income.update({
            where: {
                id: parseInt(id),
            },
            data: {
                no_pembelian,
                nama_pembeli,
                jumlah_pembelian: Number(jumlah_pembelian),
                amount,
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
                createdAt : new Date(createdAt)
            }
        });
        res.status(200).json(updatedIncome);
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ error: "Error updating income" });
    }
};

export const deleteIncome = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.income.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        console.error("Error deleting income:", error);
        res.status(500).json({ error: "Error deleting income" });
    }
};

