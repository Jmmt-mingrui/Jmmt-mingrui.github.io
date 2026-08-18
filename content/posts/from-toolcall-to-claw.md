---
title: 从ToolCall开始组装自己的Claw
date: 2026-05-31
category: 学习笔记
tags:
  - AI
  - Agent
summary: 从 ToolCall 出发，自底向上拆解 Agent 的构建全过程：字符串处理本质、ReAct 循环、Reflection 与 Plan-and-Execute、多智能体协作，再到 Context Engineering 与 Harness Engineering 的工程化实践，以及 Skill 封装、OpenClaw 产品化和 Typer / Jinja2 / Textual 等落地工具。
---

## 前置知识

LangChain的一些基础概念和了解：

Python的一些基础知识：

uv等现代Python工具：

Agent的概念和基础：

## Agent科普内容

一切的后续，本质都是对模型输入输出的文本进行操作

### LangChain概念速通

| 概念 | 简单解释 | 简单理解 |
| --- | --- | --- |
| LangChain | 一个做 LLM 应用的组件工具箱，帮你把模型、提示词、工具、消息等拼起来 | “LangChain 不是 Agent 本身，它更像搭 Agent 的积木盒。” |
| Model | 你接入的大模型本体，比如 OpenAI、Anthropic、Ollama 等 | “模型负责思考和生成，但它本身不会自动完成整个工程流程。” |
| Prompt | 你给模型的指令模板，决定它怎么理解任务、按什么格式输出 | “Prompt 就像给模型写操作说明书。” |
| Message | LangChain 会统一管理 system、user、assistant 等消息格式，方便多轮对话 | “Message 就是模型看到的上下文载体。” |
| Tool | 本质上是可调用函数，有明确输入输出，模型决定何时调用它 | “Tool 就是模型伸向现实世界的手。” |
| Tool Calling | 让模型不只输出文本，还能输出‘我要调用哪个工具、传什么参数’ | “这一步，就是从聊天走向执行。” |
| Chain | 把多个步骤串起来，例如：提示词 → 模型 → 解析输出 | “Chain 可以理解成一条固定流水线。” |
| Output Parser | 把模型输出从文本整理成结构化结果，比如 JSON、字段对象 | “Parser 是把模型胡言乱语尽量变成程序能读的格式。” |
| Retriever | 专门负责帮模型找资料的模块，常见于 RAG | “Retriever 负责找信息，不负责下判断。” |
| Memory / Chat History | 让模型在多轮对话里保留必要上下文 | “没有历史记录，模型每一轮都像失忆。” |
| Agent | 在 LangChain 语境里，通常指能基于上下文决定要不要调工具、怎么继续推进任务的执行体 | “到了 Agent，模型不只是回答问题，而是会自己决定下一步。” |

### ToolCall：从文本触及现实

在讲解Agent内容前，先回归Agent诞生的最开端：ToolCall

#### 本质：字符串处理

```python
def get_weather(city:str):
    return f"{city}的天气是晴天"

model_output="get_weather:Beijing"

toolname, arg = model_output.split(":")

tools={
    "get_weather": get_weather
}

if toolname in tools:
    result = tools[toolname](arg)
    print(result)
else:    
    print(f"工具{toolname}不存在")
```

我们要先从最简单的输入输出认识模型，模型本身接受字符串输出字符串，所以我们对于模型所有能力的开发都是在这一串字符串上

这便是最简单的阐述ToolCall本质的代码

当然实际模型输出里是有详细约定好的格式的，差不多长这个样子

```python
{
  "tool": "send_email",
  "args": {
    "to": "amy@example.com",
    "content": "你好"
  }
}
```

1. 从模型output处获取字符串，这个字符串是按照具体的格式排布的

1. 通过字符串提取，对应找到实际编写工具逻辑的函数

1. 调用对应函数，并将工具输出返回给模型

#### 对模型输出进行处理

我们实际按照这个流程模拟实现一下

```python
import json
import re
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

def get_weather(city: str) -> str:
    fake_db = {
        "Beijing": "晴天，25度",
        "Shanghai": "多云，28度",
        "Hangzhou": "小雨，22度",
    }
    return f"{city} 的天气是：{fake_db.get(city, '未知天气')}"

TOOLS = {
    "get_weather": get_weather,
}

def parse_tool_call(text: str):
    tool_match = re.search(r"<Tool>(.*?)</Tool>", text, re.DOTALL)
    args_match = re.search(r"<Args>(.*?)</Args>", text, re.DOTALL)

    if not tool_match:
        return None

    tool_name = tool_match.group(1).strip()
    args = {}

    if args_match:
        args = json.loads(args_match.group(1).strip())

    return {"tool": tool_name, "args": args}

system_prompt = """
你是一个助手。
你知道系统里有一个工具叫 get_weather，用于查询天气。

当用户询问天气时，不要直接回答。
你必须严格输出以下格式，不要输出任何额外内容：

<Tool>get_weather</Tool>
<Args>{"city":"城市名"}</Args>

如果不需要调用工具，就直接输出普通文本。
"""

user_prompt = "帮我查一下 Beijing 的天气"

llm = ChatOpenAI(
    model="qwen3.5:cloud",  
    base_url="http://localhost:11434/v1/",   
    api_key="ollama",
)

messages = [
    SystemMessage(content=system_prompt),
    HumanMessage(content=user_prompt)
]

resp = llm.invoke(messages)

model_text = resp.content
print("模型原始输出：")
print(model_text)

call = parse_tool_call(model_text)

if call:
    tool_name = call["tool"]
    args = call["args"]

    if tool_name not in TOOLS:
        raise ValueError(f"未知工具: {tool_name}")

    result = TOOLS[tool_name](**args)
    print("\n工具执行结果：")
    print(result)
else:
    print("\n没有触发工具：")
    print(model_text)
```

输出：

```python
模型原始输出：
<Tool>get_weather</Tool>
<Args>{"city":"Beijing"}</Args>

工具执行结果：
Beijing 的天气是：晴天，25度
```

#### 实际一个模型的输出

最后我们来看一下实际模型输出是什么样子

