import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // 1. 공통코드 데이터를 담을 State
    const [lines, setLines] = useState([]);       // 호선 리스트 (대분류)
    const [stations, setStations] = useState([]); // 역 리스트 (중분류)

    // 2. 사용자가 선택한 값을 담을 State
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedStationCd, setSelectedStationCd] = useState('');

    // 3. 검색 결과 데이터를 담을 State
    const [shops, setShops] = useState([]);

    /**
     * 컴포넌트 최초 마운트 시, '호선' 리스트를 백엔드에서 가져옵니다.
     * 그룹코드 'SUBWAY_LINE'은 실제 DB에 등록된 호선 그룹 코드로 맞춰주세요.
     */
    useEffect(() => {
        fetch('/api/codes/details?grpCd=SUBWAY_LINE')
            .then(res => {
                if (!res.ok) throw new Error('호선 데이터를 불러오는데 실패했습니다.');
                return res.json();
            })
            .then(data => setLines(data))
            .catch(err => console.error(err));
    }, []);

    /**
     * selectedLine(호선) State가 변경될 때마다 실행됩니다.
     * 선택된 호선 코드를 기반으로 해당하는 역 목록을 백엔드에서 가져옵니다.
     */
    useEffect(() => {
        if (selectedLine) {
            // 선택된 호선 코드가 있다면 API 호출 (예: 1호선 선택시 grpCd='LINE_1' 등)
            // *주의: DB에 역 목록이 어떤 그룹코드로 묶여있는지 확인 후 템플릿 리터럴을 맞추세요.
            fetch(`/api/codes/details?grpCd=${selectedLine}`)
                .then(res => {
                    if (!res.ok) throw new Error('역 데이터를 불러오는데 실패했습니다.');
                    return res.json();
                })
                .then(data => setStations(data))
                .catch(err => console.error(err));
        } else {
            // 호선 선택이 해제된 경우: 하위 데이터(역 목록 및 선택된 역) 초기화
            setStations([]);
            setSelectedStationCd('');
        }
    }, [selectedLine]);

    /**
     * 식당 리스트를 조회하는 검색 함수
     */
    const fetchShops = async () => {
        try {
            // 선택된 역이 있으면 파라미터 추가, 없으면 전체 검색
            const url = selectedStationCd
                ? `/api/shops?stationCd=${selectedStationCd}`
                : `/api/shops`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API 통신 에러: ${response.status}`);
            }

            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error("데이터 조회 중 오류 발생:", error);
            alert('데이터를 가져오는 중 문제가 발생했습니다.');
        }
    };

    return (
        <div className="App">
            <div className="filter-container">
                {/* 호선 선택 필터 */}
                <select
                    value={selectedLine}
                    onChange={(e) => {
                        setSelectedLine(e.target.value);
                        // 호선이 변경되면 기존에 선택된 역명은 유효하지 않으므로 무조건 빈값으로 초기화해야 합니다.
                        setSelectedStationCd('');
                    }}
                >
                    <option value="">호선 선택</option>
                    {lines.map((line) => (
                        <option key={line.dtlCd} value={line.dtlCd}>
                            {line.dtlNm}
                        </option>
                    ))}
                </select>

                {/* 역명 선택 필터 (상위 셀렉트박스인 호선이 선택되어야만 활성화 됨) */}
                <select
                    value={selectedStationCd}
                    onChange={(e) => setSelectedStationCd(e.target.value)}
                    disabled={!selectedLine}
                >
                    <option value="">역명 선택</option>
                    {stations.map((station) => (
                        <option key={station.dtlCd} value={station.dtlCd}>
                            {station.dtlNm}
                        </option>
                    ))}
                </select>

                <button onClick={fetchShops}>조회</button>
            </div>

            <hr />

            {/* 식당 리스트 렌더링 */}
            <div className="shop-list">
                {shops.length > 0 ? (
                    shops.map(shop => (
                        // shopSeq가 PK이므로 key값으로 사용 (Double 타입인 위도/경도 등은 화면에 표시할때만 사용)
                        <div key={shop.shopSeq} className="shop-item">
                            <h3>{shop.shopNm}</h3>
                            <p>주소: {shop.address}</p>
                            {/* 위도, 경도는 DB에서 Double 타입이므로 null 체크 후 출력 */}
                            {(shop.latitude && shop.longitude) && (
                                <p style={{fontSize: '12px', color: 'gray'}}>
                                    위치: {shop.latitude}, {shop.longitude}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default App;