import React, { useState } from "react";
import styled from "styled-components";


export const DropDownContainer = styled("div")`
  padding-top: 20px;
  width: 200px;
`;

export const DropDownHeader = styled("div")`
  cursor: pointer;
  padding: 0.4em 2em 0.4em 1em;
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