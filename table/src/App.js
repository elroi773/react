import React from 'react';
import './App.css';
import { Table } from './Table';  // Table.jsx의 export된 Table 컴포넌트 import
import './Table.css';             // Table.css 불러오기


const columns = [
  { name: '이름', width: 150 },
  { name: '나이', width: 100 },
  { name: '직업', width: 200 },
];

const data = [
  { 이름: '홍길동', 나이: 30, 직업: '개발자' },
  { 이름: '김철수', 나이: 25, 직업: '디자이너' },
];

function App() {
  return (
    <div className="App">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
