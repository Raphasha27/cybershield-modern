FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /cybershield-backend ./cmd/server

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /cybershield-backend .
EXPOSE 8080
CMD ["./cybershield-backend"]
