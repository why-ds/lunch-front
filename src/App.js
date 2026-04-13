import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // 공통코드 그룹 데이터를 담을 state
  const [groups, setGroups] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetch('/api/codes/groups')
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

  return (
      <div className="App">
        <h1>🍚 점심 뭐 먹지?</h1>
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