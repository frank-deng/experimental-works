import asyncio
import os
import json
import aiohttp
from aiohttp import ClientTimeout

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
API_KEY = os.getenv("DEEPSEEK_KEY")
if not API_KEY:
    raise RuntimeError("请设置环境变量 DEEPSEEK_API_KEY")

async def chat_completion(
    messages: list[dict],
    model: str = "deepseek-chat",
    temperature: float = 0.7,
    max_tokens: int = 1024,
    timeout_seconds: int = 60,
) -> dict | str:
    """
    异步调用 DeepSeek Chat API，返回完整响应 JSON。
    如果只想获取文本，可设置 return_text=True。
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False,   # 非流式响应
        "tools":[{
            "type":"function",
            "function":{
                "name":"get_weather",
                "description":"获取某地天气，地点由用户给出",
                "parameters":{
                    "type":"object",
                    "properties":{
                        "location":{
                            "type":"string",
                            "description":"需要查询天气的地方"
                        }
                    },
                    "required":["location"]
                }
            }
        }]
    }

    timeout = ClientTimeout(total=timeout_seconds)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            async with session.post(
                DEEPSEEK_API_URL, headers=headers, json=payload
            ) as resp:
                # 检查 HTTP 错误
                if resp.status != 200:
                    error_text = await resp.text()
                    raise RuntimeError(
                        f"API 请求失败: {resp.status} {resp.reason}\n{error_text}"
                    )
                data = await resp.json()
                return data
        except asyncio.TimeoutError:
            raise TimeoutError("请求超时，请检查网络或增加 timeout_seconds")
        except aiohttp.ClientError as e:
            raise ConnectionError(f"网络连接错误: {e}")

async def main():
    # 示例对话
    messages = [
        {"role": "user", "content": "请帮忙查询下宣城文昌镇的实时天气"},
    ]

    try:
        response = await chat_completion(messages)
        # 提取模型回复文本
        content = response
        print("DeepSeek 回复：")
        print(content)

        # 如果需要查看完整 JSON 响应，可以取消下面注释
        # print("\n完整响应：")
        # print(json.dumps(response, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"调用出错: {e}")

if __name__ == "__main__":
    asyncio.run(main())
