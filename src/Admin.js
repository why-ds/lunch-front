import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'http://yds.it';

function Admin() {
    const [uploadResult, setUploadResult] = useState(null);
    const [landmarkResult, setLandmarkResult] = useState(null);
    const token = localStorage.getItem('token');
    const userNm = localStorage.getItem('userNm');

    // 로그인 체크
    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userNm');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    // 가게 엑셀 업로드
    const handleShopUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(API_BASE + '/api/shops/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
            });
            const result = await response.json();
            setUploadResult(result);
            alert(result.message);
        } catch (error) {
            alert('업로드 실패');
        }
        e.target.value = '';
    };

    // 랜드마크 엑셀 업로드
    const handleLandmarkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(API_BASE + '/api/landmarks/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
            });
            const result = await response.json();
            setLandmarkResult(result);
            alert(result.message);
        } catch (error) {
            alert('랜드마크 업로드 실패');
        }
        e.target.value = '';
    };

    return (
        <div style={{ textAlign: 'center', paddingTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>⚙️ 관리자 페이지</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{userNm}님</span>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        로그아웃
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '600px', margin: '20px auto' }}>
                {/* 가게 엑셀 업로드 */}
                <div style={{ margin: '20px auto', padding: '20px', border: '2px dashed #ccc', borderRadius: '10px' }}>
                    <h3>📂 가게 엑셀 업로드</h3>
                    <input type="file" accept=".xlsx" onChange={handleShopUpload} />
                    {uploadResult && <p style={{ marginTop: '10px', color: uploadResult.success ? 'green' : 'red' }}>{uploadResult.message}</p>}
                </div>

                {/* 랜드마크 엑셀 업로드 */}
                <div style={{ margin: '20px auto', padding: '20px', border: '2px dashed #E67E22', borderRadius: '10px' }}>
                    <h3>🏢 랜드마크 엑셀 업로드</h3>
                    <input type="file" accept=".xlsx" onChange={handleLandmarkUpload} />
                    {landmarkResult && <p style={{ marginTop: '10px', color: landmarkResult.success ? 'green' : 'red' }}>{landmarkResult.message}</p>}
                </div>

                {/* 메인 페이지로 이동 */}
                <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                    🍚 메인 페이지로
                </button>
            </div>
        </div>
    );
}

export default Admin;