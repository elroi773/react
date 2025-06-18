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
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}

function App() {
  const startX = window.innerWidth / 2 - 40; // 중앙
  const startY = 0;

  const [starPos, setStarPos] = useState({ x: startX, y: startY });
  const [texts, setTexts] = useState([]);
  const [input, setInput] = useState("");
  const [animationActive, setAnimationActive] = useState(false);

  useEffect(() => {
    if (!animationActive) return;

    let animationFrameId;
    const speed = 4; // 아래로 이동
    const diagonalSpeed = 2; // 왼쪽으로 이동

    function animate() {
      setStarPos((pos) => {
        const newX = pos.x - diagonalSpeed;
        const newY = pos.y + speed;

        if (newY > window.innerHeight || newX < -80) {
          setAnimationActive(false);
          setTexts([]);
          return { x: startX, y: startY };
        }

        // 텍스트 위치도 함께 이동
        setTexts((texts) =>
          texts.map((t) => ({
            ...t,
            x: t.x - diagonalSpeed,
            y: t.y + speed,
          }))
        );

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [animationActive, startX, startY]);

  function handleAddText() {
    if (!input.trim()) return;

    setTexts((texts) => [
      ...texts,
      { id: Date.now(), text: input, x: starPos.x + 50, y: starPos.y + 20 },
    ]);
    setInput("");
    setAnimationActive(true);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #8a7bed, #bdb5f5)",
        overflow: "hidden",
      }}
    >
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
          filter: "drop-shadow(0 0 6px cyan)",
        }}
      />

      <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 100 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="텍스트 입력"
          style={{ fontSize: 16, padding: 6 }}
        />
        <button
          onClick={handleAddText}
          style={{ marginLeft: 8, padding: "6px 12px", fontSize: 16 }}
        >
          날리기
        </button>
      </div>

      {texts.map(({ id, text, x, y }) => (
        <FlyingText key={id} text={text} pos={{ x, y }} />
      ))}
    </div>
  );
}

export default App;
