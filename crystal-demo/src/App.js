import React, { useState, useEffect } from "react";
import starImg from "./img/star.png";

function FlyingText({ text, pos }) {
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        color: "white",
        fontWeight: "bold",
        fontSize: "20px",
        textShadow: "0 0 5px cyan",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}

function App() {
  const [starPos, setStarPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [texts, setTexts] = useState([]);
  const [input, setInput] = useState("");
  const [animationActive, setAnimationActive] = useState(false);

  // 애니메이션: 별과 텍스트 위치 매 프레임 업데이트
  useEffect(() => {
    if (!animationActive) return;

    let animationFrameId;
    const speed = 3; // 픽셀 이동 속도

    function animate() {
      setStarPos((pos) => {
        const newX = pos.x - speed; // 왼쪽으로 이동
        const newY = pos.y - speed; // 위로 이동

        // 화면 밖으로 나가면 애니메이션 종료
        if (newX < -80 || newY < -80) {
          setAnimationActive(false);
          setTexts([]);
          return { x: window.innerWidth - 80, y: window.innerHeight - 80 };
        }

        // 텍스트 위치도 함께 업데이트
        setTexts((texts) =>
          texts.map((t) => ({
            ...t,
            x: t.x - speed,
            y: t.y - speed,
          }))
        );

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [animationActive]);

  function handleAddText() {
    if (!input.trim()) return;
    // 별 위치에서 텍스트 시작 위치 추가
    setTexts((texts) => [
      ...texts,
      { id: Date.now(), text: input, x: starPos.x, y: starPos.y },
    ]);
    setInput("");
    setAnimationActive(true);
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
      {/* 별 이미지 */}
      <img
        src={starImg}
        alt="star"
        style={{
          position: "absolute",
          left: starPos.x,
          top: starPos.y,
          width: 80,
          height: 80,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* 텍스트 입력과 버튼 */}
      <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 100 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="텍스트 입력"
          style={{ fontSize: 16, padding: 6 }}
        />
        <button onClick={handleAddText} style={{ marginLeft: 8, padding: "6px 12px", fontSize: 16 }}>
          날리기
        </button>
      </div>

      {/* 텍스트들 */}
      {texts.map(({ id, text, x, y }) => (
        <FlyingText key={id} text={text} pos={{ x, y }} />
      ))}
    </div>
  );
}

export default App;