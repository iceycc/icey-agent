import {NextRequest, NextResponse} from "next/server";
import { HttpsProxyAgent } from 'https-proxy-agent';
import get_weather from "@/utils/llm-tools/get_weather";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { AgentExecutor, type AgentStep } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Ollama } from "@langchain/community/llms/ollama";
import get_my_location from "@/utils/llm-tools/get_my_location";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export function GET(req:NextRequest){
    return NextResponse.json({
        data: 'success'
    },{
        status: 200
    })
}

export async function POST(req:NextRequest){
    const body = await req.json();
    console.log(body.messages)
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "你是一个非常强大的助手,但不知道时事。你可以通过工具去获取你需要知道事。"],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad"),
    ]);
    const tools = [get_my_location,get_weather]
    // const model = new ChatOllama({
    //     baseUrl: "http://localhost:11434", // Default value
    //     model: "llama2", // Default value
    // });
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
    }, {
        httpAgent: new HttpsProxyAgent('http://127.0.0.1:7890')
    });
    const modelWithFunctions = model.bind({
        functions: tools.map((tool) => convertToOpenAIFunction(tool)),
    });


    const runnableAgent = RunnableSequence.from([
        {
            input: (i: { input: string; steps: AgentStep[] }) => i.input,
            agent_scratchpad: (i: { input: string; steps: AgentStep[] }) =>
                formatToOpenAIFunctionMessages(i.steps),
        },
        prompt,
        modelWithFunctions,
        new OpenAIFunctionsAgentOutputParser(),
    ]);

    const executor = AgentExecutor.fromAgentAndTools({
        agent: runnableAgent,
        tools,
    });
    console.log(`Calling agent executor with query: ${body.messages}`);

    const result = await executor.invoke({
        input: body.messages,
    });
    return NextResponse.json({
        data: result
    },{
        status: 200
    })
}
