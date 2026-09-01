#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn make_event(id: &str, threat_type: &str, severity: &str, source_ip: &str) -> ThreatEvent {
        ThreatEvent {
            id: id.to_string(),
            threat_type: threat_type.to_string(),
            severity: severity.to_string(),
            source_ip: source_ip.to_string(),
            timestamp: "2024-06-15T12:00:00Z".to_string(),
            status: "ACTIVE".to_string(),
        }
    }

    // ── mean ──

    #[test]
    fn test_mean_empty() {
        let vals: Vec<f64> = vec![];
        assert_eq!(mean(&vals), 0.0);
    }

    #[test]
    fn test_mean_single_value() {
        assert_eq!(mean(&[42.0]), 42.0);
    }

    #[test]
    fn test_mean_multiple_values() {
        let vals = vec![10.0, 20.0, 30.0];
        assert!((mean(&vals) - 20.0).abs() < 1e-10);
    }

    #[test]
    fn test_mean_identical_values() {
        let vals = vec![5.0, 5.0, 5.0, 5.0];
        assert_eq!(mean(&vals), 5.0);
    }

    #[test]
    fn test_mean_negative_values() {
        let vals = vec![-10.0, 10.0];
        assert_eq!(mean(&vals), 0.0);
    }

    // ── stddev ──

    #[test]
    fn test_stddev_empty() {
        let vals: Vec<f64> = vec![];
        assert_eq!(stddev(&vals, 0.0), 0.0);
    }

    #[test]
    fn test_stddev_single_element() {
        assert_eq!(stddev(&[5.0], 5.0), 0.0);
    }

    #[test]
    fn test_stddev_known_values() {
        let vals = vec![2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0];
        let m = mean(&vals);
        let sd = stddev(&vals, m);
        assert!((sd - 2.0).abs() < 0.01);
    }

    #[test]
    fn test_stddev_identical_values() {
        let vals = vec![3.0, 3.0, 3.0];
        assert_eq!(stddev(&vals, 3.0), 0.0);
    }

    // ── z_score ──

    #[test]
    fn test_z_score_zero_sd() {
        assert_eq!(z_score(5.0, 3.0, 0.0), 0.0);
    }

    #[test]
    fn test_z_score_positive() {
        let score = z_score(10.0, 5.0, 2.0);
        assert!((score - 2.5).abs() < 1e-10);
    }

    #[test]
    fn test_z_score_negative() {
        let score = z_score(1.0, 5.0, 2.0);
        assert!((score - (-2.0)).abs() < 1e-10);
    }

    #[test]
    fn test_z_score_at_mean() {
        assert_eq!(z_score(5.0, 5.0, 3.0), 0.0);
    }

    // ── rate_severity ──

    #[test]
    fn test_rate_severity_low() {
        assert_eq!(rate_severity(0.5), "low");
        assert_eq!(rate_severity(-0.3), "low");
    }

    #[test]
    fn test_rate_severity_medium() {
        assert_eq!(rate_severity(1.5), "medium");
        assert_eq!(rate_severity(-1.2), "medium");
    }

    #[test]
    fn test_rate_severity_high() {
        assert_eq!(rate_severity(2.5), "high");
        assert_eq!(rate_severity(-2.1), "high");
    }

    #[test]
    fn test_rate_severity_critical() {
        assert_eq!(rate_severity(3.0), "critical");
        assert_eq!(rate_severity(-4.5), "critical");
    }

    #[test]
    fn test_rate_severity_boundary_values() {
        assert_eq!(rate_severity(1.0), "medium");
        assert_eq!(rate_severity(2.0), "high");
        assert_eq!(rate_severity(3.0), "critical");
    }

    // ── overall_risk ──

    #[test]
    fn test_overall_risk_low() {
        let counts: HashMap<String, usize> = HashMap::new();
        assert_eq!(overall_risk(&counts), "LOW");
    }

    #[test]
    fn test_overall_risk_medium() {
        let mut counts: HashMap<String, usize> = HashMap::new();
        counts.insert("HIGH".to_string(), 5);
        assert_eq!(overall_risk(&counts), "MEDIUM");
    }

    #[test]
    fn test_overall_risk_high_critical_count() {
        let mut counts: HashMap<String, usize> = HashMap::new();
        counts.insert("CRITICAL".to_string(), 4);
        assert_eq!(overall_risk(&counts), "HIGH");
    }

    #[test]
    fn test_overall_risk_critical_many_critical() {
        let mut counts: HashMap<String, usize> = HashMap::new();
        counts.insert("CRITICAL".to_string(), 10);
        assert_eq!(overall_risk(&counts), "CRITICAL");
    }

    #[test]
    fn test_overall_risk_critical_many_high() {
        let mut counts: HashMap<String, usize> = HashMap::new();
        counts.insert("HIGH".to_string(), 20);
        assert_eq!(overall_risk(&counts), "CRITICAL");
    }

    #[test]
    fn test_overall_risk_medium_many_medium() {
        let mut counts: HashMap<String, usize> = HashMap::new();
        counts.insert("MEDIUM".to_string(), 25);
        assert_eq!(overall_risk(&counts), "MEDIUM");
    }

    // ── ThreatEvent deserialization ──

    #[test]
    fn test_threat_event_deserialize() {
        let json_str = r#"{"id":"THR-001","type":"DDoS","severity":"HIGH","source_ip":"10.0.0.1","timestamp":"2024-06-15T12:00:00Z","status":"ACTIVE"}"#;
        let event: ThreatEvent = serde_json::from_str(json_str).unwrap();
        assert_eq!(event.id, "THR-001");
        assert_eq!(event.threat_type, "DDoS");
        assert_eq!(event.severity, "HIGH");
        assert_eq!(event.source_ip, "10.0.0.1");
    }

    #[test]
    fn test_threat_event_serialize_roundtrip() {
        let event = make_event("THR-002", "SQLInjection", "CRITICAL", "192.168.1.1");
        let json_str = serde_json::to_string(&event).unwrap();
        let deserialized: ThreatEvent = serde_json::from_str(&json_str).unwrap();
        assert_eq!(event.id, deserialized.id);
        assert_eq!(event.threat_type, deserialized.threat_type);
        assert_eq!(event.severity, deserialized.severity);
        assert_eq!(event.source_ip, deserialized.source_ip);
    }

    #[test]
    fn test_threat_event_malformed_json() {
        let result = serde_json::from_str::<ThreatEvent>("not valid json");
        assert!(result.is_err());
    }

    #[test]
    fn test_threat_event_missing_field() {
        let json_str = r#"{"id":"THR-001","type":"DDoS"}"#;
        let result = serde_json::from_str::<ThreatEvent>(json_str);
        assert!(result.is_err());
    }

    // ── RiskReport serialization ──

    #[test]
    fn test_risk_report_serialization() {
        let mut severity_counts: HashMap<String, usize> = HashMap::new();
        severity_counts.insert("HIGH".to_string(), 5);
        let mut type_counts: HashMap<String, usize> = HashMap::new();
        type_counts.insert("DDoS".to_string(), 3);

        let report = RiskReport {
            total_events: 5,
            severity_counts,
            type_counts,
            anomaly_scores: vec![],
            risk_level: "MEDIUM".to_string(),
            summary: "Test summary".to_string(),
        };

        let json_str = serde_json::to_string(&report).unwrap();
        assert!(json_str.contains("total_events"));
        assert!(json_str.contains("risk_level"));
        assert!(json_str.contains("MEDIUM"));
    }

    // ── AnomalyScore serialization ──

    #[test]
    fn test_anomaly_score_serialization() {
        let score = AnomalyScore {
            event_id: "THR-001".to_string(),
            threat_type: "DDoS".to_string(),
            source_ip: "10.0.0.1".to_string(),
            score: 2.5,
            deviation: 2.5,
            rating: "high".to_string(),
        };

        let json_str = serde_json::to_string(&score).unwrap();
        assert!(json_str.contains("event_id"));
        assert!(json_str.contains("score"));
        assert!(json_str.contains("high"));
    }
}
