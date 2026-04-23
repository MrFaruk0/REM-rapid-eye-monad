// DailyTask — günlük görev göstergesi
export default function DailyTask({ task, taskCompleted }) {
  if (!task) return null;

  return (
    <div
      id="daily-task-panel"
      style={{
        background: taskCompleted
          ? "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.05))"
          : "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
        border: `1px solid ${taskCompleted ? "rgba(34,197,94,0.4)" : "rgba(124,58,237,0.35)"}`,
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "all 0.4s ease",
      }}
    >
      {/* Icon */}
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: taskCompleted
          ? "rgba(34,197,94,0.2)"
          : "rgba(124,58,237,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        flexShrink: 0,
      }}>
        {taskCompleted ? "✅" : "🎯"}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "10px",
          color: "var(--muted)",
          fontWeight: "700",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}>
          Günlük Görev
        </div>
        <div style={{
          fontSize: "14px",
          fontWeight: "600",
          color: taskCompleted ? "#22c55e" : "var(--text)",
        }}>
          {task.description}
        </div>
        <div style={{
          fontSize: "11px",
          color: "var(--muted)",
          marginTop: "3px",
        }}>
          Hedef: <span style={{ color: taskCompleted ? "#22c55e" : "#a78bfa" }}>{task.targetActivity}</span>
          {" · "}
          Ödül: <span style={{ color: "#f97316" }}>+{task.reward} MON</span>
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        padding: "4px 10px",
        borderRadius: "20px",
        background: taskCompleted ? "rgba(34,197,94,0.2)" : "rgba(124,58,237,0.2)",
        border: `1px solid ${taskCompleted ? "rgba(34,197,94,0.5)" : "rgba(124,58,237,0.5)"}`,
        fontSize: "10px",
        fontWeight: "700",
        color: taskCompleted ? "#22c55e" : "#a78bfa",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
      }}>
        {taskCompleted ? "TAMAMLANDI" : "AKTİF"}
      </div>
    </div>
  );
}
