import React, { useState, useEffect } from "react";
import "../css/style.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainEvent from "../images/event.png";


export default function List() {

	const [tickets, setTickets] = useState([]);
	const navigate = useNavigate();
	const [ticket, setTicket] = useState(null);


	useEffect(() => {
	  axios
	    .get("http://localhost:9090/ticketnow/tickets")
	    .then((res) => {
	      const list = res.data.data || res.data.list || [];
	      setTickets(list);
	    })
	    .catch((err) => {
	      console.error("오류:", err);
	      setTickets([]);
	    });
	}, []);

	const formatDate = (dateArr, fallback = "") => {
		if (!dateArr || !Array.isArray(dateArr)) return fallback;

		const [year, month, day] = dateArr;
		if (!year || !month || !day) return fallback;

		const date = new Date(year, month - 1, day);
		if (isNaN(date.getTime())) return fallback;

		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		return `${date.getFullYear()}.${mm}.${dd}`;
	};

	return (

		<div className="toptk"><br/><br/><br/><br/>
			
			<div className="tkList2">
			<Link to="/Ticket/List"><button className="tkLists">티켓 전체 보기</button></Link>
			<Link to="/Ticket/List"><button className="tkLists">에스엠</button></Link>
			<Link to="/Ticket/List"><button className="tkLists">하이브</button></Link>
			<Link to="/Ticket/List"><button className="tkLists">제이와이피</button></Link>
			<Link to="/Ticket/List"><button className="tkLists">웨이크원</button></Link>
			<Link to="/Ticket/List"><button className="tkLists">기타</button></Link>
			</div>
			<br/><br/>
			
			<div className="TopList">
			
			
			
			<div className="tickets-grid">
			  {tickets.slice(0, 16).map((t) => (
			    <div
			      key={t.ticketId}
			      className="ticket-card"
			      onClick={() => navigate(`/ticket/${t.ticketId}`)}
			    >
			      <img
			        src={t.mainImageUrl || "/default.jpg"}
			        alt={t.title || "티켓 이미지"}
			        className="ticket-img"
			      />
			      <strong>{t.title}</strong>
			      <p>{t.venueName || "장소 미정"}</p>
			      <span>{formatDate(t.ticketDate)}</span>
			    </div>
			  ))}
			</div></div>
			<br /><br /><br />
			
			<div className="member-myCont-plus">
			             <strong> + </strong> <span> 콘서트 목록 더 보기 </span>
			           </div><br />

			<br /><br /><br /><br /><br />

			
		</div>
	);
}