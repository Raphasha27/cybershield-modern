package models

import "time"

type Threat struct {
	ID        string    json:"id"
	Type      string    json:"type"
	Severity  string    json:"severity"
	SourceIP  string    json:"source_ip"
	Timestamp time.Time json:"timestamp"
	Status    string    json:"status"
}

type Metrics struct {
	TotalThreats      int            json:"total_threats_24h"
	ActiveAlerts      int            json:"active_alerts"
	BlockedIPs        int            json:"blocked_ips"
	SeverityBreakdown map[string]int json:"severity_breakdown"
}
