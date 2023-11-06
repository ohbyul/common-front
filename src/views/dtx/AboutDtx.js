import React from 'react';


const AboutDtx = (props) => {
    const onHref = () => {
        window.open('https://www.khidi.or.kr/board/view?linkId=48744963&menuId=MENU00085', '_blank')
    }
    const onHref2 = () => {
        window.open('https://www.mfds.go.kr/brd/m_1060/view.do?seq=14597&srchFr=&srchTo=&srchWord=%EC%9D%98%EB%A3%8C%EA%B8%B0%EA%B8%B0&srchTp=0&itm_seq_1=0&itm_seq_2=0&multi_itm_seq=0&company_cd=&company_nm=&Data_stts_gubun=C9999&page=8', '_blank')
    }



    return (
        <div className="section-wrap">
            <div className="header-bg"></div>
            <div className="header-title aboutdtx">
                <div>
                    <div className="h1">DTx 임상시험에 대해 알려드립니다.</div>
                    <div className="subtxt">디지털 치료기기(DTx)에 대해서 알아보고 임상시험에도 참여하세요!</div>
                </div>
            </div>

            <div className="body-contents">
                <div>
                    <div className="flex">
                        <div className="text-title">DTx란?</div>
                        <div className="text-subtext">
                            <div>DTx란 Digital Therapeutics의 약어로 ‘디지털 치료기기’를 명칭합니다.</div>
                            <div>
                                DTx는 의학적 장애나 질병을 예방, 관리, 치료하기 위해 환자에게 근거 기반의 치료적 개입을 제공하는<br />
                                소프트웨어 의료기기로 제1세대 치료제인 알약이나 캡슐, 제 2세대 치료제인 항체 등에 이어 제 3세대 치료제로 분류됩니다.
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="balance">
                        <div className="txt-title">참여신청 임상시험 정보</div>
                        <div className="flex gap24x">
                            <span className="origin">*출처 : KHIDI 바이오헬스 리포트, 한국보건산업진흥원, 2019.01</span>
                            <button className="btn-square" onClick={onHref}>출처 바로가기</button>
                        </div>
                    </div>

                    <table className="default">
                        <colgroup>
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "12%" }} />
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "8%" }} />
                            <col style={{ "width": "10%" }} />
                            <col style={{ "width": "10%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th rowSpan={2}>구분</th>
                                <th rowSpan={2}>공통점</th>
                                <th colSpan={5}>차이점</th>
                            </tr>
                            <tr>
                                <th>부작용</th>
                                <th>비용</th>
                                <th>복약</th>
                                <th>모니터링</th>
                                <th>데이터</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='th'>기존 치료제</td>
                                <td className='last-td' rowSpan={2}>
                                    임상실험을 통해 검증된 치료 효과,
                                    규제 당국 심사,
                                    의사 처방, 보험 환급
                                </td>
                                <td>독성 및 부작용<br />있음</td>
                                <td>다양함<span>&#40;원가 규모, 개발기간 등 고비용 고위험 구조&#41;</span></td>
                                <td>관리 불가</td>
                                <td>진료시간 외 환자상태<br />모니터링 불가</td>
                                <td>환자 데이터<br />수집, 관리, 저장<br />어려움</td>
                            </tr>
                            <tr>
                                <td className='th'>디지털 치료제<br />&#40;DTx&#41;</td>
                                <td className='last-td'>독성 및 부작용<br />없음</td>
                                <td className='last-td'>매우 적음<span>&#40;코딩 등 개발 및 복제비용, 서비스 제공 단가 낮음&#41;</span></td>
                                <td className='last-td'>실시간, 연속적<br />관리 가능</td>
                                <td className='last-td'>24시간 실시간 환자상태<br />모니터링 가능</td>
                                <td className='last-td'>환자데이터<br />맞춤 분석 가능<span>&#40;환자 스스로 데이터 수집 및 관리&#41;</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <div className="flex mb40">
                        <div className="text-title">DTx 주요 대상질환</div>
                        <div className="text-subtext">
                            DTx는 ADHD, PTSD 등의 정신질환 뿐만 아니라 편두통, 심부전, 불면증 등 다양한 질병에 대상으로 출시 및 개발되고 있습니다.<br />
                            DTx를 사용함으로서 환자의 생활습관 및 행동을 변화시키며, 표준적인 치료나 치료제를 병용하여 기존 치료보다 더 큰 치료효과를 보입니다.
                        </div>
                    </div>
                    <ul className="flex gap20x">
                        <li className="cast migraine">편두통</li>
                        <li className="cast adhd">ADHD</li>
                        <li className="cast ptsd">PTSD</li>
                        <li className="cast insomnia">불면증</li>
                        <li className="cast heart-failure">심부전</li>
                    </ul>
                </div>
                <div>
                    <div className="flex">
                        <div className="text-title">DTx 임상시험</div>
                        <div className="text-subtext">
                            <div>
                                임상시험은 치료제 또는 치료기기의 사용 및 판매 허가를 위해 치료 효능성과 안전성의 검증을 위해 사람을 대상으로 체내 분포, 대사와 배설,<br />
                                약리효과의 임상적 효과, 부작용 등을 알아보는 시험 또는 연구를 말합니다.
                            </div>
                            <div>
                                한국의 경우 의약품 뿐만 아니라 치료기기 등의 모든 임상시험은 ‘식품의약품안전처’와 ‘임상시험심사위원회&#40;IRB&#41;’의 승인을 받아야만 진행 할 수 있습니다.<br />
                                즉, 임상시험은 치료제&#41;치료기기&#41;의 효능과 안전성을 검증하여 처방, 출시 및 판매, 사용을 위해 반드시 거쳐야 하는 과정입니다.
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="balance mb60">
                        <div className="txt-title">혁신 의료기기 단계별 심사 절차</div>
                        <div className="flex gap24x">
                            <span className="origin">*출처 : 식품의약품안전처, 혁신의료기기 단계별 심사 가이드라인, 2020.08</span>
                            <button className="btn-square" onClick={onHref2}>출처 바로가기</button>
                        </div>
                    </div>
                    <ul className="flex-middle">
                        <li className="step stage1"><div>1단계</div><div>제품 설계 및 개발 검토</div></li>
                        <li className="arr"></li>
                        <li className="step stage2"><div>2단계</div><div>안전성 및 성능 검토</div></li>
                        <li className="arr"></li>
                        <li className="step stage3"><div>3단계</div><div>임상시험계획서 검토</div></li>
                        <li className="arr"></li>
                        <li className="step stage4"><div>4단계</div><div>기술문서 및 임상자료 검토</div></li>
                    </ul>
                    <div className="write">본 내용은 2023.11.11에 작성 되었습니다.</div>
                </div>


            </div>
            <div className="last-contents aboutdtx">
                DTVERSE는 디지털 치료기기&#40;DTx&#41;의 개발과 발전을 위하여<br/>
                다양한 DTx 특화 임상시험 지원 서비스를 제공합니다.
            </div>
        </div>
    );
};

export default AboutDtx;