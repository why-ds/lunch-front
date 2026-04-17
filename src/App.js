import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

function App() {
    const [selectedShop, setSelectedShop] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);

    // 새로 추가된 호선/역명 필터 State
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedStationCd, setSelectedStationCd] = useState('');

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const infoRef = useRef(null);

    // 공통코드 조회 (호선 데이터 로드)
    useEffect(() => {
        fetch(API_BASE + '/api/codes/details?grpCd=SUBWAY_LINE')
            .then(res => res.json())
            .then(data => setLines(data))
            .catch(err => console.error('호선 데이터를 불러오는데 실패했습니다.', err));
    }, []);

    // 호선이 변경될 때 역 데이터 로드
    useEffect(() => {
        if (selectedLine) {
            fetch(API_BASE + `/api/codes/details?grpCd=${selectedLine}`)
                .then(res => res.json())
                .then(data => setStations(data))
                .catch(err => console.error('역 데이터를 불러오는데 실패했습니다.', err));
        } else {
            setStations([]);
            setSelectedStationCd('');
        }
    }, [selectedLine]);

    // 카카오 지도 초기화 (세종대로 39 기본 중심)
    useEffect(() => {
        const kakao = window.kakao;
        if (kakao && kakao.maps) {
            const container = mapRef.current;
            const options = {
                center: new kakao.maps.LatLng(37.5607, 126.9738),
                level: 4,
            };
            mapInstance.current = new kakao.maps.Map(container, options);
        }
    }, []);

    // 식당 선택 시 지도에 마커 표시
    useEffect(() => {
        const kakao = window.kakao;
        if (!kakao || !mapInstance.current || !selectedShop) return;
        if (!selectedShop.latitude || !selectedShop.longitude) return;

        const moveLatLng = new kakao.maps.LatLng(selectedShop.latitude, selectedShop.longitude);
        mapInstance.current.setCenter(moveLatLng);

        // 기존 마커 제거
        if (markerRef.current) markerRef.current.setMap(null);
        if (infoRef.current) infoRef.current.close();

        // 새 마커
        markerRef.current = new kakao.maps.Marker({
            position: moveLatLng,
            map: mapInstance.current,
        });

        // 인포윈도우
        const displayName = selectedShop.rmk
            ? selectedShop.shopNm + '(' + selectedShop.rmk + ')'
            : selectedShop.shopNm;

        infoRef.current = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px;font-size:14px;white-space:nowrap;">' + displayName + '</div>',
        });
        infoRef.current.open(mapInstance.current, markerRef.current);
    }, [selectedShop]);

    // 식당 랜덤 선택
    const handleSelectShop = async () => {
        try {
            // 역 코드가 있으면 파라미터 추가, 없으면 전체 조회
            const url = selectedStationCd
                ? API_BASE + '/api/shops?stationCd=' + selectedStationCd
                : API_BASE + '/api/shops';

            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 0) {
                alert('해당 역에 등록된 가게가 없습니다!');
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
            <h1>🍚</h1>

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

            {/* 호선 및 역명 선택 필터 */}
            <div style={{ margin: '15px auto', maxWidth: '500px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <select
                    value={selectedLine}
                    onChange={(e) => {
                        setSelectedLine(e.target.value);
                        setSelectedStationCd(''); // 호선이 바뀌면 역명 초기화
                        setSelectedShop(null); // 식당 정보 초기화
                    }}
                    style={{
                        padding: '10px 15px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="">호선 전체</option>
                    {lines.map((line) => (
                        <option key={line.dtlCd} value={line.dtlCd}>
                            {line.dtlNm}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedStationCd}
                    onChange={(e) => {
                        setSelectedStationCd(e.target.value);
                        setSelectedShop(null); // 식당 정보 초기화
                    }}
                    disabled={!selectedLine}
                    style={{
                        padding: '10px 15px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        cursor: selectedLine ? 'pointer' : 'not-allowed',
                        backgroundColor: selectedLine ? 'white' : '#f5f5f5'
                    }}
                >
                    <option value="">역명 전체</option>
                    {stations.map((station) => (
                        <option key={station.dtlCd} value={station.dtlCd}>
                            {station.dtlNm}
                        </option>
                    ))}
                </select>
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