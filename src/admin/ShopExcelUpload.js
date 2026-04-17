import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'http://yds.it';

function ShopExcelUpload() {
    const token = localStorage.getItem('token');
    const [result, setResult] = useState(null);

    useEffect(() => { if (!token) window.location.href = '/login'; }, [token]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(API_BASE + '/api/shops/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
            });
            const data = await res.json();
            setResult(data);
            alert(data.message);
        } catch (e) { alert('업로드 실패'); }
        e.target.value = '';
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px', textAlign: 'center' }}>
            <h2>📂 가게 엑셀 업로드</h2>
            <div style={{ margin: '30px 0', padding: '40px', border: '2px dashed #ccc', borderRadius: '10px' }}>
                <p style={{ marginBottom: '20px', color: '#666' }}>엑셀 파일(.xlsx)을 선택해주세요</p>
                <input type="file" accept=".xlsx" onChange={handleUpload} />
                {result && <p style={{ marginTop: '15px', color: result.success ? 'green' : 'red' }}>{result.message}</p>}
            </div>
            <button onClick={() => window.location.href = '/admin'} style={{ width: '100%', padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                ← 돌아가기
            </button>
        </div>
    );
}

export default ShopExcelUpload;