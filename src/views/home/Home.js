import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";// 슬라이드 임포트
import { Autoplay, Pagination, Navigation } from "swiper";// 슬라이드 임포트
import "swiper/css";// 슬라이드 임포트
import "swiper/css/pagination";// 슬라이드 임포트
import ComponentNotice from './components/ComponentNotice';

import { actionGetBoardList } from '../../modules/action/BoardAction';
import { dateFormat } from '../../utiles/date';

const Home = (props) => {
    const onProject = () => {
        props.history.push('/project')
    }
    const onFaq = () => {
        props.history.push('/cs/faq')
    }
    
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
                        <div className="cursor" onClick={() => props.history.push('/project')}><img src="../images/main_slide1.jpg" /></div>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <div className="cursor" onClick={() => props.history.push('/dtx/info')}><img src="../images/main_slide2.jpg" /></div>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <div className="cursor" onClick={() => props.history.push('/dtx/procedureguidance')}><img src="../images/main_slide3.jpg" /></div>
                    </SwiperSlide>
                    {/* <SwiperSlide className="swiper-slide">
                        <div>
                            <div className="subtxt">DTx 임상 참여 절차가 궁금하신가요?</div>
                            <div className="mainlogo"></div>
                            <div className="h1">임상시험 시작하기</div>
                            <button type="button" className="btn-arr fill">자세히보기</button>
                        </div>
                    </SwiperSlide> */}
                </Swiper>

                <div className="con-body">
                    <div className="set1">
                        <div>DTx 임상시험은 DTVERSE에서!</div>

                        <div>
                            DTVSERSE는 디지털 치료제(Digital therapeutics, DTx)에
                            맞춰 특화된 CTMS로 참여신청부터 동의서작성, 비대면상담 등
                            DTx 임상에 맞춰 특화된 다양한 서비스를 제공합니다.
                        </div>
                    </div>
                    <div className="set2">
                        <div><img src="../images/main_img1.png" /></div>
                        <div className="cursor" onClick={() => onProject()}><img src="../images/main_img2.png" /></div>
                    </div>

                    <div className="customer">
                        <div className="space-between">
                            <div><img src="../images/main_bottom1.png" /></div>
                            <div>
                                <div className="headline2-font txt-center">
                                    DTx란<br />
                                    무엇인가요?
                                </div>
                            </div>
                        </div>
                        <div className="space-between">
                            <div><img src="../images/main_bottom2.png" /></div>
                            <div>
                                <div className="headline2-font txt-center`">자주하는 질문</div>
                                <div className="contents2-font">
                                    ‘자주하는 질문’을 통해서<br />
                                    궁금하신 사항을 확인해 보세요.
                                </div>
                                <div className="caption-font underline" onClick={() => onFaq()}>자세히 보기</div>
                            </div>
                        </div>
                        <div className="space-between">
                            <div><img src="../images/main_bottom3.png" /></div>
                            <div>
                                <div className="headline2-font txt-center`">고객센터</div>
                                <div  className="connect-us">이메일 문의<span>dtverse@urbancorp.co.kr</span></div>
                                <div  className="connect-us">온라인 문의<span>고객센터&#62;이용문의</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="con-footer"></div>
            </div>
        </div>
    )
}

export default Home;
