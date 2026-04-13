import React, { useEffect, useState } from 'react';
import './App.css';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

function App() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadResult, setUploadResult] = useState(null);

    useEffect(() => {
        fetch(API_BASE + '/api/codes/groups')
            .then((response) => response.json())
            .then((data) => {
                setGroups(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('API 호출 실패:', error);
                setLoading(false);
            });
    }, []);

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
        <div className="App">
            <h1>🍚 java,react 밥</h1>

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
                        {uploadResult.failCount > 0 && ` (실패: ${uploadResult.failCount}건)`}
                    </p>
                )}
            </div>

            <h2>공통코드 그룹 목록</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <table border="1" cellPadding="10" style={{ margin: '0 auto' }}>
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>그룹코드</th>
                        <th>그룹명</th>
                        <th>사용여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groups.map((group) => (
                        <tr key={group.grpSeq}>
                            <td>{group.grpSeq}</td>
                            <td>{group.grpCd}</td>
                            <td>{group.grpNm}</td>
                            <td>{group.useYn}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;