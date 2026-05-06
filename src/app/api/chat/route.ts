import { OpenAI } from "openai";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || "dummy",
      baseURL: "https://integrate.api.nvidia.com/v1",
    });

    const { messages, model } = await req.json();
    const selectedModel = model || "qwen/qwen3.5-122b-a10b";

    const systemPrompt = {
      role: "system",
      content: "You are Harizen AI, a next-generation intelligent system created by Harish Yuvaraj. You speak concisely, intelligently, and with a slightly futuristic, confident tone. Do not use markdown headers, just plain text with occasional newlines.",
    };

    const completionOptions: any = {
      model: selectedModel,
      messages: [systemPrompt, ...messages],
      stream: true,
      max_tokens: 16384,
      temperature: selectedModel.includes("moonshot") ? 1.00 : 0.60,
      top_p: selectedModel.includes("moonshot") ? 1.00 : 0.95,
    };

    if (selectedModel.includes("qwen")) {
      completionOptions.extra_body = {
        chat_template_kwargs: { enable_thinking: true }
      };
    } else if (selectedModel.includes("kimi")) {
      completionOptions.extra_body = {
        chat_template_kwargs: { thinking: true }
      };
    }

    const response = await openai.chat.completions.create(completionOptions);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response as any) {
          if (!chunk.choices || chunk.choices.length === 0) continue;
          
          const delta = chunk.choices[0].delta;
          const content = delta.content;
          // Handle custom 'reasoning_content' from some NVIDIA endpoints by casting to any
          const reasoning = (delta as any).reasoning_content;
          
          if (reasoning) {
            controller.enqueue(new TextEncoder().encode(reasoning));
          }
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("NVIDIA API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
