# 临时 Demo试验 页面

主页中英文导航都新增 `Demo试验`，链接 `/demo-trial/`。该目录为完全独立静态页，不通过 Next.js 客户端路由加载，因此导航中的 `link` 使用普通链接。刷新或直接访问该子页同样显示密码弹窗。

此目录由 PP 工作台仓库的 `scripts/build-locked-demo.mjs` 生成，来源：Sherlockwz/pp-workbench-demo 的独立展示实现（基础提交 8ed553f）。仅包含虚构业务样本。它不引用 chatgpt.site、飞书或外部模型服务；每位访问者操作保存在自己的浏览器内。

`public/demo-trial/` 中工作台代码与数据是加密文件，输入约定密码后在浏览器内解密执行，密码本身不保存在网页源文件或浏览器存储。刷新、退出、重新锁定都会关闭当前工作台。该短密码仅用于虚构演示的轻量访问入口，不用于保护真实员工资料。

更新：在工作台仓库运行 `npm run build:locked-demo` 并通过标准输入提供约定密码；将生成的 `artifacts/demo-trial/` 整目录替换本仓库的 `public/demo-trial/`，运行 `npm run build` 后发布。请勿把 `dist/src` 或运行数据直接复制到公开站点，以免绕过演示入口。

移除：删除两份 config.toml 中 target=demo-trial 的导航项和 public/demo-trial 目录即可。原有主页内容、语言切换及页面保持原样。

浏览器要求：支持 WebCrypto、Import Maps、Web Locks 的现代浏览器；通过 HTTPS 打开。不支持 file://。GitHub Pages 是否能在目标网络直连，需要访问者实测，不能据此承诺所有网络无 VPN 可用。

验证（2026-11-23）：Next.js 生产构建、类型和 lint 检查通过。独立无头 Chrome 实测桌面/手机导航、错误密码拒绝、正确密码解锁、取消、重新锁定、刷新后重新解锁及进度保留；解密后的工作台完成管理决定→PP落实→管理复查闭环，未出现浏览器运行错误。仅本机与发布资源验证，不代表大陆所有网络连通性。
