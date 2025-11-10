import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from "@mui/material";

import teamMembersAPIClient from '../APIClients/TeamMembersAPIClient';
import { TeamMemberDTO } from "../types/TeamMemberTypes";

const TeamMembersPage = (): React.ReactElement => {
    const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[] | null>(null);
    // get function
    const getTM = async () => {
        const data = await teamMembersAPIClient.get();
        if (data) {
            setTeamMembers(data);
        }
    };

    const addTM = async (): Promise<void> => {
        await teamMembersAPIClient.create("Shalott", "Tam", "DEVELOPER");
        await getTM();
    };

    useEffect(() => {
        getTM();
    }, []);

    return (
       <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "24px", 
                margin: "24px auto",
                padding: "24px"
            }}
        >
            <Typography variant="headlineLarge">Team Members Page</Typography>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Team Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamMembers?.map((teamMember, index) => (
                            <TableRow key={index}>
                                <TableCell>{teamMember.firstName}</TableCell>
                                <TableCell>{teamMember.lastName}</TableCell>
                                <TableCell>{teamMember.teamRole}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Button 
                variant="contained" 
                color="primary"
                onClick={addTM}
            >
                Add an onion
            </Button>
        </Box>
    );
};

export default TeamMembersPage;
