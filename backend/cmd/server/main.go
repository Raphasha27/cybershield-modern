package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/Raphasha27/cybershield_soc/internal/handlers"
	"github.com/Raphasha27/cybershield_soc/internal/models"
	"github.com/Raphasha27/cybershield_soc/internal/services"
)

func main() {
	router := mux.NewRouter()
	hub := handlers.NewWSHub()

	// Start threat simulator
	go func() {
		for {
			time.Sleep(time.Duration(3) * time.Second)
			threat := services.GenerateRandomThreat()
			hub.Broadcast(threat)
		}
	}()

	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
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

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)

	log.Println("Starting CyberShield SOC Backend on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
