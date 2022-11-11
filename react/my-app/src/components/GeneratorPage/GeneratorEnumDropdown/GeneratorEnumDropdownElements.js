import React, { useState } from "react";
import styled from "styled-components";
import {MdExpandMore} from 'react-icons/md'

export const DropDownContainer = styled("div")`
  padding-top: 20px;
  width: 220px;
`;

export const DropDownHeader = styled("div")`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  padding: 0.4em 0.4em 0.4em 0.4em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-size: 20px;
  color: #fff;
  background: #5D6270;
  text-align: center;
  height: 48px;

  &:hover{
    background: #808080;
  }
`;

export const DropDownListContainer = styled("div")`
`;

export const DropDownList = styled("ul")`
  position: absolute;
  background: #17181c;
  box-sizing: border-box;
  color: #fff;
  font-size: 1.3rem;
  &:first-child {
    //padding-top: 0.8em;
  }
  width: 200px;
`;

export const ListItem = styled("li")`
  cursor: pointer;
  list-style: none;
  text-align: center;
  width: 200px;
  height: 40px;
  padding-top: 5px;

  &:hover{
    background: #3faffa;
  }
`;

export const ArrowDown = styled(MdExpandMore)`
    
    font-size: 32px;
    text-align: right;
`;