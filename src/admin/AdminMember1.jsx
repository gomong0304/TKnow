import React, { useState } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import Nmx7 from "../images/nmx7.png";
import Heart from "../images/heart.png";


export default function Member() {

	return (
		<div className="member-Member-page">


		<div className="member-left">
			<div className="admin-Member-box1">
				<strong>관리자</strong><span> 님 반갑습니다!</span><br /><br />
				<table>
					<tbody>
						<tr><td><Link to="/admin/AdminMember" className="member-Member-click">회원 관리</Link></td></tr>
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
				<div className="member-myTk-box2">
					<div className="mytick-main-box">

						<br /><br />
						<div className="admin-member-memBox">
							<div className="admin-member-memList">

								<br /><br />
								<img src={Nmx7} alt="콘서트_썸네일" className="member-tkRead-consImg" />
								<span>또오해원</span>
							</div>

							<div className="member-tkRead-dayBox">
								<div className="member-tkRead-my">
									<table>
										<tbody>
											<tr><th>아이디</th><td>5go1.0_0</td></tr>
											<tr><th>이메일</th><td>dhgodnjs@gmail.com</td></tr>
											<tr><th>이름</th><td>오해원</td></tr>
											<tr><th>휴대 전화 번호</th><td>010-1111-2222</td></tr>
											<tr><th>가입일</th><td>2025. 10. 10</td></tr>
										</tbody>
									</table>


								</div>
							</div>
						</div>

						<br />

						<div className="admin-member-memBox3">
							<table className="admin-member-text1">

								<tbody>
									<tr><th>2025 투모로우바이투게더 단독 콘서트〈# :  유화〉</th><td className="admin-con-btn">배송 중</td></tr>
									<tr><th>2025 엔시티위시 단독 콘서트〈WISH’s〉</th><td className="admin-con-btn">배송 중</td></tr>
									<tr><th>2025 아일릿 팬미팅〈글릿즈럽〉</th><td className="admin-con-btn1">배송 완료</td></tr>
									<tr><th>2025 백현 단독 콘서트〈럽백 is 백현〉</th><td className="admin-con-btn1">배송 완료</td></tr>
									<tr><th>2025 알파드라이브 첫 팬미팅</th><td className="admin-con-btn1">배송 완료</td></tr>
								</tbody>
							</table><br /><br />
							<div className="member-ticket-plus">
								<strong> + </strong> <span> 회원 티켓 목록 더 보기 </span>
							</div></div>

						<br />


						<div className="admin-member-memBox4">
							<div className="admin-member-top">
								<img src={Heart} alt="등급_사진" className="admin-Member-heartImg" />

								<div className="admin-levelBox1-text">
									<span>또오해원</span><span>&nbsp;님의 등급은</span>
									<strong>Silver</strong><span>&nbsp;입니다</span>

									<table>
										<tbody>
											<tr><th>주문 건</th><td>｜</td><td>100 건</td>
												<th>주문 금액</th><td>｜</td><td>425,414,441 원</td></tr>
										</tbody>
									</table>

									<p className="admin-Member-purPer">쿠폰 전송</p>
								</div>
							</div>

							<table className="admin-cons-list">
								<tbody>
									<tr><th colSpan="9">2025 알디원 첫 콘서트 〈알디원플래닛〉</th> <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
										<th className="admin-member-refund">미환불</th></tr>
									
										<tr>
										<td>2025. 10. 15 결제 완료</td><td>｜</td>
										<td>230,000 원</td><td>｜</td>
										<td>신용카드</td><td>｜</td>
										<td>2025. 10. 20 환불</td><td>｜</td>
										<td>단순변심</td>
									</tr>
								</tbody>
							</table>

							<table className="admin-cons-list">
								<tbody>
									<tr><th colSpan="9">2025 알디원 첫 콘서트 〈알디원플래닛〉</th> <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
										<th className="admin-member-refund">미환불</th></tr>
									<tr>
										<td>2025. 10. 15 결제 완료</td><td>｜</td>
										<td>230,000 원</td><td>｜</td>
										<td>신용카드</td><td>｜</td>
										<td>2025. 10. 20 환불</td><td>｜</td>
										<td>단순변심</td>
									</tr>
								</tbody>
							</table>

							<table className="admin-cons-list">
								<tbody>
									<tr><th colSpan="9">2025 알디원 첫 콘서트 〈알디원플래닛〉</th> <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
										<th className="admin-member-refund">미환불</th></tr>
									<tr>
										<td>2025. 10. 15 결제 완료</td><td>｜</td>
										<td>230,000 원</td><td>｜</td>
										<td>신용카드</td><td>｜</td>
										<td>2025. 10. 20 환불</td><td>｜</td>
										<td>단순변심</td>
									</tr>
								</tbody>
							</table>
							<br/>
							<div className="member-ticket-plus">
								<strong> + </strong> <span> 환불 목록 더 보기 </span>
							</div></div><br/>
							
							<div className="admin-member-memBox3">
									<table className="admin-member-text1">

										<tbody>
											<tr><th>2025 투모로우바이투게더 단독 콘서트〈# :  유화〉</th><td className="admin-con-btn">배송 중</td></tr>
											<tr><th>2025 엔시티위시 단독 콘서트〈WISH’s〉</th><td className="admin-con-btn">배송 중</td></tr>
											<tr><th>2025 아일릿 팬미팅〈글릿즈럽〉</th><td className="admin-con-btn1">배송 완료</td></tr>
											<tr><th>2025 백현 단독 콘서트〈럽백 is 백현〉</th><td className="admin-con-btn1">배송 완료</td></tr>
											<tr><th>2025 알파드라이브 첫 팬미팅</th><td className="admin-con-btn1">배송 완료</td></tr>
										</tbody>
									</table><br /><br />
									<div className="member-ticket-plus">
										<strong> + </strong> <span> 회원 티켓 목록 더 보기 </span>
									</div></div>
								<br />
								
								
								
								<div className="admin-Member-pointBox">
									<span>보유 포인트</span>&nbsp;&nbsp;<strong className="member-poins-live">100,392,102 P</strong><br />
									<span>소멸 예정 포인트 (30 일 이내)</span>&nbsp;&nbsp;<strong>12</strong><strong>P</strong><br />
									<span>포인트 프로모션 등록&nbsp;&nbsp;&nbsp;&gt;</span>
								</div><br />
								
								<Link to="/admin/AdminContact/" className="admin-member-memBox4">
								<table className="admin-member-text1">

									<tbody>
										<tr><th>[티켓] 티켓을 언제쯤 주나요 ㅡ ㅡ 기다리기 힘드네요 </th><td className="admin-con-btn1">미답변</td></tr>
										<tr><th>[회원] 회원 탈퇴는 어떻게 하죠</th><td className="admin-con-btn1">미답변</td></tr>
										<tr><th>[회원] 회원가입을 하려고 하는데 연동 가능한가요?</th><td className="admin-con-btn1">미답변</td></tr>
										<tr><th>[티켓] 티켓 배송으로 받고 싶어요 ㅜㅜ</th><td className="admin-con-btn">답변 완료</td></tr>
										<tr><th>[티켓] 위시 콘서트 현장 수령으로 바꾸고 싶어여</th><td className="admin-con-btn">답변 완료</td></tr>
									</tbody>
									</table><br /><br />
										<div className="member-ticket-plus">
										<strong> + </strong> <span> 회원 문의 목록 더 보기 </span>
										</div></Link><br />

										<div className="admin-member-memBox5">
											<table className="admin-member-text1">

												<tbody>
												<tr><th>[위시] 진심 이 콘서트 안 간다? 후회할 것 같습니다 제</th><td className="admin-con-btn1">미답변</td></tr>
												<tr><th>[라이즈] 제 인생은 이 콘 보기 전과 후로 나뉨 ㅜㅜ</th><td className="admin-con-btn1">미답변</td></tr>
												<tr><th>[아일릿] 아일릿 나의 사랑 나의 여신 나의 사랑</th><td className="admin-con-btn1">미답변</td></tr>
												<tr><th>[투어스] 42 멤버십 결제했어요 저는 오늘부터 사이입니다</th><td className="admin-con-btn">답변 완료</td></tr>
												<tr><th>[기타] 왜 알디원 잘생긴 거 말 안 했음? 인생 손해 봤다</th><td className="admin-con-btn">답변 완료</td></tr>
												</tbody>
												</table><br /><br />
												<div className="member-ticket-plus">
												<strong> + </strong> <span> 리뷰 목록 더 보기 </span>
												</div></div>

																				<br />

					</div>
					
					
			</div>
			
			
		</div>
		</div >
	);
}