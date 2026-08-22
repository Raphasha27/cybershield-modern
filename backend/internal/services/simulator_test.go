package services

import (
	"testing"
	"time"

	"github.com/Raphasha27/cybershield_soc/internal/models"
)

func TestGenerateRandomThreat(t *testing.T) {
	before := time.Now()
	threat := GenerateRandomThreat()
	after := time.Now()

	if threat.ID == "" {
		t.Error("expected non-empty threat ID")
	}
	if threat.Type == "" {
		t.Error("expected non-empty threat type")
	}
	if threat.Severity == "" {
		t.Error("expected non-empty severity")
	}
	if threat.SourceIP == "" {
		t.Error("expected non-empty source IP")
	}
	if threat.Timestamp.Before(before) || threat.Timestamp.After(after) {
		t.Errorf("timestamp %v not between %v and %v", threat.Timestamp, before, after)
	}
	if threat.Status != "ACTIVE" {
		t.Errorf("expected status ACTIVE, got %s", threat.Status)
	}
}

func TestGenerateRandomThreat_UniqueIDs(t *testing.T) {
	seen := make(map[string]bool)
	for i := 0; i < 100; i++ {
		threat := GenerateRandomThreat()
		if seen[threat.ID] {
			t.Fatalf("duplicate threat ID generated: %s", threat.ID)
		}
		seen[threat.ID] = true
	}
}

func TestGenerateRandomThreat_ValidTypes(t *testing.T) {
	validTypes := map[string]bool{
		"PortScan":      true,
		"BruteForce":    true,
		"SQLInjection":  true,
		"XSS":           true,
		"DDoS":          true,
		"MalwareC2":     true,
	}

	for i := 0; i < 200; i++ {
		threat := GenerateRandomThreat()
		if !validTypes[threat.Type] {
			t.Errorf("unexpected threat type: %s", threat.Type)
		}
	}
}

func TestGenerateRandomThreat_ValidSeverities(t *testing.T) {
	validSeverities := map[string]bool{
		"LOW":      true,
		"MEDIUM":   true,
		"HIGH":     true,
		"CRITICAL": true,
	}

	for i := 0; i < 200; i++ {
		threat := GenerateRandomThreat()
		if !validSeverities[threat.Severity] {
			t.Errorf("unexpected severity: %s", threat.Severity)
		}
	}
}

func TestGenerateRandomThreat_IPFormat(t *testing.T) {
	for i := 0; i < 100; i++ {
		threat := GenerateRandomThreat()
		var a, b, c, d int
		n, _ := scanIP(threat.SourceIP, &a, &b, &c, &d)
		if n != 4 {
			t.Errorf("expected 4 octets in IP %s, got %d", threat.SourceIP, n)
			continue
		}
		if a < 0 || a > 255 || b < 0 || b > 255 || c < 0 || c > 255 || d < 0 || d > 255 {
			t.Errorf("IP octet out of range: %s", threat.SourceIP)
		}
	}
}

func scanIP(ip string, a, b, c, d *int) (int, error) {
	n, err := fmt_sscanf(ip, "%d.%d.%d.%d", a, b, c, d)
	return n, err
}

func fmt_sscanf(s, format string, a, b, c, d *int) (int, error) {
	n := 0
	vals := []*int{a, b, c, d}
	j := 0
	start := -1
	for i := 0; i <= len(s); i++ {
		if i == len(s) || s[i] == '.' {
			if start >= 0 && j < 4 {
				num := 0
				for k := start; k < i; k++ {
					num = num*10 + int(s[k]-'0')
				}
				*vals[j] = num
				j++
				n++
				start = -1
			}
		} else if s[i] >= '0' && s[i] <= '9' {
			if start == -1 {
				start = i
			}
		}
	}
	return n, nil
}

func TestSeverityDistribution(t *testing.T) {
	counts := make(map[string]int)
	total := 1000
	for i := 0; i < total; i++ {
		threat := GenerateRandomThreat()
		counts[threat.Severity]++
	}

	for _, sev := range []string{"LOW", "MEDIUM", "HIGH", "CRITICAL"} {
		if counts[sev] == 0 {
			t.Errorf("severity %s was never generated in %d iterations", sev, total)
		}
	}
}

func TestThreatFieldsArePopulated(t *testing.T) {
	threat := GenerateRandomThreat()

	if len(threat.ID) == 0 {
		t.Error("threat ID should not be empty")
	}
	if len(threat.Type) == 0 {
		t.Error("threat type should not be empty")
	}
	if len(threat.Severity) == 0 {
		t.Error("threat severity should not be empty")
	}
	if len(threat.SourceIP) == 0 {
		t.Error("threat source IP should not be empty")
	}
	if threat.Timestamp.IsZero() {
		t.Error("threat timestamp should not be zero")
	}
}

func TestThreatModelIntegration(t *testing.T) {
	threat := GenerateRandomThreat()

	data := models.Threat{
		ID:        threat.ID,
		Type:      threat.Type,
		Severity:  threat.Severity,
		SourceIP:  threat.SourceIP,
		Timestamp: threat.Timestamp,
		Status:    threat.Status,
	}

	if data.ID != threat.ID {
		t.Error("model copy does not match original")
	}
}
