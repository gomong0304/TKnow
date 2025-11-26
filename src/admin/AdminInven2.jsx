import React, { useState } from "react";
import "../css/style.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminInven2() {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [startAt, setStartAt] = useState({ year: "", month: "", day: "", hour: "", minute: "" });
	const [endAt, setEndAt] = useState({ year: "", month: "", day: "", hour: "", minute: "" });
	const [venueName, setVenueName] = useState("");
	const [venueAddress, setVenueAddress] = useState("");
	const [totalSeats, setTotalSeats] = useState("");
	const [price, setPrice] = useState("");
	const [ticketCost, setTicketCost] = useState("");
	const [ticketPrice, setTicketPrice] = useState("");
	const [ticketStock, setTicketStock] = useState("");
	const [ticketDetail, setTicketDetail] = useState("");
	const [ageLimit, setAgeLimit] = useState("");
	const [benefit, setBenefit] = useState("");
	const [promotion, setPromotion] = useState("");
	const [mainImage, setMainImage] = useState(null);
	const [detailImage, setDetailImage] = useState(null);
	const [category, setCategory] = useState("");
	const [ticketStatus, setTicketStatus] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// 날짜/시간 형식: yyyy-MM-ddTHH:mm:ss
			const startDateTime = `${startAt.year}-${startAt.month.padStart(2, '0')}-${startAt.day.padStart(2, '0')}T${startAt.hour.padStart(2, '0')}:${startAt.minute.padStart(2, '0')}:00`;
			const endDateTime = `${endAt.year}-${endAt.month.padStart(2, '0')}-${endAt.day.padStart(2, '0')}T${endAt.hour.padStart(2, '0')}:${endAt.minute.padStart(2, '0')}:00`;

			const payload = {
				title,
				category: category, // 기본값
				startAt: startDateTime,
				endAt: endDateTime,
				venueName,
				venueAddress,
				totalSeats: parseInt(totalSeats) || 0,
				price: parseFloat(price) || 0,
				ticketCost: ticketCost ? parseFloat(ticketCost) : null,
				ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
				ticketStock: ticketStock ? parseInt(ticketStock) : null,
				ticketDetail,
				ageLimit,
				benefit,
				promotion,
				ticketStatus
			};

			console.log("전송 데이터:", payload);

			const token = localStorage.getItem("accessToken");

			const res = await axios.post(
				"http://localhost:9090/ticketnow/tickets",
				payload,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert("상품 등록 성공!");
			console.log("응답:", res.data);
			navigate("/admin/AdminInven");

		} catch (err) {
			console.error("상품 등록 실패:", err);
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};
	
	

	return (
		<form className="member-Member-page" onSubmit={handleSubmit}>
			<div className="member-left">
				<div className="admin-Member-box1">
					<strong>관리자</strong><span> 님 반갑습니다!</span><br /><br />
					<table>
						<tbody>
							<tr><td><Link to="/admin/AdminMember" className="member-mytick">회원 관리</Link></td></tr>
							<tr><td>보안 관리</td></tr>
							<tr><td>공지사항 관리</td><td className="admin-btn">공지 등록</td></tr>
							<tr><td><Link to="/admin/AdminContact2" className="member-mytick">1:1 문의사항 관리</Link></td></tr>
							<tr><td><Link to="/admin/AdminInven" className="member-Member-click">재고 관리</Link></td>
								<td><Link to="/admin/AdminInven2" className="admin-btn2">상품 등록</Link></td></tr>
						</tbody>
					</table>
					<hr className="member-box1-bottom" /><br /><br />
					<span className="member-box1-logout">로그아웃</span>
				</div>
			</div>

			<div className="member-right">
				<div className="member-myTk-box2">
					<div className="costs-main-box">
						<br /><br />

						{error && (
							<div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red' }}>
								 {error}
							</div>
						)}

						<div className="member-conts-conBox">
							<div className="Admin-conts-list">
								<table className="AdConts-table">
									<tbody>
										<tr><th>상품명 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr><td><input type="text" className="Ad-conts-resNum" value={title} onChange={e => setTitle(e.target.value)} required /></td></tr>

										<tr><th>판매 상태 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr>
											<td>
												<select value={ticketStatus} className="Ad-conts-resNum" onChange={e => setTicketStatus(e.target.value)} required>
												<option value="" disabled>선택하세요</option>	
												<option value="ON_SALE">판매중</option>
													<option value="SOLD_OUT">매진</option>
													<option value="SCHEDULED">오픈 예정</option>
													<option value="CLOSED">판매 종료</option>
												</select>
											</td>
										</tr>

										<tr><th>카테고리 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr>
											<td>
												<select value={category} className="Ad-conts-resNum" onChange={e => setCategory(e.target.value)} required>
												<option value="" disabled>선택하세요</option>	
												<option value="CONCERT">콘서트</option>
													<option value="MUSICAL">뮤지컬</option>
													<option value="SPORTS">스포츠</option>
													<option value="EXHIBITION">전시회</option>
												</select>
											</td>
										</tr>

										<tr><th>공연 시작 일시 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr>
											<td>
												<input type="text" placeholder="YYYY" className="admin-inven-phone1" value={startAt.year} maxLength="4" onChange={e => setStartAt({ ...startAt, year: e.target.value })} required />
												<input type="text" placeholder="MM" className="admin-inven-phone1" value={startAt.month} maxLength="2" onChange={e => setStartAt({ ...startAt, month: e.target.value })} required />
												<input type="text" placeholder="DD" className="admin-inven-phone1" value={startAt.day} maxLength="2" onChange={e => setStartAt({ ...startAt, day: e.target.value })} required />
												<input type="text" placeholder="HH" className="admin-inven-phone1" value={startAt.hour || ""} maxLength="2" onChange={e => setStartAt({ ...startAt, hour: e.target.value })} required />
												:
												<input type="text" placeholder="mm" className="admin-inven-phone1" value={startAt.minute || ""} maxLength="2" onChange={e => setStartAt({ ...startAt, minute: e.target.value })} required />
											</td>
										</tr>

										<tr><th>공연 종료 일시 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr>
											<td>
												<input type="text" placeholder="YYYY" className="admin-inven-phone1" value={endAt.year} maxLength="4" onChange={e => setEndAt({ ...endAt, year: e.target.value })} required />
												<input type="text" placeholder="MM" className="admin-inven-phone1" value={endAt.month} maxLength="2" onChange={e => setEndAt({ ...endAt, month: e.target.value })} required />
												<input type="text" placeholder="DD" className="admin-inven-phone1" value={endAt.day} maxLength="2" onChange={e => setEndAt({ ...endAt, day: e.target.value })} required />
												<input type="text" placeholder="HH" className="admin-inven-phone1" value={endAt.hour || ""} maxLength="2" onChange={e => setEndAt({ ...endAt, hour: e.target.value })} required />
												:
												<input type="text" placeholder="mm" className="admin-inven-phone1" value={endAt.minute || ""} maxLength="2" onChange={e => setEndAt({ ...endAt, minute: e.target.value })} required />
											</td>
										</tr>

										<tr><th>공연 장소 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr><td><input type="text" className="Ad-conts-resNum" value={venueName} onChange={e => setVenueName(e.target.value)} required /></td></tr>

										<tr><th>공연장 주소</th></tr>
										<tr><td><input type="text" className="Ad-conts-resNum" value={venueAddress} onChange={e => setVenueAddress(e.target.value)} /></td></tr>

										<tr><th>총 좌석 수 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr><td><input type="number" min="1" className="Ad-conts-resNum" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required /></td></tr>

										<tr><th>기본 가격 <span style={{ color: 'red' }}>*</span></th></tr>
										<tr>
										  <td>
										    <input
										      type="number"
										      min="0"
										      className="Ad-conts-resNum"
										      value={price}
										      onChange={e => {
										        const val = e.target.value;
										        setPrice(val);
										        if (val) setTicketCost((parseFloat(val) * 0.4).toFixed(0)); // 40% 자동 계산
										        else setTicketCost("");
										      }}
										      required
										    />
										  </td>
										</tr>

										<tr><th>매입 원가</th></tr>
										<tr>
										  <td>
										    <input
										      type="number"
										      min="0"
										      className="Ad-conts-resNum"
										      value={ticketCost}
										      readOnly
										    />
										  </td>
										</tr>

										<tr><th>상품 상세 설명</th></tr>
										<tr><td><textarea className="Ad-conts-resNum" value={ticketDetail} onChange={e => setTicketDetail(e.target.value)} rows="4" style={{ width: '100%' }} /></td></tr>


										<tr><th>대표 이미지</th></tr>
										<tr><td><input type="file" accept="image/*" onChange={e => setMainImage(e.target.files[0])} /></td></tr>

										<tr><th>상품 설명 이미지</th></tr>
										<tr><td><input type="file" accept="image/*" onChange={e => setDetailImage(e.target.files[0])} /></td></tr>

										<tr>
											<td>
												<button type="submit" className="conts-conts-btn" disabled={loading}>
													{loading ? "등록 중..." : "등록하기"}
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}