FROM scratch
COPY spin.toml /spin.toml
COPY target/crossword-helper.wasm /target/crossword-helper.wasm
COPY assets/* /assets/
ENTRYPOINT ["spin up --from /spin.toml"]
