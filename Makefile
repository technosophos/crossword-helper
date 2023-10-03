APP=crossword-helper

PHONY: build
build:
	spin build
	docker buildx build --platform wasi/wasm --provenance=false -t docker.io/technosophos/$(APP):latest .
	docker image ls | grep $(APP)

PHONY: run
run:
	docker run -i --runtime=io.containerd.spin.v1 --platform=wasi/wasm -p 3000:80 docker.io/technosophos/$(APP):latest
