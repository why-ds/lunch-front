import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './Login';
import AdminMenu from './admin/AdminMenu';
import ShopRegister from './admin/ShopRegister';
import ShopExcelUpload from './admin/ShopExcelUpload';
import LandmarkRegister from './admin/LandmarkRegister';
import LandmarkExcelUpload from './admin/LandmarkExcelUpload';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminMenu />} />
            <Route path="/admin/shop" element={<ShopRegister />} />
            <Route path="/admin/shop-excel" element={<ShopExcelUpload />} />
            <Route path="/admin/landmark" element={<LandmarkRegister />} />
            <Route path="/admin/landmark-excel" element={<LandmarkExcelUpload />} />
        </Routes>
    </BrowserRouter>
);