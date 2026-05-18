export default function StatusBadge({ status }) {
  const classes = {
    Open: "badge-open",
    "In Progress": "badge-progress",
    Closed: "badge-closed",
  };

  return (
    <span className={classes[status] || "badge-open"}>
      {status === "Open" && "● "}
      {status === "In Progress" && "◐ "}
      {status === "Closed" && "○ "}
      {status}
    </span>
  );
}
