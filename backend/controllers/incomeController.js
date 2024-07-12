import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllIncomeByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await prisma.income.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        user: true,
        items: {
          include: {
            category: true,
          },
        },
      },
    });
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ error: "Error fetching incomes" });
  }
};

export const createIncome = async (req, res) => {
  const { no_pembelian, nama_pembeli, userId, items } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const income = await prisma.income.create({
        data: {
          no_pembelian,
          nama_pembeli,
          total_pembelian: 0,
          user: {
            connect: { id: userId },
          },
        },
      });

      let totalPembelian = 0;
      let totalDiscount = 0;

      for (const item of items) {
        const { categoryId, jumlah_pembelian } = item;
        const category = await prisma.incomeCategory.findUnique({
          where: { id: parseInt(categoryId) },
        });

        if (!category) {
          throw new Error(`Category with id ${categoryId} not found`);
        }

        const subtotal = category.harga_barang * jumlah_pembelian;
        const itemDiscount = subtotal * (category.discount / 100);

        await prisma.incomeItem.create({
          data: {
            jumlah_pembelian: parseInt(jumlah_pembelian),
            harga_satuan: category.harga_barang,
            subtotal,
            discount: itemDiscount,
            income: {
              connect: { id: parseInt(income.id) },
            },
            category: {
              connect: { id: parseInt(categoryId) },
            },
          },
        });

        totalPembelian += subtotal;
        totalDiscount += itemDiscount;
      }

      await prisma.income.update({
        where: { id: income.id },
        data: {
          total_pembelian: totalPembelian - totalDiscount,
        },
      });

      return { incomeId: income.id, totalPembelian, totalDiscount };
    });

    res.status(201).json({
      message: "Income added successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding income", error: error.message });
  }
};

export const editIncome = async (req, res) => {
  const { id } = req.params;
  const { no_pembelian, nama_pembeli, total_pembelian, createdAt } =
    req.body;

  try {
    const updatedIncome = await prisma.income.update({
      where: {
        id: parseInt(id)
      },
      data: {
        no_pembelian,
        nama_pembeli,
        total_pembelian: Number(total_pembelian),
        createdAt: new Date(createdAt),
      },
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
    await prisma.incomeItem.deleteMany({
      where: {
        incomeId: parseInt(id),
      },
    });
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
