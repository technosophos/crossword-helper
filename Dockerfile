FROM scratch

# This is the file that declares the app
COPY spin.toml /spin.toml
# This is our compiled JS/TS code. Note we ONLY need the Wasm (no node_modules)
COPY target/crossword-helper.wasm /target/crossword-helper.wasm
# This is a 3rd party file server (Fermyon)
COPY target/spin_static_fs.wasm /target/spin_static_fs.wasm
# These are our HTML/CSS files
COPY assets/* /assets/

# Docker Desktop requires this
ENTRYPOINT ["/spin.toml"]
