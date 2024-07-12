import { FaArrowUp, FaRobot, FaUser } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import Markdown from "react-markdown";
import React from "react";
import axios from "axios";

const AiConsultant = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [suggestion, setSuggestion] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [starterQuestions, setStarterQuestions] = useState([
    {
      title: "Cara memasarkan produk",
      description: "untuk meningkatkan pendapatan",
      prompt:
        "Bagaimana cara memasarkan produk untuk meningkatkan pendapatan dari usaha UMKM saya?",
    },
    {
      title: "Mengatur pembagian modal awal",
      description: "untuk memulai bisnis dengan lancar",
      prompt:
        "Bagaimana cara terbaik untuk mengatur pembagian modal awal agar bisnis dapat dimulai dengan lancar?",
    },
    {
      title: "Membuat strategi perkembangan bisnis",
      description: "untuk mencapai pertumbuhan yang berkelanjutan",
      prompt:
        "Apa langkah-langkah utama dalam membuat strategi perkembangan bisnis untuk mencapai pertumbuhan yang berkelanjutan?",
    },
    {
      title: "Analisis risiko bisnis",
      description: "untuk mengidentifikasi dan mengelola risiko",
      prompt:
        "Bagaimana melakukan analisis risiko bisnis untuk mengidentifikasi dan mengelola risiko yang dapat mempengaruhi pendapatan?",
    },
  ]);
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([
    {
      role: "model",
      parts:
        "Halo saya Finny! Ada yang ingin Anda tanyakan tentang data keuangan UMKM Anda?",
    },
  ]);
  const [input, setinput] = useState("");
  const [chat, setchat] = useState(null);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
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
    startQuestion(null);
  }

  async function startQuestion(prompt) {
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: prompt ? prompt : input,
      },
      {
        role: "model",
        parts: "Menjawab...",
      },
    ]);
    setinput("");
    try {
      if (!prepared) {
        await chat.sendMessage(`
      Kamu adalah sebuah bot AI Consultant yang dibuat untuk membantu pengusaha UMKM
      Saya adalah seorang pengusaha menjalankan usaha UMKM
      Tolong jawab chat saya berikutnya berdasarkan data:
      incomes: ${JSON.stringify(incomes)} 
      expenses: ${JSON.stringify(expenses)}
      products: ${JSON.stringify(products)}
      `);
        setPrepared(true);
      }
      const result = await chat.sendMessage(prompt ? prompt : input);
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
          parts: "Terjadi kesalahan. Mohon coba lagi nanti.",
        });
        return newHistory;
      });
      setLoading(false);
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

      const chatSession = model.startChat({
        generationConfig: {
          maxOutputTokens: 400,
        },
      });
      const chatResultSummary = await chatSession?.sendMessage(`
        Saya adalah seorang pengusaha menjalankan usaha UMKM
        Tolong berikan ringkasan finansial untuk UMKM saya dalam satu kalimat singkat tanpa awalan berdasarkan data:
        incomes: ${JSON.stringify(incomes)} 
        expenses: ${JSON.stringify(expenses)}
        products: ${JSON.stringify(products)}
        `);
      const chatResultSuggestion = await chatSession?.sendMessage(`
        Saya adalah seorang pengusaha menjalankan usaha UMKM
        Tolong berikan rekomendasi finansial untuk UMKM saya dalam satu kalimat singkat tanpa awalan berdasarkan data:
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
    <div className="px-5 pt-8">
      <div className="mx-5">
        <h1 className="dark:text-white font-bold text-3xl flex items-center gap-4">
          <FaRobot /> Finny
        </h1>
      </div>
      <div className="flex justify-center gap-2">
        {summary && (
          <h2 className="mt-5 py-3 px-5 max-w-96 rounded-2xl bg-cyan-700">
            <h3 className="dark:text-white font-bold text-xl">Ringkasan</h3>
            <Markdown className="dark:text-white pt-2">
              {summary.charAt(0).toUpperCase() + summary.slice(1)}
            </Markdown>
          </h2>
        )}
        {suggestion && (
          <h2 className="mt-5 py-3 px-5 max-w-96 rounded-2xl bg-indigo-700">
            <h3 className="dark:text-white font-bold text-xl">Saran</h3>
            <Markdown className="dark:text-white pt-2">
              {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
            </Markdown>
          </h2>
        )}
      </div>
      <div className="mx-auto mt-3 mb-5 relative flex p-4 justify-center max-w-3xl h-[600px] w-full bg-gray-800 rounded-3xl shadow shadow-gray-900">
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
                    : "dark:text-cyan-300"
                }`}
              >
                {item.role === "model" ? (
                  <>
                    <FaRobot /> Finny
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

        <div className="absolute px-5 bottom-5 w-full flex flex-col gap-2">
          {!prepared && (
            <div className="grid grid-cols-2 gap-2 pb-5">
              {starterQuestions.map((question) => (
                <div
                  className="bg-gray-800 rounded-2xl border border-gray-600 px-4 py-2 cursor-pointer"
                  onClick={() => {
                    startQuestion(question.prompt);
                  }}
                >
                  <h1 className="dark:text-white font-bold">
                    {question.title}
                  </h1>
                  <h2 className="dark:text-gray-400">{question.description}</h2>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
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
    </div>
  );
};

export default AiConsultant;
