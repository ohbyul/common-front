import { id } from "date-fns/locale";
import React, { useState } from "react";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

function SelectBox({ id, options, setValue, selectValue, isDisabled, isTop }) {

    const customStyles = {

        control: (provided, state) => ({
            ...provided,
            while: '100%',
            minWidth: '92px',
            height: '32px',
            minHeight: '32px',
            background: '#fff',
            border: '1px solid #cccccc',
            borderColor: state.isFocused ? "#cccccc" : "#cccccc",
            "&:hover": {},
            borderRadius: '4px',
            boxShadow: 'none',
        }),

        /* option설정 */
        option: (provided, state) => ({
            ...provided,
            padding: '4.5px 10px',
            background: state.isSelected ? "#f2f5f7" : "#ffffff",
            color: state.isSelected ? '#FF6600' : "#666666",
            "&:hover": { background: "#e6e6e6", color: "#393939" },
            borderRadius: state.isSelected ? '0' : '4px',
            boxShadow: 'none',
        }),
        // menuList 겉에 감싸는영역
        menu: provided => ({
            ...provided,
            margin: '5px 0',
            border: '1px solid #cccccc',
            boxShadow: 'none',
            zIndex: 9999
        }),
        // option 겉에 감싸는영역
        menuList: (provided, state) => ({
            ...provided,
            padding: '0',
        }),
        // 셀릭트 상단테스트 감싸는 영역
        valueContainer: (provided, state) => ({
            ...provided,
            height: '28px',
            padding: '0 10px',
        }),



        /* 폰트설정 */
        singleValue: (provided, state) => ({
            ...provided,
            margin: "0",
            fontWeight: '400',
            fontSize: "16px",
            lineHeight: '1.2',
            color: '#666666',
        }),
        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '30px',
        }),
        // 화살표 아이콘 스타일
        dropdownIndicator: defaultStyles => ({
            ...defaultStyles,
            padding: '0',//2023-02-07 18:02:02 스타일수정
            '& svg': { display: 'none' },
            '&::after': {
                'content': '""',
                'position': 'absolute',
                'top': '50%',
                'right': '10px',
                'marginTop': '-2px',
                'width': '8px',
                'height': '5px',
                'display': 'inline-block',
                'backgroundImage': 'url(/images/icon_select_arr.svg)',
                'backgroundColor': '#fff',
                'backgroundRepeat': 'no-repeat',
                'backgroundSize': '8px auto',
                'backgroundPosition': 'center',
                'transition': 'all 0.25s',
            }



        })
    };


    return (
        <>
            <CreatableSelect
                id={id}
                className={"select-customer " + (isDisabled ? "disabled" : "")}
                classNamePrefix="select-fix"
                isDisabled={isDisabled}
                isSearchable={false}//검색/입력비활성화
                value={selectValue != '' ? options.filter(option => option.value === selectValue) : options[0]}
                defaultValue={options[0]}
                options={options}
                onChange={(e) => setValue(e.value)}
                styles={customStyles}
                menuPlacement={isTop ? 'top' : 'auto'}
            // menuPosition="fixed" 
            />
        </>
    )

}

export default SelectBox;
