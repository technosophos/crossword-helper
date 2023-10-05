## Crossword Helper: LLM for your crossword solving needs

Sometimes you need _help_ with your crossword clues, but don't just want the answers given to you. That's what Crossword Helper is for.

This is a Spin app that can help you solve crossword puzzles. This probably won't help you get the exact answer to your puzzle, but it will help provide some background or synonyms or possibilities.

## Prerequisites

* Spin 1.5 or later
* One of the LLaMa2-Chat models. Locally, the 7b param model is best unless you have a custom-built Spin. (Fermyon Cloud uses the 13b param version)
    * Your model must be stored exactly here: `$THIS_DIRECTORY/.spin/ai-models/llama2-chat` (where $THIS_DIRECTORY is the directory the `spin.toml` is located)
* For Docker Desktop support, you need Docker Desktop version 24 or later.

## Running This App
You can run this app in three ways:

1. You can run locally with `spin build --up` or `spin up`
2. You can build it into a Docker image (`make build`) and run it in Docker Desktop (`make run`)
3. You can run it in Fermyon Cloud `spin build && spin deploy`

If you run it locally, it will use CPU for infere
