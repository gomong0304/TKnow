import React, { useState } from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import Nmx1 from "../images/nmx1.png";
import Nmx2 from "../images/nmx2.png";
import Nmx3 from "../images/nmx3.png";
import Nmx4 from "../images/nmx4.png";
import Nmx5 from "../images/nmx5.png";
import Nmx6 from "../images/nmx6.png";

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
				<div className="member-Member-box2">
				
					<Link to="/admin/AdminMember1" className="admin-Member-conBox">
						<img src={Nmx1} alt="멤버_상세" className="admin-Member-memImg" />
						<div className="admin-Member-Box1">
							<span>신규</span>
							<div className="admin-Member-BoxTb">
								<table>
									<tbody>
										<tr><th>오해원</th><th>｜</th><th>또오해원</th></tr>
										<tr><td>5go1.0_0</td><th>｜</th><td>dhgodnjs@gmail.com</td></tr>
										<tr><td>010-1111-2222</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link><br />
					
					<Link to="/admin/AdminMember1" className="admin-Member-conBoxnoe">
						<img src={Nmx2} alt="멤버_상세" className="admin-Member-memImg" />
						<div className="admin-Member-Box1">
							<span>신규</span>
							<div className="admin-Member-BoxTb">
								<table>
									<tbody>
										<tr><th>설윤아</th><th>｜</th><th>윤아씨</th></tr>
										<tr><td>yuuuuna</td><th>｜</th><td>aaa111@daum.net</td></tr>
										<tr><td>010-2222-2222</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link><br />
					
					<Link to="/admin/AdminMember1" className="admin-Member-conBoxnoe">
						<img src={Nmx3} alt="멤버_상세" className="admin-Member-memImg" />
						<div className="admin-Member-Box1">
							<span>신규</span>
							<div className="admin-Member-BoxTb">
								<table>
									<tbody>
										<tr><th>장규진 </th><th>｜</th><th>짱뀨</th></tr>
										<tr><td>jaaaaaaanng_1</td><th>｜</th><td>rbwlsl@gmail.com</td></tr>
										<tr><td>010-0000-11111</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link><br />
					
					<Link to="/admin/AdminMember1" className="admin-Member-conBoxnoe">
						<img src={Nmx4} alt="멤버_상세" className="admin-Member-memImg" />
						<div className="admin-Member-Box1">
							<span>신규</span>
							<div className="admin-Member-BoxTb">
								<table>
									<tbody>
										<tr><th>김지우</th><th>｜</th><th>마이쮸</th></tr>
										<tr><td>woooo_0</td><th>｜</th><td>rlawldn@gmail.com</td></tr>
										<tr><td>010-5432-1234</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link><br />
					
					<Link to="/admin/AdminMember1" className="admin-Member-conBoxnoe">
						<img src={Nmx5} alt="멤버_상세" className="admin-Member-memImg" />
						<div className="admin-Member-Box1">
							<span>신규</span>
							<div className="admin-Member-BoxTb">
								<table>
									<tbody>
										<tr><th>배진솔 </th><th>｜</th><th>배지터</th></tr>
										<tr><td>beaaaaa2482</td><th>｜</th><td>wlsthffl@gmail.com</td></tr>
										<tr><td>010-5555-5252</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link><br />
					
					<Link to="/admin/AdminMember1" className="admin-Member-conBoxnoe">
						<img src={Nmx6} alt="멤버_상세" className="admin-Member-memImg" />
						<div className="admin-Member-Box1">
							<span>신규</span>
							<div className="admin-Member-BoxTb">
								<table>
									<tbody>
										<tr><th>릴리</th><th>｜</th><th>리리</th></tr>
										<tr><td>rllllllllillllls2</td><th>｜</th><td>llllllillllll@gmail.com</td></tr>
										<tr><td>010-5959-7777</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</Link><br />

					




					<div className="admin-member-plus">
						<strong> + </strong> <span> 내 티켓 목록 더 보기 </span>
					</div><br />
			
</div>
			</div>

		</div>
	);
}