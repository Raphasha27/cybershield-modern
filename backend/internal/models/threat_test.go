package models

import (
	"encoding/json"
	"testing"
	"time"
)

func TestThreatCreation(t *testing.T) {
	now := time.Now()
	threat := Threat{
		ID:        "THR-001",
		Type:      "DDoS",
		Severity:  "HIGH",
		SourceIP:  "192.168.1.100",
		Timestamp: now,
		Status:    "ACTIVE",
	}

	if threat.ID != "THR-001" {
		t.Errorf("expected ID THR-001, got %s", threat.ID)
	}
	if threat.Type != "DDoS" {
		t.Errorf("expected Type DDoS, got %s", threat.Type)
	}
	if threat.Severity != "HIGH" {
		t.Errorf("expected Severity HIGH, got %s", threat.Severity)
	}
	if threat.SourceIP != "192.168.1.100" {
		t.Errorf("expected SourceIP 192.168.1.100, got %s", threat.SourceIP)
	}
	if !threat.Timestamp.Equal(now) {
		t.Errorf("expected Timestamp %v, got %v", now, threat.Timestamp)
	}
	if threat.Status != "ACTIVE" {
		t.Errorf("expected Status ACTIVE, got %s", threat.Status)
	}
}

func TestThreatSerialization(t *testing.T) {
	now := time.Date(2024, 6, 15, 12, 0, 0, 0, time.UTC)
	threat := Threat{
		ID:        "THR-001",
		Type:      "SQLInjection",
		Severity:  "CRITICAL",
		SourceIP:  "10.0.0.1",
		Timestamp: now,
		Status:    "BLOCKED",
	}

	data, err := json.Marshal(threat)
	if err != nil {
		t.Fatalf("failed to marshal threat: %v", err)
	}

	var decoded Threat
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal threat: %v", err)
	}

	if decoded.ID != threat.ID {
		t.Errorf("decoded ID mismatch: got %s", decoded.ID)
	}
	if decoded.Type != threat.Type {
		t.Errorf("decoded Type mismatch: got %s", decoded.Type)
	}
	if decoded.Severity != threat.Severity {
		t.Errorf("decoded Severity mismatch: got %s", decoded.Severity)
	}
	if decoded.SourceIP != threat.SourceIP {
		t.Errorf("decoded SourceIP mismatch: got %s", decoded.SourceIP)
	}
	if !decoded.Timestamp.Equal(threat.Timestamp) {
		t.Errorf("decoded Timestamp mismatch: got %v", decoded.Timestamp)
	}
	if decoded.Status != threat.Status {
		t.Errorf("decoded Status mismatch: got %s", decoded.Status)
	}
}

func TestThreatJSONTags(t *testing.T) {
	threat := Threat{
		ID:        "THR-002",
		Type:      "XSS",
		Severity:  "MEDIUM",
		SourceIP:  "172.16.0.1",
		Timestamp: time.Now(),
		Status:    "ACTIVE",
	}

	data, err := json.Marshal(threat)
	if err != nil {
		t.Fatalf("failed to marshal: %v", err)
	}

	var raw map[string]interface{}
	if err := json.Unmarshal(data, &raw); err != nil {
		t.Fatalf("failed to unmarshal to map: %v", err)
	}

	expectedKeys := map[string]string{
		"id":         "THR-002",
		"type":       "XSS",
		"severity":   "MEDIUM",
		"source_ip":  "172.16.0.1",
		"status":     "ACTIVE",
	}

	for key, expectedVal := range expectedKeys {
		val, ok := raw[key]
		if !ok {
			t.Errorf("missing JSON key: %s", key)
			continue
		}
		if val != expectedVal {
			t.Errorf("JSON key %s: expected %v, got %v", key, expectedVal, val)
		}
	}

	if _, ok := raw["timestamp"]; !ok {
		t.Error("missing JSON key: timestamp")
	}
}

