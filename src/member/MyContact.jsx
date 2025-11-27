import React, { useEffect, useState } from "react";
import "../css/style.css";
import { Link, useParams,useNavigate } from "react-router-dom";
import api from "../api";

export default function MyContact() {
  const [inquiries, setInquiries] = useState([]);
  const { boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("http://localhost:9090/ticketnow/boards/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setInquiries(data.list || []))
      .catch((err) => console.error("문의 불러오기 실패:", err));
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

          <div className="mytick-main-box">
            <strong>내 문의 내역</strong>
            <br /><br />

			    {inquiries.map((inq) => (
			        <div
			          key={inq.boardId}
			          className="member-mycont-Box"
			          style={{ cursor: "pointer" }}
			          onClick={() => navigate(`/member/ContactRead/${inq.boardId}`)} // 클릭 시 이동
			        >
			          <div className="cont-cont-list">
			            <strong>[문의]</strong> <span>{inq.title}</span><br />
			            {inq.reply ? (
			              <p><strong>[답변]</strong> <span>{inq.reply}</span></p>
			            ) : (
			              <p><strong>[답변대기]</strong></p>
			            )}
			          </div>
			        </div>
			      ))}
			

            <br />

            <div className="member-myCont-plus">
              <strong> + </strong> <span> 내 문의 목록 더 보기 </span>
            </div><br />
          </div>
        </div><br />

        <div className="member-myCont-box">
          <Link to="/member/Contact" className="member-myCont-but1">1:1 문의하기</Link>
          <Link to="/member/OftenContact" className="member-myCont-but2">자주 묻는 질문</Link>
        </div>

      </div>
    </div>
  );
}
