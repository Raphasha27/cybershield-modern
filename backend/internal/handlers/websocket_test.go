package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/Raphasha27/cybershield_soc/internal/models"
	"github.com/gorilla/websocket"
)

func TestNewWSHub(t *testing.T) {
	hub := NewWSHub()
	if hub == nil {
		t.Fatal("expected non-nil hub")
	}
	if hub.clients == nil {
		t.Fatal("expected non-nil clients map")
	}
	if len(hub.clients) != 0 {
		t.Errorf("expected 0 clients, got %d", len(hub.clients))
	}
}

func TestBroadcastEmpty(t *testing.T) {
	hub := NewWSHub()
	threat := models.Threat{
		ID:        "THR-001",
		Type:      "DDoS",
		Severity:  "HIGH",
		SourceIP:  "10.0.0.1",
		Timestamp: time.Now(),
		Status:    "ACTIVE",
	}

	hub.Broadcast(threat)

	if len(hub.clients) != 0 {
		t.Errorf("expected 0 clients after broadcast, got %d", len(hub.clients))
	}
}

func TestBroadcastSingleClient(t *testing.T) {
	hub := NewWSHub()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnection(w, r)
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("failed to dial websocket: %v", err)
	}
	defer ws.Close()

	time.Sleep(50 * time.Millisecond)

	hub.mu.Lock()
	clientCount := len(hub.clients)
	hub.mu.Unlock()

	if clientCount != 1 {
		t.Fatalf("expected 1 client, got %d", clientCount)
	}

	threat := models.Threat{
		ID:        "THR-002",
		Type:      "SQLInjection",
		Severity:  "CRITICAL",
		SourceIP:  "192.168.1.1",
		Timestamp: time.Now(),
		Status:    "ACTIVE",
	}

	hub.Broadcast(threat)

	_, msg, err := ws.ReadMessage()
	if err != nil {
		t.Fatalf("failed to read message: %v", err)
	}

	var received models.Threat
	if err := json.Unmarshal(msg, &received); err != nil {
		t.Fatalf("failed to unmarshal received message: %v", err)
	}

	if received.ID != threat.ID {
		t.Errorf("expected threat ID %s, got %s", threat.ID, received.ID)
	}
	if received.Type != threat.Type {
		t.Errorf("expected threat type %s, got %s", threat.Type, received.Type)
	}
	if received.Severity != threat.Severity {
		t.Errorf("expected severity %s, got %s", threat.Severity, received.Severity)
	}
}

func TestBroadcastMultipleClients(t *testing.T) {
	hub := NewWSHub()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnection(w, r)
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	const numClients = 3
	clients := make([]*websocket.Conn, numClients)
	for i := 0; i < numClients; i++ {
		ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
		if err != nil {
			t.Fatalf("failed to dial client %d: %v", i, err)
		}
		defer ws.Close()
		clients[i] = ws
	}

	time.Sleep(100 * time.Millisecond)

	hub.mu.Lock()
	clientCount := len(hub.clients)
	hub.mu.Unlock()

	if clientCount != numClients {
		t.Fatalf("expected %d clients, got %d", numClients, clientCount)
	}

	threat := models.Threat{
		ID:        "THR-003",
		Type:      "BruteForce",
		Severity:  "MEDIUM",
		SourceIP:  "10.10.10.10",
		Timestamp: time.Now(),
		Status:    "ACTIVE",
	}

	hub.Broadcast(threat)

	var wg sync.WaitGroup
	for i, client := range clients {
		wg.Add(1)
		go func(idx int, c *websocket.Conn) {
			defer wg.Done()
			_, msg, err := c.ReadMessage()
			if err != nil {
				t.Errorf("client %d failed to read: %v", idx, err)
				return
			}
			var received models.Threat
			if err := json.Unmarshal(msg, &received); err != nil {
				t.Errorf("client %d failed to unmarshal: %v", idx, err)
				return
			}
			if received.ID != threat.ID {
				t.Errorf("client %d expected ID %s, got %s", idx, threat.ID, received.ID)
			}
		}(i, client)
	}
	wg.Wait()
}

