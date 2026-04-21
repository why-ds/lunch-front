import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import AdminMenu from './admin/AdminMenu';
import ShopRegister from './admin/ShopRegister';
import ShopExcelUpload from './admin/ShopExcelUpload';
import LandmarkRegister from './admin/LandmarkRegister';
import LandmarkExcelUpload from './admin/LandmarkExcelUpload';
import MyPageMenu from './mypage/MyPageMenu';
import Profile from './mypage/Profile';
import Favorites from './mypage/Favorites';
import Blacklist from './mypage/Blacklist';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminMenu />} />
            <Route path="/admin/shop" element={<ShopRegister />} />
            <Route path="/admin/shop-excel" element={<ShopExcelUpload />} />
            <Route path="/admin/landmark" element={<LandmarkRegister />} />
            <Route path="/admin/landmark-excel" element={<LandmarkExcelUpload />} />
            <Route path="/mypage" element={<MyPageMenu />} />
            <Route path="/mypage/profile" element={<Profile />} />
            <Route path="/mypage/favorites" element={<Favorites />} />
            <Route path="/mypage/blacklist" element={<Blacklist />} />
        </Routes>
    </BrowserRouter>
);