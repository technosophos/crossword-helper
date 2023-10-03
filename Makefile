APP=crossword-helper
VOL=/Users/technosophos/LLMs/llama-2-7b-chat.ggmlv3.q3_K_L.bin

PHONY: build
build:
	spin build
	docker buildx build --platform wasi/wasm --provenance=false -t docker.io/technosophos/$(APP):latest .
	docker image ls | grep $(APP)

PHONY: run
run:
	docker run -i --runtime=io.containerd.spin.v1 --platform=wasi/wasm -p 3000:80 -v /Users/technosophos/LLMs/llama-2-7b-chat.ggmlv3.q3_K_L.bin:/.spin/ai-models/llama2-chat docker.io/technosophos/$(APP):latest
