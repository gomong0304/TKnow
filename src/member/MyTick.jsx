import React, { useEffect, useState } from "react";
import "../css/style.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Cons from "../images/cons.png";
import Consitt from "../images/consitt.png";
import Consbnd from "../images/consbnd.png";


export default function MyTick() {

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9090';
	const [token, setToken] = useState(null);


	// 또는 axios 인스턴스 사용 시
	const api = axios.create({
	  baseURL: 'http://localhost:9090',
	  headers: {
	    'Content-Type': 'application/json',
	  }
	});
	
	
	
	// 🔹 예시: 로그인 후 토큰 발급 (실제 로그인 API 호출 필요)
	const loginAndSaveToken = async () => {
		try {
			const res = await axios.post("http://localhost:9090/auth/login", {
				memberId: "jjj123",
				password: "jjj11111",
			});
			const accessToken = res.data.accessToken;
			console.log("🔑 로그인 성공, AccessToken:", accessToken);
			localStorage.setItem("accessToken", accessToken);
			return accessToken;
		} catch (err) {
			console.error("❌ 로그인 실패", err.response?.data || err.message);
			setError("로그인 실패");
			setLoading(false);
			return null;
		}
	};
	
	// ✅ 올바른 코드
	const fetchOrders = async () => {
	  try {
	    const response = await fetch(
	      "http://localhost:9090/orders?page=1&size=10",
	      { headers: { "Authorization": "Bearer " + token } }
	    );
	    const data = await response.json();
	    console.log(data);
	  } catch (error) {
	    console.error(error);
	  }
	};

	// 컴포넌트 마운트 시 호출
	useEffect(() => {
	  const t = localStorage.getItem("accessToken");
	  setToken(t);
	}, []);

	useEffect(() => {
	  const token = localStorage.getItem("accessToken");

	  console.log("=== 주문 조회 시작 ===");
	  console.log("1. 토큰:", token ? token.substring(0, 30) + "..." : "없음");

	  if (!token) {
	    console.error("❌ 토큰 없음");
	    setError("로그인이 필요합니다.");
	    setLoading(false);
	    return;
	  }

	  // 토큰 디코딩
	  try {
	    const payload = JSON.parse(atob(token.split('.')[1]));
	    console.log("2. 토큰 내용:", payload);
	    console.log("3. 만료시각:", new Date(payload.exp * 1000));
	    console.log("4. 현재시각:", new Date());
	    console.log("5. 만료여부:", payload.exp * 1000 < Date.now() ? "만료됨" : "유효함");
	  } catch (e) {
	    console.error("❌ 토큰 파싱 실패:", e);
	  }

	  axios.get("http://localhost:9090/ticketnow/orders", {
	    headers: { 
	      Authorization: `Bearer ${token}`,
	      "Content-Type": "application/json"
	    },
	    params: { page: 1, size: 10 },
	    withCredentials: true,
	  })
	  .then(res => {
	    
	    setOrders(res.data.list || []);
	    setLoading(false);
	  })
	  .catch(err => {
	   
	    
	    setError(err.response?.data?.message || err.message);
	    setLoading(false);
	  });
	}, []);


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

					<span className="member-box1-logout">로그아웃</span>
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

						{orders.map(order => (
						    <Link
						        key={order.ordersId}  // ← orderId → ordersId
						        to={`/member/ticket/${order.ordersId}`}  // ← orderId → ordersId
						        className="member-Member-conBox"
						    >
						        <img
						            src="https://via.placeholder.com/200x150"
						            alt="공연 썸네일"
						            className="member-Member-consImg"
						        />

						        <div className="member-Member-dayBox">
						            <span>{order.ddayText}</span>  {/* ← D-DAY 표시 */}

						            <div className="member-Member-dayBoxTb">
						                <table>
						                    <tbody>
						                        <tr><th>{order.ticketTitle}</th></tr>  {/* ← title → ticketTitle */}
						                        <tr><th>{order.ticketVenue || '장소 미정'}</th></tr>  {/* ← venue → ticketVenue */}
						                        <tr><td>{order.ticketDate} {order.showStartTime}</td></tr>  {/* ← date → ticketDate + showStartTime */}
						                    </tbody>
						                </table>
						            </div>
						        </div>
						    </Link>
						))}<br/>

						<Link to="/member/TkRead" className="member-Member-conBox2">
							<img src={Consbnd} alt="콘서트_썸네일" className="member-Member-consImg" />

							<div className="member-Member-dayBox">


								<div className="member-Member-dayBoxTb">
									<table>
										<tbody>
											<tr><th>2025 보이넥스트도어 단독 팬미팅〈KNOCK ON〉</th></tr>
											<tr><th>인천 인스파이어 아레나</th></tr>
											<tr><td>2025. 10. 18 (금) 13:00  </td></tr>
										</tbody>
									</table>
								</div>
							</div>
						</Link><br />

						<Link to="/member/TkRead" className="member-Member-conBox2">
							<img src={Consitt} alt="콘서트_썸네일" className="member-Member-consImg" />

							<div className="member-Member-dayBox">


								<div className="member-Member-dayBoxTb">
									<table>
										<tbody>
											<tr><th>2025 아일릿 단독 팬미팅〈Glitter Day〉</th></tr>
											<tr><th>고척 스카이돔</th></tr>
											<tr><td>2025. 09. 13 (토) 12:00  </td></tr>
										</tbody>
									</table>
								</div>
							</div>
						</Link><br /><br />
						<div className="member-ticket-plus">
							<strong> + </strong> <span> 내 티켓 목록 더 보기 </span>
						</div><br />
					</div><br />




				</div>

			</div >
		</div >

	);
}