import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";// 슬라이드 임포트
import { Autoplay, Pagination, Navigation } from "swiper";// 슬라이드 임포트
import "swiper/css";// 슬라이드 임포트
import "swiper/css/pagination";// 슬라이드 임포트


const Home = (props) => {
    
    return (
        <div className="section-wrap">
            <div className="main-header-bg"></div>
            <div className="main">

                <Swiper className="con-header mySwiper"
                    modules={[Autoplay, Pagination, Navigation]}
                    pagination={{
                        clickable: true, //네비클릭유무
                    }}
                    autoplay={{
                        delay: 3000, //움직이는 속도
                        disableOnInteraction: false,
                    }}
                >
                    <SwiperSlide className="swiper-slide">
                        <div>1</div>
                        {/* <div className="cursor" onClick={() => props.history.push('/project')}><img src="../images/main_slide1.jpg" /></div> */}
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <div>2</div>
                        {/* <div className="cursor" onClick={() => props.history.push('/dtx/info')}><img src="../images/main_slide2.jpg" /></div> */}
                    </SwiperSlide>
                </Swiper>

                <div className="con-body"></div>
                <div className="con-footer"></div>
            </div>
        </div>
    )
}

export default Home;
