package services

import (
	"fmt"
	"math/rand"
	"time"
	"github.com/Raphasha27/cybershield_soc/internal/models"
)

var threatTypes = []string{"PortScan", "BruteForce", "SQLInjection", "XSS", "DDoS", "MalwareC2"}
var severities = []string{"LOW", "MEDIUM", "HIGH", "CRITICAL"}

func GenerateRandomThreat() models.Threat {
	tType := threatTypes[rand.Intn(len(threatTypes))]
	severity := severities[rand.Intn(len(severities))]
	ip := fmt.Sprintf("%d.%d.%d.%d", rand.Intn(255), rand.Intn(255), rand.Intn(255), rand.Intn(255))
	
	return models.Threat{
		ID:        fmt.Sprintf("THR-%d", time.Now().UnixNano()),
		Type:      tType,
		Severity:  severity,
		SourceIP:  ip,
		Timestamp: time.Now(),
		Status:    "ACTIVE",
	}
}
