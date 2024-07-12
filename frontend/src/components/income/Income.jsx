import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './../AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Income = () => {
    const [noPembelian, setNoPembelian] = useState('');
    const [namaPembeli, setNamaPembeli] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
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

    const addItem = () => {
        setSelectedItems([...selectedItems, { categoryId: '', quantity: '' }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...selectedItems];
        newItems[index][field] = value;
        setSelectedItems(newItems);
    };

    const handleShowInvoice = (e) => {
        e.preventDefault();
        let totalPrice = 0;
        let totalDiscount = 0;
        selectedItems.forEach(item => {
            const selectedCategory = categories.find(c => c.id === parseInt(item.categoryId));
            if (selectedCategory) {
                const basePrice = selectedCategory.harga_barang * parseInt(item.quantity);
                const discountAmount = basePrice * parseFloat(selectedCategory.discount / 100);
                totalPrice += basePrice;
                totalDiscount += discountAmount;
            }
        });
        setTotalPrice(totalPrice);
        setTotalDiscount(totalDiscount);
        setShowInvoice(true);
    };

    const addIncome = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/incomes`, {
                no_pembelian: noPembelian,
                nama_pembeli: namaPembeli,
                userId: user.id,
                items: selectedItems.map(item => ({
                    categoryId: parseInt(item.categoryId),
                    jumlah_pembelian: parseInt(item.quantity)
                }))
            });
            navigate('/dashboard/home');
        } catch (error) {
            console.error("Error adding income:", error);
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
                                placeholder="No Pembelian"
                                value={noPembelian}
                                onChange={(e) => setNoPembelian(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="font-bold text-slate-500">Nama Pembeli</label>
                            <input
                                type="text"
                                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                placeholder="Nama Pembeli"
                                value={namaPembeli}
                                onChange={(e) => setNamaPembeli(e.target.value)}
                            />
                        </div>
                        {selectedItems.map((item, index) => (
                            <div key={index} className="flex mb-3">
                                <select
                                    className="w-1/2 py-3 mr-2 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                    value={item.categoryId}
                                    onChange={(e) => updateItem(index, 'categoryId', e.target.value)}
                                >
                                    <option value="">Select Barang</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nama_barang}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    className="w-1/2 py-3 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                                    placeholder="Jumlah"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItem}
                            className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Tambah Barang
                        </button>
                        <div className="flex flex-1 mt-5">
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
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-xl font-bold text-gray-700">Nama Barang</th>
                                        <th className="px-4 py-2 text-xl font-bold text-gray-700">Harga Barang</th>
                                        <th className="px-4 py-2 text-xl font-bold text-gray-700">Jumlah</th>
                                        <th className="px-4 py-2 text-xl font-bold text-gray-700">Subtotal</th>
                                        <th className="px-4 py-2 text-xl font-bold text-gray-700">Discount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showInvoice && selectedItems.map((item, index) => {
                                        const category = categories.find(c => c.id === parseInt(item.categoryId));
                                        const subtotal = category ? category.harga_barang * parseInt(item.quantity) : 0;
                                        const discount = category ? subtotal * (category.discount / 100) : 0;
                                        return (
                                            <tr key={index}>
                                                <td className="px-4 py-2 text-xl font-bold">{category ? category.nama_barang : '-'}</td>
                                                <td className="px-4 py-2 text-xl font-bold">{category ? formatRupiah(category.harga_barang) : '-'}</td>
                                                <td className="px-4 py-2 text-xl font-bold">{item.quantity} Pcs</td>
                                                <td className="px-4 py-2 text-xl font-bold">{formatRupiah(subtotal)}</td>
                                                <td className="px-4 py-2 text-xl font-bold">{formatRupiah(discount)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="pt-4">
                            <table className="min-w-full bg-gray-400">
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Subtotal:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? formatRupiah(totalPrice) : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Total Discount:</td>
                                        <td className="px-4 py-2 text-xl font-bold">{showInvoice ? formatRupiah(totalDiscount) : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-xl font-bold text-gray-700">Tax:</td>
                                        <td className="px-4 py-2 text-xl font-bold">2.5%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-2xl font-bold text-gray-800 mt-4">Total Harga:</td>
                                        <td className="px-4 py-2 text-2xl font-bold">{showInvoice ? formatRupiah(totalPrice - totalDiscount) : '-'}</td>
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