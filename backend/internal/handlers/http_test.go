package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/Raphasha27/cybershield_soc/internal/handlers"
	"github.com/Raphasha27/cybershield_soc/internal/models"
)

func setupRouter() *mux.Router {
	hub := handlers.NewWSHub()
	router := mux.NewRouter()

	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}).Methods("GET")

	router.HandleFunc("/api/metrics", func(w http.ResponseWriter, r *http.Request) {
		metrics := models.Metrics{
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
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(metrics)
	}).Methods("GET")

	router.HandleFunc("/ws/events", hub.HandleConnection)
	return router
}

func TestHealthEndpoint(t *testing.T) {
	router := setupRouter()
	req := httptest.NewRequest("GET", "/api/health", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rr.Code)
	}

	var body map[string]string
	if err := json.NewDecoder(rr.Body).Decode(&body); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if body["status"] != "ok" {
		t.Errorf("expected status 'ok', got '%s'", body["status"])
	}
}

func TestMetricsEndpoint(t *testing.T) {
	router := setupRouter()
	req := httptest.NewRequest("GET", "/api/metrics", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rr.Code)
	}

	var metrics models.Metrics
	if err := json.NewDecoder(rr.Body).Decode(&metrics); err != nil {
		t.Fatalf("failed to decode metrics: %v", err)
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

func TestMetricsEndpointJSONKeys(t *testing.T) {
	router := setupRouter()
	req := httptest.NewRequest("GET", "/api/metrics", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	var raw map[string]interface{}
	if err := json.NewDecoder(rr.Body).Decode(&raw); err != nil {
		t.Fatalf("failed to decode raw JSON: %v", err)
	}

	expectedKeys := []string{"total_threats_24h", "active_alerts", "blocked_ips", "severity_breakdown"}
	for _, key := range expectedKeys {
		if _, ok := raw[key]; !ok {
			t.Errorf("missing expected JSON key: %s", key)
		}
	}
}

func TestHealthEndpointMethodNotAllowed(t *testing.T) {
	router := setupRouter()
	req := httptest.NewRequest("POST", "/api/health", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code == http.StatusOK {
		t.Error("POST to /api/health should not return 200")
	}
}

func TestMetricsEndpointMethodNotAllowed(t *testing.T) {
	router := setupRouter()
	req := httptest.NewRequest("POST", "/api/metrics", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	if rr.Code == http.StatusOK {
		t.Error("POST to /api/metrics should not return 200")
	}
}