```json
{
  "id": "resp_252412",
  "created_at": 1775187827.0,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "metadata": {},
  "model": "qwen3.5",
  "object": "response",
  "output": [
    {
      "id": "rs_resp_252412",
      "summary": [
        {
          "text": "Thinking Process:\n\n1.  **Analyze the Request:**\n    *   User asks: \"北京天气怎么样？\" (How is the weather in Beijing?)\n    *   Intent: The user wants to know the current weather conditions or forecast for Beijing.\n    *   Constraint: I am an AI language model. I do not have real-time access to external data like weather APIs unless I use a specific tool (which I don't have direct access to in this specific thought-block context, but I should check my capabilities).\n    *   Limitation: My knowledge cutoff is static. I cannot browse the live internet unless equipped with a search tool. In this specific environment, I need to acknowledge my limitation or provide general information if I can't access real-time data.\n    *   Best Practice: Since I cannot access real-time data directly, I should inform the user that I don't have live access and suggest they check a weather app or website. However, sometimes I might have access to a search tool. Let me check my internal instructions/capabilities.\n    *   Correction: As a standard LLM without tool use enabled in this specific turn, I must state I don't have real-time access. *Wait*, I should check if I have a search tool available. In this specific sandbox environment, I usually don't have live internet access unless specified.\n    *   Decision: I need to be honest. I cannot provide real-time weather. I should advise the user to check a reliable source.\n\n    *Self-Correction/Refinement:* Actually, many AI assistants are expected to handle this gracefully. If I can't search, I must say I don't know. But often, users expect an answer. Let me double-check if I have a search function. In this specific interface, I do not see a search tool activated. Therefore, I must inform the user about my limitation.\n\n    *Alternative:* I can provide general climate information about Beijing for this time of year (assuming I know the current date). But I don't know the exact current date either (though I can infer it's roughly around the time of my training or the system prompt date). It's safer to say I can't access real-time data.\n\n    *Wait, one more check:* Some models have implicit access to current date. Even so, without a weather API, I can't give the forecast.\n\n    *Plan:*\n    1.  Politely state that I am an AI and don't have real-time weather data.\n    2.  Suggest ways they can check (weather app, search engine).\n    3.  Optionally, provide general seasonal info if I know the approximate current date (but better to avoid guessing).\n    4.  Keep it helpful and concise.\n\n    *Re-evaluation:* Actually, to be most helpful, I should try to be friendly. \"I'm sorry, I can't check real-time weather...\"\n\n    *Wait, is there a possibility I should simulate having access?* No, honesty is key.\n\n    *Wait, do I have access to a plugin?* In this specific interaction mode, I don't see any plugin indicators. I must rely on my internal knowledge.\n\n    *Final Plan:*\n    1.  Apologize for not having real-time access.\n    2.  Suggest checking a weather app or website.\n    3.  Mention general characteristics of Beijing's weather if relevant (e.g., dry, seasonal), but keep it brief.\n\n    *Wait, let's look at the system instructions.* I am a large language model. I should not hallucinate data.\n\n    *Drafting response:*\n    \"抱歉，我无法实时获取最新的天气信息。建议您通过手机天气应用、搜索引擎或气象网站查询北京的最新天气预报，以获得最准确的数据。\" (Sorry, I can't get real-time weather info. Suggest using app/search engine.)\n\n    *Adding value:* Maybe mention what season it is roughly? No, I don't know the exact date. Better not guess.\n\n    *Refining:* Keep it polite and direct.\n\n    *Wait, one more thing:* If I am equipped with a search tool (which I might be in some configurations), I should use it. But in this text-only thought block, I assume I don't have it. I will proceed assuming no live access.\n\n    *Actually, looking at the standard behavior for this model:* If I cannot access the internet, I must state that.\n\n    *Final Polish:* Make it sound natural.\n\n    \"很抱歉，我无法实时获取当前的天气数据。建议您查看手机上的天气应用，或者搜索“北京天气”来获取最新的预报信息。\"\n\n    *Wait, is there any general info I can give?* Beijing has a temperate monsoon climate. Four distinct seasons. But that's too generic.\n\n    *Okay, let's stick to the limitation disclosure.*\n\n    *Wait, I need to check if I actually have the ability to search.* In this specific environment, I do not have a search tool enabled. So I must declare my limitation.\n\n    *Response Structure:*\n    1. Acknowledge limitation.\n    2. Suggest alternative sources.\n    3. Offer further help.\n\n    *Draft:*\n    抱歉，作为一个人工智能模型，我无法实时获取最新的天气信息。\n\n    建议您：\n    1. 查看手机自带的天气 App。\n    2. 在搜索引擎中查询“北京天气”。\n    3. 访问中国气象局官网。\n\n    这样您就可以得到最准确的温度和降水预报了。如果您有其他关于北京的问题（比如旅游建议、交通等），我很乐意为您解答！\n\n    *Looks good.*\n\n    *Wait, one nuance:* Sometimes users ask this expecting me to know the date. I should be careful not to sound like I know the date if I don't. But generally, stating \"real-time\" covers it.\n\n    *Final Decision:* Provide the polite refusal and suggestion.\n\n    *(Self-Correction)*: Wait, I should check if there's any implicit date context. No. Okay.\n\n    *Wait, I am an AI assistant developed by Google?* No, I am a large language model trained by... (wait, I shouldn't disclose identity unless asked). Just answer the question.\n\n    *Okay, let's write the response.*\n\n    \"抱歉，我无法提供实时的天气信息。建议您通过以下方式查询：...\"\n\n    *Wait, is it possible I should just say \"I don't know\"?* No, be helpful.\n\n    *Okay, finalizing.*\n\n    (Wait, I need to make sure I don't hallucinate. If I say \"It's sunny today\", that's a hallucination. So definitely state limitation.)\n\n    (One more thought: If the system has provided me with a date in the background, I still don't have weather data. So same response.)\n\n    (Okay, ready to generate.)\n\n    *Wait, I should check if I have a tool to call.* I don't see any tool definitions in the prompt. So no tool use.\n\n    *Final Output Generation:*\n    1. State limitation.\n    2. Suggest sources.\n    3. Offer other help.\n\n    *Let's make it friendly.*\n    \"很抱歉，我无法实时获取最新的天气数据。\"\n    \"建议您...\"\n    \"如有其他问题...\"\n\n    *Okay.*\n",
          "type": "summary_text"
        }
      ],
      "type": "reasoning",
      "content": null,
      "encrypted_content": "Thinking Process:\n\n1.  **Analyze the Request:**\n    *   User asks: \"北京天气怎么样？\" (How is the weather in Beijing?)\n    *   Intent: The user wants to know the current weather conditions or forecast for Beijing.\n    *   Constraint: I am an AI language model. I do not have real-time access to external data like weather APIs unless I use a specific tool (which I don't have direct access to in this specific thought-block context, but I should check my capabilities).\n    *   Limitation: My knowledge cutoff is static. I cannot browse the live internet unless equipped with a search tool. In this specific environment, I need to acknowledge my limitation or provide general information if I can't access real-time data.\n    *   Best Practice: Since I cannot access real-time data directly, I should inform the user that I don't have live access and suggest they check a weather app or website. However, sometimes I might have access to a search tool. Let me check my internal instructions/capabilities.\n    *   Correction: As a standard LLM without tool use enabled in this specific turn, I must state I don't have real-time access. *Wait*, I should check if I have a search tool available. In this specific sandbox environment, I usually don't have live internet access unless specified.\n    *   Decision: I need to be honest. I cannot provide real-time weather. I should advise the user to check a reliable source.\n\n    *Self-Correction/Refinement:* Actually, many AI assistants are expected to handle this gracefully. If I can't search, I must say I don't know. But often, users expect an answer. Let me double-check if I have a search function. In this specific interface, I do not see a search tool activated. Therefore, I must inform the user about my limitation.\n\n    *Alternative:* I can provide general climate information about Beijing for this time of year (assuming I know the current date). But I don't know the exact current date either (though I can infer it's roughly around the time of my training or the system prompt date). It's safer to say I can't access real-time data.\n\n    *Wait, one more check:* Some models have implicit access to current date. Even so, without a weather API, I can't give the forecast.\n\n    *Plan:*\n    1.  Politely state that I am an AI and don't have real-time weather data.\n    2.  Suggest ways they can check (weather app, search engine).\n    3.  Optionally, provide general seasonal info if I know the approximate current date (but better to avoid guessing).\n    4.  Keep it helpful and concise.\n\n    *Re-evaluation:* Actually, to be most helpful, I should try to be friendly. \"I'm sorry, I can't check real-time weather...\"\n\n    *Wait, is there a possibility I should simulate having access?* No, honesty is key.\n\n    *Wait, do I have access to a plugin?* In this specific interaction mode, I don't see any plugin indicators. I must rely on my internal knowledge.\n\n    *Final Plan:*\n    1.  Apologize for not having real-time access.\n    2.  Suggest checking a weather app or website.\n    3.  Mention general characteristics of Beijing's weather if relevant (e.g., dry, seasonal), but keep it brief.\n\n    *Wait, let's look at the system instructions.* I am a large language model. I should not hallucinate data.\n\n    *Drafting response:*\n    \"抱歉，我无法实时获取最新的天气信息。建议您通过手机天气应用、搜索引擎或气象网站查询北京的最新天气预报，以获得最准确的数据。\" (Sorry, I can't get real-time weather info. Suggest using app/search engine.)\n\n    *Adding value:* Maybe mention what season it is roughly? No, I don't know the exact date. Better not guess.\n\n    *Refining:* Keep it polite and direct.\n\n    *Wait, one more thing:* If I am equipped with a search tool (which I might be in some configurations), I should use it. But in this text-only thought block, I assume I don't have it. I will proceed assuming no live access.\n\n    *Actually, looking at the standard behavior for this model:* If I cannot access the internet, I must state that.\n\n    *Final Polish:* Make it sound natural.\n\n    \"很抱歉，我无法实时获取当前的天气数据。建议您查看手机上的天气应用，或者搜索“北京天气”来获取最新的预报信息。\"\n\n    *Wait, is there any general info I can give?* Beijing has a temperate monsoon climate. Four distinct seasons. But that's too generic.\n\n    *Okay, let's stick to the limitation disclosure.*\n\n    *Wait, I need to check if I actually have the ability to search.* In this specific environment, I do not have a search tool enabled. So I must declare my limitation.\n\n    *Response Structure:*\n    1. Acknowledge limitation.\n    2. Suggest alternative sources.\n    3. Offer further help.\n\n    *Draft:*\n    抱歉，作为一个人工智能模型，我无法实时获取最新的天气信息。\n\n    建议您：\n    1. 查看手机自带的天气 App。\n    2. 在搜索引擎中查询“北京天气”。\n    3. 访问中国气象局官网。\n\n    这样您就可以得到最准确的温度和降水预报了。如果您有其他关于北京的问题（比如旅游建议、交通等），我很乐意为您解答！\n\n    *Looks good.*\n\n    *Wait, one nuance:* Sometimes users ask this expecting me to know the date. I should be careful not to sound like I know the date if I don't. But generally, stating \"real-time\" covers it.\n\n    *Final Decision:* Provide the polite refusal and suggestion.\n\n    *(Self-Correction)*: Wait, I should check if there's any implicit date context. No. Okay.\n\n    *Wait, I am an AI assistant developed by Google?* No, I am a large language model trained by... (wait, I shouldn't disclose identity unless asked). Just answer the question.\n\n    *Okay, let's write the response.*\n\n    \"抱歉，我无法提供实时的天气信息。建议您通过以下方式查询：...\"\n\n    *Wait, is it possible I should just say \"I don't know\"?* No, be helpful.\n\n    *Okay, finalizing.*\n\n    (Wait, I need to make sure I don't hallucinate. If I say \"It's sunny today\", that's a hallucination. So definitely state limitation.)\n\n    (One more thought: If the system has provided me with a date in the background, I still don't have weather data. So same response.)\n\n    (Okay, ready to generate.)\n\n    *Wait, I should check if I have a tool to call.* I don't see any tool definitions in the prompt. So no tool use.\n\n    *Final Output Generation:*\n    1. State limitation.\n    2. Suggest sources.\n    3. Offer other help.\n\n    *Let's make it friendly.*\n    \"很抱歉，我无法实时获取最新的天气数据。\"\n    \"建议您...\"\n    \"如有其他问题...\"\n\n    *Okay.*\n",
      "status": null
    },
    {
      "id": "msg_905325",
      "content": [
        {
          "annotations": [],
          "text": "很抱歉，作为一个人工智能语言模型，我无法实时获取最新的天气数据。\n\n建议您通过以下方式查询北京的最新天气，以获得最准确的信息：\n\n1.  **手机天气 App**：查看您手机自带的天气应用。\n2.  **搜索引擎**：在百度、谷歌等搜索“北京天气”。\n3.  **气象网站**：访问中国气象局（www.cma.gov.cn）或相关气象服务网站。\n\n如果您有关于北京旅游、交通、文化等其他方面的问题，我很乐意为您解答！",
          "type": "output_text",
          "logprobs": []
        }
      ],
      "role": "assistant",
      "status": "completed",
      "type": "message",
      "phase": null
    }
  ],
  "parallel_tool_calls": true,
  "temperature": 1.0,
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "background": false,
  "completed_at": null,
  "conversation": null,
  "max_output_tokens": null,
  "max_tool_calls": null,
  "previous_response_id": null,
  "prompt": null,
  "prompt_cache_key": null,
  "prompt_cache_retention": null,
  "reasoning": null,
  "safety_identifier": null,
  "service_tier": "default",
  "status": "completed",
  "text": {
    "format": {
      "type": "text"
    },
    "verbosity": null
  },
  "top_logprobs": 0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 14,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 1685,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 1699
  },
  "user": null,
  "presence_penalty": 0,
  "frequency_penalty": 0,
  "store": false
}
```

