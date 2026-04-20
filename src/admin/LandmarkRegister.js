import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function LandmarkRegister() {
    const token = localStorage.getItem('token');
    const [form, setForm] = useState({ landmarkCd: '', landmarkNm: '', address: '' });

    useEffect(() => { if (!token) window.location.href = '/login'; }, [token]);

    const searchAddress = () => {
        new window.daum.Postcode({
            oncomplete: (data) => setForm({ ...form, address: data.roadAddress || data.jibunAddress })
        }).open();
    };

    const handleSubmit = async () => {
        if (!form.landmarkCd) { alert('랜드마크코드를 입력해주세요!'); return; }
        if (!form.landmarkNm) { alert('랜드마크명을 입력해주세요!'); return; }
        try {
            const res = await fetch(API_BASE + '/api/landmarks/single', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(form),
            });
            const result = await res.json();
            alert(result.message);
            if (result.success) setForm({ landmarkCd: '', landmarkNm: '', address: '' });
        } catch (e) { alert('등록 실패'); }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <h2>🏢 랜드마크 등록</h2>
            <input style={inputStyle} placeholder="랜드마크코드 * (예: LM0001)" value={form.landmarkCd}
                   onChange={(e) => setForm({...form, landmarkCd: e.target.value})} />
            <input style={inputStyle} placeholder="랜드마크명 *" value={form.landmarkNm}
                   onChange={(e) => setForm({...form, landmarkNm: e.target.value})} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input style={{...inputStyle, flex: 1, marginBottom: 0}} placeholder="주소 (검색 버튼 클릭)" value={form.address}
                       onChange={(e) => setForm({...form, address: e.target.value})} />
                <button onClick={searchAddress} style={{ padding: '10px 16px', backgroundColor: '#E67E22', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>🔍 검색</button>
            </div>
            <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', backgroundColor: '#E67E22', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>
                등록
            </button>
            <button onClick={() => window.location.href = '/admin'} style={{ width: '100%', padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                ← 돌아가기
            </button>
        </div>
    );
}

export default LandmarkRegister;