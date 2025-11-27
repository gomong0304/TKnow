import React, { useEffect, useState } from "react";
import "../css/style.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function MyTick() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMyOrders = async () => {
			try {
				const token = localStorage.getItem("accessToken");
				
				if (!token) {
					setError("로그인이 필요합니다.");
					setLoading(false);
					return;
				}

				// 내 주문 내역만 가져오기 (JWT에서 자동으로 memberId 추출)
				const res = await api.get("/orders", {
					headers: { 
						Authorization: `Bearer ${token}` 
					},
					params: {
						page: 1,
						size: 10
					}
				});

				console.log("내 주문 내역:", res.data);
				
				// PageResponseDTO 구조에 맞게 데이터 추출
				const orderList = res.data.list || res.data.data || [];
				setOrders(orderList);
				setLoading(false);

			} catch (err) {
				console.error("주문 조회 실패:", err);
				
				if (err.response?.status === 401) {
					setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
					localStorage.removeItem("accessToken");
				} else {
					setError(err.response?.data?.message || "주문 내역을 불러올 수 없습니다.");
				}
				
				setLoading(false);
			}
		};

		fetchMyOrders();
	}, []);

	const formatDate = (dateArr) => {
		if (!dateArr || !Array.isArray(dateArr)) return "";
		const [year, month, day] = dateArr;
		return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		navigate("/login");
	};

	return (
		<div className="member-Member-page">
			<div className="member-left">
				<div className="member-Member-box1">
					<strong>힙합개냥이</strong><span>님 반갑습니다!</span><br /><br />
					<table>
						<tbody>
							<tr><td><Link to="/member/Member" className="member-Member">회원정보</Link></td></tr>
							<tr><td>보안설정</td></tr>
							<tr><td>회원등급</td></tr>
							<tr><td><Link to="/member/MyTick" className="member-Member-click">나의 티켓</Link></td></tr>
							<tr><td>나의 일정</td></tr>
							<tr><td><Link to="/member/Contact" className="member-mytick">1:1 문의 내역</Link></td></tr>
							<tr><td>고객센터</td></tr>
							<tr><td>공지사항</td></tr>
						</tbody>
					</table>
					<hr className="member-box1-bottom" />

					<table>
						<tbody className="member-box1-bottom1">
							<tr><td>내 아이돌 콘서트 앞 숙소 예약까지</td></tr>
							<tr><th>콘서트 준비는 티켓나우와 함께!</th></tr>
						</tbody>
					</table>
					<br /><br />

					<span className="member-box1-logout" onClick={handleLogout} style={{cursor: 'pointer'}}>
						로그아웃
					</span>
				</div>
			</div>

			<div className="member-right">
				<div className="member-myTk-box2">
					<div className="mytick-main-box">
						<strong>결제 내역</strong><br /><br />

						{loading && <p>로딩 중...</p>}
						{error && <p style={{ color: 'red' }}>{error}</p>}

						{!loading && !error && orders.length === 0 && (
							<p>주문 내역이 없습니다.</p>
						)}

						{orders.map((order, idx) => (
							<Link
								key={order.ordersId || idx}
								to={`/member/ticket/${order.ordersId}`}
								className={`member-Member-conBox ${idx === 0 ? 'recent-order' : 'older-order'}`}
							>
								<img
									src={order.ticketImageUrl || "https://via.placeholder.com/200x150"}
									alt="공연 썸네일"
									className="member-Member-consImg"
								/>
								<div className="member-Member-dayBox">
									<span>{order.ddayText || `D-${order.dday}`}</span>
									<div className="member-Member-dayBoxTb">
										<table>
											<tbody>
												<tr><th>{order.ticketTitle}</th></tr>
												<tr><th>{order.ticketVenue || '장소 미정'}</th></tr>
												<tr><td>{formatDate(order.ticketDate)} {order.showStartTime || ''}</td></tr>
											</tbody>
										</table>
									</div>
								</div>
							</Link>
						))}
						<br/>

						{orders.length > 0 && (
							<div className="member-ticket-plus">
								<strong> + </strong> <span> 내 티켓 목록 더 보기 </span>
							</div>
						)}
						<br />
					</div>
					<br />
				</div>
			</div>
		</div>
	);
}