func TestClientDisconnect(t *testing.T) {
	hub := NewWSHub()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnection(w, r)
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("failed to dial: %v", err)
	}

	time.Sleep(50 * time.Millisecond)

	hub.mu.Lock()
	if len(hub.clients) != 1 {
		t.Fatalf("expected 1 client, got %d", len(hub.clients))
	}
	hub.mu.Unlock()

	ws.Close()
	time.Sleep(100 * time.Millisecond)

	hub.mu.Lock()
	count := len(hub.clients)
	hub.mu.Unlock()

	if count != 0 {
		t.Errorf("expected 0 clients after disconnect, got %d", count)
	}
}

func TestBroadcastMultipleMessages(t *testing.T) {
	hub := NewWSHub()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnection(w, r)
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("failed to dial: %v", err)
	}
	defer ws.Close()

	time.Sleep(50 * time.Millisecond)

	const numMessages = 5
	for i := 0; i < numMessages; i++ {
		threat := models.Threat{
			ID:        fmt.Sprintf("THR-%d", i),
			Type:      "PortScan",
			Severity:  "LOW",
			SourceIP:  "127.0.0.1",
			Timestamp: time.Now(),
			Status:    "ACTIVE",
		}
		hub.Broadcast(threat)
	}

	for i := 0; i < numMessages; i++ {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			t.Fatalf("failed to read message %d: %v", i, err)
		}
		var received models.Threat
		if err := json.Unmarshal(msg, &received); err != nil {
			t.Fatalf("failed to unmarshal message %d: %v", i, err)
		}
		expectedID := fmt.Sprintf("THR-%d", i)
		if received.ID != expectedID {
			t.Errorf("message %d: expected ID %s, got %s", i, expectedID, received.ID)
		}
	}
}

func TestBroadcastJSONIntegrity(t *testing.T) {
	hub := NewWSHub()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnection(w, r)
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("failed to dial: %v", err)
	}
	defer ws.Close()

	time.Sleep(50 * time.Millisecond)

	threat := models.Threat{
		ID:        "THR-INTEGRITY",
		Type:      "MalwareC2",
		Severity:  "CRITICAL",
		SourceIP:  "203.0.113.42",
		Timestamp: time.Date(2024, 6, 15, 12, 0, 0, 0, time.UTC),
		Status:    "BLOCKED",
	}

	hub.Broadcast(threat)

	_, rawMsg, err := ws.ReadMessage()
	if err != nil {
		t.Fatalf("failed to read: %v", err)
	}

	var raw map[string]interface{}
	if err := json.Unmarshal(rawMsg, &raw); err != nil {
		t.Fatalf("failed to unmarshal raw JSON: %v", err)
	}

	expectedFields := []string{"id", "type", "severity", "source_ip", "timestamp", "status"}
	for _, field := range expectedFields {
		if _, ok := raw[field]; !ok {
			t.Errorf("missing expected field in JSON: %s", field)
		}
	}

	if raw["id"] != "THR-INTEGRITY" {
		t.Errorf("expected id THR-INTEGRITY, got %v", raw["id"])
	}
	if raw["status"] != "BLOCKED" {
		t.Errorf("expected status BLOCKED, got %v", raw["status"])
	}
}

func TestConcurrentBroadcast(t *testing.T) {
	hub := NewWSHub()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnection(w, r)
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	const numClients = 5
	clients := make([]*websocket.Conn, numClients)
	for i := 0; i < numClients; i++ {
		ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
		if err != nil {
			t.Fatalf("failed to dial client %d: %v", i, err)
		}
		defer ws.Close()
		clients[i] = ws
	}

	time.Sleep(100 * time.Millisecond)

	const numBroadcasts = 10
	var wg sync.WaitGroup
	for i := 0; i < numBroadcasts; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			threat := models.Threat{
				ID:        fmt.Sprintf("THR-CONC-%d", idx),
				Type:      "DDoS",
				Severity:  "HIGH",
				SourceIP:  "10.0.0.1",
				Timestamp: time.Now(),
				Status:    "ACTIVE",
			}
			hub.Broadcast(threat)
		}(i)
	}
	wg.Wait()

	for i, client := range clients {
		_ = client.SetReadDeadline(time.Now().Add(2 * time.Second))
		count := 0
		for {
			_, _, err := client.ReadMessage()
			if err != nil {
				break
			}
			count++
			if count >= numBroadcasts {
				break
			}
		}
		if count != numBroadcasts {
			t.Errorf("client %d received %d messages, expected %d", i, count, numBroadcasts)
		}
	}
}