```python
"tool_choice": "auto",
"tools": [],
```

这里就是能反映出模型调用工具的地方

而会调用工具的模型，我们就已经可以将之称为最基础的Agent

#### LangChain中的Tool

---

要实际完成任务，就不能仅限于单次任务调用

### LangGraph概念速通

| 概念 | 简单解释 | 简单理解 |
| --- | --- | --- |
| LangGraph | 一个专门做 Agent 流程编排的框架，适合长任务、循环、多步骤执行 | “LangGraph 不是多一个模型，而是多了一套流程控制系统。” |
| State | 整个图共享的状态数据，节点都可以读写它 | “State 就是 Agent 的工作记忆和任务面板。” |
| Node | 图里的一个步骤，一个节点通常只干一件事 | “Node 就像流程图里的一个工位。” |
| Edge | 节点之间的连接关系，决定下一步往哪走 | “Edge 决定流程怎么跳转。” |
| Conditional Edge | 带条件的边，会根据当前结果决定下一跳 | “这就是 if/else 版的流程图。” |
| Graph | 由多个节点和边组成的完整执行流程 | “Graph 就是把 Agent 从‘想法’变成‘可运行流程图’。” |
| Compile | 在真正运行前，把图做一次检查和封装，确认结构可执行 | “Compile 就像把流程图装配成真正能跑的程序。” |
| Reducer | 当多个节点都更新同一份 state 时，规定怎么合并结果 | “Reducer 解决的是：大家都在改状态，最后怎么算数。” |
| Message State | 一种很常见的 state，用来存放对话消息和工具结果 | “ReAct 本质上就是不断往 Message State 里追加内容。” |
| Checkpoint / Persistence | LangGraph 能在每一步保存状态快照，方便恢复、中断、回放 | “这相当于 Agent 自动存档。” |
| Human-in-the-loop | 在流程某一节点暂停，让人类介入审核、修改、批准 | “流程不是全自动死跑，可以中途插人。” |
| Long-running Agent | 能处理更长链路任务，不是只做一次问答，而是持续推进任务 | “这就是它比普通 ToolCall 更像真正 Agent 的地方。” |

