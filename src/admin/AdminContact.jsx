// src/admin/AdminContact.jsx
import React, { useEffect, useState } from "react";
import "../css/style.css";
import { useParams, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"
export default function AdminContactDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState(""); // 새 댓글 입력
  const [replyError, setReplyError] = useState("");

  // 게시글 + 댓글 불러오기
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

  // 댓글 달기
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setReplyError("");
    if (!newReply.trim()) {
      setReplyError("댓글을 입력해 주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        content: newReply, // 백엔드 DTO 기준
        adminId: "관리자", // 실제 로그인 ID로 변경 가능
        newAttachments: [],
        existingImages: [],
      };

      const res = await fetch(
        `http://localhost:9090/ticketnow/admin/boards/${boardId}/replies`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "댓글 등록 실패");
      }

      const savedReply = await res.json();

      // 댓글 갱신
      setBoard((prev) => ({
        ...prev,
        replies: [...prev.replies, savedReply],
      }));
      setNewReply("");
    } catch (err) {
      console.error(err);
      setReplyError(err.message);
    }
  };

  if (loading) return <p>로딩중...</p>;
  if (!board) return <p>게시글을 불러올 수 없습니다.</p>;

  return (
    <div className="member-Member-page">
     <AdminSidebar />{/* ← 공통 사이드바 호출 */}

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
                      <td><input type="text" className="admin-cont-phone1" value={board.email || ""} readOnly /></td>
                      <td><input type="text" className="admin-cont-phone2" value={board.phone || ""} readOnly /></td>
                    </tr>

                    <tr>
                      <th>문의 유형</th>
                      <th>예약번호</th>
                    </tr>
                    <tr>
                      <td><input type="text" className="admin-cont-phone1" value={board.categoryType || ""} readOnly /></td>
                      <td><input type="text" className="admin-cont-phone2" value={board.orderTicketId || ""} readOnly /></td>
                    </tr>

                    <tr>
                      <th>문의내용</th>
                    </tr>
                    <tr>
                      <td colSpan={2}><textarea rows="6" className="conts-area" value={board.content || ""} readOnly /></td>
                    </tr>

					<tr>
					  <th>첨부파일</th>
					</tr>
					{board.image?.length > 0 ? (
					  board.image.map((file, idx) => (
					    <tr key={idx}>
					      <td>
					        <a href={file.imgUrl} target="_blank" rel="noopener noreferrer">
					          {file.orginName}
					        </a>
					        <br />
					        <img
					          src={file.imgUrl}
					          alt={file.orginName}
					          style={{ maxWidth: "200px" }}
					        />
					      </td>
					    </tr>
					  ))
					) : (
					  <tr>
					    <td>첨부파일 정보 없음</td>
					  </tr>
					)}

                    <tr>
                      <th>댓글</th>
                    </tr>
                    {board.replies?.map((reply, idx) => (
                      <tr key={idx}><td>{reply.replyContent || reply.content} ({reply.memberId})</td></tr>
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
                        {replyError && <p style={{ color: "red" }}>{replyError}</p>}
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
