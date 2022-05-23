import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

type Props = {
  setDropdown: any;
  dropdown: boolean;
  value: any;
  onChange: (value: any) => void;
  dropDownList: any[];
  width: string;
  top: string;
};

const DropdownMain = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  gap: 11px;
  background: #373943;
  border-radius: 11px;
  width: ${(props: { width: string }) => (props.width ? props.width : '155.78px')};
  height: 37px;
  cursor: pointer;

  font-family: 'Rubik';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  margin-top: ${(props: { top: string }) => (props.top ? props.top : '36px')};

  color: #5c95ff;

  .cross {
    font-size: 22px;
  }

  .logo-container {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    background: #edf0f4;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
`;

const DropdownContainer = styled.div`
  width: ${(props: { width: string }) => (props.width ? props.width : '155.78px')};
  background: #373943;
  border-radius: 11px;
  position: absolute;

  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 30px;
  margin-left: -10px;
  z-index: 3;

  .drop-el {
    height: 38px;
    display: flex;
    align-items: center;
    padding-left: 10px;

    &:hover {
      opacity: 0.5;
    }
  }
`;

export default function DropdownComponentWithIcon({
  setDropdown,
  dropdown,
  value,
  onChange,
  dropDownList,
  width,
  top
}: Props) {
  return (
    <DropdownMain
      onClick={() => {
        setDropdown(!dropdown);
      }}
      width={width}
      top={top}
    >
      <div className="logo-container">
        <Image width="12px" height="12px" src={dropDownList[value].image} />
      </div>
      {dropDownList[value].name}
      <Image width="12px" style={{ zIndex: 1 }} height="11px" src="/icons/downIcon.svg" />
      {dropdown && (
        <DropdownContainer width={width}>
          {dropDownList &&
            dropDownList.map((data, index) => (
              <div key={index} onClick={() => onChange(index)} className="drop-el">
                <div className="logo-container">
                  <Image width="12px" height="12px" src={dropDownList[index].image} />
                </div>
                {data.name}
              </div>
            ))}
        </DropdownContainer>
      )}
    </DropdownMain>
  );
}
