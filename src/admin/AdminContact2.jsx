import React, { useEffect, useState } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";

export default function AdminAllInquiries() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("로그인이 필요합니다.");
      return;
    }

    // 여기 URL만 관리자를 위한 전체 목록으로 변경
    fetch("http://localhost:9090/ticketnow/admin/boards", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("전체 문의 내역:", data);
        setInquiries(data.list || []);
      })
      .catch((err) => console.error("문의 불러오기 실패:", err));
  }, []);

  return (
    <div className="member-Member-page">
      <div className="member-left">
        <div className="admin-Member-box1">
          <strong>관리자</strong><span> 님 반갑습니다!</span><br /><br />
          <table>
            <tbody>
              <tr><td><Link to="/admin/AdminMember" className="member-mytick">회원 관리</Link></td></tr>
              <tr><td>보안 관리</td></tr>
              <tr><td>공지사항 관리</td><td className="admin-btn">공지 등록</td></tr>
              <tr><td><Link to="/admin/AdminContact2" className="member-Member-click">1:1 문의사항 관리</Link></td></tr>
              <tr><td><Link to="/admin/AdminInven" className="member-mytick">재고 관리</Link></td>
                  <td><Link to="/admin/AdminInven2" className="admin-btn2">상품 등록</Link></td></tr>
            </tbody>
          </table>
          <hr className="member-box1-bottom" />
          <br /><br />
          <span className="member-box1-logout">로그아웃</span>
        </div>
      </div>

      <div className="member-right">
        <div className="member-myTk-box2">
          <div className="mytick-main-box">
            <strong>회원 문의 내역</strong>
            <br /><br />

            {inquiries.length === 0 ? (
              <p>문의 내역이 없습니다.</p>
            ) : (
              inquiries.map((inq, idx) => (
                <div className="member-mycont-Box" key={idx}>
                  <div className="cont-cont-list">
                    {/* 상세 보기 링크 */}
                    <Link to={`/admin/AdminContact/${inq.boardId}`} className="cont-link" style={{ textDecoration: "none", color: "inherit" }}>
                      <strong>[문의]</strong>
                      <span> {inq.title}</span>
                      <span style={{marginLeft: "10px", color:"#555" }}>({inq.memberId})</span>
                    </Link>

                    {inq.reply ? (
                      <p>
                        <strong>[답변]</strong>
                        <span> {inq.reply} </span>
                      </p>
                    ) : (
                      <p>
                        <strong>[답변대기]</strong>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}

            <br />
            <div className="member-myCont-plus">
              <strong> + </strong> <span> 문의 목록 더 보기 </span>
            </div><br />
          </div>
        </div><br />

      </div>
    </div>
  );
}
