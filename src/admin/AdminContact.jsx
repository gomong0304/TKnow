import React, { useEffect, useState } from "react";
import "../css/style.css";
import { useParams, Link } from "react-router-dom";

export default function AdminContactDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState(""); // 새 댓글 입력

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:9090/ticketnow/admin/boards/${boardId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("게시글 상세:", data);
        setBoard({
          ...data,
          email: data.email || data.memberId,
          phone: data.phone || data.memberId,
          replies: data.replies || [],
        });
      })
      .catch((err) => console.error("게시글 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, [boardId]);

  const handleReplySubmit = () => {
    if (!newReply.trim()) return;

    const token = localStorage.getItem("accessToken");
    
    // 관리자만 댓글 달도록 강제
    fetch(`http://localhost:9090/ticketnow/admin/boards/${boardId}/replies`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replyContent: newReply,
        boardId: board.boardId,
        memberId: "관리자" // 서버에서도 관리자 인증 확인
      }),
    })
      .then(res => res.json())
      .then(savedReply => {
        // 서버에 저장 후 댓글 갱신
        setBoard(prev => ({
          ...prev,
          replies: [...prev.replies, savedReply]
        }));
        setNewReply("");
      })
      .catch(err => console.error("댓글 등록 실패:", err));
  };

  if (loading) return <p>로딩중...</p>;
  if (!board) return <p>게시글을 불러올 수 없습니다.</p>;

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
          <div className="costs-main-box">
            <br /><br />
            <div className="member-conts-conBox">
              <div className="Admin-conts-list">
                <table className="AdConts-table">
                  <tbody>
                    <tr>
                      <th>이메일 주소</th>
                      <th>휴대전화번호</th>
                    </tr>
                    <tr>
                      <td>
                        <input type="text" className="admin-cont-phone1" value={board.email || ""} readOnly />
                      </td>
                      <td>
                        <input type="text" className="admin-cont-phone2" value={board.phone || ""} readOnly />
                      </td>
                    </tr>

                    <tr>
                      <th>문의 유형</th>
                      <th>예약번호</th>
                    </tr>
                    <tr>
                      <td>
                        <input type="text" className="admin-cont-phone1" value={board.categoryType || ""} readOnly />
                      </td>
                      <td>
                        <input type="text" className="admin-cont-phone2" value={board.orderTicketId || ""} readOnly />
                      </td>
                    </tr>

                    <tr>
                      <th>문의내용</th>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <textarea rows="6" className="conts-area" value={board.content || ""} readOnly />
                      </td>
                    </tr>

                    <tr>
                      <th>첨부파일</th>
                    </tr>
                    {board.attachments?.map((file, idx) => (
                      <tr key={idx}>
                        <td>{file.imageUrl}</td>
                      </tr>
                    ))}

                    <tr>
                      <th>댓글</th>
                    </tr>
                    {board.replies?.map((reply, idx) => (
                      <tr key={idx}>
                        <td>{reply.content} ({reply.memberId})</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2}>
                        <input
                          type="text"
                          className="Ad-conts-rep"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="댓글을 입력하세요"
                        /><br/><br/>
                        <button className="conts-conts-btn2" onClick={handleReplySubmit}>
                          댓글 달기
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
    </div>
  );
}
