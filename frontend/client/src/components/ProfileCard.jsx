const ProfileCard = ({
  name = "Unknown",
  role = "Member",
  skills = [],
  isOnline = false,
  onGreet,
}) => {     
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        width: 260,
        margin: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#1f6f5c",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontWeight: "bold",
          }}
        >
          {name[0].toUpperCase()}
        </div>
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>{role}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: isOnline ? "green" : "#999" }}>
        {isOnline ? "● Online" : "○ Offline"}
      </p>

      <p style={{ fontSize: 13 }}>Skills: {skills.join(", ")}</p>

      <button onClick={onGreet}>Say hi</button>
    </div>
  );
}

export default ProfileCard;