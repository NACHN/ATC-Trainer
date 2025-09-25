# ATC Trainer

这是一个基于 Vue 3、TypeScript 和 Vite 构建的空中交通管制（ATC）训练模拟器。该项目旨在提供一个交互式环境，用于模拟和训练空中交通管制操作。

## 技术栈

* **前端框架**: Vue 3 (使用 `<script setup>` SFC)
* **语言**: TypeScript
* **构建工具**: Vite
* **状态管理**: Pinia
* **路由**: Vue Router
* **UI 库**: Tailwind CSS
* **图形渲染**: Konva (通过 vue-konva)

## 项目结构

* `src/`: 源代码目录
  * `App.vue`: 根组件，负责路由视图的渲染。
  * `main.ts`: 应用入口文件，初始化 Vue 应用、Pinia、Vue Router 和 Konva。
  * `router/`: Vue Router 配置。
  * `views/`: 页面视图组件（如 Home, FlightSim）。
  * `components/`: 可复用的 UI 组件（如 RadarDisplay, ControlPanel, AircraftCard）。
  * `store/`: Pinia 状态管理 store (simulation store)。
  * `types/`: TypeScript 类型定义。
  * `assets/`: 静态资源（样式、图片等）。

## 核心功能

1. **飞行模拟 (FlightSim)**: 主要的模拟界面，分为雷达显示区和控制面板区。
2. **雷达显示 (RadarDisplay)**: 使用 Konva 渲染飞机、机场、边界和出口。飞机以不同颜色显示（选中为黄色，未选中为绿色），并带有轨迹线。
3. **模拟控制**: 允许设置飞机生成间隔、批次大小、总飞机数和总模拟时间，并启动模拟。
4. **飞机管理**: 模拟能够生成飞机，更新它们的位置，检测碰撞（墙壁、其他飞机、机场）和目的地达成（出口、机场着陆）。
5. **状态管理**: 使用 Pinia 管理所有模拟状态，包括飞机列表、机场信息、设置、选中的飞机、事故记录和成功记录。

## 开发与构建

* **安装依赖**: `pnpm install`
* **开发服务器**: `pnpm dev` (启动 Vite 开发服务器)
* **构建项目**: `pnpm build` (使用 Vite 构建)
* **预览构建**: `pnpm preview` (预览构建后的应用)