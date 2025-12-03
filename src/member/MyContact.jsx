// src/member/MyContact.jsx
import React, { useEffect, useState } from "react";
import "../css/member.css";
import "../css/style.css";
import { Link, useParams,useNavigate } from "react-router-dom";
import api from "../api";
import MemberSidebar from "./MemberSidebar";
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
    <div className="member-Member-page-1">
      
      <MemberSidebar active="myContact" />

      <div className="member-right">
        <div className="member-myTk-box2-1">
            <strong>&nbsp;&nbsp;내 문의 내역</strong>

			    {inquiries.map((inq) => (
			        <div
			          key={inq.boardId}
			          className="member-mycont-Box-1"
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
          
        </div><br />

        <div className="member-myCont-box">
          <Link to="/member/Contact" className="member-myCont-but1">1:1 문의하기</Link>
          <Link to="/member/OftenContact" className="member-myCont-but2">자주 묻는 질문</Link>
        </div>

      </div>
    </div>
  );
}
