// src/Ticket/TicketBuy6.jsx
import React, { useEffect, useState } from "react";
import "../css/ticket.css";
import "../css/style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cons from "../images/cons.png";
import Ticket from "../images/ticket.png";
import TKNOW_w from "../images/TKNOW_w.png";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import api from "../api";

const API_BASE = (process.env.REACT_APP_API_BASE || api.defaults.baseURL || "").replace(/\/$/, "");


export default function TicketBuy6() {

  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  
  const normal = paymentInfo?.normalCount || 1;
  const discount1 = paymentInfo?.discount1Count || 0;
  const discount2 = paymentInfo?.discount2Count || 0;
  const discount3 = paymentInfo?.discount3Count || 0;
  const total = normal + discount1 + discount2 + discount3;
  
  // 결제 정보 불러오기
  useEffect(() => {
    const info = location.state || JSON.parse(localStorage.getItem("lastPayment") || "{}");
    console.log("결제 정보 로드:");
    console.log("  normalCount:", info?.normalCount);
    console.log("  discount1Count:", info?.discount1Count);
    console.log("  discount2Count:", info?.discount2Count);
    console.log("  discount3Count:", info?.discount3Count);
    console.log("  전체 info:", info);
    setPaymentInfo(info);
  }, [location]);

    useEffect(() => {
    if (!paymentInfo || !paymentInfo.orderId) return;

    const token = localStorage.getItem("accessToken");

    let payUrl = "";
    let payData = {
      ordersId: paymentInfo.orderId,
      memberId: localStorage.getItem("memberId") || 1,
      amount: paymentInfo.totalPrice,
    };

     if (paymentInfo.paymentMethod === "신용카드") {
      payUrl = `${API_BASE}/pay/card/approve`;
      payData.cardCompany = paymentInfo.cardType;
    } else if (paymentInfo.paymentMethod === "무통장") {
      payUrl = `${API_BASE}/pay/vbank/issue`;
      payData.bankName = "신한";
    } else {
      payUrl = `${API_BASE}/pay/card/approve`;
      payData.cardCompany = "일반";
    }

    axios
      .post(payUrl, payData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      .then(res => console.log("결제 정보 DB 저장 완료:", res.data))
      .catch(err => console.error("결제 저장 실패:", err));
  }, [paymentInfo]);


  // 주문 데이터 DB 저장 + 창 닫기 / 홈 이동
  const handleClose = async () => {
	if (!paymentInfo?.seatIdList || paymentInfo.seatIdList.length === 0) {
	    alert("좌석이 선택되지 않았습니다.");
	    return;
	}

    const token = localStorage.getItem("accessToken");

    // 수량 검증 추가
    if (total < 1) {
      alert("주문 수량이 올바르지 않습니다.");
      return;
    }

    // 백엔드 DTO에 맞춰 필드명 변경
    const orderData = {
      ordersTotalAmount: paymentInfo.totalPrice, 
      ordersTicketQuantity: total,    
      seatIdList: paymentInfo.seatIdList
    };

    console.log("📤 주문 데이터 전송:");
    console.log("  ordersTotalAmount:", orderData.ordersTotalAmount);
    console.log("  ordersTicketQuantity:", orderData.ordersTicketQuantity);
    console.log("  seatIdList:", orderData.seatIdList);
    
    console.log(" 수량 계산:");
    console.log("  normal:", normal);
    console.log("  discount1:", discount1);
    console.log("  discount2:", discount2);
    console.log("  discount3:", discount3);
    console.log("  total:", total);

      try {
      const response = await axios.post(
        `${API_BASE}/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      console.log("주문 데이터 DB 저장 완료:", response.data);

      
      // 성공 시 창 닫기 또는 홈 이동
      if (window.opener) {
        window.close();
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("주문 저장 실패:", err.response?.data || err);
      alert("주문 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!paymentInfo || !paymentInfo.orderId) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>결제 정보를 찾을 수 없습니다.</h2>
        <Link to="/">홈으로 가기</Link>
      </div>
    );
  }

  const serialNumber = paymentInfo.orderId;

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

        <br />
        <div className="ticket-buy-middle">
          <div className="ticket-buy-middle-box">
            <div className="ticket-buy-middle-box1">
              <div className="ticket-buy6-box2">
                <div className="ticket-buy6-center1">
                  <div className="cons-img">
                    <img src={Cons} alt="콘서트 썸네일" />
                    <div className="ticket-buy6-table1">
                      <table>
                        <tbody>
                          <tr>{paymentInfo.ticketTitle}</tr><br />
                          <tr>{paymentInfo.ticketVenue}</tr><br />
                          <tr>
                            <td colSpan={3}>{paymentInfo?.ticketDate ? new Date(paymentInfo.ticketDate).toLocaleString("ko-KR") : ''}</td>
                          </tr><br />
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <br />
                <strong>결제 내역</strong><br /><br />

                <table className="ticket-buy6-center2">
                  <tbody>
                    <tr>
                      <th>예매일</th><td>｜</td>
                      <td>{new Date(paymentInfo.paymentDate).toLocaleString("ko-KR")}</td>
                      <th>상태</th><td>｜</td>
                      <td style={{ color: "#FFA6C9", fontWeight: "bold" }}>결제 완료</td>
                      <th>결제수단</th><td>｜</td>
                      <td>{paymentInfo.paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>
                <br />

                <strong>예매 내역</strong><br /><br />
                <table className="ticket-buy6-center2">
                  <tbody>
                    <tr>
                      <th>예매 번호</th><td>｜</td><td>{paymentInfo.orderId}</td>
                      <th>배송</th><td>｜</td><td>{paymentInfo.deliveryMethod || "현장"}</td>
                      <th>가격 등급</th><td>｜</td><td>일반 {normal}매</td>
                    </tr>
                    <tr>
                      <th>좌석번호</th><td>｜</td><td>{paymentInfo.seatInfo}</td>
                      <th>가격</th><td>｜</td><td>{paymentInfo.basePrice?.toLocaleString()} 원</td>
                      <th>취소 여부</th><td>｜</td><td>가능</td>
                    </tr>
                    <tr>
                      <th>수수료</th><td>｜</td><td>{paymentInfo.serviceFee?.toLocaleString()} 원</td>
                      <th>배송비</th><td>｜</td><td>{paymentInfo.deliveryFee?.toLocaleString()} 원</td>
                      <th>총 결제 금액</th><td>｜</td>
                      <td style={{ color: "#FFA6C9", fontWeight: "bold" }}>
                        {paymentInfo.totalPrice?.toLocaleString()} 원
                      </td>
                    </tr>
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
                  <div className="ticket-buy6-text1">{serialNumber}</div>
                  <div className="ticket-buy6-text2">{paymentInfo.ticketTitle}</div>

                  <table className="ticket-buy6-table">
                    <tr><th>예매번호</th><td>｜</td><td>{paymentInfo.orderId}</td></tr>
                    <tr><th>좌석위치</th><td>｜</td><td>{paymentInfo.seatInfo}</td></tr>
                    <tr><th>날짜</th><td>｜</td><td colSpan={3}>{paymentInfo?.ticketDate ? new Date(paymentInfo.ticketDate).toLocaleString("ko-KR") : ''}</td></tr>
                    <tr><th>장소</th><td>｜</td><td>{paymentInfo.ticketVenue}</td></tr>
                  </table>

                  <div className="ticket-qr-box">
                    <QRCodeCanvas
                      className="ticket-qr-img"
                      value={serialNumber}
                      size={150}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="Q"
                    />
                  </div>
                </div>
              </div>
            </div>

            <br />
            <div className="ticket-stage-button2">
              <Link to={`/Ticket/Buy5/${paymentInfo.ticketId}`} className="ticket-stage-back">
                이전 단계
              </Link>
              <button onClick={handleClose} className="ticket-stage-next3">
                나가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}