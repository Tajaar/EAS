import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

export const CheckToggle: React.FC<{
  initialChecked?: boolean;
  onChange?: (isCheckedIn: boolean) => Promise<void> | void;
}> = ({ initialChecked = false, onChange }) => {
  const [checked, setChecked] = useState(initialChecked);
  const [loading, setLoading] = useState(false);

  useEffect(() => setChecked(initialChecked), [initialChecked]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    const newState = !checked;
    try {
      await onChange?.(newState);
      setChecked(newState);
    } catch (err) {
      console.error("Error updating check state:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <ToggleContainer>
        <input
          type="checkbox"
          id="checkbox"
          checked={checked}
          onChange={toggle}
          disabled={loading}
        />
        <ToggleLabel checked={checked} />
      </ToggleContainer>

      <MessageSection>
        <Status loading={loading} checked={checked}>
          {loading ? "Processing..." : checked ? "Checked In" : "Checked Out"}
        </Status>
        <Hint checked={checked}>
          {checked ? "Tap to check out" : "Tap to check in"}
        </Hint>
      </MessageSection>
    </Wrapper>
  );
};

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 8px #4caf50; }
  50% { box-shadow: 0 0 20px #4caf50; }
`;

// Styled components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  margin: 50px auto;
`;

const ToggleContainer = styled.div`
  position: relative;
  width: 80px;
  height: 44px;

  input[type="checkbox"] {
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: absolute;
    z-index: 2;
  }
`;

const ToggleLabel = styled.label<{ checked?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ checked }) => (checked ? "#4caf50" : "#ccc")};
  border-radius: 44px;
  transition: background 0.4s ease;
  cursor: pointer;
  box-shadow: ${({ checked }) => (checked ? "0 0 10px #4caf50" : "none")};

  &:before {
    content: "";
    position: absolute;
    left: 4px;
    top: 4px;
    width: 36px;
    height: 36px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    ${({ checked }) =>
      checked &&
      css`
        transform: translateX(36px);
        animation: ${pulse} 0.4s ease, ${glow} 1.2s ease-in-out infinite;
      `}
  }
`;

const MessageSection = styled.div`
  margin-top: 24px;
  text-align: center;
`;

const Status = styled.div<{ loading: boolean; checked: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ checked }) => (checked ? "#4caf50" : "#333")};
  opacity: ${({ loading }) => (loading ? 0.7 : 1)};
  transition: all 0.3s;
`;

const Hint = styled.div<{ checked: boolean }>`
  font-size: 0.95rem;
  color: #666;
  margin-top: 6px;
  transition: color 0.3s;
  color: ${({ checked }) => (checked ? "#388e3c" : "#666")};
`;