func TestMetricsCreation(t *testing.T) {
	metrics := Metrics{
		TotalThreats: 1247,
		ActiveAlerts: 23,
		BlockedIPs:   89,
		SeverityBreakdown: map[string]int{
			"CRITICAL": 3,
			"HIGH":     12,
			"MEDIUM":   45,
			"LOW":      187,
		},
	}

	if metrics.TotalThreats != 1247 {
		t.Errorf("expected TotalThreats 1247, got %d", metrics.TotalThreats)
	}
	if metrics.ActiveAlerts != 23 {
		t.Errorf("expected ActiveAlerts 23, got %d", metrics.ActiveAlerts)
	}
	if metrics.BlockedIPs != 89 {
		t.Errorf("expected BlockedIPs 89, got %d", metrics.BlockedIPs)
	}
	if len(metrics.SeverityBreakdown) != 4 {
		t.Errorf("expected 4 severity entries, got %d", len(metrics.SeverityBreakdown))
	}
}

func TestMetricsSerialization(t *testing.T) {
	metrics := Metrics{
		TotalThreats: 100,
		ActiveAlerts: 5,
		BlockedIPs:   10,
		SeverityBreakdown: map[string]int{
			"CRITICAL": 1,
			"HIGH":     2,
			"MEDIUM":   3,
			"LOW":      4,
		},
	}

	data, err := json.Marshal(metrics)
	if err != nil {
		t.Fatalf("failed to marshal metrics: %v", err)
	}

	var decoded Metrics
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal metrics: %v", err)
	}

	if decoded.TotalThreats != metrics.TotalThreats {
		t.Errorf("decoded TotalThreats mismatch: got %d", decoded.TotalThreats)
	}
	if decoded.ActiveAlerts != metrics.ActiveAlerts {
		t.Errorf("decoded ActiveAlerts mismatch: got %d", decoded.ActiveAlerts)
	}
	if decoded.BlockedIPs != metrics.BlockedIPs {
		t.Errorf("decoded BlockedIPs mismatch: got %d", decoded.BlockedIPs)
	}
	for k, v := range metrics.SeverityBreakdown {
		if decoded.SeverityBreakdown[k] != v {
			t.Errorf("decoded SeverityBreakdown[%s] mismatch: got %d", k, decoded.SeverityBreakdown[k])
		}
	}
}

func TestThreatZeroValue(t *testing.T) {
	var threat Threat

	data, err := json.Marshal(threat)
	if err != nil {
		t.Fatalf("failed to marshal zero-value threat: %v", err)
	}

	var decoded Threat
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal zero-value threat: %v", err)
	}

	if decoded.ID != "" {
		t.Errorf("expected empty ID, got %s", decoded.ID)
	}
	if !decoded.Timestamp.IsZero() {
		t.Errorf("expected zero timestamp, got %v", decoded.Timestamp)
	}
}

func TestThreatStatusValues(t *testing.T) {
	validStatuses := []string{"ACTIVE", "BLOCKED", "INVESTIGATING", "RESOLVED"}

	for _, status := range validStatuses {
		threat := Threat{
			ID:     "THR-TEST",
			Type:   "PortScan",
			Status: status,
		}

		data, err := json.Marshal(threat)
		if err != nil {
			t.Fatalf("failed to marshal with status %s: %v", status, err)
		}

		var decoded Threat
		if err := json.Unmarshal(data, &decoded); err != nil {
			t.Fatalf("failed to unmarshal with status %s: %v", status, err)
		}

		if decoded.Status != status {
			t.Errorf("status roundtrip failed: expected %s, got %s", status, decoded.Status)
		}
	}
}

func TestMetricsJSONTags(t *testing.T) {
	metrics := Metrics{
		TotalThreats: 500,
		ActiveAlerts: 10,
		BlockedIPs:   20,
		SeverityBreakdown: map[string]int{
			"LOW": 470,
		},
	}

	data, err := json.Marshal(metrics)
	if err != nil {
		t.Fatalf("failed to marshal: %v", err)
	}

	var raw map[string]interface{}
	if err := json.Unmarshal(data, &raw); err != nil {
		t.Fatalf("failed to unmarshal to map: %v", err)
	}

	expectedKeys := []string{"total_threats_24h", "active_alerts", "blocked_ips", "severity_breakdown"}
	for _, key := range expectedKeys {
		if _, ok := raw[key]; !ok {
			t.Errorf("missing expected JSON key: %s", key)
		}
	}
}
