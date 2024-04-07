import { Ollama } from "@langchain/community/llms/ollama";

export const ollama = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "llama2-chinese", // Default value
});
