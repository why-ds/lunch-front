import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

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

// 구역별 기본 좌표 (나중에 실제 좌표로 변경)
const AREA_CENTER = {
    '': { lat: 37.5636, lng: 126.9745 },
    'A01': { lat: 37.5636, lng: 126.9745 },
    'A02': { lat: 37.5640, lng: 126.9750 },
    'A03': { lat: 37.5630, lng: 126.9740 },
    'A04': { lat: 37.5635, lng: 126.9755 },
    'A05': { lat: 37.5645, lng: 126.9735 },
    'A06': { lat: 37.5625, lng: 126.9760 },
    'A07': { lat: 37.5650, lng: 126.9730 },
    'A08': { lat: 37.5620, lng: 126.9765 },
};

function App() {
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedArea, setSelectedArea] = useState('');
    const [uploadResult, setUploadResult] = useState(null);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);

    // 카카오 지도 초기화
    useEffect(() => {
        const kakao = window.kakao;
        if (kakao && kakao.maps) {
            const container = mapRef.current;
            const options = {
                center: new kakao.maps.LatLng(37.5636, 126.9745),
                level: 4,
            };
            mapInstance.current = new kakao.maps.Map(container, options);
        }
    }, []);

    // 식당 선택 시 지도 이동
    useEffect(() => {
        const kakao = window.kakao;
        if (!kakao || !mapInstance.current || !selectedShop) return;

        // 구역 좌표로 이동 (나중에 가게별 좌표로 변경 가능)
        const center = AREA_CENTER[selectedShop.areaCd] || AREA_CENTER[''];
        const moveLatLng = new kakao.maps.LatLng(center.lat, center.lng);
        mapInstance.current.setCenter(moveLatLng);

        // 마커 표시
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }
        markerRef.current = new kakao.maps.Marker({
            position: moveLatLng,
            map: mapInstance.current,
        });

        // 인포윈도우
        const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;">${selectedShop.shopNm}</div>`,
        });
        infowindow.open(mapInstance.current, markerRef.current);
    }, [selectedShop]);

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
        <div className="App" style={{ textAlign: 'center', paddingTop: '30px' }}>
            <h1>🍚 점심 뭐 먹지?</h1>

            {/* 카카오 지도 */}
            <div
                ref={mapRef}
                style={{
                    width: '90%',
                    maxWidth: '600px',
                    height: '350px',
                    margin: '20px auto',
                    borderRadius: '12px',
                    border: '2px solid #ddd',
                }}
            />

            {/* 선택된 가게 표시 */}
            <div style={{ margin: '20px auto', fontSize: '32px', fontWeight: 'bold', minHeight: '45px' }}>
                {selectedShop
                    ? `${selectedShop.shopNm}${selectedShop.rmk ? '(' + selectedShop.rmk + ')' : ''}`
                    : '버튼을 눌러주세요!'
                }
            </div>

            {/* 구역 선택 버튼들 */}
            <div style={{ margin: '15px auto', maxWidth: '500px' }}>
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
                    marginBottom: '30px',
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