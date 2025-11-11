import React, { useState } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import Cons from "../images/cons.png";

export default function TicketBuy() {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-12-01"));

  const handleDateClick = (day) => {
    setSelectedDate(new Date(`2025-12-${day.toString().padStart(2, "0")}`));
  };

  return (
    <div className="ticket-buy-main">
      <div className="ticket-buy-page">
        <div className="ticket-buy-top">
          <button className="ticket-buy-button1">
            01&nbsp;<span className="ticket-buy-button-text1">날짜 선택</span>
          </button>
          <button className="ticket-buy-button2">
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

        <div className="ticket-buy-middle">
          <div className="ticket-buy-middle-box">
            <div className="ticket-buy-middle-box1">
              <div className="ticket-buy-day1">
                <strong>관람일 선택</strong><br/><br/>
                <div className="calendar1">
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const isSelected =
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === 11 &&
                      selectedDate.getFullYear() === 2025;
                    return (
                      <button
                        key={day}
                        className={`calendar-day ${isSelected ? "selected" : ""}`}
                        onClick={() => handleDateClick(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: "10px" }}>
                  선택 날짜: {selectedDate.toLocaleDateString("ko-KR")}
                </div>
				</div>

                <div className="ticket-buy-day2">
                  <strong>회차</strong>&nbsp;
                  <span style={{ fontSize: "16px", color: "@ffbcd4" }}>(관람 시간)</span>
                  <div className="ticket-buy-round">
                    <button className="round-btn selected">14시 00분</button>
                  </div>
                </div>

                <div className="ticket-buy-day3">
                  <strong>좌석 등급 / 잔여석</strong>
                  <div className="ticket-buy-seat">
                    <p>R석 143,000원</p>
                    <p>S석 132,000원</p>
                  </div>
                </div>
              </div>

              <div className="ticket-buy-note">
                <strong>유의사항</strong>
                <div className="ticket-buy-note-text">
                  <br />
                  <p>장애인, 국가유공자 할인 가격 예매 시 현장 수령만 가능하며, 현장에 증명서류 미지침시 할인 불가합니다.</p>
                  <p>할인 쿠폰을 사용하여 예매한 티켓은 부분  취소가 불가합니다.</p>
                  <p>당일 관리 상품 예매시는 취소 불가합니다.</p>
                  <p>취소 수수료와 취소 가능일자는 상품별로 다르니, 오른쪽 하단 My 예매 정보에서 확인해 주시기 바랍니다.</p>
                  <p>ATM 기기에서 가상 계좌 입금이 안 될 수 있으니 인터넷 / 폰 뱅킹이 어려우시면 무통장 입금 외 다른 결제 수단을 선택해 주세요.</p>
                </div>
              </div>
            </div>

            <div className="ticket-set-setting2">
              <div className="ticket-set-setting">
                <div className="read-set">
                  <div className="cons-img">
                    <img src={Cons} alt="콘서트_썸네일" />
                  </div>
                  <div className="read-table">
                    <table>
                      <tbody>
                        <tr>
                          <th>2025 투모로우바이투게더 단독 콘서트〈# :  유화〉</th>
                        </tr>
                        <tr>
                          <th>2025. 12. 05 ~ 2025. 12. 07</th>
                        </tr>
                        <tr>
                          <th>잠실 올림픽경기장</th>
                        </tr>
                        <tr>
                          <th>미취학아동 관람 불가</th>
                        </tr>
                        <tr>
                          <th>관람 시간: 300 분</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <table className="ticket-buy-table2">
                  <tbody>
                    <strong className="ticket-buy-my">My 예매 정보 </strong>
                    <br />
                    <tr>
                      <th>일시</th>
                      <td>2025 년 12 월 05 일  (금) 14:00</td>
                    </tr>
                    <tr>
                      <th>선택 좌석</th>
                      <td>F2 구역 - B 열 - 129</td>
                    </tr>
                    <tr>
                      <th>티켓 금액</th>
                      <td>143,000 원</td>
                    </tr>
                    <tr>
                      <th>수수료</th>
                      <td>14,300 원</td>
                    </tr>
                    <tr>
                      <th>배송료</th>
                      <td>5,700 원</td>
                    </tr>
                    <tr>
                      <th>할인</th>
                      <td>0 원</td>
                    </tr>
                    <tr>
                      <th>배송료</th>
                      <td>0 원</td>
                    </tr>
                    <tr>
                      <th>취소기한</th>
                      <td>2025 년 12 월 10 일 (수) 14:00</td>
                    </tr>
                    <tr>
                      <th>취소수수료</th>
                      <td>티켓 금액의 0 ~ 50 %</td>
                    </tr>
                  </tbody>
                </table>

                <div className="ticket-buy-total">
                  <span>총 결제 금액</span>
                  <strong>163,000</strong>
                  <p>원</p>
                </div>
              </div>
              <br />
              <Link to="/Ticket/Buy2" className="ticket-next-btn">
                다음 단계
              </Link>
            </div>
          </div>
        </div>
      </div>
    
  );
}
