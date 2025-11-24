import React, { useEffect, useState } from "react";
import "../css/style.css";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import F2 from "../images/f2.png";
import axios from "axios";

export default function F2Floor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedDate, ticket } = location.state || {}; // TicketBuy2에서 넘어온 데이터
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketInfo, setTicketInfo] = useState(ticket || null); // TicketBuy2에서 넘어온 공연 정보

  // 좌석 데이터 생성
  const rows = 12;
  const cols = 13;
  const seatWidth = 37.2;
  const seatHeight = 34.1;
  const seatGap = 5.1;
  const startX = 160;
  const startY = 0;

  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seats.push({
        id: `${r}-${c}`,
        grade: "R",
        row: r + 1,
        number: c + 1,
        x: startX + c * (seatWidth + seatGap),
        y: startY + r * (seatHeight + seatGap),
      });
    }
  }

  // 예약 좌석 + 공연 정보 가져오기
  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:9090/ticketnow/tickets/${id}/reserved-seats`)
      .then((res) => setReservedSeats(res.data.reservedSeats || []))
      .catch(() => {
        const randomReserved = [];
        const reservedCount = Math.floor(Math.random() * 50) + 23;
        for (let i = 0; i < reservedCount; i++) {
          const randomIndex = Math.floor(Math.random() * seats.length);
          if (!randomReserved.includes(seats[randomIndex].id)) {
            randomReserved.push(seats[randomIndex].id);
          }
        }
        setReservedSeats(randomReserved);
      })
      .finally(() => setLoading(false));

    if (!ticketInfo) {
      axios
        .get(`http://localhost:9090/ticketnow/tickets/${id}`)
        .then((res) => setTicketInfo(res.data))
        .catch((err) => console.error("공연 정보 조회 실패:", err));
    }
  }, [id]);

  const handleSelectSeat = (seat) => {
    if (reservedSeats.includes(seat.id)) {
      alert("이미 선택된 좌석입니다.");
      return;
    }
    setSelectedSeat(seat);
  };

  const handleNext = () => {
    if (!selectedSeat) {
      alert("좌석을 선택하세요!");
      return;
    }

    axios
      .post(`http://localhost:9090/ticketnow/tickets/${id}/select-seat`, {
        seatId: selectedSeat.id,
        grade: selectedSeat.grade,
        row: selectedSeat.row,
        number: selectedSeat.number,
      })
      .then(() => {
        navigate(`/Ticket/Buy3/${id}`, {
          state: { selectedSeat, selectedDate, ticketInfo },
        });
      })
      .catch(() => {
        // API 오류 시에도 페이지 이동
        navigate(`/Ticket/Buy3/${id}`, {
          state: { selectedSeat, selectedDate, ticketInfo },
        });
      });
  };

  return (
    <div className="ticket-stage-main">
      <div className="ticket-seage-page">
        <div className="ticket-buy-top">
          <button className="ticket-buy-button2">01&nbsp;<span className="ticket-buy-button-text1">날짜 선택</span></button>
          <button className="ticket-buy-button1">02&nbsp;<span className="ticket-buy-button-text1">좌석 선택</span></button>
          <button className="ticket-buy-button2">03&nbsp;<span className="ticket-buy-button-text1">가격 선택</span></button>
          <button className="ticket-buy-button2">04&nbsp;<span className="ticket-buy-button-text1">배송 선택</span></button>
          <button className="ticket-buy-button2">05&nbsp;<span className="ticket-buy-button-text1">결제하기</span></button>
        </div>
        <br />

        <div className="ticket-stage-middle">
          {loading ? (
            <p style={{ textAlign: "center" }}>좌석 정보를 불러오는 중입니다...</p>
          ) : (
            <div className="ticket-stage-map" style={{ position: "relative" }}>
              <img src={F2} className="ticket-f2-img" alt="좌석 배치도" />
              {seats.map((seat) => {
                const isReserved = reservedSeats.includes(seat.id);
                return (
                  <div
                    key={seat.id}
                    className={`seat ${selectedSeat?.id === seat.id ? "selected" : ""}`}
                    style={{
                      position: "absolute",
                      left: `${seat.x}px`,
                      top: `${seat.y}px`,
                      width: `${seatWidth}px`,
                      height: `${seatHeight}px`,
                      backgroundColor: isReserved
                        ? "#999"
                        : selectedSeat?.id === seat.id
                        ? "#FFA6C9"
                        : "#D9D9D9",
                      cursor: isReserved ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleSelectSeat(seat)}
                    title={`R석 ${seat.row}열 ${seat.number}`}
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
                    <td>{selectedSeat ? `F2 구역 - ${selectedSeat.row}열 - ${selectedSeat.number}` : "-"}</td>
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
              <Link to={`/Ticket/Buy2/${id}`} state={{ selectedDate, ticketInfo }} className="ticket-stage-back">
                이전 단계
              </Link>
              <button className="ticket-stage-back" onClick={() => setSelectedSeat(null)}>
                좌석 다시 선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
