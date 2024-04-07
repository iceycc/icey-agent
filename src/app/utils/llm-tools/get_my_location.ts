import { DynamicTool } from "@langchain/core/tools";

const get_my_location = new DynamicTool({
    name: "get_my_location",
    description: "获取我现在所在的城市。",
    func: async (input: string) => '新加坡',
});

export default get_my_location
