# JUTour · 韩国医美旅游 Demo 网站

面向外国游客的韩国医美旅游 Demo 网站。支持韩语 / 简体中文 / 英语三语，游客端可浏览服务、韩国景点、医美机构、K-pop 演出与旅游产品并提交咨询；管理员端可登录后台维护"行程素材"，多选素材拼装成可发布的"旅游产品"。

**这是一个可运行的产品 Demo，不涉及真实支付、真实预约或真实后端。**

---

## 目录

- [本地开发](#本地开发)
- [构建与部署（GitHub Pages）](#构建与部署github-pages)
- [免费部署方案比较与推荐](#免费部署方案比较与推荐查询日期-2026-09-10)
- [API 配置说明](#api-配置说明)
- [数据存储、导入导出](#数据存储导入导出)
- [管理员入口](#管理员入口)
- [功能清单：已实现 / 演示 / 待接入](#功能清单已实现--演示--待接入)
- [验收流程](#验收流程)
- [技术栈与目录结构](#技术栈与目录结构)

---

## 本地开发

```bash
npm install
npm run dev       # http://localhost:5173
```

首次运行前，如果你有首尔观光局 API Key，复制 `.env.example` 为 `.env.local` 并填入：

```bash
cp .env.example .env.local
# 编辑 .env.local，填入 VITE_VISITSEOUL_API_KEY
```

不配置 Key 也可以直接运行 —— 韩国景点板块会自动使用带有明确"演示数据"标注的内置数据。

## 构建与部署（GitHub Pages）

```bash
VITE_BASE_PATH=/jutour/ npm run build   # 产物在 dist/
npm run preview                          # 本地预览构建产物
```

仓库已包含 `.github/workflows/deploy.yml`：push 到 `main` 分支即自动构建并发布到 GitHub Pages。使用前需要：

1. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
2. 如果要接入真实首尔观光局 API，在 Settings → Secrets and variables → Actions 新增仓库 Secret `VITE_VISITSEOUL_API_KEY`。不设置也能正常构建，只是景点板块会使用演示数据。
3. `public/404.html` 里硬编码了仓库名路径 `/jutour/`（GitHub Pages SPA 深层路由刷新的经典 fallback 方案）。如果仓库改名，需要同步修改这个文件，以及 workflow 里的 `VITE_BASE_PATH`。

**部署平台已验证的点**：子路径下的资源加载（`vite.config.ts` 的 `base` 由 `VITE_BASE_PATH` 注入）、语言前缀路由（`/zh` `/en` `/ko`）在子路径下的深层链接刷新（`index.html` + `public/404.html` 的经典 `sessionStorage` 重定向方案）、无 API Key 时的自动降级。

## 免费部署方案比较与推荐（查询日期 2026-09-10）

| 平台 | 免费额度要点 | 商用限制 | SPA 路由支持 | 能否代理隐藏 API Key |
|---|---|---|---|---|
| **GitHub Pages**（当前采用） | 站点 ≤1GB，流量/构建次数为软限制 | 官方明确不鼓励用于以商业交易为主的站点；纯展示 Demo 不受影响 | 无原生支持，需 404.html 重定向 trick（已内置） | 不能（纯静态，无函数能力） |
| Cloudflare Pages | 静态资源带宽/请求基本不限量 | 未见"仅限个人非商用"限制 | 原生支持（`_redirects`） | 可以（Pages Functions 可做一层代理） |
| Vercel | Hobby 计划额度充裕 | Hobby 计划**明确仅限个人非商用** | 原生支持 | 有 Serverless/Edge Functions，但受商用条款限制 |
| Netlify | 新账号为"信用点"制，额度相对紧张 | 未强制非商用，但免费额度较紧 | 原生支持（`_redirects`） | 有 Edge Functions，但与流量共享同一额度池 |

**当前采用 GitHub Pages**（用户在需求确认阶段已明确选择），信息来源为各平台官方定价/文档页面。若未来需要**彻底隐藏**首尔观光局 API Key（而不是像现在这样接受它出现在公开构建产物中），建议迁移到 **Cloudflare Pages**，用一个 Pages Function 转发请求、注入 Key，前端只请求自己的域名。

## API 配置说明

### 首尔观光局景点 API（Visit Seoul）

- 文档入口：`https://api-call.visitseoul.net/api/v1/swagger-ui/index.html`
- 认证方式：请求头 `VISITSEOUL-API-KEY`
- 实测支持的接口：景点列表（`/contents/list`，支持分类 `com_ctgry_sn`、关键词 `keyword`、分页）、景点详情（`/contents/info`）、语言列表（`/code/lang`，含 `zh-CN` 简体中文）、分类树（`/category/list`）
- **实测确认支持浏览器端直接跨域调用**（响应头 `Access-Control-Allow-Origin: *`），因此选择直接在前端调用，不额外搭建代理后端
- **重要声明**：由于本项目是纯静态站点，`VITE_VISITSEOUL_API_KEY` 无论放在 `.env.local` 本地开发还是 GitHub Actions Secret，最终都会被打包进公开可见的前端构建产物中，**这不是"保密"，只是避免把 Key 明文提交进 git 历史**。这是可以接受的，因为该 API 网关本身设计为全开放 CORS 的公开只读展示数据接口；但官方文档未给出正式的限流/使用条款，正式商用前建议联系首尔观光局确认，或迁移到 Cloudflare Pages Functions 做代理彻底隐藏 Key。
- 未配置 Key，或请求失败时，自动降级为 `src/data/seed/attractions.json`（`src/data/seed/attractions.ts`）中的演示数据，并在页面上明确标注"演示数据"。

### 医美机构数据

- 首页医美板块的机构**名称 / 分类 / 地址 / 语言服务标识 / 来源链接**取自首尔市官方医疗观光名录 `medical.visitseoul.net` 的公开事实信息（客观事实，不受著作权保护）。
- **简介文字为 JUTour 原创撰写**，配图为通用可商用素材图片（非机构实拍），页面上有明确说明。
- 名录站点本身**不公开任何价格信息**——所有诊疗项目价格、优惠均由管理员在后台维护，标注为"演示价格"（`priceStatus: 'demo_price'`）或"需咨询"（`'inquire'`），不代表真实报价、优惠或合作关系。

### K-pop 演出

- 调研结论：目前没有免申请、支持浏览器端直连、且真正覆盖 K-pop 演唱会的官方免费 API（KOPIS 覆盖演出但需注册审核、不支持 CORS、站点主要为韩文；Ticketmaster 不覆盖韩国本土场次；Interpark / YES24 / Melon Ticket 无公开票务 API）。
- 因此本 Demo 的 K-pop 板块**全部为演示数据**（`src/data/seed/kpopEvents.ts`），演出名称、艺人均为虚构占位内容，购票按钮指向真实票务平台的**首页**（而非编造的具体场次链接），页面顶部有醒目提示。
- 如未来要接入真实数据，建议流程：在 kopis.or.kr 注册开发者账号申请 `serviceKey`（邮箱验证即可，免费但有调用配额），并搭建一个最小后端 / Edge Function 做代理（该接口不支持浏览器直连）。

## 数据存储、导入导出

- 素材、产品、医美机构价格、咨询记录**全部只保存在当前浏览器的 `localStorage`**，不会自动同步给其他访客或你自己的其他设备/浏览器。
- 管理员后台「数据管理」页提供：
  - **导出 JSON**：导出全部数据为一个 JSON 文件，用于备份，或在改动素材/产品后随静态站点重新部署（把导出的 JSON 内容手动合并进 `src/data/seed/*.ts` 作为新的默认种子数据，再提交部署）。
  - **导入 JSON**：从之前导出的文件恢复数据（会校验基本结构），导入前会二次确认，因为会覆盖当前浏览器里的全部数据。
  - **恢复演示数据**：一键还原到项目自带的示例内容，同样有二次确认。
- 如果未来需要"多人在线共享编辑"（而不是导出导入手动同步），需要引入一个最小后端或 Serverless 数据库（例如 Cloudflare D1 / Workers KV），这超出了当前 Demo 范围，本次未实现。

## 管理员入口

- 入口：导航栏「管理员入口」→ `/admin/login`
- Demo 密码硬编码为 `junet0123`（见 `src/context/AdminAuthContext.tsx`）
- **明确声明**：这只是前端硬编码密码比对，用于演示"管理员登录后台"这个交互流程，**不能保护真实后台或敏感数据**——任何人打开浏览器开发者工具都能在打包后的 JS 里直接看到这个密码。正式上线必须替换为真正的服务端认证（如 JWT/Session + 后端校验）。
- 登录状态保存在 `localStorage`，刷新页面不会掉登录，直到手动点击「退出登录」。

## 功能清单：已实现 / 演示 / 待接入

### 已实现（真实可用的功能逻辑）

- 三语言切换（`/zh` `/en` `/ko` 路径前缀），语言选择记忆在 `localStorage`
- 缺失翻译时的显式回退机制（`getLocalized`），管理员编辑表单会标注"未填写 XX 语言，将回退显示其他语言"
- 首尔观光局 API 真实对接（列表/详情/分类/关键词筛选），Key 缺失或请求失败时自动降级演示数据
- 管理员登录（Demo 级）、行程素材增删改查（搜索、分类筛选）
- 素材多选 → 创建旅游产品 → 按天分配、上下移排序、开始时间自动计算结束时间、交通/自由活动/备注、同日时间冲突检测提示
- 价格计算按 每人 / 每车 / 每次 分别列明细，不混加；销售价与优惠金额由管理员单独设置
- 发布时对素材做快照冻结，之后修改素材库不影响已发布产品
- 医美机构价格/优惠管理（原价/优惠金额/优惠价/币种/说明/需咨询）
- 咨询表单 → 本地保存为咨询记录 → 管理员可查看/导出/清空
- JSON 全量导出/导入、恢复演示数据（均有二次确认）
- 响应式布局（桌面/移动断点在 `src/index.css`）

### 演示功能（有 UI 流程，但底层是演示数据或本地模拟）

- K-pop 演出板块：完全为标注清楚的演示数据，非真实演出/票务库存
- 医美机构页面的简介文字、图片：原创/通用素材，非机构真实资料；价格为管理员维护的演示价格
- 咨询表单：仅保存到浏览器本地，不会真实发送邮件/短信，也不做真实的数据持久化到服务器
- 管理员登录：前端硬编码密码，非真实身份认证

### 待接入 / 已知限制（超出本次 Demo 范围）

- 真实的 K-pop 演出数据源（需要申请 KOPIS `serviceKey` 并自建代理后端，因其不支持浏览器直连）
- 医美机构真实、可核实的价格与优惠（需要与机构或首尔观光局官方渠道另行合作获取）
- 多人协作/多浏览器共享编辑（需要最小后端或 Serverless 数据库）
- 真实的支付、预约、会员系统
- 服务端认证的管理员登录
- 首尔观光局 API Key 的服务端代理隐藏（当前 Key 会出现在公开的前端构建产物中，见上文说明）

## 验收流程

1. 打开首页，切换中/英/韩三语，确认导航、按钮、表单文案均正确切换；用浏览器开发者工具模拟常见手机尺寸检查布局。
2. 导航栏「管理员入口」→ 输入 `junet0123` 登录 → 「行程素材」新增/编辑一条素材。
3. 「旅游产品」→「创建旅游产品」→ 勾选若干素材 → 分配到不同天、调整顺序、设置开始时间（观察结束时间自动计算）、故意制造一次时间冲突（观察提示）。
4. 「预览」后「发布」→ 退出登录 → 前台「旅游产品」能看到并打开完整详情页（按天时间线、费用明细、包含/不包含）。
5. 刷新浏览器，确认新增素材/产品仍在（localStorage 持久化）。
6. 「数据管理」→ 导出 JSON → （可选）「恢复演示数据」→ 再导入刚才导出的 JSON，确认数据还原。
7. 临时移除 `.env.local` 里的 `VITE_VISITSEOUL_API_KEY`（或清空其值）重启 `npm run dev`，确认「韩国景点」页面仍可正常浏览，并显示"演示数据"标注。
8. `VITE_BASE_PATH=/jutour/ npm run build && npm run preview`，在子路径下检查资源加载、路由跳转、产品详情页直接刷新是否正常；实际部署到 GitHub Pages 后重复此检查。

## 技术栈与目录结构

React 18 + TypeScript + Vite + react-router-dom；无额外 UI 框架依赖，使用自定义 CSS 设计变量（米白 / 柔和绿 / 金色）。i18n 为自研的轻量 Context + JSON 字典方案（未使用 react-i18next），以便精确控制"回退语言并显式标注"的行为。状态与持久化基于 React Context + `localStorage`，无 Redux。

```
src/
  i18n/            三语字典、I18nContext、getLocalized 回退逻辑
  types/           领域类型（Material / Product / MedicalOrg / KpopEvent / ConsultationLead）
  data/
    seed/          内置演示数据（素材、产品、医美机构、K-pop、景点降级数据）
    store/         localStorage 封装的应用数据 Context（含导入导出/恢复演示数据）
  services/        首尔观光局 API 客户端 + 演示/真实数据适配器
  context/         管理员登录状态
  router/          语言路由参数辅助
  components/      导航/页脚/徽章/表单控件等通用组件
  pages/           游客端与管理员端页面
  utils/           价格计算、时间计算、JSON 导入导出、ID 生成
```
