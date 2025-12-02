// src/main/TopTK.jsx
import React, { useState, useEffect } from "react";
import "../css/style.css";
import { useNavigate, Link } from "react-router-dom";
import MainEvent from "../images/event.png";
import DefaultImage from "../images/top5.png"; //  기본 이미지 import
import api from "../api";

export default function TopTk() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_API_URL || "http://localhost:9090/ticketnow";

  //  이미지 URL 처리 함수 (오타 모두 수정!)
  const resolveImageUrl = (imageUrl) => {
    // undefined, null, 빈 문자열 체크
    if (!imageUrl) {
      return "https://via.placeholder.com/400x300?text=No+Image";
    }

    // 절대 URL인 경우 그대로 반환
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // 상대 경로인 경우 BASE URL 붙이기
    return `${BASE}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  useEffect(() => {
    api
      .get("/tickets")
      .then((res) => {
        const list = res.data.data || res.data.list || [];
        
        console.log("📦 전체 응답:", res.data);
        console.log("📦 티켓 리스트:", list);
        
        // ✅ 각 티켓의 이미지 URL 상세 확인
        list.forEach((ticket, idx) => {
          console.log(` 티켓 ${idx + 1}:`, {
            ticketId: ticket.ticketId,
            title: ticket.title,
            mainImageUrl: ticket.mainImageUrl || " 없음",
            originalUrl: ticket.originalUrl || " 없음",
            모든필드: ticket  // 전체 객체 출력
          });
        });
        
        setTickets(list);
      })
      .catch((err) => {
        console.error("티켓 조회 오류:", err);
        setTickets([]);
      });
  }, []);

  const formatDate = (dateArr, fallback = "") => {
    if (!dateArr || !Array.isArray(dateArr)) return fallback;

    const [year, month, day] = dateArr;
    if (!year || !month || !day) return fallback;

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return fallback;

    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}.${mm}.${dd}`;
  };

  return (
    <div className="toptk">
      <div className="liveTopTk">실시간 인기 티켓</div>
      <br />
      <br />

      <div className="tkList1">
        <Link to="/Ticket/List">
          <button className="tkList">티켓 전체 보기</button>
        </Link>
        <Link to="/Ticket/List">
          <button className="tkList">에스엠</button>
        </Link>
        <Link to="/Ticket/List">
          <button className="tkList">하이브</button>
        </Link>
        <Link to="/Ticket/List">
          <button className="tkList">제이와이피</button>
        </Link>
        <Link to="/Ticket/List">
          <button className="tkList">웨이크원</button>
        </Link>
        <Link to="/Ticket/List">
          <button className="tkList">기타</button>
        </Link>
      </div>
      <br />
      <br />

      <div className="TopList">
        {tickets.slice(0, 5).map((t, index) => {
          // ✅ 이미지 URL 미리 계산
          const imageUrl = resolveImageUrl(t.mainImageUrl);

          return (
            <div
              key={t.ticketId}
              className="top"
              onClick={() => navigate(`/ticket/${t.ticketId}`)} // ✅ 백틱 → 괄호
            >
              <div className="rank">{index + 1}</div>
              <img
                src={imageUrl}
                alt={t.title || "티켓 이미지"}
                className="ticket-img"
                onError={(e) => {
                  // ✅ 무한 루프 방지 - 이미 DefaultImage면 실행 안 함
                  if (e.target.src === DefaultImage) return;
                  
                  console.error("❌ 이미지 로드 실패:", {
                    ticketId: t.ticketId,
                    title: t.title,
                    originalUrl: t.mainImageUrl
                  });
                  
                  e.target.src = DefaultImage; // ✅ import한 이미지로 교체
                }}
              />
              <strong style={{ fontSize: "25px" }}>{t.title}</strong>
              <p style={{ fontSize: "20px", color: "#454545", fontWeight: "bold" }}>
                {t.venueName || "장소 미정"}
              </p>
              <span style={{ fontSize: "18px", color: "#808080" }}>
                {formatDate(t.ticketDate)}
              </span>
            </div>
          );
        })}
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="main-event">
        <img src={MainEvent} alt="메인_이벤트" />
      </div>
    </div>
  );
}