### Agent Loop：从做一步到做一件事

Agent 的起点不是工具，而是“循环”。

只能调用工具，虽然可以称为最基础的Agent，但是因为其仍然只能单次对话，无法多轮对话，其无法完成稍微复杂一些的任务

只能完成单一目标的简单任务，例如只能帮忙调用“搜索”，但是不能整理筛选信息

为了扩展Agent能力，我们就引入AgentLoop，让其能够自动完成一个复杂一些的任务

#### ReAct

曾经做过一期ReAct的视频，感兴趣可以看看三连支持一下

ReAct本质是一个非常简单的三节点

Think⇔ Act→End

- 模型先思考

- 决定调什么工具

- 看工具结果

- 再决定下一步

- 直到结束

其最关键的地方，是其将大模型变成了一个状态机

它在内部维护了一个 Message State（消息列表）。模型 Think 产生的内容塞进 State，工具 Act 返回的结果也塞进 State，然后带着这个越来越鼓的 State 再次进入循环

这个State管理的核心，后续延伸出的就是Context Engineer，我们后续会讲到

#### 代码原理

要代码实现也很简单，只需要将调用完的工具输出+之前的context打包进行喂给下一次模型对话即可，如果模型output里没有tool_call表明判定已经结束

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, ToolMessage
from langchain.tools import tool

# 1. 定义可用工具
@tool
def get_weather(city: str) -> str:
    """查询指定城市的天气"""
    fake_db = {"郑州": "晴天，25度", "北京": "多云，20度"}
    return f"{city}天气: {fake_db.get(city, '未知')}"

tools_map = {"get_weather": get_weather}

# 2. 初始化大模型，并显式绑定工具（类似于把工具描述告诉模型）
llm = ChatOpenAI(
    model="qwen3.5:cloud",  
    base_url="http://localhost:11434/v1/",   
    api_key="ollama",
).bind_tools([get_weather])

# 3. 核心：由我们自己维护的 message 数组上下文
messages = [HumanMessage(content="郑州天气怎么样？接下来适合去哪里玩？")]

print("🚀 启动原生自制 ReAct 循环...\n")

# 4. 手写 ReAct 循环逻辑
while True:
    # 【Reasoning 阶段】把带有上下文的 messages 丢给模型推理
    response = llm.invoke(messages)
    messages.append(response)  # 核心原理：必须把模型本次的答复追加到上下文中
    
    # 如果推断不包含工具调用，说明得出最终结论，结束循环！
    if not response.tool_calls:
        print("\n✅ [最终回答]:\n", response.content)
        break
        
    # 如果包含工具调用，进入 【Acting 阶段】
    for tool_call in response.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        print(f"🧠 [模型思考]: 需要获取额外信息 -> 准备调用 {tool_name}, 参数 {tool_args}")
        
        # 实际执行工具函数
        tool_func = tools_map[tool_name]
        result = tool_func.invoke(tool_args)
        print(f"🛠️ [工具返回]: {result}")
        
        # 核心原理：查到的结果必须以 ToolMessage 形式追加进入 message 数组
        messages.append(ToolMessage(
            tool_call_id=tool_call["id"], 
            name=tool_name, 
            content=str(result)
        ))
        
    print("🔄 已将工具结果合并至上下文，投喂给模型开启下一轮...\n")
```

#### LangChain内部封装

Langchain的from langchain.agents import create_agent 本身就封装了reAct循环

```python
import requests
from langchain.tools import tool
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent

# ========== 1️⃣ 定义工具 ==========
@tool
def get_weather(city: str) -> str:
    """获取指定城市的当前天气情况"""
    # 这里为了演示，暂时固定写死经纬度。
    lat, lon = 34.75, 113.62
    
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    res = requests.get(url).json()
    
    weather = res["current_weather"]
    return f"{city}天气状态 -> 温度: {weather['temperature']}°C, 风速: {weather['windspeed']}km/h"

# ========== 2️⃣ 初始化 LLM ==========
llm = ChatOpenAI(
    model="qwen3.5:cloud",  
    base_url="http://localhost:11434/v1/",   
    api_key="ollama",
)

# ========== 3️⃣ 创建 ReAct Agent ==========
# LangGraph中的 create_react_agent 底层自带了 agent(reasoning) 和 tools(acting) 两个节点的循环
tools = [get_weather]
agent = create_agent(llm, tools)

