import {NextRequest, NextResponse} from "next/server";
import {loadPyFile, parsePythonOutput} from "@/utils";
export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body.messages)
    const pythonOutput =await loadPyFile('test.py', body.messages)
    // 解析字符串
    return NextResponse.json(pythonOutput)

}
