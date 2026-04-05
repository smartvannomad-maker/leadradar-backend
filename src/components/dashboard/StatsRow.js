import { styles } from "../../styles/dashboardStyles";

export default function StatsRow({ stats }) {
  const cards = [
    { label: "Total Leads", value: stats.totalLeads },
    { label: "New", value: stats.newLeads },
    { label: "Contacted", value: stats.contactedLeads },
    { label: "Interested", value: stats.interestedLeads },
    { label: "Closed", value: stats.closedLeads },
  ];

  return (
    <div style={styles.statsRow}>
      {cards.map((card) => (
        <div key={card.label} style={styles.statCard}>
          <p style={styles.statLabel}>{card.label}</p>
          <h2 style={styles.statValue}>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}