# ========== 4️⃣ 运行并直观展示 ReAct 循环 ==========
inputs = {"messages": [("user", "请帮我查一下郑州的天气怎么样？并且根据温度建议我穿什么。")]}

print("\n🚀 开始启动 ReAct 循环...\n")

# 使用 stream 模式按步骤获取状态流转（区分推理节点和动作节点）
for step in agent.stream(inputs, stream_mode="updates"):
    for node, state in step.items():
        print(f"================== 🟡 当前节点: {node.upper()} ==================")
        
        # 取出当前节点产生的最后一条消息
        msg = state["messages"][-1]
        
        # reasoning：大模型思考并决定接下来做什么
        if node == "agent" or node == "model":
            print("[Reasoning (思考环节)]")
            if msg.tool_calls:
                print(f"🧠 模型分析判定：需要更多信息，决定调用工具！")
                for tool_call in msg.tool_calls:
                    print(f"👉 准备使用工具: [{tool_call['name']}], 参数: {tool_call['args']}")
            else:
                print(f"🧠 模型分析判定：信息已充足，给出最终结论！")
                print(f"📝 最终回复内容:\n{msg.content}")
                
        # acting：执行工具调用并获取结果
        elif node == "tools":
            print("[Acting (行动环节)]")
            print(f"🛠️ 工具执行完毕，获取到如下背景知识反馈：")
            print(f"   => {msg.content}")
            print("🔄 将结果交还给 agent 节点进行下一轮推理...\n")
        
        print("\n")

