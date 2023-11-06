import React, { useState , useEffect} from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { CALENDAR_DATE } from '../../../modules/action/actionTypes';
import ModalAddScreening from '../../project/detail/manage/screening/components/modal/ModalAddScreening';
import { getMenuPermissionCd } from '../../project/detail/manage/common/utiles/auth';

const Toolbar = (props) => {
    const { date } = props;
    const path = location.pathname;
    const isScreeningPage = path.includes('screening')
    const dispatch = useDispatch();
    //--------------- project-auth ---------------
    const projectAuth = useSelector(state => state.project.projectAuth)
    const [ isUpdate , setIsUpdate] = useState(false)
    useEffect(()=>{
        if(projectAuth){
            const isUpdateAuth = getMenuPermissionCd(projectAuth)?.indexOf('W') >= 0 ? true : false
            setIsUpdate(isUpdateAuth)
        }
    },[projectAuth])
    //--------------- project-auth ---------------

    // modal on/off 
    const cancelModalRef = React.useRef();
    const [ showModal , setShowModal ] = useState(false);

    const [click, setClick] = useState(false);
    const month = moment(date).format("MM");
    const year = moment(date).format("YYYY");
    const YYMM = { month: month, year: year };
    
    const navigate = (action) => {
        props.onNavigate(action);
        if (!click) setClick(true);
        else setClick(false);
    };

    useEffect(() => {
        dispatch({ type: CALENDAR_DATE, calendarDate: YYMM })          //redux 세팅
      }, [click]);

    // 모달
    const onModal  = () => {
        setShowModal(true)
    }

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={navigate.bind(null, 'TODAY')}>
                    이번달
                </button>
                <span className="flex gap5x calendar">
                    <button type="button" onClick={navigate.bind(null, 'PREV')}>
                        이전
                    </button>
                    <span className="rbc-toolbar-label">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</span>
                    <button type="button" onClick={navigate.bind(null, 'NEXT')}>
                        다음
                    </button>
                </span>

                {
                    isScreeningPage ? 
                        <button type="button" 
                                className="btn-square" 
                                onClick={onModal}
                                disabled={!isUpdate}
                        >
                            스크리닝 일정 등록
                        </button>
                        : ''
                }

            </span>
            {
                showModal && <ModalAddScreening {...props} cancelRef={cancelModalRef} setShowModal={setShowModal}
                                                projectAuth={projectAuth}
                            />
            }
        </div>
    );
};

export default Toolbar;