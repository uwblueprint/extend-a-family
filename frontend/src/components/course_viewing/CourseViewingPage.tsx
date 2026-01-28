import { useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Search } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CourseUnit } from "../../types/CourseTypes";
import CourseModulesGrid from "./CourseModulesGrid";
import UnitSidebar from "./sidebar/UnitSidebar";
import StartAdornedTextField from "../common/form/StartAdornedTextField";
import { useUser } from "../../hooks/useUser";

export default function CourseUnitsPage() {
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { role } = useUser();

  const handleDrawerOpen = () => {
    setSidebarOpen(true);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Update URL when selectedUnit changes
  useEffect(() => {
    if (selectedUnit) {
      const searchParams = new URLSearchParams(location.search);
      const currentUnitId = searchParams.get("selectedUnit");

      if (currentUnitId !== selectedUnit.id) {
        searchParams.set("selectedUnit", selectedUnit.id);
        history.replace({
          pathname: location.pathname,
          search: searchParams.toString(),
        });
      }
    }
  }, [selectedUnit, location.pathname, location.search, history]);

  return (
    <Box display="flex" width="100%" height="100vh" overflow="hidden">
      <UnitSidebar
        setSelectedUnit={setSelectedUnit}
        open={sidebarOpen}
        selectedUnit={selectedUnit}
      />

      <Box sx={{ flexGrow: 1, p: "48px", mb: "48px", overflowY: "scroll" }}>
        {selectedUnit ? (
          <Stack spacing="14px">
            <Box
              display="flex"
              alignItems="center"
              paddingLeft="10px"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                {!sidebarOpen && (
                  <Button
                    type="button"
                    sx={{
                      color: theme.palette.Neutral[700],
                      backgroundColor: theme.palette.Neutral[200],
                      borderRadius: "4px",
                      width: "34px",
                      minWidth: "34px",
                      height: "34px",
                      padding: 0,
                      marginRight: "12px",
                    }}
                    onClick={handleDrawerOpen}
                  >
                    <MenuOpenIcon
                      sx={{
                        fontSize: "18px",
                        transform: "scaleX(-1)",
                      }}
                    />
                  </Button>
                )}
                <Typography variant="headlineLarge" display="inline">
                  Unit {selectedUnit.displayIndex}: {selectedUnit.title}
                </Typography>
              </Box>
              <StartAdornedTextField
                variant="outlined"
                label="Search"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
                adornment={
                  <Search
                    sx={{
                      color: isSearchActive
                        ? theme.palette.Neutral[600]
                        : theme.palette.Neutral[500],
                    }}
                  />
                }
                focusedBorderColor={theme.palette[role].Dark.Default}
                sx={{
                  minWidth: "400px",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: isSearchActive
                        ? theme.palette[role].Dark.Default
                        : theme.palette.Neutral[500],
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.Neutral[600],
                    },
                  },
                }}
              />
            </Box>
            <CourseModulesGrid
              unitId={selectedUnit.id}
              isSidebarOpen={sidebarOpen}
              searchQuery={searchQuery}
            />
          </Stack>
        ) : (
          <Typography>Loading units...</Typography>
        )}
      </Box>
    </Box>
  );
}