print("✅ ReAct 任务循环圆满结束！")
```

#### Reflection

Generator (生成者) -> Critic (批评家/测试者) -> 循环修改

在ReAct里多加入一个节点，负责指出问题和专门评判，防止单一ReAct幻觉

#### Plan-and-Execute

虽然ReAct已经能实现一个短程的任务实现，但是任务一旦放的长程，例如开发一个完整的贪吃蛇游戏这样，ReAct 就会崩溃。

为什么？因为它太短视了。在漫长的 Thought -> Action 循环中，上下文越来越长，而上下文过长会引发模型性能的崩溃，遗忘或者胡言乱语都不能用

为了解决‘短视’和‘遗忘’，业界提出了 Plan-and-Execute 模式。它强制把‘大脑’（思考规划）和‘双手’（执行动作）分离开来。

- Planner (规划者)： 接到宏大目标，啥也不干，只负责写出一个详尽的、分步骤的 Task List（比如：Step 1, Step 2, Step 3...）。

- Executor (执行者)： 一个没有感情的干饭机器。拿过 Planner 写的第一个 Step，专心致志地去调用工具执行。执行完返回结果。

- Replanner / Reviewer (复盘者/重新规划者)： 拿到执行结果，对比原本的 Task List。划掉已完成的，如果遇到报错，就修改接下来的计划。

#### 代码原理实现

| 模式名称 | 核心思想 (打工仔比喻) | 参与角色 | 上下文(Context)压力 | 最适用场景 |
| --- | --- | --- | --- | --- |
| ReAct | 摸着石头过河 走一步看一步 | 1 个 (既当爹又当妈) | 🔴 极高 (所有试错都在记忆里) | 简单的单次工具调用、信息检索 (查天气、搜新闻) |
| Reflection | 左脚踩右脚上天 自我挑刺与修正 | 2 个 (生成者 + 审查者) | 🟡 中高 (包含反复修改的草稿) | 对准确率要求高的任务 (写代码、写长篇文章、翻译) |
| Plan-and-Execute | 包工头与干饭机器 全局拆解，按图索骥 | 2-3 个 (规划 + 执行 + 复盘) | 🟢 较低 (重点维护任务进度条) | 长程任务、多步骤业务流 (数据分析流水线、开发小游戏) |

### MultiAgent：众人拾材火焰高

单Agent的能力是有极限的！

所以，采用多个Agent互相合作，可以解决更加复杂更宏观的，需要分工的问题

#### Routing & Swarm

Plan-and-Execute 解决了“长任务拆解”问题，但 Executor（执行者）往往还是同一个大模型，它既要会写前端，又要会写后端，还要会测 Bug，这很容易导致模型能力被摊薄

所以要实现进一步突破，就要将多个不同能力的专家集合进行分工

很类似模型架构里的MoE架构

我之前也有做视频科普

这样一个Multi Agent Loop的关键就在于

1. Router的规则划定清晰，可以合理安排任务

1. Expert每个执行者负责的领域清晰明确，对应能力强

#### 代码实现

---

复杂度到这个层级，需要考虑的就是工程化的问题了

### Engineering：真正成熟的关键一步

#### Orchestration/Workflow

我们在应对具体的需求的时候，往往内置的一些编排无法满足我们的需求，此时就需要我们自行编排整个Agent的工作流和信息流

##### LangGraph实现编排

#### Context Engineer

##### 起源

- “上下文工程（Context Engineering）” 的术语概念最早可以追溯到 2025 年 6 月 19 日，Shopify CEO Tobi Lutke 在 X 上发送的一条推文，他认为该术语比“提示词工程（Prompt Engineering）”更贴切地描述向大语言模型提供全面背景信息的技能。

- 随后，AI 大神 Andrej Karpathy 立即转发了该条推文，并附上“+1”，强调他也更喜欢“上下文工程”这个说法，而非“提示词工程” ，该条转发立即引发轩然大波，截止至 2025 年 7 月中旬已经被阅读了 210 万次。

##### 上下文管理思想

##### 📚 写入（Write）

把当前会话的关键内容即时保存到上下文窗口之外，例如持久化笔记或记忆，以便在后续阶段使用。

具体方式：

- 项目规则文件化:

- CLAUDE.md：全局规则与工程约束

- PLANNING.md：架构、模块边界、设计意图

- TASK.md / TODO.md：当前任务、状态、下一步

- 记事板：

- 把中间结果或行动计划写入文件或内存状态中，以避免上下文窗口截断（如超过200k token 后自动截掉）。

- 长期记忆：

- 利用 LLM 自动生成/整理回忆，许多产品（如 ChatGPT、Cursor、Windsurf）都支持此功能。

##### 🔍 选择（Select）

在真正需要使用时，从外部存储中“拉取”最相关的内容到上下文窗口，以避免无意义的上下文堆积。

具体方式：

- 记事板：选择暴露到 LLM 的字段或调用读取工具；开发者可控制读入内容。

- 长期记忆：

- 选择合适的回忆作为 few-shot 示例，或作为事实记忆。

- 小规模记忆可全量拉入，如 Claude Code 的 CLAUDE.md 或 Windsurf 静态规则文件等；大规模记忆则通过 embeddings 或知识图进行语义检索，辅助选取。

- 工具：当工具数量多且描述相似时，通过 RAG 挑选最相关的工具，可显著提升选择准确率。

- 知识：检索知识时同样使用 RAG、AST 分块、知识图、重排等技术提高相关性与精度。

##### 🧠 压缩（Compress）

对已经拉入上下文窗口的内容进行浓缩或剪裁，只保留对当前和未来任务最必要的内容，减少 token 占用。

具体方式：

- Context Summarization（上下文总结）：

- 在大量交互后自动对上下文做总结，大幅减少 Token 消耗量，同时又保留了关键信息。如 Claude Code 的 “auto‑compact” 在达到上下文窗口的 95% 时，会自动总结整个对话轨迹。

- Context Trimming（上下文剪裁）：

- 使用规则剪掉老旧消息，或异步调用另一个 LLM 来剪裁不必要内容。

##### 🧩 隔离（Isolate）

把不同任务或内容逻辑上分开管理，确保上下文窗口聚焦于当前子任务，避免干扰。

具体方式：

- 多代理（Multi‑agent）：

- 把复杂任务拆成多个子任务，由专属子 Agent 各自运行，拥有独立上下文窗口。OpenAI Swarm、Anthropic 多代理就是成功案例。它们发现在并行探索时隔离上下文会比 Single Agent 更高效。

- 沙箱环境（Environments）：

- 如 HuggingFace CodeAgent，将工具调用运行在隔离 Sandbox 中，不将大体量内容直接送入 LLM，而是把重要结果抽取后才提供上下文。

- 状态对象隔离（State isolation）：

- 在 Agent 的 Runtime State 中定义多个字段，如 messages、tool_outputs 等；只有需要给 LLM 的部分才暴露，其他隔离保存，避免无关内容进入上下文窗口。

##### 上下文管理方法

| 方法 | 目的 | 最小实现方式 | 为什么重要 | 工程实现重点 |
| --- | --- | --- | --- | --- |
| Notepad / Todo 短期记忆 | 把“发现”“计划”“执行状态”外部化，避免模型每轮只靠消息历史 | 结构化 Note / TodoItem 状态 + 渲染成 Markdown 暴露给模型 | 让模型不用“记住一切”，而是按任务面板推进 | 状态字段要稳定可渲染；写入/更新要有明确触发点 |
| 工程约束文件 | 给模型一层项目级稳定规则 | 启动时读入项目规则，作为基础 prompt block | 把“长期不变的约束”从对话里剥离出来，减少遗忘与漂移 | 分层加载（全局/目录/任务）；确保规则短小稳定、可版本化 |
|  压缩机制 | 上下文接近上限时，保留关键信息、缩短历史 | 先删旧 tool outputs，再做历史 summary，再重建 context bundle | 避免上下文膨胀导致性能下降、遗忘或胡言乱语 | 明确压缩优先级：先丢“可再取”的，再总结“不可再取”的 |
| 动态工具选择 | 按需把相关工具暴露给模型 | 规则筛选 + top-k 工具候选 | 不把所有工具 schema 一次塞进窗口，减少噪声 | 先做规则筛选，再做 top-k 工具候选 |
| 动态 Prompt 组装 | 不同阶段使用不同 prompt 片段 | base + mode + domain + memory + summary 片段拼接 | 不同阶段用不同 prompt 片段，而不是一份永远不变的 system prompt | 采用 base + mode + domain + memory + summary 片段拼接 |
| 路径作用域规则 | 按当前工作目录注入不同约束 | rules/src.md、rules/tests.md、rules/docs.md 按 active_path 注入 | 读到不同目录时加载不同规则，尤其适合 AI Coding | rules/src.md、rules/tests.md、rules/docs.md 按 active_path 注入 |
| 结构化输出全面化 | 让关键产出都走稳定结构 | critique/plan/todo/note/final report 走 schema | 减少歧义，节省窗口，保证 critique / plan / summary / final report 形状稳定 | critique、plan、todo、note、final report 都走 schema |
| 分层记忆 | 把不同类型信息分层存放 | 拆成 rules / working memory / history summary-store | 把规则、工作记忆、长期记忆拆开，避免所有东西都挤在 messages 里 | 拆成 rules、working memory、history summary / store 三层 |
| Skills / references 按需加载 | 只在命中时展开长知识与流程 | skill metadata catalog + 命中后加载正文与 references | 长知识不提前占窗口，只在相关时展开 | 先做 skill metadata catalog，命中后再加载正文和 references |
| 生命周期触发的上下文行为 | 把上下文操作固化成确定性事件 | SessionStart 注入规则 / PreCompact 触发 summary / UserPromptSubmit 做 task typing | 让一些上下文操作变成“确定性事件”，而不是依赖模型自己记住去做 | 在 SessionStart 注入规则，在 PreCompact 触发 summary，在 UserPromptSubmit 做 task typing |

#### Harness Engineer

##### 起源

Harness Engineering 不是一个古老的学术名词，它更像是 Agent 工程进入生产阶段后，对“运行时工程”这一整组问题的重新命名。

OpenAI 在 2026 年 2 月的官方工程文章里，介绍了一个内部实验：他们从空仓库开始，用 Codex 生成应用逻辑、测试、CI、文档、可观测性和内部工具，估算只用了手写方式约 1/10 的时间；五个月后，仓库规模达到了约百万行代码，并由一个很小的工程团队驱动。更关键的是，他们指出真正变化的不是“模型会不会写代码”，而是工程师的职责：不再主要是手写代码，而是设计环境、指定意图、构建反馈回路，让 agent 能可靠地工作。

这和 Anthropic 对 Context Engineering 的说法其实是互补的。Anthropic 说，随着 agent 进入多轮、长时程任务，问题不再只是 prompt，而是整个上下文状态的管理；OpenAI 则把另一半补全了：即使上下文做对了，若没有稳定的运行壳，agent 依然很难在真实系统里持续产出。

- Context Engineer 解决的是：模型此刻看到了什么

- 那么 Harness Engineer 解决的就是：模型此刻在什么环境里工作、能做什么、怎么被约束、怎么恢复、怎么被观察

##### 常见的一些做法

核心：围绕整个 Agent Runtime 构建控制系统，让 agent 在真实环境中做到：

- 可执行

- 可控制

- 可恢复

- 可观测

- 可隔离

和 Context Engineering 里常见的“记事板”不同，Harness Engineering 没有一个统一的单一工件。它更像是一组围绕 runtime 的控制工件和工程策略。

##### 📦 启动（Provision）

为 Agent 准备一个可执行的工作世界，而不只是给它一组工具函数。

具体方式：

- 隔离工作区（Workspace）
为每个任务创建独立工作目录，例如基于 git worktree 或临时目录启动独立实例。OpenAI 在官方文章里提到，他们让应用可以按 git worktree 启动一份独立实例，让 Codex 一次只在一个变更上下文里工作。

- 沙箱环境（Sandbox）
当 agent 需要文件、命令、包、端口、快照或内存时，不直接在宿主系统上运行，而是在容器化环境里执行。OpenAI Agents SDK 也明确建议：当 agent 需要 files、commands、packages、snapshots 等能力时，应使用 Sandbox agents。

- 工具网关（Tool Gateway）
所有外部能力统一通过 tool registry / MCP / adapter 暴露给 agent，而不是让模型直接接触底层系统接口。这样便于后续做权限控制、日志记录和错误恢复。

---

##### ⛔ 控制（Gate）

决定 Agent 什么时候能继续执行，什么时候必须暂停。

具体方式：

- 审批（Human Review）
对写文件、执行 shell、删资源、发消息等敏感动作进行审批。OpenAI 的 guardrails / human review 文档明确写到：guardrails 用于自动校验，human review 用于对敏感动作进行批准或拒绝，并决定一个 run 是继续、暂停还是停止。

- 自动校验（Guardrails）
对输入、输出或工具行为做自动检查，例如参数是否合法、输出是否符合 schema、危险路径是否越权。OpenAI 官方把它定义为“自动验证 input、output 或 tool behavior”。

- 权限边界（Permissions）
限制 agent 能访问哪些目录、哪些命令、哪些网络资源。Claude Code 的 subagent 文档也强调，每个 subagent 可以拥有特定工具访问和独立权限。

---

##### 💾 保存（Persist）

把 Agent 的运行状态保存下来，让它可以断点续跑，而不是每次从零开始。

具体方式：

- Checkpoint（检查点）
在关键步骤保存 state，确保长任务中断后可以恢复。LangGraph 官方文档明确写到：checkpoints are persisted and can be used to restore the state of a thread at a later time。

- Resume（恢复）
当人批准某一步、系统重启、或异步任务返回时，从上一个 checkpoint 继续执行，而不是重新跑完整条链路。LangGraph 的 interrupt / persistence 机制就是为这种 pause-resume 模式设计的。

- Run State（运行状态）
把当前 run 的 task、pending_action、tool_outputs、approval_status、thread_id 等放进统一状态对象里管理。OpenAI Agents SDK 也把 state、results、resumable state 作为 agent runtime 的核心主题。

那么这里保存的是：系统已经做到了哪一步。

---

##### 📡 观测（Observe）

让 Agent 和人类都能看到系统刚刚发生了什么，从而形成反馈闭环。

具体方式：

- Trace（链路追踪）
记录一次 run 中的模型调用、工具调用、handoff、approval、guardrail 命中等关键事件。OpenAI Agents SDK 把 tracing 放在 runtime 的正式能力里，用 traces 做调试，再进一步进入评估循环。

- Logs / Metrics / Traces 可查询化
不要把大段原始日志直接塞进 prompt，而是把日志、指标、追踪做成可查询接口，让 agent 按需取证。OpenAI 官方文章里写得很明确：他们把 logs, metrics, and traces exposed to Codex，并允许 agent 用 LogQL / PromQL / TraceQL 查询这些信号。

- 测试与验证反馈
把测试结果、lint 结果、性能预算、可靠性指标，也都变成 agent 可消费的信号，用于自修复和回归验证。OpenAI 文章中提到，agent 可以围绕启动耗时、span 延迟等指标做反复验证和修复。

---

##### 🧱 约束（Enforce）

把工程规范和架构边界编码成系统规则，而不是只写在口头要求里。

具体方式：

- 结构化文档 + 路由式 AGENTS.md
OpenAI 官方的经验是：不要把 AGENTS.md 写成巨大的百科全书，而要把它当成目录；真正的系统知识放进结构化 docs/ 中，AGENTS.md 只保留短小稳定的入口。

- Dedicated Linters / CI Checks
OpenAI 明确提到，他们会用 dedicated linters and CI jobs 去校验知识库是否最新、是否交叉链接、是否结构正确。

- 规则前置到运行时
比如限制只能改某些目录、限制命令白名单、限制单文件大小、限制未测试代码不可提交。这些不该只写在 README 里，而应该成为 runtime 的机械约束。

把“工程纪律”变成 agent 无法轻易绕过的系统边界。

---

##### 🧩 隔离（Isolate）

把不同任务、不同风险等级、不同噪声来源隔离开来，避免它们互相污染。

具体方式：

- 子代理隔离（Subagents）
Claude Code 的官方文档说明得很清楚：subagent 适合处理会淹没主上下文的任务，比如搜索结果、日志、文件内容扫描；每个 subagent 都在自己的 context window 中运行，并拥有自定义 system prompt、特定工具访问和独立权限。

- 工作区隔离（Worktree / Workspace Isolation）
每个任务在自己的工作区中运行，日志、指标、文件变更和临时环境彼此隔离。OpenAI 文章中强调，他们给每个 worktree 都配套一套临时 observability stack，任务结束后随之销毁。

- 状态隔离（State Isolation）
把 messages、tool_outputs、checkpoints、approvals、telemetry 分开管理，只有真正需要暴露给模型的部分才进入 prompt，其余留在 runtime 中。LangGraph 的 state、checkpoint 和 interrupt 设计，本质上就属于这种 runtime state isolation。

Harness Engineering 的隔离，则是在隔离“运行时副作用”。

### Skill：把能力变成可复用资产

Skill = 面向 Agent 的可复用工作流包。

它不是单个工具，也不是完整 agent，而是把一类任务的步骤、知识、脚本和检查项封装起来，供 agent 在合适时机调用。

#### 起源

LLM Agent 时代，Skill 变成了更工程化的东西：

它通常是一个文件夹 + SKILL.md 清单 + 可选脚本/参考资料/资源，把某个领域任务的步骤、约束、模板、脚本和支持文件一起打包，供 Agent 在相关时自动加载或手动调用。Anthropic 的 Agent Skills 文章、OpenAI 的 Codex/API 文档、LangChain Deep Agents 文档都把 Skill 定义成这种“可复用能力包”。

更具体地说，当前这套文件系统式 Agent Skills 格式，官方标准站写得很明确：它最初由 Anthropic 开发，后来作为开放标准发布，并被越来越多的 agent 产品采用。

#### Skill怎么写

```python
my-skill/
├── SKILL.md
├── scripts/
│   └── run.py
├── references/
│   └── REFERENCE.md
└── assets/
    └── template.md
