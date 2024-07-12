import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/users/Dashboard';
import Home from './components/users/Home';
import Profile from './components/users/Profile';

import { AuthProvider } from './components/AuthContext';
import ExpenseCategory from './components/expense/ExpenseCategory'
import Income from './components/income/Income';
import Expense from './components/expense/Expense';
import Products from './components/income/Products';
import HomePage from './components/HomePage';
import AiConsultant from './components/consultant/AiConsultant';

function App() {
  return (
    <div className='container'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="products" element={<Products />} />
              <Route path="expense_category" element={<ExpenseCategory />} />
              <Route path="income" element={<Income />} />
              <Route path="expense" element={<Expense />} />
              <Route path="ai_consultant" element={<AiConsultant />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
