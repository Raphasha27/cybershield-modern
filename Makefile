.PHONY: lint test build docker-build clean

lint:
	cd backend && go vet ./...

test:
	cd backend && go test -race -coverprofile=coverage.out ./...

build:
	cd backend && CGO_ENABLED=0 go build -o ../bin/cybershield-server ./cmd/server

docker-build:
	docker build -t cybershield-soc ./backend

clean:
	rm -rf bin/
	rm -f backend/coverage.out