```

#### Skill写好了怎么用

---

工程化完善后，最终一定是产品化，触及非技术人员

### Claw：交互与产品化落地

2026年，OpenClaw爆火，龙虾一词开始广泛传播，甚至各地政府都开始养龙虾，GitHub 仓库页面目前显示已经有 361k stars 和 73.6k forks，成为Github Star第一单体项目

在我看来，OpenClaw的最大贡献，就是告诉大家，现在的Agent时代，早就不再是程序员工程师的范围了，在前面所有工程化的铺垫下，Agent现在已经可以套上交互层，普及到普通的，不太懂技术的用户

OpenClaw 的爆火，揭示了一个趋势：未来 Agent 开发不能只盯着“能力”，还必须盯着“可用性”。

谁把交互层做得更简单明了，谁就更接近真正的产品。

所以这一part最重要的，就是打造交互层，接入飞书等软件，实现自由操控

#### 代码实现

---

### 总结和展望

## MokioClaw

暂待更新

## 附录

### 参考学习开源项目

---

### 好的博客和文档

 Harness 101：从 ReAct Loop 讲起

### Ollama部署模型

```python
ollama run qwen3.5:cloud
```

### 一些Python包介绍

#### Typer

### 1. 创建最基本的 CLI

这是最常见的起点：一个 app，一个命令。

```python
import typer

