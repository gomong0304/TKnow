import React, { useState } from "react";
import axios from "axios";
import "../css/style.css";
import { Link } from "react-router-dom";



export default function Contact() {
	
	const[email, setEmail] = useState("");
	const[phone, setPhone] = useState("");
	const[noticetype, setNoticetype] = useState("");
	const[reservation, setReservation] = useState("");
	const[details, setDetails] = useState("");
	const[file, setfile] = useState(null);
	
	const handleSubmit = async () => {
	  const formData = new FormData();
	  formData.append("email", email);
	  formData.append("phone", phone);
	  formData.append("noticetype", noticetype);
	  formData.append("reservation", reservation);
	  formData.append("reservationNo", details);
	  formData.append("content", file);

	  if (file) {
	    formData.append("attachments", file); // 백엔드 DTO 필드명 맞춰야 함
	  }

	  try {
	    const res = await axios.post("/boards/inquiry", formData, {
	      headers: {
	        Authorization: `Bearer ${localStorage.getItem("access")}`,
	        "Content-Type": "multipart/form-data",
	        "X-Request-Id": crypto.randomUUID() // 선택
	      }
	    });

	    alert("문의 등록을 완료했습니다");
	    console.log("boardId:", res.data);

	  } catch (err) {
	    console.error(err);
	    alert("문의 등록을 실패했습니다");
	  }
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
							<tr><td><Link to="/member/MyTick" className="member-Member">나의 티켓</Link></td></tr>
							<tr><td>나의 일정</td></tr>
							<tr><td><Link to="/member/MyContact" className="member-Member-click">1:1 문의 내역</Link></td></tr>
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
					<div className="costs-main-box">
						<strong>1:1 문의하기</strong>
						<br /><br />
						<div className="member-conts-conBox">
							<div className="cont-conts-list">
								<table>
									<tbody>
										<tr><th>이메일 주소</th></tr>
										<tr><td><input type="text" onChange={(e) => setEmail(e.target.value)}></input></td></tr>
										<tr><th>휴대 전화 번호</th></tr>
										<tr><td><input type="text" onChange={(e) => setPhone(e.target.value)}></input></td></tr>
										<tr><th>문의 유형</th></tr>
										<tr><td><input type="text" onChange={(e) => setNoticetype(e.target.value)}></input></td></tr>
										<tr><th>예약번호</th></tr>
										<tr><td><input type="text" alt="예약번호"  className="conts-resNum" onChange={(e) => setReservation(e.target.value)}>
										</input>&nbsp;&nbsp;&nbsp;
										<button type="text" className="conts-resNumBtn">예약번호 조회</button></td></tr>
										<tr><th>문의내용</th></tr>
										<tr><td><textarea type="text" rows="6" className="conts-area" onChange={(e) => setDetails(e.target.value)}>
										</textarea></td></tr>
										<tr>
										  <th>첨부파일</th>
										</tr>
										<tr>
										  <td>
										
										  <input 
										     type="text" 
										     alt="첨부파일" 
										     className="conts-resNum" 
										     value={file ? (Array.isArray(file) ? file.map(f => f.name).join(', ') : file.name) : ''} 
										     readOnly 
										   />

										    &nbsp;&nbsp;&nbsp;

										 
										    <label className="conts-resNumBtn">
										      첨부파일
										      <input 
										        type="file" 
										        style={{ display: "none" }} 
										        onChange={(e) => { 
										          if (e.target.files) setfile(Array.from(e.target.files)) 
										        }} 
										      />
										    </label>
										  </td>
										</tr>
										<br/>
										
										
										
										<button type="text" className="conts-conts-btn" onClick={handleSubmit}>문의하기</button>
									</tbody>
								</table>
								<input 
								   type="file" 
								   style={{ display: "none" }} 
								   onChange={(e) => { 
								     if (e.target.files) {
								       const filesArray = Array.from(e.target.files);
								       setfile(filesArray.length === 1 ? filesArray[0] : filesArray);
								     }
								   }} 
								 />

							</div>

							<div className="member-tkRead-dayBox">
								<div className="member-tkRead-my">



								</div>
							</div>
						</div>










					</div>
				</div>
			</div>
		</div>



	);
}