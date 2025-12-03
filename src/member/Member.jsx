// src/member/member.jsx
import React, { useState, useEffect } from "react";
import "../css/member.css";
import "../css/style.css";
import { Link, useNavigate } from "react-router-dom";
import Pro from "../images/propile.png";
import ProMod from "../images/pro_mod.png";
import Cons from "../images/cons.png";
import Heart from "../images/heart.png";
import IVE from "../images/pick_ive.png";
import NJS from "../images/pick_newjeans.png";
import KIKI from "../images/pick_kiki.png";
import ILLIT from "../images/pick_illit.png";
import Ht from "../images/ht.png";
import api from "../api";
import MemberSidebar from "./MemberSidebar";
//  api의 baseURL을 이용해서 이미지 URL 만드는 공통 함수
const BASE_URL = (api.defaults.baseURL || "").replace(/\/$/, "");

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path}`;
};

export default function Member() {
  const navigate = useNavigate(); // 

  const [memberId, setMemberId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);
  const [profileUrl, setProfileUrl] = useState(""); // 프로필 이미지 URL

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 받은 토큰
    const localMemberId = localStorage.getItem("memberId"); // 로그인한 아이디

    // 0) localStorage 에 저장된 프로필 경로가 있으면 먼저 적용 (계정별 저장)
    let savedPath = null;
    if (localMemberId) {
      savedPath = localStorage.getItem(`profileImagePath_${localMemberId}`);
      if (savedPath) {
        setProfileUrl(resolveImageUrl(savedPath));
      }
    }

    // 토큰이나 아이디가 없으면 여기서 종료
    if (!localMemberId || !token) return;

    // 1) 회원 정보 가져오기
    api
      .get(`members/${localMemberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMemberId(res.data.memberId || "");
        setMemberEmail(res.data.memberEmail || "");
        setMemberName(res.data.memberName || "");
        setMemberPhone(res.data.memberPhone || "");

        // ⚠ 이미 localStorage 에 값이 없을 때만 서버에서 온 값을 사용
        if (!savedPath && res.data.profileImageUrl) {
          const imageUrl = resolveImageUrl(res.data.profileImageUrl);
          setProfileUrl(imageUrl);

          if (localMemberId) {
            localStorage.setItem(
              `profileImagePath_${localMemberId}`,
              res.data.profileImageUrl
            );
          }
        }
      })
      .catch((err) => console.error("회원정보 조회 실패:", err));

    // 2) 최근 주문 1건 조회
    api
      .get("orders?page=1&size=1", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const raw = res.data.list?.[0];
        if (!raw) return;

        const recent = {
          thumbnail: raw.ticketThumbnail,
          concertName: raw.ticketTitle,
          venue: raw.ticketVenue,
          date: raw.ticketDate,
          daysAgo: raw.ddayText,
          ordersId: raw.ordersId,
        };

        console.log("매핑된 최근 주문:", recent);
        setRecentOrder(recent);
      })
      .catch((err) => console.error("최근 주문 조회 실패:", err));
  }, []);

  // 
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("memberId");
    localStorage.removeItem("role");

    alert("로그아웃 되었습니다");
    navigate("/"); // 메인페이지로 이동
    window.location.replace("/");

    // App.js의 RequireAuth가 해당 라우트가 렌더링 될 때 만 토큰을 검사함
    // 마이페이지에 이미 들어와 있는 상태에서 로그아웃을 누르면 localStorage의 토큰을 지움
    // RequireAuth 는 다시 렌더링되지 않기 때문에 토큰이 사라진걸 모르는 상태
    // 원래는 navigate("/")가 라우팅을 바꿔줘야 하는데 실제 실행환경에서 제대로 동작하지 않아서 URL이 살아있는 상태가 됨
    // RequireAuth가 개입할 기회가 사라짐. 로그아웃을 해도 새로고침 전까지 토큰만 사라진 상태로 이전 화면에 그대로 남아있음.
    // 로그아웃 후에는 SPA 라우팅 + 강제 페이지 이동을 둘 다 걸어 두어 무조건 메인으로 보내는 방식으로 해둠
  };

  // 프로필 변경 함수 (useEffect 밖)
  const handleChangeImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("accessToken");
        const memberId = localStorage.getItem("memberId");

        const res = await api.post(
          `/members/${memberId}/profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("업로드 응답:", res.data);

        // 1) 응답 배열에서 '대표 회원 프로필' 이미지를 우선 선택
        let imgPath = null;

        if (Array.isArray(res.data)) {
          const profileDto = res.data.find(
            (img) =>
              img.imageType === "MEMBER_PROFILE" && img.isPrimary === true
          );

          // 대표 프로필이 있으면 그걸, 없으면 첫 번째 항목이라도 사용
          if (profileDto && profileDto.imageUrl) {
            imgPath = profileDto.imageUrl;
          } else if (res.data[0] && res.data[0].imageUrl) {
            imgPath = res.data[0].imageUrl;
          }
        }

        if (!imgPath) {
          alert("서버에서 이미지 URL을 돌려주지 않았습니다.");
          return;
        }

        const imageUrl = resolveImageUrl(imgPath);

        // 화면에 즉시 반영
        setProfileUrl(imageUrl);

        // 새로고침 후에도 유지되도록 localStorage 에 저장 (계정별로 분리)
        if (memberId) {
          localStorage.setItem(`profileImagePath_${memberId}`, imgPath);
        }

        alert("프로필 이미지가 변경되었습니다.");
      } catch (err) {
        console.error("업로드 실패:", err);
        alert("이미지 업로드 실패");
      }
    };

    input.click();
  };

  return (
    <div className="member-Member-page">
       <MemberSidebar active="myContact" />
      <div className="member-right">
        <div className="member-Member-box2">
          <div className="member-pro-box">
            <div className="member-Member-propile-imgBox">
              <img
                src={profileUrl ? profileUrl : Pro}
                alt="프로필_사진"
                className="member-Member-proImg"
              />
              <button
                onClick={handleChangeImage}
                className="member-propile-change-btn"
              >
                변경
              </button>
              <img
                src={ProMod}
                alt="프로필_사진"
                className="member-Member-prMod"
              />

              <div className="member-propile-table">
                <table>
                  <tbody>
                    <tr>
                      <th>아이디</th>
                      <td>{memberId}</td>
                    </tr>
                    <tr>
                      <th>이메일</th>
                      <td>{memberEmail}</td>
                    </tr>
                    <tr>
                      <th>이름</th>
                      <td>{memberName}</td>
                    </tr>
                    <tr>
                      <th>휴대 전화 번호</th>
                      <td>{memberPhone}</td>
                    </tr>
                    <tr>
                      <th>본인인증</th>
                      <td>
                        <span className="member-member-VerCom">완료</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <br />

          {recentOrder ? (
            <Link to="/member/MyTick" className="member-Member-conBox1">
              <img
                src={recentOrder.thumbnail || Cons}
                alt="콘서트_썸네일"
                className="member-Member-consImg"
              />
              <div className="member-Member-dayBox">
                <span>{recentOrder.daysAgo} </span>
                <div className="member-Member-dayBoxTb">
                  <table>
                    <tbody>
                      <tr>
                        <th>{recentOrder.concertName}</th>
                      </tr>
                      <tr>
                        <th>{recentOrder.venue}</th>
                      </tr>
                      <tr>
                        <td>{recentOrder.date}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/member/MyTick" className="member-Member-conBox1">
              <img
                src={Cons}
                alt="콘서트_썸네일"
                className="member-Member-consImg"
              />
              <div className="member-Member-dayBox">
                <span>주문 내역이 없습니다</span>
                <div className="member-Member-dayBoxTb">
                  <table>
                    <tbody>
                      <tr>
                        <th>-</th>
                      </tr>
                      <tr>
                        <th>-</th>
                      </tr>
                      <tr>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Link>
          )}
          <br />

          <div className="member-Member-payment">
            <strong>대표 결제 수단</strong>&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="member-bank">카카오뱅크</span>
            <br />
            <br />
            <span>3333-1234-56-7890</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>김나우</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>변경</span>
          </div>
          <br />

          <div className="member-Member-levelBox">
            <img src={Heart} alt="등급_사진" className="member-Member-heartImg" />

            <div className="member-levelBox-text">
              <span>힙합개냥이</span>
              <span>&nbsp;님의 등급은</span>
              <strong>GOLD</strong>
              <span>&nbsp;입니다</span>
              <table>
                <tbody>
                  <tr>
                    <th>주문 건</th>
                    <td>｜</td>
                    <td>100 건</td>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <th>주문 금액</th>
                    <td>｜</td>
                    <td>425,414,441 원</td>
                  </tr>
                </tbody>
              </table>
              <p className="member-Member-purPer">구매 실적 보기</p>
            </div>
          </div>
          <br />

          <div className="member-Member-pointBox">
            <span>보유 포인트</span>&nbsp;&nbsp;
            <strong className="member-poins-live">100,392,102 P</strong>
            <br />
            <span>소멸 예정 포인트 (30 일 이내)</span>&nbsp;&nbsp;
            <strong>12</strong>
            <strong>P</strong>
            <br />
            <span>포인트 프로모션 등록&nbsp;&nbsp;&nbsp;&gt;</span>
          </div>
          <br />

          <div className="member-Member-conListBox">
            <table>
              <tbody>
                <tr>
                  <td>2025 투모로우바이투게더 단독 콘서트〈# : 유화〉</td>
                  <td>2025. 10. 11</td>
                  <td>
                    <span className="member-list-none">미작성</span>
                  </td>
                </tr>
                <tr>
                  <td>2025 엔시티위시 단독 콘서트〈WISH’s〉</td>
                  <td>2025. 09. 23</td>
                  <td>
                    <span className="member-list-none">미작성</span>
                  </td>
                </tr>
                <tr>
                  <td>2025 아일릿 팬미팅〈글릿즈럽〉</td>
                  <td>2025. 08. 21</td>
                  <td>
                    <span className="member-list-none">미작성</span>
                  </td>
                </tr>
                <tr>
                  <td>2025 백현 단독 콘서트〈럽백 is 백현〉</td>
                  <td>2025. 07. 01</td>
                  <td>
                    <span>작성 완료</span>
                  </td>
                </tr>
                <tr>
                  <td>2025 알파드라이브 첫 팬미팅</td>
                  <td>2025. 06. 03</td>
                  <td>
                    <span>작성 완료</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />

          <div className="member-Member-pickBox">
            <div className="member-pick-picture">
              <img src={IVE} alt="픽_아이브" className="member-pickBox-img" />
              <img src={Ht} alt="픽_하트" className="member-pickBox-ht" />
              <p>IVE</p>
            </div>
            <div className="member-pick-picture">
              <img src={NJS} alt="픽_ 뉴진스" className="member-pickBox-img" />
              <img src={Ht} alt="픽_하트" className="member-pickBox-ht" />
              <p>NewJeans</p>
            </div>
            <div className="member-pick-picture">
              <img src={KIKI} alt="픽_키키" className="member-pickBox-img" />
              <img src={Ht} alt="픽_하트" className="member-pickBox-ht" />
              <p>KiKi</p>
            </div>
            <div className="member-pick-picture">
              <img src={ILLIT} alt="픽_아일릿" className="member-pickBox-img" />
              <img src={Ht} alt="픽_하트" className="member-pickBox-ht" />
              <p>ILLTE</p>
            </div>
          </div>
          <br />

          <div className="member-Member-pwModBox">
            <strong>비밀번호 찾기</strong>
            <br />
            <br />
            <div className="member-pwModBox-pw">
              <input type="text" alt="패스워드_변경" />
              &nbsp;&nbsp;
              <input type="text" alt="패스워드_변경2" />
            </div>
          </div>
          <br />

          <div className="member-Member-noticeBox">
            <button alt="1:1문의" className="member-noticeBox-top1">
              1:1 문의하기
            </button>
            <button alt="내 문의 보기" className="member-noticeBox-top2">
              내 문의 보기
            </button>
            <button alt="자주 묻는 질문" className="member-noticeBox-top3">
              자주 묻는 질문
            </button>
            <br />
            <button alt="고객센터 방문" className="member-noticeBox-bottom">
              고객센터 방문하기
            </button>
          </div>
          <br />
          <br />

          <div className="member-Member-remove">
            <span onClick={handleLogout}>로그아웃</span>
            <span>&nbsp;｜&nbsp;</span>
            <span>회원탈퇴</span>
          </div>
        </div>
      </div>
    </div>
  );
}
