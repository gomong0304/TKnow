import React, { useState } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import Cons from "../images/cons.png";
import ConsRead from "../images/Consread.png";
import Girl from "../images/girl.png";
import Boy from "../images/boy.png";


export default function Read() {
    const [selectedDate, setSelectedDate] = useState(null);

    const schedule = {
        "2025-12-05": [{ round: "1회", time: "14:00" }],
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="read-top">
            <div className="read-page">
                
                <div className="read-content">
                    
                    <div className="read-main">
                        <section className="read-right">
                            <h2>2025 투모로우바이투게더 단독 콘서트〈#: 유화〉</h2>
                            <h3>콘서트 주간 1위</h3>

                            <div className="read-set">
                                <div className="cons-img">
                                    <img src={Cons} alt="콘서트_썸네일" />
                                </div>

                                <div className="read-table">
                                    <table>
                                        <tbody>
                                            <tr><th>장소</th><td>잠실 올림픽경기장</td></tr>
                                            <tr><th>날짜</th><td>2025. 12. 05 ~ 2025. 12. 07</td></tr>
                                            <tr><th>공연 시간</th><td>300 분</td></tr>
                                            <tr><th>관람 연령</th><td>미취학 아동 입장 불가</td></tr>
                                            <tr><th>가격</th><td>전체 가격 보기 ▶</td></tr>
                                            <tr><th></th><td>R 석 143,000 원</td></tr>
                                            <tr><th></th><td>S 석 132,000 원</td></tr>
                                            <tr><th>혜택</th><td>무이자할부 ▶</td></tr>
                                            <tr><th></th><td>위버스 멤버십 가입자 10 % 할인 받기</td></tr>
                                            <tr><th></th><td>웨이크원 멤버십 가입자 15 % 할인 받기</td></tr>
                                            <tr><th>프로모션</th><td>일 선착순 200 명 5만 원 결제시 5천 원 할인</td></tr>
                                            <tr><th></th><td>2026 년 01 월 15 일에 배송되는 상품입니다.</td></tr>
                                            <tr><th>배송</th><td>일괄배송일: 10 월 30 일 (목)~ 31 일 (금), 2 일간</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="read-particular">
                                <div className="button-class">
                                    <button className="read-button2">공연정보</button>
                                    <button className="read-button1">판매정보</button>
									<Link to="/Ticket/Review">
									        <button className="read-button1">공연후기</button>
									    </Link>
                                    <button className="read-button1">기대평</button>
                                    <button className="read-button1">QNA</button>
                                </div>
                            </div><br/><br/><br/>

                            <div className="concert-particular">
                                <strong className="concert-particular-1">공연 시간 정보</strong><br/><br/>
                                <p>2025 년 12 월 5 일 (금) 오후 2 시</p>
                                <p>2025 년 12 월 6 일 (토) 오후 2 시</p>
                                <p>2025 년 12 월 7 일 (일) 오후 2 시</p><br/><br/><br/>

                                <strong className="concert-particular-1">공연 상세 / 출연진 정보</strong><br/><br/>
                                <img src={ConsRead} className="Consread-img" alt="콘서트_상세" />
                            </div><br/><br/><br/><br/><br/>
				
							 <strong className="concert-particular-1">예매자 통계</strong><br/><br/>
							<div className="sex-ratio">
							<p className="ratio-text1">97 %</p>
							<img src={Girl} alt="여성_썸네일" />
							<p className="ratio-text2">3 %</p>
							<img src={Boy} alt="남성_썸네일" />
							</div>
                        </section>
                    </div>

                    <div className="reservation-setting">
                        <div className="reservation">
                            <div className="calendar-section">
                                <h2>날짜 선택</h2>
                                <div className="calendar">
                                    {Array.from({ length: 31 }, (_, i) => {
                                        const day = i + 1;
                                        const dateStr = `2025-12-${day.toString().padStart(2, "0")}`;
                                        const isSelected = selectedDate === dateStr;
                                        return (
                                            <button
                                                key={day}
                                                className={`calendar-day ${isSelected ? "selected" : ""}`}
                                                onClick={() => handleDateClick(dateStr)}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className={`schedule ${selectedDate && schedule[selectedDate] ? "show-note" : ""}`}>
                                    {schedule[selectedDate]?.map((item, idx) => (
                                        <div key={idx} className="round">
                                            <span className="round-num">{item.round}</span>&nbsp;
                                            <span className="round-time">{item.time}</span>
                                        </div>
                                    ))}<br/>
                                    <p className="note">잔여석 안내 서비스를 제공하지 않습니다.</p>
                                </div>
                            </div>

							<button className="reserve-btn" onClick={() => window.open("/Ticket/Buy2", "TicketBuy2", "width=1450, height=1024, scrollbars=yes")}
							>예매하기</button>
                            <p className="bottom-note">
                                위버스 멤버십 가입자 10% 적립 &gt; <br />
                                <span>이 공연이 궁금하다면</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
