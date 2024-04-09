import {spawn} from "child_process";
import {ptyhonsPath} from "@/config";
import path from 'path'
export function parsePythonOutput(output: string) {
    console.log(output)
    try {
        // 替换可能的单引号为双引号
        let jsonString = output.replace(/'/g, `"`);

        // 将结构化的字符串转换为有效的 JSON 字符串
        jsonString = jsonString.replace(/(\w+):/g, `"$1":`);
        jsonString = jsonString.replace(/\\n/g, '\\n');

        // 尝试解析 JSON 字符串
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing string:", error);
        return output;
    }
}
export async function loadPyFile(pyPath: string, ...args: any[]): Promise<string> {
    const file = path.join(ptyhonsPath, pyPath)
    console.log(file);
    const pythonProcess = spawn('python', [file, ...args]);
    return new Promise((resolve, reject) => {
        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString())
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`python 脚本执行错误：stderr: ${data}`);
            reject(data)
        });

        pythonProcess.on('close', (code) => {
            console.log(`子进程退出，退出码 ${code}`);
        });
    })
}
