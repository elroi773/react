// App.js
import React from "react";
import { Example } from "./Example"; // Example.jsx에서 export한 컴포넌트
import "./Card.css"; // CSS 파일도 import 해줘야 스타일 적용됨

function App() {
  return (
    <div className="App">
      <Example />
    </div>
  );
}

export default App;
