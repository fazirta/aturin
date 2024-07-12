import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";
import { useAuth } from ".././AuthContext";
import Markdown from "react-markdown";
import { FaArrowUp, FaRobot, FaUser } from "react-icons/fa";

const AIConsultant = () => {
  const [incomes, setIncomes] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [prepared, setPrepared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [history, setHistory] = useState([
    {
      role: "model",
      parts:
        "Halo! Apa kabar? Ada yang ingin Anda tanyakan tentang data keuangan UMKM Anda?",
    },
  ]);
  const [input, setinput] = useState("");
  const [chat, setchat] = useState(null);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCgIg8cyyn1HK-97J8BfAFPszzaM2s0eb8"
  );
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);
  useEffect(() => {
    if (!chat) {
      setchat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 400,
          },
        })
      );
    }
  }, [chat, model]);

  async function chatting() {
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: input,
      },
      {
        role: "model",
        parts: "Thinking...",
      },
    ]);
    setinput("");
    try {
      if (!prepared) {
        await chat.sendMessage(`
      Saya adalah seorang pengusaha menjalankan usaha UMKM
      Tolong jawab chat saya berikutnya berdasarkan data:
      incomes: ${JSON.stringify(incomes)} 
      expenses: ${JSON.stringify(expenses)}
      products: ${JSON.stringify(products)}
      `);
        setPrepared(true);
      }
      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();
      setLoading(false);
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: text,
        });
        return newHistory;
      });
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: "Oops! Something went wrong.",
        });
        return newHistory;
      });
      setLoading(false);
      console.log(error);
      alert("Oops! Something went wrong.");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      chatting();
    }
  }

  useEffect(() => {
    const getSummary = async () => {
      let incomes;
      let expenses;
      let products;

      try {
        const [incomesResponse, expensesResponse, productsResponse] =
          await Promise.all([
            axios.get(`http://localhost:5000/incomes/user/${user.id}`, {
              params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            }),
            axios.get(`http://localhost:5000/expense/user/${user.id}`, {
              params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            }),
            axios.get(`http://localhost:5000/incomeCategories/${user.id}`, {
              params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            }),
          ]);

        incomes = incomesResponse.data;
        expenses = expensesResponse.data;
        products = productsResponse.data;

        const incomesWithTotal = incomes.map((income) => {
          const product = products.find((p) => p.id === income.categoryId);
          if (product) {
            const basePrice =
              product.harga_barang * parseInt(income.jumlah_pembelian);
            const discountAmount = basePrice * (product.discount / 100);
            const priceAfterDiscount = basePrice - discountAmount;
            const taxAmount = priceAfterDiscount * 0.025;
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

      const chatSession = genAI
        .getGenerativeModel({ model: "gemini-1.5-flash-latest" })
        .startChat({
          generationConfig: {
            maxOutputTokens: 400,
          },
        });
      const chatResultSummary = await chatSession?.sendMessage(`
        Saya adalah seorang pengusaha menjalankan usaha UMKM
        Tolong berikan ringkasan finansial untuk UMKM saya dalam satu kalimat tanpa awalan berdasarkan data:
        incomes: ${JSON.stringify(incomes)} 
        expenses: ${JSON.stringify(expenses)}
        products: ${JSON.stringify(products)}
        `);
      const chatResultSuggestion = await chatSession?.sendMessage(`
        Saya adalah seorang pengusaha menjalankan usaha UMKM
        Tolong berikan rekomendasi finansial untuk UMKM saya dalam satu kalimat tanpa awalan berdasarkan data:
        incomes: ${JSON.stringify(incomes)} 
        expenses: ${JSON.stringify(expenses)}
        products: ${JSON.stringify(products)}
        `);

      setSummary(chatResultSummary.response.text().toLowerCase());
      setSuggestion(chatResultSuggestion.response.text().toLowerCase());
    };
    getSummary();
  }, []);

  return (
    <div className="px-5 pt-10">
      <h1 className="dark:text-white font-bold text-2xl flex items-center gap-4">
        <FaRobot /> AI CONSULTANT
      </h1>
      <div className="flex justify-center gap-2">
        {summary && (
          <h2 className="mt-5 py-3 px-5 max-w-96 rounded-2xl bg-emerald-900">
            <h3 className="dark:text-white font-bold text-xl">Ringkasan</h3>
            <Markdown className="dark:text-white pt-2">
              {summary.charAt(0).toUpperCase() + summary.slice(1)}
            </Markdown>
          </h2>
        )}
        {suggestion && (
          <h2 className="mt-5 py-3 px-5 max-w-96 rounded-2xl bg-teal-900">
            <h3 className="dark:text-white font-bold text-xl">Saran</h3>
            <Markdown className="dark:text-white pt-2">
              {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
            </Markdown>
          </h2>
        )}
      </div>
      <div className="mx-auto mt-6 relative flex px-2 justify-center max-w-3xl h-[600px] w-full py-2  bg-gray-800 rounded-3xl shadow shadow-slate-900">
        <div className="flex gap-5 text-sm md:text-base flex-col px-5 pt-4 pb-16 w-full flex-grow flex-1 rounded-3xl shadow-md overflow-y-auto">
          {history.map((item, index) => (
            <div
              key={index}
              className={`rounded-3xl bg-gray-700 px-5 py-3 ${
                item.role === "model" ? "chat-start" : "chat-end"
              }`}
            >
              <div
                className={`dark:text-white pb-1 font-semibold opacity-80 flex items-center gap-2 ${
                  item.role === "model"
                    ? "dark:text-indigo-300"
                    : "dark:text-emerald-300"
                }`}
              >
                {item.role === "model" ? (
                  <>
                    <FaRobot /> ✨
                  </>
                ) : (
                  <>
                    <FaUser /> {user.nama}
                  </>
                )}
              </div>
              <div
                className={`dark:text-white font-medium ${
                  item.role === "model" ? "dark:text-white" : ""
                }`}
              >
                <Markdown>{item.parts}</Markdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute px-2 bottom-2 w-full flex gap-2">
          <textarea
            type="text"
            value={input}
            required
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={(e) => setinput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="outline-none bg-gray-600 text-white px-5 py-2 backdrop-blur w-full mx-auto bg-opacity-60 font-medium shadow rounded-3xl"
          />
          <button
            className={`text-white w-12 h-11 flex justify-center backdrop-blur bg-opacity-60 items-center bg-gray-600 rounded-3xl shadow-md ${
              loading ? "cursor-wait pointer-events-none" : ""
            }`}
            title="send"
            onClick={chatting}
          >
            {loading ? (
              <div class="relative inline-flex">
                <div class="w-4 h-4 bg-indigo-500 rounded-full"></div>
                <div class="w-4 h-4 bg-indigo-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                <div class="w-4 h-4 bg-indigo-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
              </div>
            ) : (
              <FaArrowUp />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
