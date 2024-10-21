import React from "react";
import { Container, Typography, Button } from "@mui/material";
import styled from "styled-components";

const DivContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

interface ForgotPasswordConfirmationProps {
    onBackToEmail: () => void; // Add a prop for the callback function
}

const ForgotPasswordConfirmation: React.FC<ForgotPasswordConfirmationProps> = ({ onBackToEmail }) => {
    return (
        <DivContainer>
            <Container
                sx={{
                    display: "flex",
                    width: "500px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexShrink: "0",
                }}
            >
                <Container
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "var(--Space-200, 8px)",
                        alignSelf: "stretch",
                        marginLeft: "-24px",
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            color: "#000",
                            fontFamily: "Lexend Deca",
                            fontSize: "28px",
                            fontWeight: "600",
                            lineHeight: "120%",
                            marginBottom: "0px",
                        }}
                    >
                        Email sent
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#000",
                            fontFamily: "Lexend Deca",
                            fontSize: "16px",
                            fontWeight: "400",
                            lineHeight: "140%",
                            letterSpacing: "0.2px",
                        }}
                    >
                        Check your email (email@email.com) and open the link we sent to continue.
                    </Typography>
                </Container>
                <Button
                    variant="text"
                    color="primary"
                    onClick={onBackToEmail}
                    sx={{
                        color: "var(--Schemes-Primary, #006877)",
                        fontSize: "12.5px",
                        fontStyle: "normal",
                        fontWeight: "300",
                        lineHeight: "120%", /* 15px */
                        letterSpacing: "0.625px",
                        textTransform: "uppercase",
                        padding: "0px",
                    }}
                >
                    NOT YOUR EMAIL? Go back to change your email
                </Button>
            </Container>
        </DivContainer >
    );
};

export default ForgotPasswordConfirmation;
