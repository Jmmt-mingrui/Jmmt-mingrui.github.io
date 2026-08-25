# VPS 自动发布

以下步骤只需在服务器上执行一次。仓库使用 deploy key 读取 GitHub，GitHub 不保存服务器私钥。

1. 把仓库克隆到 `/home/ubuntu/minguri-blog`，确认 `origin/main` 可通过 deploy key 拉取。
2. 将 `deploy/mingrui-blog.service` 安装到 `/etc/systemd/system/`，然后启用服务。
3. 将 `deploy/Caddyfile` 合并到服务器 Caddy 配置并重新加载 Caddy。
4. 把 `deploy/crontab.example` 的一行加入 `ubuntu` 用户的 crontab。
5. 确保 `ubuntu` 用户可以无交互重启 `mingrui-blog.service`，但不要授予更宽泛的 sudo 权限。

部署脚本只做 fast-forward 更新。服务器工作区存在手工修改时会停止，避免覆盖数据。构建或测试失败时旧进程继续运行，成功标记不会更新，三分钟后自动重试。

首次手动验证：

```bash
cd /home/ubuntu/minguri-blog
MINGRUI_BLOG_ROOT=/home/ubuntu/minguri-blog deploy/deploy-mingrui-blog.sh
curl --fail http://127.0.0.1:8080/
```

服务器本地文件 `.deploy-last-success`、`.deploy.lock` 和 `.deploy.log` 已由 `.gitignore` 排除，不应提交。
