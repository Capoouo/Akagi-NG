<div align="center">
  <img src="https://gcore.jsdelivr.net/gh/Xe-Persistent/CDN-source/image/assets/akagi.png" width="50%" alt="Akagi Shigeru">
  <h1>Akagi-NG</h1>

  <p>
    Next Generation Mahjong AI Assistant<br>
    Inspired by <b>Akagi</b> and <b>MajsoulHelper</b>
  </p>
<p><i>「死ねば助かるのに……」— 赤木しげる</i></p>

<p>
<a href="https://github.com/Xe-Persistent/Akagi-NG/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/Xe-Persistent/Akagi-NG/test.yml?branch=master&label=CI&labelColor=181717&logo=github" alt="CI Status"></a>
<a href="https://github.com/Xe-Persistent/Akagi-NG/releases"><img src="https://img.shields.io/github/v/release/Xe-Persistent/Akagi-NG?labelColor=181717&logo=github&display_name=tag" alt="GitHub release"></a>
<a href="https://github.com/Xe-Persistent/Akagi-NG/stargazers"><img src="https://img.shields.io/github/stars/Xe-Persistent/Akagi-NG?style=social" alt="GitHub stars"></a>
<br>
<img src="https://img.shields.io/badge/Windows-0078D6?logo=windows&logoColor=white" alt="Windows">
<img src="https://img.shields.io/badge/macOS-000000?logo=apple&logoColor=white" alt="macOS">
<img src="https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black" alt="Linux">
<br>
<img src="https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white" alt="Electron">
<img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-9135FF?logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" alt="Python">
<img src="https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=white" alt="PyTorch">
<br>
<img src="https://img.shields.io/github/license/Xe-Persistent/Akagi-NG?labelColor=808080&color=663366" alt="License">
<a href="https://discord.gg/Z2wjXUK8bN"><img src="https://img.shields.io/discord/1192792431364673577?label=Discord&labelColor=5865F2&logo=discord&logoColor=white" alt="Discord"></a>
<a href="https://codecov.io/gh/Xe-Persistent/Akagi-NG"><img src="https://img.shields.io/codecov/c/github/Xe-Persistent/Akagi-NG?labelColor=F01F7A&logo=Codecov&logoColor=white" alt="Codecov"></a>
</p>

<p align="center">
  <b>简体中文</b> | <a href="./README.md">English</a>
</p>
</div>

---

## 什么是 Akagi-NG？

