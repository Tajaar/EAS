import React from "react";
import styled from "styled-components";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContent";

export const Navbar: React.FC<{ appName?: string }> = ({
  appName = "Employee Attendance App",
}) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Header>
      <Container>
        {/* Left: App Name */}
        <Left>
          <AppName href="#">{appName}</AppName>
        </Left>

        {/* Center: Employee Name & Role */}
        <Center>
          <Info>{user.name}</Info>
          <Role>{user.role}</Role>
        </Center>

        {/* Right: Logout Button */}
        <Right>
          <LogoutButton onClick={() => logout()}>
            <LogOut size={18} />
            Logout
          </LogoutButton>
        </Right>
      </Container>
    </Header>
  );
};

// Styled Components

const Header = styled.header`
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 8px 16px;
    gap: 8px;
  }
`;

const Left = styled.div`
  flex: 1;
`;

const AppName = styled.a`
  font-weight: 700;
  font-size: 1.5rem;
  color: #e53935;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
`;

const Info = styled.span`
  font-weight: 500;
  font-size: 1rem;
  color: #333;
`;

const Role = styled.span`
  font-size: 0.9rem;
  color: #666;
  text-transform: capitalize;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #e53935;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: #d32f2f;
  }

  svg {
    stroke: white;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;
