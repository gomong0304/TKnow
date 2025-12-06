// src/Ticket/FloorF3.jsx
import React, { useEffect, useState } from "react";
import "../css/ticket.css";
import "../css/style.css";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import F2 from "../images/f2.png"; // 좌석도 이미지는 기존 f2.png 재사용
import axios from "axios";
import api from "../api";

export default function F3Floor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedDate, ticket } = location.state || {};
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketInfo, setTicketInfo] = useState(ticket || null);

  const rows = 12;
  const cols = 13;
  const seatWidth = 37.2;
  const seatHeight = 34.1;
  const seatGap = 5.1;
  const startX = 120;
  const startY = 120;

  const seats = [];
  let idCounter = 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (seatWidth + seatGap);
      const y = startY + row * (seatHeight + seatGap);
      const seatGrade = row < 2 ? "S" : "R";

      seats.push({
        id: idCounter,
        dbId: idCounter,
        row: row + 1,
        number: col + 1,
        grade: seatGrade,
        zone: "F3", 
        x,
        y,
      });
      idCounter++;
    }
  }

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const res = await axios.get(
          `${api.defaults.baseURL}/tickets/${id}/reserved-seats`
        );
        const seatIds = res.data || [];
        setReservedSeats(seatIds);
      } catch (error) {
        console.error("예약 좌석 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservedSeats();

    if (!ticketInfo) {
      api
        .get(`/tickets/${id}`)
        .then((res) => setTicketInfo(res.data))
        .catch((err) => console.error("공연 정보 조회 실패:", err));
    }
  }, [id]);

  const handleSelectSeat = (seat) => {
    if (reservedSeats.includes(seat.id)) {
      alert("이미 예약된 좌석입니다.");
      return;
    }
    setSelectedSeat(seat);
    console.log("🪑 선택한 좌석:", seat);
  };

  const handleNext = () => {
    if (!selectedSeat) {
      alert("좌석을 선택하세요!");
      return;
    }

    console.log("Buy3로 이동, 좌석 정보:", selectedSeat);

    navigate(`/Ticket/Buy3/${id}`, {
      state: {
        selectedSeat,
        selectedDate,
        ticketInfo,
      },
    });
  };

  return (
    <div className="ticket-stage-main">
      <div className="ticket-seage-page">
        <div className="ticket-buy-top">
          <button className="ticket-buy-button2">
            01&nbsp;<span className="ticket-buy-button-text1">날짜 선택</span>
          </button>
          <button className="ticket-buy-button1">
            02&nbsp;<span className="ticket-buy-button-text1">좌석 선택</span>
          </button>
          <button className="ticket-buy-button2">
            03&nbsp;<span className="ticket-buy-button-text1">가격 선택</span>
          </button>
          <button className="ticket-buy-button2">
            04&nbsp;<span className="ticket-buy-button-text1">배송 선택</span>
          </button>
          <button className="ticket-buy-button2">
            05&nbsp;<span className="ticket-buy-button-text1">결제하기</span>
          </button>
        </div>
        <br />

        <div className="ticket-stage-middle">
          {loading ? (
            <p style={{ textAlign: "center" }}>
              좌석 정보를 불러오는 중입니다...
            </p>
          ) : (
            <div className="ticket-stage-map" style={{ position: "relative" }}>
              <img src={F2} className="ticket-f2-img" alt="F3 좌석 배치도" />
              {seats.map((seat) => {
                const isReserved = reservedSeats.includes(seat.id);
                const isSelected = selectedSeat?.id === seat.id;
                return (
                  <div
                    key={seat.id}
                    className={`seat ${isSelected ? "selected" : ""}`}
                    style={{
                      position: "absolute",
                      left: `${seat.x}px`,
                      top: `${seat.y}px`,
                      width: `${seatWidth}px`,
                      height: `${seatHeight}px`,
                      backgroundColor: isReserved
                        ? "#999"
                        : isSelected
                        ? "#FFA6C9"
                        : "#D9D9D9",
                      cursor: isReserved ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleSelectSeat(seat)}
                    title={`${seat.grade}석 F3구역 ${seat.row}열 ${seat.number}`}
                  />
                );
              })}
            </div>
          )}

          <div className="ticket-f2-info">
            <div className="ticket-stage-selected">
              <h4>선택 좌석 / 예매 정보</h4>
              <table>
                <thead>
                  <tr>
                    <th>좌석 등급</th>
                    <th>좌석 번호</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedSeat ? selectedSeat.grade : "-"}</td>
                    <td>
                      {selectedSeat
                        ? `F3 구역 - ${selectedSeat.row}열 - ${selectedSeat.number}`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />

            <div className="ticket-stage-buttons">
              <button className="ticket-stage-next" onClick={handleNext}>
                좌석 선택 완료
              </button>
            </div>
            <br />

            <div className="ticket-stage-button2">
              <Link
                to={`/Ticket/Buy2/${id}`}
                state={{ selectedDate, ticketInfo }}
                className="ticket-stage-back"
              >
                이전 단계
              </Link>
              <button
                className="ticket-stage-back"
                onClick={() => setSelectedSeat(null)}
              >
                좌석 다시 선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
