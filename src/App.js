import React, { useEffect, useState } from 'react';
import './App.css';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

// 구역 목록
const AREAS = [
    { cd: '', nm: '전체' },
    { cd: 'A01', nm: 'A' },
    { cd: 'A02', nm: 'B' },
    { cd: 'A03', nm: 'C' },
    { cd: 'A04', nm: 'D' },
    { cd: 'A05', nm: 'E' },
    { cd: 'A06', nm: 'F' },
    { cd: 'A07', nm: 'G' },
    { cd: 'A08', nm: 'H' },
];

function App() {
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedArea, setSelectedArea] = useState('');
    const [uploadResult, setUploadResult] = useState(null);

    // 식당 랜덤 선택
    const handleSelectShop = async () => {
        try {
            const url = selectedArea
                ? API_BASE + '/api/shops?areaCd=' + selectedArea
                : API_BASE + '/api/shops';

            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 0) {
                alert('해당 구역에 등록된 가게가 없습니다!');
                return;
            }

            const randomIndex = Math.floor(Math.random() * data.length);
            setSelectedShop(data[randomIndex]);
        } catch (error) {
            console.error('API 호출 실패:', error);
            alert('가게 정보를 불러올 수 없습니다.');
        }
    };

    // 엑셀 업로드
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(API_BASE + '/api/shops/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            setUploadResult(result);
            alert(result.message);
        } catch (error) {
            console.error('업로드 실패:', error);
            alert('업로드에 실패했습니다.');
        }

        e.target.value = '';
    };

    return (
        <div className="App" style={{ textAlign: 'center', paddingTop: '60px' }}>
            <h1>🍚java,react로 변경중</h1>

            {/* 선택된 가게 표시 */}
            <div style={{ margin: '40px auto', fontSize: '36px', fontWeight: 'bold', minHeight: '50px' }}>
                {selectedShop
                    ? `${selectedShop.shopNm}${selectedShop.rmk ? '(' + selectedShop.rmk + ')' : ''}`
                    : '버튼을 눌러주세요!'
                }
            </div>

            {/* 구역 선택 버튼들 */}
            <div style={{ margin: '20px auto', maxWidth: '500px' }}>
                {AREAS.map((area) => (
                    <button
                        key={area.cd}
                        onClick={() => {
                            setSelectedArea(area.cd);
                            setSelectedShop(null);
                        }}
                        style={{
                            padding: '10px 18px',
                            margin: '5px',
                            fontSize: '16px',
                            backgroundColor: selectedArea === area.cd ? '#4472C4' : '#e0e0e0',
                            color: selectedArea === area.cd ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        {area.nm}
                    </button>
                ))}
            </div>

            {/* 식당 선택 버튼 */}
            <button
                onClick={handleSelectShop}
                style={{
                    padding: '15px 40px',
                    fontSize: '20px',
                    backgroundColor: '#4472C4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginBottom: '40px',
                }}
            >
                🎲 식당 선택!
            </button>

            {/* 엑셀 업로드 영역 */}
            <div style={{ margin: '20px auto', padding: '20px', border: '2px dashed #ccc', width: '400px' }}>
                <h3>📂 가게 엑셀 업로드</h3>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                />
                {uploadResult && (
                    <p style={{ marginTop: '10px', color: uploadResult.success ? 'green' : 'red' }}>
                        {uploadResult.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;