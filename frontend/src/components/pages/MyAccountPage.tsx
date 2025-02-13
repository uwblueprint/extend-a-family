import React from "react";
import { Container, Typography, Avatar, Box, Button } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { isAuthenticatedFacilitator, isAuthenticatedLearner } from "../../types/AuthTypes";
import { useUser } from "../../hooks/useUser";
import MainPageButton from "../common/MainPageButton";

const MyAccount = (): React.ReactElement => {
  const authenticatedUser = useUser();

  return (
    <>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          display: "flex",
          padding: "48px", // This padding is customizable and can be adjusted
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          flex: "1 0 0",
          alignSelf: "stretch",
          background: "#F8F9FA",
          height: "92vh", // Ensures the container takes full height of the screen
        }}
      >
        <MainPageButton />
        <Container
          sx={{
            display: "flex",
            padding: "32px",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px",
            borderRadius: "16px",
            background: "#FFF",
            width: "464px",
            height: "653px",
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Typography
              sx={{
                color: "var(--Schemes-On-Background, #171D1E)",
                fontFamily: "Lexend Deca",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "120%", /* 33.6px */
              }}
            >
              Your Account
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "var(--Schemes-Outline, #6F797B)",
                fontFamily: "Lexend Deca",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%", // 22.4px
                letterSpacing: "0.2px",
              }}
            >
              View and edit your details
            </Typography>
          </Container>
          <Box
            sx={{
              display: "flex",
              width: "160px",
              height: "160px",
              padding: "26.667px",
              justifyContent: "center",
              alignItems: "center",
              gap: "66.667px",
              borderRadius: "5000px",
              background: "#D5F7FF",
            }}
          >
            <Avatar sx={{ width: "100%", height: "100%", bgcolor: "#D5F7FF" }}>
              <Typography
                sx={{
                  color: "var(--Schemes-Primary, #006877)",
                  fontFamily: "Lexend Deca",
                  fontSize: "60px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "140%", // 84px
                  letterSpacing: "-3px",
                }}
              >
                {`${authenticatedUser.firstName?.charAt(0)}${authenticatedUser.lastName?.charAt(0)}`}
              </Typography>
            </Avatar>
          </Box>
          <Container
            sx={{
              display: "flex",
              width: "400px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            <Typography
              sx={{
                color: "#000",
                fontFamily: "Lexend Deca",
                fontSize: "26px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "120%",
              }}
            >
              Details
            </Typography>
            <Container
              disableGutters
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                alignSelf: "stretch",
              }}
            >
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--Schemes-Outline, #6F797B)",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                  }}
                >
                  First Name
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    flex: "1 0 0",
                    overflow: "hidden",
                    color: "#000",
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%", // 22.4px
                    letterSpacing: "0.2px",
                  }}
                >
                  {authenticatedUser.firstName}
                </Typography>
              </Container>
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Schemes-Outline, #6F797B)",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                  }}
                >
                  Last Name
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    flex: "1 0 0",
                    overflow: "hidden",
                    color: "#000",
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%", // 22.4px
                    letterSpacing: "0.2px",
                  }}
                >
                  {authenticatedUser.lastName}
                </Typography>
              </Container>
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >

                <Typography
                  sx={{
                    color: "var(--Schemes-Outline, #6F797B)",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0.32px",
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    flex: "1 0 0",
                    overflow: "hidden",
                    color: "#000",
                    textAlign: "right",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%", // 22.4px
                    letterSpacing: "0.2px",
                  }}
                >
                  {authenticatedUser.email}
                </Typography>
              </Container>
            </Container>
            <Container
              disableGutters
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
                alignSelf: "stretch",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  height: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "4px",
                  background: "var(--M3-sys-light-primary, #006877)",
                  padding: "10px 24px 10px 16px",
                  flex: "1 0 0",
                }}
              ><Container
                sx={{
                  display: "flex",
                  padding: "10px 24px 10px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 0 0",
                  alignSelf: "stretch",
                }}
              >
                  <ModeEditOutlineOutlinedIcon sx={{ color: "#FFFFFF" }} />
                  <Typography
                    sx={{
                      color: "var(--M3-sys-light-on-primary, #FFF)",
                      textAlign: "center",
                      fontFamily: "Lexend Deca",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 300,
                      lineHeight: "120%",
                      letterSpacing: "0.7px",
                      textTransform: "uppercase",
                    }}
                  >
                    Edit Details
                  </Typography>
                </Container>
              </Button>
              <Button
                sx={{
                  display: "flex",
                  height: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "4px",
                  background: "var(--Error-Light, #FFF2F0);",
                  padding: "10px 24px 10px 16px",
                  flex: "1 0 0",
                }}
              ><Container
                sx={{
                  display: "flex",
                  padding: "10px 24px 10px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 0 0",
                  alignSelf: "stretch",
                }}
              >
                  <CachedIcon sx={{ color: "#BA1A1A" }} />
                  <Typography
                    sx={{
                      color: "var(--Error-Default, #BA1A1A)",
                      textAlign: "center",
                      fontFamily: "Lexend Deca",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 300,
                      lineHeight: "120%",
                      letterSpacing: "0.7px",
                      textTransform: "uppercase",
                    }}
                  >
                    Reset Password
                  </Typography>
                </Container>
              </Button>
            </Container>
          </Container>
          {isAuthenticatedFacilitator(authenticatedUser) && (
            <Typography variant="body1">Learners: {authenticatedUser.learners}</Typography>
          )}
          {isAuthenticatedLearner(authenticatedUser) && (
            <Typography variant="body1">Facilitator: {authenticatedUser.facilitator}</Typography>
          )}
        </Container>
      </Container>
    </>
  );
};

export default MyAccount;
