import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  Button,
  Heading,
} from "@chakra-ui/react";
import teamMemberAPIClient from "../../APIClients/TeamMembersAPIClient";
import { TeamMember } from "../../types/TeamMemberTypes";

const TeamMembersPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const getTeamMembers = async () => {
    const teamMembersData = await teamMemberAPIClient.getTeamMembers();
    if (teamMembersData) {
      setTeamMembers(teamMembersData);
    }
  };

  const addTeamMember = async () => {
    await teamMemberAPIClient.createTeamMember(
      "John",
      "Cena",
      "notAnEmail@email.com",
      "PM",
    );
    await getTeamMembers();
  };

  useEffect(() => {
    getTeamMembers();
  }, []);

  return (
    <VStack gap={2}>
      <Heading>Team members page</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>First name</Th>
              <Th>Last name</Th>
              <Th>Team role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teamMembers.map((member, index) => {
              return (
                <Tr key={index}>
                  <Td>{member.firstName}</Td>
                  <Td>{member.lastName}</Td>
                  <Td>{member.teamRole}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Button onClick={addTeamMember}>Add a John Cena</Button>
    </VStack>
  );
};

export default TeamMembersPage;
