import projectEino from "../../content/projects/eino-ext.jpg?url";
import projectDoris from "../../content/projects/doris-mcp-server.jpg?url";
import projectVelo from "../../content/projects/velodb-mcp-server.jpg?url";
import projectMicro from "../../content/projects/microservices-go-start.jpg?url";

export interface Project {
  key: string;
  name: string;
  description: string;
  href: string;
  image: string;
}

// 项目数据：首页与 /projects 页共用（图片为构建期 ?url 打包出的静态资源地址）
export const projects: Project[] = [
  {
    key: "eino",
    name: "eino-ext",
    description: "Eino 框架的各类扩展组件：模型接入、工具集成与编排能力",
    href: "https://github.com/cloudwego/eino-ext",
    image: projectEino,
  },
  {
    key: "doris",
    name: "doris-mcp-server",
    description: "Apache Doris 的 MCP Server，让 AI 应用通过标准接口查询 Doris",
    href: "https://github.com/apache/doris-mcp-server",
    image: projectDoris,
  },
  {
    key: "velodb",
    name: "velodb-mcp-server",
    description: "VeloDB Cloud 与 Enterprise 的 MCP Server，接入云原生实时分析数据库",
    href: "https://github.com/velodb/velodb-mcp-server",
    image: projectVelo,
  },
  {
    key: "microservices",
    name: "microservices-go",
    description: "微服务实战 Go 完整示例代码，从零搭建一套微服务体系",
    href: "https://github.com/Jmmt-mingrui/microservices-go-Start",
    image: projectMicro,
  },
];
