import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import teamMemberAPIClient from "../../APIClients/TeamMembersAPIClient";
import { TeamMember } from "../../types/TeamMemberTypes";

const TeamMembersPage = (): React.ReactElement => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const getTeamMembers = async () => {
    const teamMembersData = await teamMemberAPIClient.getTeamMembers();
    if (teamMembersData) {
      setTeamMembers(teamMembersData);
    }
  };

  const addTeamMember = async () => {
    await teamMemberAPIClient.createTeamMember({
      id: "1",
      firstName: "Aathi",
      lastName: "C",
      teamRole: "DEVELOPER",
    });
    await getTeamMembers();
  };

  useEffect(() => {
    getTeamMembers();
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
            {teamMembers.map((teamMember, index) => (
              <Tr key={index}>
                <Td>{teamMember.firstName}</Td>
                <Td>{teamMember.lastName}</Td>
                <Td>{teamMember.teamRole}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button colorScheme="blue" onClick={addTeamMember}>
        Add Team Member
      </Button>
    </VStack>
  );
};

export default TeamMembersPage;
