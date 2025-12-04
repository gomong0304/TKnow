// src/admin/AdminInven2.jsx
import React, { useState } from "react";
import "../css/admin.css";
import "../css/style.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import AdminSidebar from "./AdminSidebar";

export default function AdminInven2() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
  });
  const [endAt, setEndAt] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
  });
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [price, setPrice] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketStock, setTicketStock] = useState("");
  const [ticketDetail, setTicketDetail] = useState("");
  const [ageLimit, setAgeLimit] = useState("");
  const [benefit, setBenefit] = useState("");
  const [promotion, setPromotion] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [detailImage, setDetailImage] = useState(null);
  const [category, setCategory] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// ===== 1) 필수값 검증 =====
			if (!title.trim()) {
				setError("상품명을 입력해주세요.");
				setLoading(false);
				return;
			}

			if (!category) {
				setError("카테고리를 선택해주세요.");
				setLoading(false);
				return;
			}

			// 날짜/시간 필수 입력 체크
			if (!startAt.year || !startAt.month || !startAt.day || !startAt.hour || !startAt.minute) {
				setError("공연 시작 일시를 모두 입력해주세요.");
				setLoading(false);
				return;
			}

			if (!endAt.year || !endAt.month || !endAt.day || !endAt.hour || !endAt.minute) {
				setError("공연 종료 일시를 모두 입력해주세요.");
				setLoading(false);
				return;
			}

			// LocalDateTime 으로 변환 가능한 문자열 생성 (yyyy-MM-dd'T'HH:mm:ss)
			const pad2 = (v) => String(v || "").padStart(2, "0");

			const startDateTime = `${startAt.year}-${pad2(startAt.month)}-${pad2(startAt.day)}T${pad2(startAt.hour)}:${pad2(startAt.minute)}:00`;
			const endDateTime = `${endAt.year}-${pad2(endAt.month)}-${pad2(endAt.day)}T${pad2(endAt.hour)}:${pad2(endAt.minute)}:00`;

			// 숫자 검증
			const totalSeatsVal = parseInt(totalSeats, 10);
			if (isNaN(totalSeatsVal) || totalSeatsVal < 1) {
				setError("총 좌석 수는 1 이상이어야 합니다.");
				setLoading(false);
				return;
			}

			const priceVal = parseFloat(price);
			if (isNaN(priceVal) || priceVal <= 0) {
				setError("기본 가격은 0보다 큰 값이어야 합니다.");
				setLoading(false);
				return;
			}

			if (!ticketDetail.trim()) {
				setError("상품 상세 설명을 입력해주세요.");
				setLoading(false);
				return;
			}

			// 이미지 최소 1장 (DTO @NotEmpty(images)와 맞추기)
			if (!mainImage && !detailImage) {
				setError("이미지는 최소 1장 이상 첨부해야 합니다.");
				setLoading(false);
				return;
			}

			// ===== 2) FormData 구성 =====
			const formData = new FormData();

			// --- DTO와 매핑되는 필드 ---
			formData.append("title", title);
			formData.append("category", category);
			formData.append("startAt", startDateTime);   // ★ LocalDateTime 파싱 가능한 문자열
			formData.append("endAt", endDateTime);       // ★ LocalDateTime 파싱 가능한 문자열
			formData.append("venueName", venueName);
			if (venueAddress) formData.append("venueAddress", venueAddress);
			formData.append("totalSeats", String(totalSeatsVal));
			formData.append("price", String(priceVal));
			formData.append("ticketDetail", ticketDetail);

			// --- 추가로 쌓아두었던 값들(백엔드 DTO에는 아직 없지만, 보내도 무시됨) ---
			if (ageLimit) formData.append("ageLimit", ageLimit);
			if (benefit) formData.append("benefit", benefit);
			if (promotion) formData.append("promotion", promotion);
			if (ticketStatus) formData.append("ticketStatus", ticketStatus);

			// ===== 3) 이미지 파일 (List<MultipartFile> images) =====
			if (mainImage) {
				formData.append("images", mainImage);
			}
			if (detailImage) {
				formData.append("images", detailImage);
			}

			console.log("전송 FormData (텍스트 필드):", {
				title,
				category,
				startAt: startDateTime,
				endAt: endDateTime,
				venueName,
				venueAddress,
				totalSeats: totalSeatsVal,
				price: priceVal,
				ticketDetail,
			});
			console.log("전송 이미지:", {
				mainImage: mainImage && mainImage.name,
				detailImage: detailImage && detailImage.name,
			});

			// ===== 4) 서버로 POST 요청 =====
			const res = await api.post("/tickets", formData, {
				headers: {
					// axios + FormData 사용 시 Content-Type은 생략해도 되지만,
					// 명시해도 브라우저가 boundary 포함해서 설정합니다.
					"Content-Type": "multipart/form-data",
				},
			});

			console.log("상품 등록 응답:", res.data);
			alert("상품 등록 완료");
			navigate("/admin/AdminInven");
		} catch (err) {
			console.error("상품 등록 오류:", err);
			// GlobalExceptionHandler에서 내려주는 message 사용
			const msg =
				err.response?.data?.message ||
				err.response?.data?.error ||
				"상품 등록 중 오류가 발생했습니다.";
			setError(msg);
			alert("상품 등록 실패: " + msg);
		} finally {
			setLoading(false);
		}
	};


  return (
    <form className="member-Member-page" onSubmit={handleSubmit}>
      <AdminSidebar />
      <div className="member-right">
        <div className="member-myTk-box2">
          <div className="costs-main-box">
            <br />
            <br />

            {error && (
              <div
                style={{
                  color: "red",
                  marginBottom: "20px",
                  padding: "10px",
                  border: "1px solid red",
                }}
              >
                {error}
              </div>
            )}

            <div className="member-conts-conBox">
              <div className="Admin-conts-list">
                <table className="AdConts-table">
                  <tbody>
                    <tr>
                      <th>
                        상품명 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="Ad-conts-resNum"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        판매 상태 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <select
                          value={ticketStatus}
                          className="Ad-conts-resNum"
                          onChange={(e) => setTicketStatus(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            선택하세요
                          </option>
                          <option value="ON_SALE">판매중</option>
                          <option value="SOLD_OUT">매진</option>
                          <option value="SCHEDULED">오픈 예정</option>
                          <option value="CLOSED">판매 종료</option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <th>
                        카테고리 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <select
                          value={category}
                          className="Ad-conts-resNum"
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            선택하세요
                          </option>
                          <option value="CONCERT">콘서트</option>
                          <option value="MUSICAL">뮤지컬</option>
                          <option value="SPORTS">스포츠</option>
                          <option value="EXHIBITION">전시회</option>
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <th>
                        공연 시작 일시 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          placeholder="YYYY"
                          className="admin-inven-phone1"
                          value={startAt.year}
                          maxLength="4"
                          onChange={(e) =>
                            setStartAt({ ...startAt, year: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="MM"
                          className="admin-inven-phone1"
                          value={startAt.month}
                          maxLength="2"
                          onChange={(e) =>
                            setStartAt({ ...startAt, month: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="DD"
                          className="admin-inven-phone1"
                          value={startAt.day}
                          maxLength="2"
                          onChange={(e) =>
                            setStartAt({ ...startAt, day: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="HH"
                          className="admin-inven-phone1"
                          value={startAt.hour || ""}
                          maxLength="2"
                          onChange={(e) =>
                            setStartAt({ ...startAt, hour: e.target.value })
                          }
                          required
                        />
                        :
                        <input
                          type="text"
                          placeholder="mm"
                          className="admin-inven-phone1"
                          value={startAt.minute || ""}
                          maxLength="2"
                          onChange={(e) =>
                            setStartAt({ ...startAt, minute: e.target.value })
                          }
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        공연 종료 일시 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          placeholder="YYYY"
                          className="admin-inven-phone1"
                          value={endAt.year}
                          maxLength="4"
                          onChange={(e) =>
                            setEndAt({ ...endAt, year: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="MM"
                          className="admin-inven-phone1"
                          value={endAt.month}
                          maxLength="2"
                          onChange={(e) =>
                            setEndAt({ ...endAt, month: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="DD"
                          className="admin-inven-phone1"
                          value={endAt.day}
                          maxLength="2"
                          onChange={(e) =>
                            setEndAt({ ...endAt, day: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="HH"
                          className="admin-inven-phone1"
                          value={endAt.hour || ""}
                          maxLength="2"
                          onChange={(e) =>
                            setEndAt({ ...endAt, hour: e.target.value })
                          }
                          required
                        />
                        :
                        <input
                          type="text"
                          placeholder="mm"
                          className="admin-inven-phone1"
                          value={endAt.minute || ""}
                          maxLength="2"
                          onChange={(e) =>
                            setEndAt({ ...endAt, minute: e.target.value })
                          }
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        공연 장소 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="Ad-conts-resNum"
                          value={venueName}
                          onChange={(e) => setVenueName(e.target.value)}
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>공연장 주소</th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="Ad-conts-resNum"
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        총 좌석 수 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="Ad-conts-resNum"
                          value={totalSeats}
                          onChange={(e) => setTotalSeats(e.target.value)}
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        기본 가격 <span style={{ color: "red" }}>*</span>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="Ad-conts-resNum"
                          value={price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrice(val);
                            if (val)
                              setTicketCost(
                                (parseFloat(val) * 0.4).toFixed(0)
                              ); // 40% 자동 계산
                            else setTicketCost("");
                          }}
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>매입 원가</th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="Ad-conts-resNum"
                          value={ticketCost}
                          readOnly
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>상품 상세 설명</th>
                    </tr>
                    <tr>
                      <td>
                        <textarea
                          className="Ad-conts-resNum"
                          value={ticketDetail}
                          onChange={(e) => setTicketDetail(e.target.value)}
                          rows="4"
                          style={{ width: "100%" }}
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>대표 이미지</th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setMainImage(e.target.files[0])}
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>상품 설명 이미지</th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setDetailImage(e.target.files[0])}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <button
                          type="submit"
                          className="conts-conts-btn"
                          disabled={loading}
                        >
                          {loading ? "등록 중..." : "등록하기"}
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
    </form>
  );
}
