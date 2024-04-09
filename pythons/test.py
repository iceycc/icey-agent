import sys
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
# 通过.env管理api_token
from dotenv import load_dotenv
load_dotenv(override=True, dotenv_path="../.env.local")
# 获取参数

def main():
    # 获取命令行参数
    args = sys.argv[1:]  # sys.argv[0] 是脚本名称，所以我们取[1:]

    llm = ChatOpenAI()

    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是世界级的技术文档编写者。"),
        ("user", "{input}")
    ])
    chain = prompt | llm

    result = chain.invoke({"input": args[0]})

    print(result.content)


if __name__ == "__main__":
    main()