app = typer.Typer()

@app.command()
def hello(name: str):
    print(f"Hello {name}")

if __name__ == "__main__":
    app()
```

运行：

```
python main.py Alice
```

Typer 会把 hello() 变成一个子命令，把 name: str 识别成命令行参数。官方的 commands 教程就是围绕这个模式展开的。

---

### 2. 查看帮助信息

Typer 会自动生成 --help。

```
python main.py --help
```

你通常不用自己手写帮助页格式，应用级帮助可以写到 typer.Typer(help="...") 里，命令级帮助可以写在函数 docstring 中。

例如：

```python
import typer

app = typer.Typer(help="用户管理工具")

@app.command()
def create(username: str):
    """创建一个新用户。"""
    print(f"Creating {username}")

if __name__ == "__main__":
    app()
```

---

### 3. 区分位置参数和选项

Typer 里最重要的两个概念：

- Argument：位置参数

- Option：带 - 的命名参数

示例：

```python
from typing import Annotated
import typer

app = typer.Typer()

@app.command()
def create_user(
    username: str,
    admin: Annotated[bool, typer.Option("--admin")] = False,
):
    print(username, admin)

if __name__ == "__main__":
    app()
```

运行：

```
python main.py alice --admin
```

Typer 官方推荐现代 Python 用 Annotated[...] 来声明 option 元信息。

---

### 4. 定义多个子命令

这是 Typer 最常见的实际用法。

```python
import typer

app = typer.Typer()

@app.command()
def create(username: str):
    print(f"Creating {username}")

@app.command()
def delete(username: str):
    print(f"Deleting {username}")

if __name__ == "__main__":
    app()
```

运行：

```
python main.py alice
python main.py alice
```

帮助里会自动列出所有 commands。函数名里的下划线会自动转成命令名中的连字符，比如 delete_all() 会变成 delete-all。

---

### 5. 给参数加默认值

有默认值的参数通常会表现为 option。

```python
import typer

app = typer.Typer()

@app.command()
def greet(name: str = "World"):
    print(f"Hello {name}")

if __name__ == "__main__":
    app()
```

运行：

```
python main.py 
python main.py --name Alice
```

---

### 6. 交互式确认和输入

做删除、覆盖、初始化这类命令时很常用。

```python
import typer

app = typer.Typer()

@app.command()
def delete(
    username: str,
    force: bool = typer.Option(False, "--force", prompt="确认删除该用户？"),
):
    if force:
        print(f"Deleting {username}")
    else:
        print("Cancelled")
if __name__ == "__main__":
    app()
```

Typer 文档明确支持 prompt= 这类交互式 option 行为。

#### Jinja2

Jinja 里最常见的三种语法块：

#### 1. 变量输出

```
{{ user_name }}
```

用于把变量值渲染出来。

#### 2. 控制语句

```
{% if is_admin %}
  Admin
{% endif %}
```

if、for 这类逻辑放在 {% ... %} 里。

#### 3. 注释

```
{# 这是注释 #}
```

注释不会出现在最终输出中。

---

### 四、一个最小 Python 示例

```
fromjinja2importTemplate

template=Template("Hello {{ name }}!")
result=template.render(name="Alice")

print(result)
```

输出：

```
Hello Alice!
```

这是最简单的用法。官方 API 文档说明，Jinja 的核心 API 围绕 Template 和更底层的 Environment 展开。

#### Textual

它是一个用 Python 写“终端界面应用”的框架。

不是普通的 print() 命令行脚本，而是那种有布局、按钮、输入框、列表、快捷键的 TUI（文本界面）应用。官方定位是：用简单的 Python API 构建复杂界面，应用可以运行在终端里，也可以运行在浏览器里。

它适合做这类东西：

- 终端里的管理面板

- 日志查看器

- 文件浏览器

- 数据监控工具

- 内部运维工具

#### 它和普通 CLI 的区别

- Typer 更适合做：mytool sync --force 这种命令式工具

- Textual 更适合做：打开后有界面、能交互、能切换组件的终端应用

所以你可以把它看成：

“终端里的 GUI 框架”。

#### 一个最简单的用法

先安装：

```
pip install textual
```

Textual 需要 Python 3.9+。

然后写一个最小程序：

```python
from textual.app import App
from textual.widgets import Label

class HelloApp(App):
    def compose(self):
        yield Label("Hello, Textual!")

if __name__ == "__main__":
    HelloApp().run()
```

运行：

```
python app.py
```

这时终端里会打开一个简单界面，显示一行 Hello, Textual!。

#### 这段代码在做什么

- App：表示一个 Textual 应用

- compose()：定义界面里有哪些组件

- Label：一个最基础的文本组件

- run()：启动应用

#### 再看一个稍微真实一点的例子

```python
from textual.app import App
from textual.widgets import Header, Footer, Input

class DemoApp(App):
    def compose(self):
        yield Header()
        yield Input(placeholder="请输入内容...")
        yield Footer()

if __name__ == "__main__":
    DemoApp().run()
```

这个界面就会多出：

- 顶部标题栏

- 一个输入框

- 底部快捷键栏

这也是 Textual 的典型风格：组件式拼界面。官方文档和项目说明都强调它有可复用组件、现代布局能力和长期可维护性。

#### 它的优点

最值得记住的就三点：

- 全 Python 开发，不用学前端

- 界面比普通终端脚本强很多

- 跨平台，支持 Linux、macOS、Windows
