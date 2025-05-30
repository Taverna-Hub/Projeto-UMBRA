package edu.cesar.taverna.bd.OP.dao;

import edu.cesar.taverna.bd.OP.config.ConnectionFactory;
import edu.cesar.taverna.bd.OP.entity.MissionAssignment;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class  MissionAssignmentDAO extends GenericDAO<MissionAssignment> {
    @Override
    protected String getInsertSQL() {
        return "INSERT INTO MISSION_ASSIGNMENT (id_team, id_mission, deallocation_date) VALUES (?, ?, ?)";
    }

    @Override
    protected String getSelectByIdSQL() {
        return "SELECT * FROM MISSION_ASSIGNMENT WHERE id_mission = ?";
    }

    @Override
    protected String getSelectAllSQL() {
        return "SELECT * FROM MISSION_ASSIGNMENT";
    }

    @Override
    protected String getDeleteSQL() {
        return "DELETE FROM MISSION_ASSIGNMENT WHERE id_team = ? AND id_mission = ?";
    }

    @Override
    protected String getUpdateSQL() {
        return "UPDATE MISSION_ASSIGNMENT SET deallocation_date = ? WHERE id_team = ? AND id_mission = ?";
    }

    @Override
    protected void prepareInsert(PreparedStatement stmt, MissionAssignment missionAssignment) throws SQLException {
        stmt.setString(1, missionAssignment.getId_team().toString());
        stmt.setString(2, missionAssignment.getId_mission().toString());
        stmt.setDate(3, missionAssignment.getDeallocation_date() != null ? java.sql.Date.valueOf(missionAssignment.getDeallocation_date()) : null);
    }

    @Override
    protected void prepareUpdate(PreparedStatement stmt, MissionAssignment entity) throws SQLException {

    }


    protected void prepareUpdate(PreparedStatement stmt, UUID id_team, UUID id_mission) throws SQLException {
        stmt.setString(1, LocalDate.now().toString());
        stmt.setString(2, id_team.toString());
        stmt.setString(3, id_mission.toString());
    }

    public void update(UUID id_team, UUID id_mission){
        System.out.println(id_mission);
        System.out.println(id_team);
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(getUpdateSQL())) {
            prepareUpdate(stmt, id_team, id_mission);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating entity", e);
        }
    }


    @Override
    protected MissionAssignment mapResultSetToEntity(ResultSet rs) throws SQLException {
        MissionAssignment missionAssignment = new MissionAssignment();

        missionAssignment.setId_team(UUID.fromString(rs.getString("id_team")));
        missionAssignment.setId_mission(UUID.fromString(rs.getString("id_mission")));
        missionAssignment.setAllocation_date(rs.getDate("allocation_date") != null ? rs.getDate("allocation_date").toLocalDate() : null);
        missionAssignment.setDeallocation_date(rs.getDate("deallocation_date") != null ? rs.getDate("deallocation_date").toLocalDate() : null);

        return missionAssignment;
    }

    public List<MissionAssignment> findByMissionId(UUID id_mission) {
        List<MissionAssignment> results = new ArrayList<>();
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(getSelectByIdSQL())) {
            stmt.setString(1, id_mission.toString());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    results.add(mapResultSetToEntity(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching assignments by mission ID", e);
        }
        return results;
    }
}
