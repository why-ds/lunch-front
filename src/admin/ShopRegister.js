import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function ShopRegister() {
    const token = localStorage.getItem('token');
    const [shopForm, setShopForm] = useState({ shopNm: '', stationCd: '', foodTypeCd: '', address: '', rmk: '' });
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedLine, setSelectedLine] = useState('');

    const foodTypes = [
        { cd: 'F01', nm: '한식' }, { cd: 'F02', nm: '중식' },
        { cd: 'F03', nm: '일식' }, { cd: 'F04', nm: '양식' },
        { cd: 'F05', nm: '분식' }, { cd: 'F06', nm: '동남아' },
    ];

    useEffect(() => { if (!token) window.location.href = '/login'; }, [token]);

    useEffect(() => {
        fetch(`${API_BASE}/api/subway-stations/lines`).then(r => r.json()).then(d => setLines(d)).catch(() => {});
    }, []);

    useEffect(() => {
        if (selectedLine) {
            fetch(`${API_BASE}/api/subway-stations?lineNm=${encodeURIComponent(selectedLine)}`).then(r => r.json()).then(d => setStations(d)).catch(() => {});
        } else { setStations([]); }
    }, [selectedLine]);

    const searchAddress = () => {
        new window.daum.Postcode({
            oncomplete: (data) => setShopForm({ ...shopForm, address: data.roadAddress || data.jibunAddress })
        }).open();
    };

    const handleSubmit = async () => {
        if (!shopForm.shopNm) { alert('가게명을 입력해주세요!'); return; }
        if (!shopForm.foodTypeCd) { alert('음식종류를 선택해주세요!'); return; }
        try {
            const res = await fetch(API_BASE + '/api/shops/single', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(shopForm),
            });
            const result = await res.json();
            alert(result.message);
            if (result.success) {
                setShopForm({ shopNm: '', stationCd: '', foodTypeCd: '', address: '', rmk: '' });
                setSelectedLine('');
            }
        } catch (e) { alert('등록 실패'); }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };
    const selectStyle = { ...inputStyle, backgroundColor: 'white' };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <h2>🍚 가게 등록</h2>
            <input style={inputStyle} placeholder="가게명 *" value={shopForm.shopNm}
                   onChange={(e) => setShopForm({...shopForm, shopNm: e.target.value})} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select style={{...selectStyle, flex: 1}} value={selectedLine}
                        onChange={(e) => { setSelectedLine(e.target.value); setShopForm({...shopForm, stationCd: ''}); }}>
                    <option value="">호선</option>
                    {lines.map((l, i) => <option key={i} value={l}>{l}</option>)}
                </select>
                <select style={{...selectStyle, flex: 1}} value={shopForm.stationCd}
                        onChange={(e) => setShopForm({...shopForm, stationCd: e.target.value})} disabled={!selectedLine}>
                    <option value="">역 선택</option>
                    {stations.map(s => <option key={s.stationCd} value={s.stationCd}>{s.stationNm}</option>)}
                </select>
            </div>
            <select style={selectStyle} value={shopForm.foodTypeCd}
                    onChange={(e) => setShopForm({...shopForm, foodTypeCd: e.target.value})}>
                <option value="">음식종류 선택 *</option>
                {foodTypes.map(f => <option key={f.cd} value={f.cd}>{f.nm}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input style={{...inputStyle, flex: 1, marginBottom: 0}} placeholder="주소 (검색 버튼 클릭)" value={shopForm.address}
                       onChange={(e) => setShopForm({...shopForm, address: e.target.value})} />
                <button onClick={searchAddress} style={{ padding: '10px 16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>🔍 검색</button>
            </div>
            <input style={inputStyle} placeholder="비고 (메뉴 등)" value={shopForm.rmk}
                   onChange={(e) => setShopForm({...shopForm, rmk: e.target.value})} />
            <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>
                등록
            </button>
            <button onClick={() => window.location.href = '/admin'} style={{ width: '100%', padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                ← 돌아가기
            </button>
        </div>
    );
}

export default ShopRegister;