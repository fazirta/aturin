import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from ".././AuthContext";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "chartjs-adapter-date-fns";
import { id } from "date-fns/locale";
import { parseISO, format } from "date-fns";
import { TimeScale } from "chart.js";
import EditIncomeModal from ".././income/EditIncomeModal";
import EditExpenseModal from ".././expense/EditExpenseModal";

import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const formatRupiah = (amount) => {
  if (amount == null) return "0";
  return amount.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const Home = () => {
  const [incomes, setIncomes] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [incomePage, setIncomePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const itemsPerPage = 3;
  const { user } = useAuth();

  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    return () => clearTimeout(timer);
  }, [incomes, expenses]);

  const fetchData = async () => {
    try {
      const [incomesResponse, expensesResponse, productsResponse] =
        await Promise.all([
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/incomes/user/${user.id}`,
            {
              params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/expense/user/${user.id}`,
            {
              params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/incomeCategories/${user.id}`,
            {
              params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            }
          ),
        ]);

      const incomes = incomesResponse.data;
      const expenses = expensesResponse.data;
      const products = productsResponse.data;

      const incomesWithTotal = incomes.map((income) => {
        const product = products.find((p) => p.id === income.categoryId);
        if (product) {
          const basePrice =
            product.harga_barang * parseInt(income.jumlah_pembelian);
          const discountAmount = basePrice * (product.discount / 100);
          const priceAfterDiscount = basePrice - discountAmount;
          const taxAmount = 0.025;
          const total = priceAfterDiscount - taxAmount;
          return { ...income, total, nama_barang: product.nama_barang };
        }
        return income;
      });

      setIncomes(incomesWithTotal);
      setExpenses(expenses);
      setProducts(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const incomeCategories = [
    ...new Set(
      incomes.flatMap((income) =>
        income.items.map((item) => item.category.nama_barang)
      )
    ),
  ];

  const expenseCategories = [
    ...new Set(expenses.map((expense) => expense.category.nama)),
  ];
  const allCategories = [
    ...new Set([...incomeCategories, ...expenseCategories]),
  ].sort();

  const getIncomeTotal = (category) => {
    return incomes
      .filter((income) => {
        return income.items.some(
          (item) => item.category.nama_barang === category
        );
      })
      .reduce((sum, income) => {
        return (
          sum +
          income.items
            .filter((item) => item.category.nama_barang === category)
            .reduce(
              (subtotal, item) =>
                subtotal +
                (item.category.harga_barang -
                  item.category.harga_barang * (item.category.discount / 100)) *
                item.jumlah_pembelian,
              0
            )
        );
      }, 0);
  };

  const getExpenseTotal = (category) => {
    return expenses
      .filter((expense) => expense.category.nama === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const chartColors = {
    income: "rgba(0, 255, 127, 0.7)",
    expense: "rgba(255, 99, 132, 0.7)",
    background: "#1f2937",
    text: "#e5e7eb",
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: chartColors.text,
        },
      },
      title: {
        display: true,
        text: "",
        color: chartColors.text,
      },
    },
    scales: {
      x: {
        ticks: {
          color: chartColors.text,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: chartColors.text,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const aggregateDataByDate = (data) => {
    const aggregated = {};
    data.forEach((item) => {
      const date = format(parseISO(item.createdAt), "yyyy-MM-dd");
      if (!aggregated[date]) {
        aggregated[date] = 0;
      }
      aggregated[date] += item.total_pembelian || item.amount;
    });
    return Object.entries(aggregated).map(([date, total]) => ({
      x: parseISO(date),
      y: total,
    }));
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PP",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
          color: chartColors.text,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
          color: chartColors.text,
        },
        ticks: {
          color: chartColors.text,
          callback: function (value) {
            return "Rp " + value.toLocaleString("id-ID");
          },
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += "Rp " + context.parsed.y.toLocaleString("id-ID");
            }
            return label;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const doughnutChartOptions = {
    ...chartOptions,
    cutout: "70%",
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "",
        color: "white",
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        ...chartOptions.scales.x,
        stacked: true,
      },
      y: {
        ...chartOptions.scales.y,
        stacked: false,
        beginAtZero: true,
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: "Income and Expense by Category",
        color: chartColors.text,
      },
    },
  };

  const lineChartData = {
    datasets: [
      {
        label: "Incomes",
        data: aggregateDataByDate(incomes).sort((a, b) => a.x - b.x),
        borderColor: chartColors.income,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Expenses",
        data: aggregateDataByDate(expenses).sort((a, b) => a.x - b.x),
        borderColor: chartColors.expense,
        backgroundColor: "rgba(221, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Incomes", "Expenses"],
    datasets: [
      {
        data: [
          Math.max(
            incomes.reduce(
              (sum, income) => sum + (income.total_pembelian || 0),
              0
            ),
            0.01
          ),
          Math.max(
            expenses.reduce((sum, expense) => sum + expense.amount, 0),
            0.01
          ),
        ],
        backgroundColor: [chartColors.income, chartColors.expense],
        hoverBackgroundColor: [
          `${chartColors.income}CC`,
          `${chartColors.expense}CC`,
        ],
      },
    ],
  };

  const barChartData = {
    labels: allCategories,
    datasets: [
      {
        label: "Incomes",
        data: allCategories.map((category) => getIncomeTotal(category)),
        backgroundColor: chartColors.income,
      },
      {
        label: "Expenses",
        data: allCategories.map((category) => getExpenseTotal(category)),
        backgroundColor: chartColors.expense,
      },
    ],
  };

  useEffect(() => {
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, []);

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleNextPage = (setter, currentPage, maxPage) => {
    if (currentPage < maxPage) {
      setter(currentPage + 1);
    }
  };

  const handlePrevPage = (setter, currentPage) => {
    if (currentPage > 1) {
      setter(currentPage - 1);
    }
  };

  const renderPagination = (currentPage, maxPage, prevHandler, nextHandler) => (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={prevHandler}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-300">{`Page ${currentPage} of ${maxPage}`}</span>
      <button
        onClick={nextHandler}
        disabled={currentPage === maxPage}
        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  const maxIncomePage = Math.ceil(incomes.length / itemsPerPage);
  const maxExpensePage = Math.ceil(expenses.length / itemsPerPage);

  const handleEditIncome = (income) => {
    setEditingIncome(income);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/income/${id}`);
        setIncomes(incomes.filter((income) => income.id !== id));
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/expense/${id}`
        );
        setExpenses(expenses.filter((expense) => expense.id !== id));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const handleUpdateIncome = (updatedIncome) => {
    const product = products.find((p) => p.id === updatedIncome.categoryId);
    if (product) {
      const basePrice =
        product.harga_barang * parseInt(updatedIncome.jumlah_pembelian);
      const discountAmount = basePrice * (product.discount / 100);
      const priceAfterDiscount = basePrice - discountAmount;
      const taxAmount = priceAfterDiscount * 0.025;
      const total = priceAfterDiscount - taxAmount;
      updatedIncome.total_pembelian = total;
    }

    const incomeWithCategory = {
      ...updatedIncome,
      category:
        products.find((p) => p.id === updatedIncome.categoryId) ||
        updatedIncome.category,
    };
    setIncomes(
      incomes.map((income) =>
        income.id === incomeWithCategory.id ? incomeWithCategory : income
      )
    );
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === updatedExpense.id
          ? { ...expense, ...updatedExpense }
          : expense
      )
    );
  };

  const generateReport = async () => {
    const sortedIncomes = [...incomes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    const workbook = new ExcelJS.Workbook();
  
    const createWorksheet = (name, headers, data) => {
      const worksheet = workbook.addWorksheet(name);
      
      const headerRow = worksheet.addRow(headers);
  
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D3D3D3' }
        };
        cell.font = { bold: true, size: 14 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });
  
      data.forEach(rowData => {
        const row = worksheet.addRow(rowData);
        row.eachCell((cell) => {
          cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
        });
      });
  
      worksheet.columns.forEach((column) => {
        column.width = 25;
      });
    };
  
    const incomeData = sortedIncomes.flatMap(income => 
      income.items.map(item => [
        income.nama_pembeli,
        item.category.nama_barang,
        item.jumlah_pembelian,
        item.category.harga_barang,
        item.category.discount,
        2.5,
        income.total_pembelian,
        new Date(income.createdAt).toLocaleDateString()
      ])
    );
    const incomeHeaders = ['Nama Pembeli', 'Nama Barang', 'Jumlah Pembelian', 'Harga Barang', 'Diskon (%)', "Tax", 'Total', 'Tanggal'];
    createWorksheet('Incomes', incomeHeaders, incomeData);
  
    const expenseData = sortedExpenses.map(expense => [
      expense.deskripsi,
      expense.amount,
      expense.category.nama,
      new Date(expense.createdAt).toLocaleDateString()
    ]);
    const expenseHeaders = ['Deskripsi', 'Jumlah', 'Kategori', 'Tanggal'];
    createWorksheet('Expenses', expenseHeaders, expenseData);
  
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, 'financial_report.xlsx');
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <style jsx>{`
        .chart-container {
          position: relative;
          height: 300px;
          width: 100%;
        }
        .doughnut-container {
          height: 400px;
          width: 100%;
        }
        .bar-container {
          height: 400px;
          width: 100%;
        }
      `}</style>

      <main>
        <div className="max-w-full mx-auto py-2 sm:px-6 lg:px-8">
          <div className="px-4 py-2 sm:px-0 flex flex-col gap-3">
            <div className="mt-4 text-end">
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                Download Report
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5" style={{ height: "400px" }}>
                  <h2 className="text-lg font-bold text-gray-100">
                    Income vs Expense Trend
                  </h2>
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-100">
                    Income vs Expense Overview
                  </h2>
                  <div className="doughnut-container">
                    <Doughnut
                      ref={doughnutChartRef}
                      data={doughnutChartData}
                      options={doughnutChartOptions}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 overflow-hidden shadow rounded-lg mt-3">
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-100">
                  Category Comparison
                </h2>
                <div className="bar-container">
                  <Bar
                    ref={barChartRef}
                    data={barChartData}
                    options={barChartOptions}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-bold text-gray-100">
                  Detail Transaksi
                </h3>
              </div>
              <div className="border-t border-gray-700">
                <dl>
                  <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-lg font-medium text-gray-400">
                      Total Pemasukan
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-gray-100 sm:mt-0 sm:col-span-2">
                      Rp.{" "}
                      {formatRupiah(
                        incomes.reduce(
                          (sum, income) => sum + income.total_pembelian,
                          0
                        )
                      )}
                    </dd>
                  </div>
                  <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-lg font-medium text-gray-400">
                      Total Pengeluaran
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-gray-100 sm:mt-0 sm:col-span-2">
                      Rp.{" "}
                      {formatRupiah(
                        expenses.reduce(
                          (sum, expense) => sum + expense.amount,
                          0
                        )
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-1 w-full mx-auto my-10 bg-gray-800 p-2 rounded-xl shadow shadow-gray-700">
              <div className="w-full m-2">
                <h2 className="text-xl font-bold mb-4 text-gray-100">
                  Semua Pemasukan
                </h2>
                <table className="w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-cyan-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 bg-cyan-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 bg-cyan-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 bg-cyan-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Edit
                      </th>
                      <th className="px-6 py-3 bg-cyan-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Hapus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {paginateData(incomes, incomePage).map((income) => (
                      <tr key={income.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {income.nama_pembeli !== null
                            ? income.nama_pembeli
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          Rp.{" "}
                          {formatRupiah(income.total_pembelian) !== null
                            ? formatRupiah(income.total_pembelian)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(income.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button
                            onClick={() => handleEditIncome(income)}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            Edit
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button
                            onClick={() => handleDeleteIncome(income.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination(
                  incomePage,
                  maxIncomePage,
                  () => handlePrevPage(setIncomePage, incomePage),
                  () => handleNextPage(setIncomePage, incomePage, maxIncomePage)
                )}
              </div>
              <div className="w-full m-2">
                <h2 className="text-xl font-bold mb-4 text-gray-100">
                  Semua Pengeluaran
                </h2>
                <table className="w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-red-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-3 bg-red-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 bg-red-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 bg-red-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 bg-red-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Edit
                      </th>
                      <th className="px-6 py-3 bg-red-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Hapus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {paginateData(expenses, expensePage).map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {expense.deskripsi !== null
                            ? expense.deskripsi
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          Rp.{" "}
                          {formatRupiah(expense.amount) !== null
                            ? formatRupiah(expense.amount)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {expense.category.nama !== null
                            ? expense.category.nama
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            Edit
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination(
                  expensePage,
                  maxExpensePage,
                  () => handlePrevPage(setExpensePage, expensePage),
                  () =>
                    handleNextPage(setExpensePage, expensePage, maxExpensePage)
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {editingIncome && (
        <EditIncomeModal
          income={editingIncome}
          onClose={() => setEditingIncome(null)}
          onUpdate={handleUpdateIncome}
        />
      )}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdate={handleUpdateExpense}
        />
      )}
    </div>
  );
};

export default Home;
