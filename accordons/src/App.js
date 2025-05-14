import React from "react";
import { ImageAccordion } from "./ImageAccordion";
import "./styles.css";


const items = [
  {
    image: "https://source.unsplash.com/random/800x600?nature",
    header: "자연의 아름다움",
    text: "푸르른 숲과 맑은 공기의 감성."
  },
  {
    image: "https://source.unsplash.com/random/800x600?city",
    header: "도시의 매력",
    text: "바쁜 일상 속에서도 반짝이는 순간들."
  },
  {
    image: "https://source.unsplash.com/random/800x600?space",
    header: "우주의 신비",
    text: "별과 은하의 끝없는 이야기."
  }
];

export default function App() {
  return (
    <div className="App">
      <h1>Image Accordion Demo</h1>
      <ImageAccordion items={items} />
    </div>
  );
}
