import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies

import {
    VStack,
    Button,
} from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from "@chakra-ui/table";

import teamMembersAPIClient from '../APIClients/TeamMembersAPIClient';
import { TeamMemberDTO } from "../types/TeamMemberTypes";

const TeamMembersPage = (): React.ReactElement {
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
        <VStack spacing="24px" style={{ margin: "24px auto" }}>
            <h1>Team Members Page</h1>
            <TableContainer>
                <Table colorScheme="blue">
                    <Thead>
                        <Tr>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Team Role</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {teamMembers?.map((teamMember, index) => (
                            <Tr key={index}>
                                <Td>{teamMember.firstName}</Td>
                                <Td>{teamMember.lastName}</Td>
                                <Td>{teamMember.teamRole}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Button colorScheme="teal" onClick={addTM}>
                Add an onion
            </Button>
        </VStack>
    );
};

export default TeamMembersPage;
