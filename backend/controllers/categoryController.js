import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllIncomeCategories = async (req, res) => {
  const { userId } = req.params;

  try {
    const categories = await prisma.incomeCategory.findMany({
      where: { userId: parseInt(userId) }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil kategori' });
  }
};

export const createIncomeCategory = async (req, res) => {
  try {
    const { nama, nama_barang, harga_barang, discount, userId } = req.body;
    const newCategory = await prisma.incomeCategory.create({
      data: {
        nama,
        nama_barang,
        harga_barang: Number(harga_barang),
        discount: Number(discount),
        userId: parseInt(userId)
      }
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat kategori' });
  }
};

export const deleteIncomeCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.incomeCategory.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
};

export const editIncomeCategory = async (req, res) => {
  const { id } = req.params;
  const { nama, nama_barang, harga_barang, discount, userId } = req.body;
  try {
    const newCategory = await prisma.incomeCategory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nama,
        nama_barang,
        harga_barang: Number(harga_barang),
        discount: Number(discount),
        userId: parseInt(userId)
      }
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengedit kategori' });
  }
};


export const getAllExpenseCategories = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const categories = await prisma.expenseCategory.findMany({
      where: { userId: userId }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil kategori' });
  }
};

export const createExpenseCategory = async (req, res) => {
  try {
    const { nama, deskripsi, userId } = req.body;
    const newCategory = await prisma.expenseCategory.create({
      data: { nama, deskripsi, userId: parseInt(userId) }
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat kategori' });
  }
};

export const deleteExpenseCategory = async (req, res) => {
  const {id} = req.params;
  try {
    await prisma.expenseCategory.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
};

export const editExpenseCategory = async (req, res) => {
  const {id} = req.params;
  const { nama, deskripsi } = req.body;
  try {
    const updatedCategory = await prisma.expenseCategory.update({
      where: { id: parseInt(id) },
      data: { nama, deskripsi }
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengedit kategori' });
  }
};