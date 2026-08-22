use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::{self, BufRead};

#[derive(Debug, Deserialize)]
struct ThreatEvent {
    id: String,
    #[serde(rename = "type")]
    threat_type: String,
    severity: String,
    #[serde(rename = "source_ip")]
    source_ip: String,
    timestamp: String,
    status: String,
}

#[derive(Debug, Serialize)]
struct RiskReport {
    total_events: usize,
    severity_counts: HashMap<String, usize>,
    type_counts: HashMap<String, usize>,
    anomaly_scores: Vec<AnomalyScore>,
    risk_level: String,
    summary: String,
}

#[derive(Debug, Serialize)]
struct AnomalyScore {
    event_id: String,
    threat_type: String,
    source_ip: String,
    score: f64,
    deviation: f64,
    rating: String,
}

fn mean(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    values.iter().sum::<f64>() / values.len() as f64
}

fn stddev(values: &[f64], mean: f64) -> f64 {
    if values.len() < 2 {
        return 0.0;
    }
    let variance = values.iter().map(|v| (v - mean).powi(2)).sum::<f64>() / values.len() as f64;
    variance.sqrt()
}

fn z_score(value: f64, mean: f64, sd: f64) -> f64 {
    if sd == 0.0 {
        return 0.0;
    }
    (value - mean) / sd
}

fn rate_severity(score: f64) -> String {
    let abs_score = score.abs();
    if abs_score >= 3.0 {
        "critical".to_string()
    } else if abs_score >= 2.0 {
        "high".to_string()
    } else if abs_score >= 1.0 {
        "medium".to_string()
    } else {
        "low".to_string()
    }
}

fn overall_risk(severity_counts: &HashMap<String, usize>) -> String {
    let critical = severity_counts.get("CRITICAL").unwrap_or(&0);
    let high = severity_counts.get("HIGH").unwrap_or(&0);

    if *critical > 5 || *high > 15 {
        "CRITICAL".to_string()
    } else if *critical > 2 || *high > 8 {
        "HIGH".to_string()
    } else if *high > 3 || severity_counts.get("MEDIUM").unwrap_or(&0) > 20 {
        "MEDIUM".to_string()
    } else {
        "LOW".to_string()
    }
}

fn main() {
    let stdin = io::stdin();
    let mut events: Vec<ThreatEvent> = Vec::new();

    for line in stdin.lock().lines() {
        let line = match line {
            Ok(l) => l,
            Err(_) => break,
        };
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        match serde_json::from_str::<ThreatEvent>(trimmed) {
            Ok(event) => events.push(event),
            Err(e) => eprintln!("Warning: skipping malformed event: {}", e),
        }
    }

    if events.is_empty() {
        eprintln!("No events provided. Reading one event per line from stdin.");
        return;
    }

    let mut severity_counts: HashMap<String, usize> = HashMap::new();
    let mut type_counts: HashMap<String, usize> = HashMap::new();
    let mut ip_counts: HashMap<String, usize> = HashMap::new();

    for event in &events {
        *severity_counts.entry(event.severity.clone()).or_insert(0) += 1;
        *type_counts.entry(event.threat_type.clone()).or_insert(0) += 1;
        *ip_counts.entry(event.source_ip.clone()).or_insert(0) += 1;
    }

    let ip_frequency: Vec<f64> = ip_counts.values().map(|&v| v as f64).collect();
    let freq_mean = mean(&ip_frequency);
    let freq_sd = stddev(&ip_frequency, freq_mean);

    let type_frequency: Vec<f64> = type_counts.values().map(|&v| v as f64).collect();
    let type_mean = mean(&type_frequency);
    let type_sd = stddev(&type_frequency, type_mean);

    let mut anomaly_scores: Vec<AnomalyScore> = Vec::new();

    for event in &events {
        let ip_freq = *ip_counts.get(&event.source_ip).unwrap_or(&0) as f64;
        let type_freq = *type_counts.get(&event.threat_type).unwrap_or(&0) as f64;

        let ip_z = z_score(ip_freq, freq_mean, freq_sd);
        let type_z = z_score(type_freq, type_mean, type_sd);

        let combined_score = (ip_z + type_z) / 2.0;
        let deviation = combined_score;

        anomaly_scores.push(AnomalyScore {
            event_id: event.id.clone(),
            threat_type: event.threat_type.clone(),
            source_ip: event.source_ip.clone(),
            score: (combined_score * 100.0).round() / 100.0,
            deviation: (deviation * 100.0).round() / 100.0,
            rating: rate_severity(combined_score),
        });
    }

    anomaly_scores.sort_by(|a, b| b.score.abs().partial_cmp(&a.score.abs()).unwrap());

    let risk = overall_risk(&severity_counts);

    let high_count = anomaly_scores.iter().filter(|s| s.rating == "critical" || s.rating == "high").count();

    let summary = format!(
        "Analyzed {} events. {} anomalies detected. Overall risk: {}.",
        events.len(),
        high_count,
        risk
    );

    let report = RiskReport {
        total_events: events.len(),
        severity_counts,
        type_counts,
        anomaly_scores,
        risk_level: risk,
        summary,
    };

    match serde_json::to_string_pretty(&report) {
        Ok(json) => println!("{}", json),
        Err(e) => eprintln!("Failed to serialize report: {}", e),
    }
}
