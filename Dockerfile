FROM scratch
COPY spin.toml /spin.toml
COPY target/crossword-helper.wasm /target/crossword-helper.wasm
COPY target/spin_static_fs.wasm /target/spin_static_fs.wasm
COPY assets/* /assets/
ENTRYPOINT ["/spin.toml"]
