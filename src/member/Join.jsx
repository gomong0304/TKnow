import React, { useState } from "react";
import "../css/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Join() {
    // ✅ 상태 관리
    const [selectedSex, setSelectedSex] = useState("");
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [pwCk, setPwCk] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [phone3, setPhone3] = useState("");
    const [email1, setEmail1] = useState("");
    const [email2, setEmail2] = useState("");
    const [address, setAddress] = useState("");
    const [ckNm, setCkNm] = useState(""); // 인증번호 (현재 미사용)

    const navigate = useNavigate();



    // 성별 선택
    const handelSexClick = (sex) => {
        setSelectedSex(sex);
    };
	
	

    // 회원가입 처리
    const handleJoin = async () => {
        // 1️⃣ 유효성 검사
        if (!name || !id || !pw || !pwCk) {
            alert("이름, 아이디, 비밀번호를 모두 입력하세요.");
            return;
        }

        if (pw !== pwCk) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 전화번호 합치기
        const fullPhone = `${phone1}-${phone2}-${phone3}`;

        // 이메일 합치기 
        const fullEmail = `${email1}@${email2}`;

        // 요청 바디 구성 (백엔드 DTO 맞춤)
        const requestBody = {
            memberId: id,
            memberPw: pw, // 백엔드에서 {noop} 자동 추가하거나, 여기서 추가
            memberName: name,
            memberPhone: fullPhone,
            memberEmail: fullEmail,
            memberAddr1: address, // 상세주소는 나중에 추가 가능
			memberAddr2: "",
			memberZip: "00000",
			memberBirth: null,
			memberGrade: "GENERAL",
			memberSex: selectedSex,
            memberRole: "USER" // 일반 회원 (관리자는 "ADMIN")
        };

        try {
            // 회원가입 API 호출
            const response = await axios.post("/members", requestBody, {
                headers: {
                    "X-Request-Id": `JOIN-${Date.now()}` // 추적용 ID
                }
            });

            console.log("회원가입 성공:", response.data);
            alert("회원가입이 완료되었습니다!");
            navigate("/member/Login"); // 로그인 페이지로 이동

        } catch (error) {
            console.error("회원가입 실패:", error);

            if (error.response) {
                // 백엔드 에러 응답
                const errorData = error.response.data;
                alert(`회원가입 실패: ${errorData.message || "서버 오류"}`);
                
                // 유효성 검사 에러 상세 출력 (있으면)
                if (errorData.detail) {
                    console.error("검증 실패:", errorData.detail);
                }
            } else {
                alert("서버 연결 실패. 네트워크를 확인하세요.");
            }
        }
    };

    return (
        <div className="member-join-page">
            <div className="member-join-box">
                <strong className="member-join-text">JOIN</strong><br />

                <div className="member-join-inBox">
                    <table>
                        <tbody>
                            <tr>
                                <th>이름</th>
                                <td>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>아이디</th>
                                <td>
                                    <input 
                                        type="text" 
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>패스워드</th>
                                <td>
                                    <input 
                                        type="password" 
                                        value={pw}
                                        onChange={(e) => setPw(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>패스워드 체크</th>
                                <td>
                                    <input 
                                        type="password" 
                                        value={pwCk}
                                        onChange={(e) => setPwCk(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>
                                    <input 
                                        className="join-email" 
                                        type="text" 
                                        value={email1}
                                        onChange={(e) => setEmail1(e.target.value)}
                                    />
                                    &nbsp;&nbsp;@&nbsp;&nbsp;
                                    <input 
                                        type="text" 
                                        className="join-email" 
                                        value={email2}
                                        onChange={(e) => setEmail2(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>휴대 전화 번호</th>
                                <td>
                                    <input 
                                        type="text" 
                                        className="join-phone" 
                                        value={phone1}
                                        onChange={(e) => setPhone1(e.target.value)}
                                        placeholder="010"
                                    />
                                    &nbsp;&nbsp;-&nbsp;&nbsp;
                                    <input 
                                        type="text" 
                                        className="join-phone" 
                                        value={phone2}
                                        onChange={(e) => setPhone2(e.target.value)}
                                        placeholder="1234"
                                    />
                                    &nbsp;&nbsp;-&nbsp;&nbsp;
                                    <input 
                                        type="text" 
                                        className="join-phone" 
                                        value={phone3}
                                        onChange={(e) => setPhone3(e.target.value)}
                                        placeholder="5678"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>인증 번호</th>
                                <td>
                                    <input 
                                        type="text" 
                                        value={ckNm}
                                        onChange={(e) => setCkNm(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>성별</th>
                                <td>
                                    <button 
                                        className={`join-sexBtn1 ${selectedSex === "female" ? "active" : ""}`}
                                        onClick={() => handelSexClick("female")}
                                    >
                                        여성
                                    </button>
                                    <button 
                                        className={`join-sexBtn2 ${selectedSex === "male" ? "active" : ""}`}
                                        onClick={() => handelSexClick("male")}
                                    >
                                        남성
                                    </button>
                                    <button 
                                        className={`join-sexBtn3 ${selectedSex === "none" ? "active" : ""}`}
                                        onClick={() => handelSexClick("none")}
                                    >
                                        선택 안 함
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td>
                                    <input 
                                        type="text" 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div><br />

                <div className="member-btn">
                    <button
                        className="member-join-comBtn"
                        type="button"
                        onClick={handleJoin}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}