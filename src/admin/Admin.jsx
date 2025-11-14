import React, { useState, useEffect } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import Kkw from "../images/kkw.png";
import ProMod from "../images/pro_mod.png";
import User from "../images/user.png";
import Inventory1 from "../images/inventory1.png";
import Inventory2 from "../images/inventory2.png";
import Inventory3 from "../images/inventory3.png";

export default function Member() {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // JWT 토큰
    if (!token) return;

    fetch("/members/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Request-Id": "admin-page"
      },
    })
      .then(res => {
        if (res.status === 401) {
          console.log("로그인 필요 또는 토큰 만료");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setAdminInfo(data);
      })
      .catch(err => console.error("관리자 정보 불러오기 실패", err));
  }, []);

  return (
    <div className="member-Member-page">

      <div className="member-left">
        <div className="admin-Member-box1">
          <strong>{adminInfo?.member_name || "관리자"}</strong><span> 님 반갑습니다!</span><br /><br />
          <table>
            <tbody>
              <tr><td><Link to="/admin/AdminMember" className="member-mytick">회원 관리</Link></td></tr>
              <tr><td>보안 관리</td></tr>
              <tr><td>공지사항 관리</td><td className="admin-btn">공지 등록</td></tr>
              <tr><td><Link to="/admin/AdminContact" className="member-mytick">1:1 문의사항 관리</Link></td></tr>
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
        <div className="member-Member-box2">

          <div className="member-pro-box">
            <div className="member-Member-propile-imgBox">
              <img src={Kkw} alt="프로필_사진" className="member-Member-proImg" />
              <img src={ProMod} alt="프로필_사진" className="member-Member-prMod" />

              <div className="member-propile-table">
                <table>
                  <tbody>
				  <tr><th>아이디</th><td>{adminInfo?.memberId || ""}</td></tr>
				  <tr><th>이메일</th><td>{adminInfo?.memberEmail || ""}</td></tr>
				  <tr><th>이름</th><td>{adminInfo?.memberName || ""}</td></tr>
				  <tr><th>휴대 전화 번호</th><td>{adminInfo?.memberPhone || ""}</td></tr>
                    <tr><th>관리자인증</th><span className="member-member-VerCom">완료</span></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div><br />

          <div className="member-Member-levelBox">
            <img src={User} alt="등급_사진" className="member-Member-heartImg" />

            <div className="admin-levelBox-text">
              <span>새로운 회원이</span><strong>&nbsp;{adminInfo?.newMembers || "0"} 명 </strong><span>&nbsp;가입했습니다</span><br />
              <span>기존 회원이</span><strong>&nbsp;{adminInfo?.withdrawnMembers || "0"} 명 </strong><span>&nbsp;탈퇴하였습니다</span>
            </div>
          </div><br />

          <div className="admin-admin-pickBox">
            <div className="admin-botom-picture">
              <span>총 판매 수익</span>
              <img src={Inventory1} alt="픽_아이브" className="admin-botom-img" />
              <p>{adminInfo?.totalRevenue1 || "525,525"} 원</p>
            </div>
            <div className="admin-botom-picture">
              <span>총 판매 수익</span>
              <img src={Inventory2} alt="픽_ 뉴진스" className="admin-botom-img" />
              <p>{adminInfo?.totalRevenue2 || "100,000"} 원</p>
            </div>
            <div className="admin-botom-picture">
              <span>총 판매 수익</span>
              <img src={Inventory3} alt="픽_ 뉴진스" className="admin-botom-img1" />
              <p>{adminInfo?.totalRevenue3 || "425,525"} 원</p>
            </div>
          </div><br />

        </div>
      </div>
    </div>
  );
}
