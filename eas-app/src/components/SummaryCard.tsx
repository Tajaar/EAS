// src/components/SummaryCard.tsx
import React from "react";
import styled from "styled-components";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";

interface SummaryCardProps {
  first_in?: string | null; // ISO string
  final_out?: string | null; // ISO string
  total_duration?: string | null; // HH:MM:SS string from backend
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  first_in,
  final_out,
  total_duration,
}) => {
  return (
    <Card>
      <Title>Today's Summary</Title>
      <ItemsContainer>
        <Item>
          <IconWrapper bg="#E6F4EA">
            <ArrowRight size={20} color="#4CAF50" />
          </IconWrapper>
          <Label>First In</Label>
          <Value>{first_in ? new Date(first_in).toLocaleTimeString() : "—"}</Value>
        </Item>

        <Item>
          <IconWrapper bg="#FDECEA">
            <ArrowLeft size={20} color="#F44336" />
          </IconWrapper>
          <Label>Last Out</Label>
          <Value>{final_out ? new Date(final_out).toLocaleTimeString() : "—"}</Value>
        </Item>

        <Item>
          <IconWrapper bg="#EAF4FD">
            <Clock size={20} color="#2196F3" />
          </IconWrapper>
          <Label>Total Time</Label>
          <Value>{total_duration || "00:00:00"}</Value>
        </Item>
      </ItemsContainer>
    </Card>
  );
};

// Styled Components
const Card = styled.div`
  background: white;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width: 100%;
  margin: 20px auto;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const ItemsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const IconWrapper = styled.div<{ bg: string }>`
  background: ${(props) => props.bg};
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #666;
  flex-shrink: 0;
`;

const Value = styled.span`
  font-weight: 600;
  color: #222;
  margin-left: auto; /* push value to the right */
  font-size: 1rem;
`;
