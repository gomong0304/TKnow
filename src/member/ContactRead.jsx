// src/member/ContactRead.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import MemberSidebar from "./MemberSidebar";
export default function Contact() {

	const navigate = useNavigate();
	const { boardId } = useParams();

	const [memberEmail, setMemberEmail] = useState("");
	const [memberPhone, setMemberPhone] = useState("");
	const [title, setTitle] = useState("");
	const [categoryType, setCategoryType] = useState("SHOW_INFO");
	const [orderTicketId, setOrderTicketId] = useState("");
	const [content, setContent] = useState("");
	const [attachments, setAttachments] = useState([]);
	const [previewImages, setPreviewImages] = useState([]);
	const [boardList, setBoardList] = useState([]);

	const token = localStorage.getItem("accessToken");
	const memberId = localStorage.getItem("memberId");

	// 회원 정보 가져오기
	useEffect(() => {
		if (!token || !memberId) return;
		api.get(`/members/${memberId}`, { headers: { Authorization: `Bearer ${token}` } })
			.then(res => {
				setMemberEmail(res.data.memberEmail || "");
				setMemberPhone(res.data.memberPhone || "");
			})
			.catch(err => console.error(err));
	}, [token, memberId]);

	// 내 문의 목록 불러오기
	useEffect(() => {
		if (!token) return;
		api.get("/boards/my", { headers: { Authorization: `Bearer ${token}` } })
			.then(res => {
				// 서버가 객체를 내려도 배열로 변환
				const list = Array.isArray(res.data) ? res.data : res.data.items || [];
				setBoardList(list);
			})
			.catch(err => console.error(err));
	}, [token]);

	// 상세 문의 불러오기
	useEffect(() => {
	  if (!boardId || !token) return;
	  api.get(`/boards/my/${boardId}`, { headers: { Authorization: `Bearer ${token}` } })
	    .then(res => {
	      console.log("상세 문의 데이터:", res.data); // <-- 여기에 images가 있는지 확인
	      const data = res.data;
	      setTitle(data.title || "");
	      setContent(data.content || "");
	      setAttachments(data.images || []);
	      setPreviewImages((data.images || []).map(img => img.img_url));
	    })
	    .catch(err => console.error(err));
	}, [boardId, token]);

	// 파일 선택 시 미리보기
	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setAttachments(files);

		const previews = files.map(file => URL.createObjectURL(file));
		setPreviewImages(previews);
	};

	// 문의 등록
	const handleSubmit = async () => {
		if (!token || !memberId) return;

		const formData = new FormData();
		formData.append("memberEmail", memberEmail);
		formData.append("memberPhone", memberPhone);
		formData.append("title", title);
		formData.append("categoryType", categoryType);
		formData.append("orderTicketId", orderTicketId);
		formData.append("content", content);
		attachments.forEach(file => formData.append("attachments", file));

		try {
			await api.post("/boards/inquiry", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
					"X-Request-Id": crypto.randomUUID(),
				},
			});
			alert("문의 등록 완료!");
			navigate("/member/MyContact");
		} catch (err) {
			console.error(err);
			alert("문의 등록 실패!");
		}
	};

	return (
		<div className="member-Member-page">
			<MemberSidebar active="myContact" />
			<div className="member-right">
				<div className="member-myTk-box2">
					<div className="costs-main-box">
						<strong>1:1 문의하기</strong>
						<br />
						<br />
						<div className="member-conts-conBox">
							<div className="cont-conts-list">
								<table>
									<tbody>
										<tr>
											<th>이메일 주소</th>
										</tr>
										<tr>
											<td>
												<input type="text" value={memberEmail} readOnly />
											</td>
										</tr>

										<tr>
											<th>휴대 전화 번호</th>
										</tr>
										<tr>
											<td>
												<input type="text" value={memberPhone} readOnly />
											</td>
										</tr>

										<tr>
											<th>문의 유형</th>
										</tr>
										<tr>
											<td>
												<select
													value={categoryType}
													onChange={(e) => setCategoryType(e.target.value)}
													className="Ad-conts-resNum"
												>
													<option value="SHOW_INFO">공연 정보</option>
													<option value="TICKET_BOOKING">예메</option>
													<option value="REFUND">환불</option>
													<option value="FREE">계정</option>
													<option value="ACCOUNT">시스템</option>
													<option value="TECHNICAL">기타</option>
												</select>
											</td>
										</tr>

										<tr>
											<th>예약번호</th>
										</tr>
										<tr>
											<td>
												<input
													type="number"
													className="conts-resNum"
													value={orderTicketId} onChange={e => setOrderTicketId(e.target.value)} />
												&nbsp;&nbsp;&nbsp;
												<button type="button" className="conts-resNumBtn">
													예약번호 조회
												</button>
											</td>
										</tr>

										<tr>
											<th>문의 제목</th>
										</tr>
										<tr>
											<td>
												<input value={title} onChange={e => setTitle(e.target.value)} />
											</td>
										</tr>

										{/* 문의 내용 (읽기 전용) */}
						{/* 문의 내용 (읽기 전용) */}
						<tr>
						<th>문의내용</th>
						</tr>
						<tr>
						<td>
							<textarea
							rows="6"
							className="conts-area"
							value={content}    
							readOnly           // 읽기 전용
							/>
						</td>
						</tr>

						{/* 첨부 이미지 표시 */}
						<tr>
						<th>첨부파일</th>
						</tr>
						{attachments && attachments.length > 0 ? (
						attachments.map((img, idx) => (
							<tr key={idx}>
							<td>
								{/* 원본 파일명 텍스트 (있으면) */}
								{(img.origin_name || img.originName) && (
								<>
									<span>{img.origin_name || img.originName}</span>
									<br />
								</>
								)}

								{/* 실제 이미지 */}
								<img
								src={img.img_url || img.imageUrl}  // 백엔드에서 내려주는 필드에 맞게 둘 다 대응
								alt={img.origin_name || img.originName || `첨부파일 ${idx + 1}`}
								style={{ maxWidth: "200px", marginTop: "8px" }}
								/>
							</td>
							</tr>
						))
						) : (
						<tr>
							<td>첨부 이미지가 없습니다.</td>
						</tr>
						)}


									

										<tr>
										   <td>
										     <button className="conts-conts-btn" onClick={handleSubmit}>
										       문의하기
										     </button>
										   </td>
										 </tr>

									</tbody>
								</table>
							</div>

							{/* 내 문의 목록 + 이미지 */}
							<div className="member-tkRead-dayBox">
								{boardList.map(board => (
									<div
										key={board.boardId}
										style={{
											marginTop: "15px",
											borderTop: "1px solid #ddd",
											paddingTop: "10px",
										}}
									>
										<strong>{board.title}</strong>
										<p>{board.content}</p>

										{/* 이미지 박스 */}
										<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
										{board.attachments?.length > 0 ? (
										  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
										    {board.attachments.map((img, idx) => {
										      console.log("이미지 URL:", img.img_url); // 이제 찍힘
										      return (
										        <div
										          key={idx}
										          style={{
										            width: "120px",
										            height: "120px",
										            borderRadius: "6px",
										            overflow: "hidden",
										            border: "1px solid #ccc",
										          }}
										        >
										          <img
										            src={img.img_url} // 서버에서 내려주는 URL 그대로
										            alt={img.origin_name || "img"}
										            style={{ width: "100%", height: "100%", objectFit: "cover" }}
										          />
										        </div>
										      );
										    })}
										  </div>
										) : (
										  <p>등록된 이미지가 없습니다.</p>
										)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
