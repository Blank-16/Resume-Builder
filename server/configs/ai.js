import OpenAI from "openai";
import config from "./config.js";

const ai = new OpenAI({
    apiKey: config.openaiApiKey,
    baseURL: config.openaiBaseUrl,
});

export default ai