import React from "react";
import "../css/style.css"
import { Link } from "react-router-dom";
import bannerImg from "../images/txt_banner.png"; 

export default function Banner() {
  return (
	
	<div className="txt-banner">
	<Link to="/Ticket/Read">
	  <img src={bannerImg} alt="메인배너" />
	</Link>
      </div>
  );
}