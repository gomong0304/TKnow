import React from "react";
import "../css/style.css"
import Top1 from "../images/top1.png";
import Top2 from "../images/top2.png";
import Top3 from "../images/top3.png";
import Top4 from "../images/top4.png";
import Top5 from "../images/top5.png";
import MainEvent from "../images/event.png";


export default function TopTk() {
  return (
	
 <div className="toptk">
	<div className="liveTopTk">실시간 인기 티켓</div><br/><br/>
	
	<div className="button-group">
	  <button className="main-button">전체 티켓 보기</button>
	  <button className="main-button">에스엠</button>
	  <button className="main-button">하이브</button>
	  <button className="main-button">제이와이피</button>
	  <button className="main-button">웨이크원</button>
	  <button className="main-button">기타</button>
	</div><br/><br/>

	<div className="TopList">
		<div className="top">
		  <img src={Top1} alt="하이브 정국"/><br/>
		  <strong style={{ fontSize: "25px" }}>하이브 &lt;정국&gt;</strong>
		  <p style={{ fontSize: "20px", color: "#454545", font: "bold" }}>잠실 종합경기장</p>
		  <span style={{ fontSize: "18px", color: "#808080"  }}>2025.11.01 ~ 11.13</span>
		</div>
		
		<div className="top">
			<img src={Top2} alt="스타십_아이브"/><br/>
			<strong style={{ fontSize: "25px" }}>스타쉽 &lt;아이브&gt;</strong>
			<p style={{ fontSize: "20px", color: "#454545", font: "bold" }}>잠실 종합경기장</p>
			<span style={{ fontSize: "18px", color: "#808080"  }}>2025.11.02 ~ 11.11</span>
		</div>
				
		<div className="top">
			 <img src={Top3} alt="제이와이피_엔믹스"/><br/>
			 <strong style={{ fontSize: "25px" }}>제이와이피 &lt;엔믹스&gt;</strong>
			 <p style={{ fontSize: "20px", color: "#454545", font: "bold" }}>서울 고척경기장</p>
			 <span style={{ fontSize: "18px", color: "#808080"  }}>2025.12.01 ~ 12.13</span>
		</div>
						
		<div className="top">
			<img src={Top4} alt="에스엠_에스파"/><br/>
			<strong style={{ fontSize: "25px" }}>에스엠 &lt;에스파&gt;</strong>
			<p style={{ fontSize: "20px", color: "#454545", font: "bold" }}>잠실 핸드볼경기장</p>
			<span style={{ fontSize: "18px", color: "#808080"  }}>2026.01.02 ~ 01.05</span>
		</div>
								
		<div className="top">
			<img src={Top5} alt="하이브_아일릿"/><br/>
			<strong style={{ fontSize: "25px" }}>하이브 &lt;아일릿&gt;</strong>
			<p style={{ fontSize: "20px", color: "#454545", font: "bold" }}>인천 인스파이어 아레나</p>
			<span style={{ fontSize: "18px", color: "#808080"  }}>2025.12.15 ~ 12.25</span>
		</div>								
	</div>
	<br/><br/><br/><br/><br/>

	<div className="main-event">
	  <img src={MainEvent} alt="메인_이벤트" />
	</div>
</div>
  );
}