**Akagi-NG** 是原 [Akagi](https://github.com/shinkuan/Akagi) 项目的次世代版本。

这是一款专为日本麻将（立直麻将）设计的 AI 辅助工具，旨在为线上麻将游戏对局提供实时局势分析与决策建议。

Akagi-NG 的核心理念：

- **前沿架构实践**：全面拥抱 Python 3.12、React 19 与 TS 6.0，以前沿工程标准构筑稳固、丝滑且高性能的系统基石。
- **极致性能推理**：深度集成 `libriichi` 高速 Rust 引擎，基于 Pytorch 提供 Mortal 系列 AI 模型的全速推理能力。
- **深度解耦设计**：决策核心与交互系统高度解耦，提供内置浏览器模式与 MITM 代理模式，灵活适配各类使用环境。
- **自研立直前瞻**：自研 `Riichi Lookahead` 前瞻技术，完整呈现模型在立直环节的隐含策略，补足 AI 决策盲区。

---

## 功能特性

- 🖥️ **兼容平台**
  - Windows 10 & 11
  - macOS (Apple Silicon only)
  - Linux

- 🎮 **支持游戏**
  - 雀魂麻将
  - 天凤
  - 麻雀一番街
  - 天月麻雀

- ✨ **核心功能**
  - 实时手牌分析与 AI 何切推荐
  - 立直前瞻 - 智能推荐最佳立直舍牌
  - 完整的副露支持 - 吃/碰/杠操作提示一目了然
  - 全新毛玻璃风格界面 - 丝滑且通透的视觉体验
  - 多语言支持 - 简体中文 / 繁體中文 / 日本語 / English

- 🤖 **AI 模型**
  - Mortal (Mortal 4p / Mortal 3p)
  - AkagiOT (AkagiOT 4p / AkagiOT 3p)

> [!NOTE]
> **Riichi Lookahead（立直前瞻）** 是 Akagi-NG 的一项核心功能，旨在解决“当 AI 建议立直时，我应该切哪张牌？”的问题。
>
> <details>
> <summary><b>点击查看立直前瞻的详细逻辑</b></summary>
>
> **1. 为什么需要它？**
>
> 当 AI 引擎 (Mortal Bot) 建议执行立直操作时，MJAI 协议返回的动作仅仅是 `{"type": "reach"}`，并不会直接告诉我们立直后应该切哪张牌（例如 `6m`）。然而，对于用户来说，点击“立直”按钮后，下一步必须切出一张牌。如果没有 Lookahead，用户只能瞎猜或者自己判断切哪张，这可能会导致 AI 建议的立直策略无法正确执行（例如切了错误的牌导致振听或放铳）。
>
> **2. 工作原理**
>
> Lookahead 的核心思想是**“模拟未来”**。当 AI 建议立直时，我们创建一个临时的平行宇宙，假设玩家已经声明了立直，然后问 AI 引擎在那个状态下会切什么牌。在这个“平行宇宙”中的一切模拟均不会影响到另一个真实的“主宇宙”。当前瞻完成后，我们只需要将前瞻得到的立直切牌推荐合并到主引擎的打牌推荐中即可。
>
> 流程分为以下几步：
>
> 1. **触发前瞻**：当前局面下，AI 引擎经过推理，认为“立直”排在推荐动作列表的前 3 名。
> 2. **启动模拟**：Akagi-NG 创建一个新的、临时的 `Lookahead Bot`。
> 3. **历史重放**：
>    - 为了让 AI 引擎内部达到当前的游戏状态，我们需要把从开局到现在发生的所有事件（摸牌、打牌、吃碰杠等）全部喂给它一遍。在重放每一手“自己的动作”时，Bot 都会傻乎乎地去问 AI 引擎：“这时候我该干嘛？”。这导致了一局游戏进行到第 15 巡时，Lookahead 需要进行 15 次以上的 AI 推理。对于在线模型，这就是 15 次 HTTP 请求，会瞬间触发 429 封禁。
>    - 因此，我们引入一个“影子” Lookahead Bot。在重放阶段，我们明确知道这只是在“复述历史”，所以当 AI 引擎问“这时候我该干嘛？”时，Lookahead Bot 通过设置 `can_act=False` **完全跳过 AI 推理**。这使得重放过程几乎是瞬时的，且零网络消耗。
> 4. **分支收束**：
>    - 当状态完全恢复到“现在”后，我们手动向 AI 引擎发送一个“立直”事件。
>    - 此时， AI 引擎的内部状态就变成了：“玩家刚刚宣布了立直，正等待切牌”。
> 5. **最终推理**：
>    - 在这个“宣布立直”的新状态下，我们向 AI 引擎发起一次**真实**的推理请求：“现在最佳切牌是什么？”
>    - 引擎会根据局面分析，返回具体的切牌动作（例如 `打 6m`）。
> 6. **结果展示**：前端 UI 接收到这个`6m`的信息，界面上会既会高亮显示立直和其他切牌推荐（比如“默听”），也会在立直推荐的子条目展示建议打出的那张`6m`。若立直切牌候选多于 1 种，子条目中会分别展示每张立直切牌和置信度。
>
> </details>

## 演示视频

https://github.com/user-attachments/assets/701a3dcf-1574-46af-9594-082605c4e158

## 运行截图

### 主界面

![主界面](./docs/screen_shots/ui.png)

### 设置面板

![设置面板](./docs/screen_shots/settings_panel.png)

---

## 免责声明

> [!CAUTION]
> 本项目**仅供教育及研究使用**。
>
> 在网络游戏中使用第三方辅助工具可能违反游戏的服务条款。
> Akagi-NG 的作者及贡献者**不对任何使用后果负责**，包括但不限于**账号被封禁或冻结**。
>
> 请您在使用前充分了解并自行承担相关风险。

## 使用指南

### 1. 快速开始

1. **下载**: 前往 [Releases](../../releases) 下载对应平台的最新版本 Release 产物并完成安装/解压。
2. **运行**: 双击运行 `Akagi-NG`。
3. **对局**: 在 Dashboard 中点击“**启动游戏**”，点击右上角显示器图标开启 **HUD**。

### 2. 目录结构说明

为了确保程序正常运行，请检查 `Akagi-NG` 所在目录结构是否完整：

```plain
Akagi-NG/
  ├── Akagi-NG     # 主程序 (Electron 桌面端)
  ├── assets/      # 各平台相关的界面资源
  ├── bin/         # 后端核心程序所在的目录
  ├── config/      # 配置文件目录 (settings.json)
  ├── lib/         # libriichi 二进制扩展 (.pyd/.so)
  │     ├── libriichi
  │     └── libriichi3p
  ├── locales/     # 多语言支持资源
  ├── logs/        # 运行日志目录
  ├── models/      # AI 模型权重文件 (.pth)
  │     ├── mortal
  │     └── mortal3p
  ├── resources/   # 应用程序核心资源 (app.asar)
  ├── LICENSE      # 开源许可协议
  ├── README       # 极简使用说明
  └── ...          # 其他必要的运行时支持文件 (.dll, .pak 等)
```

### 3. 启动与退出

双击运行 `Akagi-NG` 后，程序将展示集成化的 Dashboard 主面板。您可以直接点击 Dashboard 中的“开始游戏”启动游戏浏览器窗口。

点击 Dashboard 右上角的显示器图标即可开启 HUD 界面。

如需退出程序，请点击 Dashboard 右上角的红色电源图标。

> [!TIP]
> **HUD (Heads-Up Display)** 是 Akagi-NG 的一项核心特性。它能够将辅助信息直接以半透明形式覆盖在游戏画面上，无需手动置顶窗口。

### 4. 配置

Akagi-NG 的所有配置均位于 `config/settings.json` 文件中。您可以点击 Dashboard 右上角的齿轮图标进入设置面板来修改，也可以使用文本编辑器修改此文件来调整程序行为。

### 5. 内置浏览器模式

这是 Akagi-NG 的**默认工作模式**。

在此模式下，Akagi-NG 利用 Electron 核心管理一个专用的 Chromium 实例来运行游戏。

- **核心优势**：
  - **免配置**：无需证书或代理设置，一键启动。
  - **环境隔离**：与您日常使用的浏览器完全隔离，互不干扰。
  - **安全稳定**：直接从游戏服务器接收数据，稳定性高。

- **使用方法**：
  1. 运行 `Akagi-NG`。
  2. 在 Dashboard 中点击“启动游戏”。

### 6. MITM 外部代理模式

Akagi-NG 支持通过中间人攻击 (MITM) 方式截获游戏数据，这允许您使用任意浏览器、游戏客户端或移动设备（配合代理）进行对局。

1. **启用配置**:
   在设置面板中启用“外部代理”或在 `config/settings.json` 中手动修改 `mitm` 字段：

   ```json
   "mitm": {
        "enabled": true,
        "host": "127.0.0.1",
        "port": 6789,
        "upstream": ""
    }
   ```

2. **设置代理**:
   将您的浏览器或系统代理设置为 `127.0.0.1:6789`。

3. **安装证书**:

   > 注意：如果您使用了其他代理软件，可能无法打开 `mitm.it`，请使用**本地安装**。
   - **方法一：在线安装**
     - 启动 Akagi-NG。
     - 访问 [http://mitm.it](http://mitm.it)。
     - 下载 Windows 证书 (p12 或 cer)。

   - **方法二：本地安装**
     - 找到用户目录下的 `.mitmproxy` 文件夹 (例如 `C:\Users\<YourName>\.mitmproxy`)。
     - 双击 `mitmproxy-ca-cert.p12` 进行安装。

   - **关键步骤**：
     - 双击证书 -> 安装证书 -> 存储位置选“**受信任的根证书颁发机构**”。

> [!WARNING]
> 务必将证书安装到“**受信任的根证书颁发机构**”。

---

## 常见问题

#### Q: 内置的模型强度如何？

**A:** 以雀魂为例，Mortal 4p 的水平在**雀豪1**左右，Mortal 3p 的水平在**雀杰3**左右。

#### Q: 内置的模型太弱了，有没有更强的模型？

**A:** 有，请加入 [Discord 频道](https://discord.gg/Z2wjXUK8bN) 获取。

#### Q: 有没有自动打牌功能？

**A:** 很遗憾，Akagi-NG 暂不支持自动打牌功能。

#### Q: 我正在使用 Clash/v2rayN 等代理软件，如何配置 MITM 代理？

<details>
<summary><b>点击查看详细代理规则配置方案</b></summary>

##### 配置方案 A: 浏览器网页（SwitchyOmega 代理）

此方案适合**网页版**玩家，配置最简单且完全隔离。

**配置步骤（以 Clash Verge 的 Tun 模式为例）**：

1. **准备环境**：
   - 保持 Clash Verge 的 Tun 模式为**开启**。
   - 确保 Akagi-NG 已启动且 `mitm.enabled` 为 `true`（端口默认为 6789）。

2. **安装 SwitchyOmega**:
   - Chrome/Edge 用户请在浏览器扩展商店搜索并安装 **SwitchyOmega**。

3. **配置情景模式**:
   - 打开 SwitchyOmega 设置界面。
   - 点击左侧 **新建情景模式** -> 命名为 `Akagi-Mitm` -> 类型选择 **代理服务器**。
   - 在 `Akagi-Mitm` 的设置中填写：
     - 协议：`HTTP`
     - 服务器：`127.0.0.1`
     - 端口：`6789`
   - 点击左侧 **应用选项** 保存。

4. **配置自动切换**:
   - 点击左侧 **自动切换** (auto switch)。
   - 删除所有现有规则（如果有）。
   - **添加规则**：
     - 域名通配符：`*.maj-soul.com  ->  Akagi-Mitm`
     - 域名通配符：`*.majsoul.com  ->  Akagi-Mitm`
     - 域名通配符：`*.mahjongsoul.com  ->  Akagi-Mitm`
   - **默认规则**：
     - 选择 **[直接连接]**，然后点击 **应用选项** 保存。

> 因为您的系统已经开启了 Tun 模式，直连的流量会自动被 Tun 网卡接管并代理，所以不需要在这里选[系统代理]。
>
> 如果您没开 Tun 模式，仅开了系统代理，这里请选[系统代理]。

5. **开始游戏**:
   - 点击浏览器右上角 SwitchyOmega 扩展程序的图标，选择 **自动切换**。
   - 访问雀魂网页版，Akagi-NG 应该能正常获取游戏事件，同时您依然可以访问 Google/YouTube (走 Tun)。

##### 配置方案 B: 雀魂客户端（Clash 规则代理，以 Windows 平台、Clash Verge rev为例）

此方案适合**Steam客户端**玩家。由于客户端无法像浏览器那样使用插件进行代理，我们需要修改 Clash 配置文件，让它把游戏流量转发给 Akagi-NG。

> 使用 Steam 客户端游玩时，请确保 Clash 处在 TUN 模式下，否则将无法代理客户端流量

1. **找到配置入口**:
   - 在 Clash Verge rev 客户端左侧点击“订阅”，找到您的配置文件，或者新建一个配置。

2. **添加代理节点 (Proxies)**:
   - 定义一个指向 Akagi-NG 本地代理的节点。

   ```yaml
   proxies:
     - name: Akagi-Mitm
       type: http
       server: 127.0.0.1
       port: 6789
       tls: false
   ```

   - 还可以定义一个代理组 (Proxy-groups)，里面包含本地代理节点和直连 (Direct)，这样方便切换是否使用 Akagi-NG 本地代理。

   ```yaml
   proxy-groups:
     - name: 🀄 雀魂麻将
       proxies:
         - Akagi-Mitm
         - DIRECT
       type: select
   ```

3. **添加分流规则 (Rules)**:
   - 将雀魂相关域名强制指向上面定义的代理节点。请注意规则顺序，建议将规则放在靠前位置。

   ```yaml
   rules:
     - PROCESS-NAME,akagi-ng.exe,DIRECT
     - PROCESS-NAME,雀魂麻將,🀄 雀魂麻将
     - PROCESS-NAME,Jantama_MahjongSoul.exe,🀄 雀魂麻将
     - DOMAIN-Keyword,maj-soul,🀄 雀魂麻将
   ```

4. **应用配置**:
   - 保存并刷新 Clash 配置。现在启动雀魂客户端，流量路径为：`雀魂客户端 -> Clash (TUN) -> 匹配到 Rules -> 转发给 Akagi-NG (6789) -> 您的网络/上游代理`

</details>

---

## 源码构建指南

### 环境要求

- **Python 3.12**: 用于运行后端推理引擎。
- **Node.js 24 & npm**: 用于编译 Electron 桌面端和 React 前端。
- **Git**: 用于克隆项目仓库。

### 1. 项目初始化

克隆仓库并进入根目录：

```bash
git clone https://github.com/Xe-Persistent/Akagi-NG.git
cd Akagi-NG
```

#### 准备后端环境

集成构建脚本依赖于 `akagi_backend` 目录下的虚拟环境：

```bash
cd akagi_backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -e ".[dev]"
cd ..
```

根据你的系统版本准备 libriichi 二进制扩展并重命名：

```bash
# Windows
copy lib\libriichi-3.12-x86_64-pc-windows-msvc.pyd lib\libriichi.pyd
copy lib\libriichi3p-3.12-x86_64-pc-windows-msvc.pyd lib\libriichi3p.pyd

# macOS
cp lib/libriichi-3.12-aarch64-apple-darwin.so lib/libriichi.so
cp lib/libriichi3p-3.12-aarch64-apple-darwin.so lib/libriichi3p.so

# Linux
cp lib/libriichi-3.12-x86_64-unknown-linux-gnu.so lib/libriichi.so
cp lib/libriichi3p-3.12-x86_64-unknown-linux-gnu.so lib/libriichi3p.so
```

#### 安装前端与 Electron 依赖

在项目根目录下，执行安装：

```bash
npm install
```

### 2. 开发环境运行

在项目根目录下执行一键启动命令，会自动同时运行前端和Electron端：

```bash
npm run dev
```

### 3. 生产环境构建

执行以下命令，即可一键完成环境清理、版本号同步、前端打包、后端编译及应用最终打包的全流程：

```bash
npm run build
```

构建产物将生成于 `dist/release` 目录下。

---

## 开源协议

本软件的主体代码遵循 [GNU Affero General Public License version 3 (AGPLv3)](LICENSE) 开源协议。

## 致谢与第三方资源声明

本项目发布版打包附带的 `lib`（包含 `libriichi` 二进制扩展）与 `models`（AI 模型权重）文件，均来源于项目 [shinkuan/Akagi](https://github.com/shinkuan/Akagi)。
这些编译的二进制文件与模型权重的版权归原作者所有，并适用其原本的开源许可协议。在此向原作者的卓越工作与开源精神表示最诚挚的感谢！
