import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
    <StyledWrapper>
      <div className="container">
        <input
          type="checkbox"
          id="checkbox"
          checked={checked}
          onChange={toggle}
          disabled={loading}
        />
        <label htmlFor="checkbox" className="label" />
      </div>

      <div className="text-section">
        <div className="status">
          {loading ? "Processing..." : checked ? "Checked In" : "Checked Out"}
        </div>
        <div className="hint">
          {checked ? "Tap to check out" : "Tap to check in"}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    height: 60px;
    width: 120px;
    background-color: #ffffff;
    border-radius: 30px;
    box-shadow: inset 0 0 5px 4px rgba(255, 255, 255, 1),
      inset 0 0 20px 1px rgba(0, 0, 0, 0.488),
      10px 20px 30px rgba(0, 0, 0, 0.096),
      inset 0 0 0 3px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    transition: transform 0.4s;
  }

  .label:hover {
    transform: perspective(100px) rotateX(5deg) rotateY(-5deg);
  }

  #checkbox:checked ~ .label:hover {
    transform: perspective(100px) rotateX(-5deg) rotateY(5deg);
  }

  #checkbox {
    display: none;
  }

  #checkbox:checked ~ .label::before {
    left: 70px;
    background-color: #000000;
    background-image: linear-gradient(315deg, #000000 0%, #414141 70%);
    transition: 0.4s;
  }

  .label::before {
    position: absolute;
    content: "";
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #000000;
    background-image: linear-gradient(
      130deg,
      #757272 10%,
      #ffffff 11%,
      #726f6f 62%
    );
    left: 10px;
    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.3),
      10px 10px 10px rgba(0, 0, 0, 0.3);
    transition: 0.4s;
  }

  .text-section {
    display: flex;
    flex-direction: column;
  }

  .status {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .hint {
    font-size: 0.8rem;
    color: gray;
  }
`;
