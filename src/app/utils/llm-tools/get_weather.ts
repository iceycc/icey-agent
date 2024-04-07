import { DynamicTool } from "@langchain/core/tools";
const weathers = {
    '北京': '气温8至21度，多云转小雨',
    '上海': '气温10至14度，小雨转阴',
    '哈尔滨': '气温-4至5度，晴天',
    '新加坡': '气温26至31度，多云'
}

const get_weather = new DynamicTool({
    name: "get_weather",
    description: "返回当前地区度天气。",
    func: async (input: string) => {
        return Object.entries(weathers).map(([key,value])=>{
            return `${key}天气：${value}；`
        }).join(' ')
    },
});

export default get_weather
