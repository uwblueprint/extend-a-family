import React, { useEffect, useState } from "react";
import teamMemberAPIClient from "../../APIClients/TeamMembersAPIClient";
import { TeamMember } from "../../types/TeamMemberTypes";

const TeamMembersPage = (): React.ReactElement => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const getTeamMembers = async () => {
    const teamMembersData = await teamMemberAPIClient.get();
    if (teamMembersData) {
      setTeamMembers(teamMembersData);
    }
  };

  const addTeamMember = async () => {
    await teamMemberAPIClient.create("Carolyn", "Zhang", "PL");
    await getTeamMembers(); // updates table with latest data
  };

  useEffect(() => {
    getTeamMembers();
  }, []);

  return (
    <div style={{ margin: "24px auto", maxWidth: 900, padding: 12 }}>
      <h1>Team Members Page</h1>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                First Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Last Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Team Role
              </th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((teamMember) => (
              <tr key={teamMember.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {teamMember.firstName}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {teamMember.lastName}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {teamMember.teamRole}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={addTeamMember}
          style={{
            background: "#3182ce",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          + Add a Carolyn
        </button>
      </div>
    </div>
  );
};

export default TeamMembersPage;
