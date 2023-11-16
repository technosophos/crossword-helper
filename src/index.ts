import { Kv, Llm, InferencingModels, HandleRequest, HttpRequest, HttpResponse, Router } from "@fermyon/spin-sdk"
import { factory } from "ulid"



// This is for decoding the body
const decoder = new TextDecoder()

// We'll use LLaMa2 Chat
const model = InferencingModels.Llama2Chat

// This is the system prompt. It will get used in a few places.
const sysprompt = `
<<SYS>>
  Your are an assistant who helps solve crossword puzzle clues.
  Respond with one or more suggestions.
  A suggested answer should be less than 20 characters.
<</SYS>>
`

/**
 * Format a question to ask the LLM.
 * 
 * Prompt guide: https://huggingface.co/blog/llama2#how-to-prompt-llama-2
 * @param question The question from the user
 * @returns The full prompt
 */
function ask(question: string): string {
  return `
  <s>[INST] 
  ${sysprompt}
  ${question} [/INST]
  `
}

function reconstruct(instances: Inst[]): string {
  var prompt = `<s>[INST]${sysprompt}[/INST]`
  for (let i = 0; i < instances.length; i++) {
    let inst = instances[i];
    prompt += `[INST]${inst.question}[/INST]${inst.answer}`
  }
  return prompt
}



/**
 * Create the session
 * @returns A ULID in a JSON body of an HttpResponse
 */
function startSession(): HttpResponse {
  // By default, ulid tries to use a stronger RNG.
  // But QuickJS doesn't have one, so we use Math.random.
  // This is not a good idea if you need cryptographically secure
  // random numbers. But is fine for this app.
  let ulid = factory(Math.random)
  let id = ulid()
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: id })
  }
}

function handleQuestion(body: ArrayBuffer, session: string) {

  // Trap the case where there is no ID and return an error:
  if (session == null) {
    return {
      status: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Invalid ID" })
    }
  }

  console.log(session)
  //console.log(body)

  // Get the data posted from the web browser
  let question = decoder.decode(body);
  let store = Kv.openDefault()
  var prompt = ""
  if (store.exists(session)) {

    let chat = store.getJson(session)
    chat.push({
      question: question,
      answer: ""
    })

    prompt = reconstruct(chat)
  } else {
    prompt = ask(question)
    store.setJson(session, [{ question: sysprompt, answer: "" }])
  }

  // Ask the LLM a question
  let res = Llm.infer(model, prompt, { maxTokens: 250 })

  // Store question and the answer
  let myinst: Inst = {
    question: question,
    answer: res.text
  }

  // Store the latest version of our chat before returning
  let current = store.getJson(session)
  current.push(myinst)
  store.setJson(session, current)

  // Send the entire response back to the user
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(current)
  }
}

// [INST]
class Inst {
  question: string = ""
  answer: string = ""
}

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  let base = request.headers["spin-component-route"]
  // We're going to register two routes:
  // * One generates a ULID
  // * One does an inference
  const router = Router()
  router.get(base, startSession)
  router.post(base + "/:id", (request, body) => { return handleQuestion(body, request.params.id) })
  return await router.handleRequest(request, request.body)
}


