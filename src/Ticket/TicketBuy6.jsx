import React from "react";
import "../css/style.css";
import { Link } from "react-router-dom"
import Cons from "../images/cons.png";
import Ticket from "../images/ticket.png";
import TKNOW_w from "../images/TKNOW_w.png";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketBuy() {

	const serialNumber = "A123456789";


	return (

		<div className="ticket-buy-main">
			<div className="ticket-buy-page">

				<div className="ticket-buy-top">
					<button className="ticket-buy-button2">01&nbsp;
						<span className="ticket-buy-button-text1">날짜 선택</span></button>

					<button className="ticket-buy-button2">02&nbsp;
						<span className="ticket-buy-button-text1">좌석 선택</span></button>

					<button className="ticket-buy-button2">03&nbsp;
						<span className="ticket-buy-button-text1">가격 선택</span></button>

					<button className="ticket-buy-button2">04&nbsp;
						<span className="ticket-buy-button-text1">배송 선택</span></button>

					<button className="ticket-buy-button1">05&nbsp;
						<span className="ticket-buy-button-text1">결제하기</span></button>
				</div><br />


				<div className="ticket-buy-middle">

					<div className="ticket-buy-middle-box">
						<div className="ticket-buy-middle-box1">
							<div className="ticket-buy6-box2">

								<div className="ticket-buy6-center1">
									<div className="cons-img">
										<img src={Cons} alt="콘서트_썸네일" />
								

									<div className="ticket-buy6-table1">
										<table>
											<tbody>
												<tr>2025 투모로우바이투게더 단독 콘서트〈# :  유화〉</tr><br />
												<tr>잠실 올림픽경기장</tr><br />
												<tr>2025. 12. 05 (금) 14:00 </tr><br />
											</tbody>
										</table>
										</div>	</div>
									</div><br />


									<strong>결제 내역</strong><br /><br />

									<table className="ticket-buy6-center2">
										<tbody>
											<th>예매일</th><td>｜</td><td>2025. 10. 13 (금)</td>
											<th>상태</th><td>｜</td><td style={{ color: "#FFA6C9", fontWeight: "bold" }}>결제 완료</td>
											<th>결제수단</th><td>｜</td><td>신용카드</td>
										</tbody>
									</table><br />

									<strong>예매 내역</strong><br /><br />
									<table className="ticket-buy6-center2">

										<tbody>
											<tr><th>예매 번호</th><td>｜</td><td>tknow-123-47890</td>
												<th>배송</th><td>｜</td><td>일반</td>
												<th>가격 등급</th><td>｜</td><td>일반</td></tr>

											<tr><th>좌석번호</th><td>｜</td><td>F2 구역 - B 열 - 129</td>
												<th>가격</th><td>｜</td><td>143,000 원</td>
												<th>취소 여부</th><td>｜</td><td>가능</td></tr>

											<tr><th>수수료</th><td>｜</td><td>14,300 원</td>
												<th>배송비</th><td>｜</td><td>5,700 원</td>
												<th>총 결제 금액</th><td>｜</td><td style={{ color: "#FFA6C9", fontWeight: "bold" }}>163,000 원</td></tr>
										</tbody>
									</table>

								</div>

							</div>
						</div>

						<div className="ticket-set-setting2">
							<div className="ticket-set-setting">
								<div className="read-set">


									<div className="ticket-img">

										<img src={Ticket} alt="티켓_사진" className="ticket-base-img" />

										<img src={TKNOW_w} alt="티켓_사진" className="ticket-logow-img" />

										<div className="ticket-buy6-text1">6553512-4654351-135431-1243553</div>

										<div className="ticket-buy6-text2">2025 투모로우바이투게더 단독 콘서트 &lt; #:  유화 &gt;</div>

										<table className="ticket-buy6-table">
											<tr><th>예매번호</th><td>｜</td><td>tknow-123-478909</td></tr>
											<tr><th>좌석위치</th><td>｜</td><td>F2 구역 - B 열 - 129</td></tr>
											<tr><th>날짜</th><td>｜</td><td>2025. 12. 05 (금) 14:00 </td></tr>
											<tr><th>장소</th><td>｜</td><td>잠실 올림픽경기장</td></tr>
										</table>

										<div className="ticket-qr-box">
											<QRCodeCanvas className="ticket-qr-img"
												value={serialNumber}     // QR 안에 들어갈 값
												size={150}                // 크기(px)
												bgColor="#FFFFFF"        // 배경색
												fgColor="#000000"        // 코드색
												level="Q"                // 오류 보정율 (L/M/Q/H)
											/>
										</div>
									</div>

								</div>




							</div>
							<br />

							<div className="ticket-stage-button2">
								<Link to="/Ticket/Buy5" className="ticket-stage-back">
									이전 단계
								</Link>


								<Link to="/Ticket/Buy6" className="ticket-stage-next3">
									나가기
								</Link>
							</div>
						</div>

					</div>
				</div>

			</div>
			);
}