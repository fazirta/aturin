import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './../AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Income = () => {
    const [noPembelian, setNoPembelian] = useState('');
    const [namaPembeli, setNamaPembeli] = useState('');
    const [jumlahPembelian, setJumlahPembelian] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/incomeCategories/${user.id}`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [user.id]);

    const addIncome = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/incomes`, {
                no_pembelian: noPembelian,
                nama_pembeli: namaPembeli,
                jumlah_pembelian: parseInt(jumlahPembelian),
                userId: user.id,
                categoryId: parseInt(categoryId),
            });
            navigate('/dashboard/home');
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };

    const handleShowInvoice = (e) => {
        e.preventDefault();
        const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
        if (selectedCategory) {
            const basePrice = selectedCategory.harga_barang * parseInt(jumlahPembelian);
            const discountAmount = basePrice * parseFloat(selectedCategory.discount / 100);
            const priceAfterDiscount = basePrice - discountAmount;
            const taxAmount = priceAfterDiscount * 0.025; // 2.5% tax
            const total = priceAfterDiscount - taxAmount;
            setTotalPrice(total);
            setShowInvoice(true);
        }
    };

    const formatRupiah = (amount) => {
        return amount.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const downloadInvoiceAsPDF = () => {
        const input = invoiceRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('potrait');
                
                pdf.setFillColor(156, 163, 175);
                pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
    
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = canvas.height * imgWidth / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save("invoice.pdf");
            });
    };
    
    

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-1 max-w-6xl mx-auto bg-gray-800 p-8 rounded-xl">
                <div className="w-1/2 mr-8">
                    <h2 className="text-3xl font-bold mb-10 text-white">Add New Pembelian</h2>
                    <form onSubmit={handleShowInvoice}>
                        <div className="flex flex-col mb-5">
                            <label className="font-bold text-slate-500">No Pembelian</label>
                            <input
                                type="text"
                                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                placeholder="Income Description"
                                value={noPembelian}
                                onChange={(e) => setNoPembelian(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="font-bold text-slate-500">Nama Pembeli</label>
                            <input
                                type="text"
                                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                placeholder="Income Description"
                                value={namaPembeli}
                                onChange={(e) => setNamaPembeli(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="font-bold text-slate-500">Nama Barang</label>
                            <select
                                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Select Barang</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.nama_barang}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="font-bold text-slate-500">Jumlah Pembelian</label>
                            <input
                                type="number"
                                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                placeholder="Amount"
                                value={jumlahPembelian}
                                onChange={(e) => setJumlahPembelian(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-1">
                            <button type="submit" className="w-full mt-7 py-3 font-bold text-white bg-gray-900 hover:bg-black rounded-lg hover:shadow">
                                Show Invoice
                            </button>
                        </div>
                    </form>
                </div>
                <div className='w-full'>
                    <div className="bg-gray-400 p-8" ref={invoiceRef}>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Invoice</h2>
                        <div className="border-b-2 border-gray-500 pb-4 mb-4 text-end">
                            <p className="text-xl text-gray-700 font-bold">{showInvoice ? noPembelian : '-'}</p>
                            <p className="text-xl text-gray-700 font-bold">{showInvoice ? 'Bpk/Ibu. ' + namaPembeli : '-'}</p>
                        </div>
                        <div className="mb-6">
                            <table className="min-w-full bg-gray-400">
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Nama Barang:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? categories.find(c => c.id === parseInt(categoryId))?.nama_barang : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Harga Barang:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? 'Rp. ' + formatRupiah(categories.find(c => c.id === parseInt(categoryId))?.harga_barang) : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Jumlah Pembelian:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? jumlahPembelian + ' Pcs' : '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pt-4">
                            <table className="min-w-full bg-gray-400">
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Subtotal:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? 'Rp. ' + formatRupiah(categories.find(c => c.id === parseInt(categoryId))?.harga_barang * parseInt(jumlahPembelian)) : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Discount:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? `${categories.find(c => c.id === parseInt(categoryId))?.discount}%` : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Tax:</td>
                                        <td className="px-4 py-2 text-xl font-bold">2.5%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-2xl font-bold text-gray-800 mt-4">Total Harga:</td>
                                        <td className="px-4 py-2 text-2xl font-bold">{showInvoice ? 'Rp. ' + formatRupiah(totalPrice) : '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    {showInvoice && (
                        <div className="w-full text-center mt-8">
                            <button onClick={downloadInvoiceAsPDF} className="mx-14 py-3 px-5 font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-lg hover:shadow transition duration-300 mb-4">
                                Download PDF
                            </button>
                            <button onClick={addIncome} className="mx-14 py-3 px-5 font-bold text-white bg-green-800 hover:bg-green-700 rounded-lg hover:shadow transition duration-300">
                                Add Pembelian
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Income;
