import React from "react";
import type { ButtonHTMLAttributes } from "react";
import type { ReactNode } from "react";
import styled, { css } from "styled-components";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ children, icon, variant = "primary", ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      <span>
        {icon && <span className="icon">{icon}</span>}
        {children}
      </span>
    </StyledButton>
  );
};

const StyledButton = styled.button<{ variant: "primary" | "secondary" }>`
  border-radius: 0.9em;
  cursor: pointer;
  padding: 0.8em 1.2em 0.8em 1em;
  transition: all ease-in-out 0.2s;
  font-size: 16px;
  border: 2px solid transparent;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    font-weight: 600;

    .icon {
      display: flex;
      align-items: center;
    }
  }

  ${({ variant }) =>
    variant === "primary" &&
    css`
      background-color: #24b4fb;
      border-color: #24b4fb;
      color: #fff;

      &:hover {
        background-color: #0071e2;
      }
    `}

  ${({ variant }) =>
    variant === "secondary" &&
    css`
      background-color: #f8fafc;
      border: 2px solid #cbd5e1;
      color: #1f2937;

      &:hover {
        background-color: #e2e8f0;
      }
    `}
`;

export default Button;
