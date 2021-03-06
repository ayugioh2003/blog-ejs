# 麥部落格

一個用 node.js + express + ejs + firebase realtime database 完成的 blog 系統

- [麥部落格](https://morning-taiga-19005.herokuapp.com/?page=2)

![image](https://user-images.githubusercontent.com/5466631/126981673-1a03b945-0f03-4f14-8311-3c2f239e1c70.png)


## 功能

前台

- 全文章列表、文章內頁
- 全分類列表、同分類文章列表
- 留言板

![image](https://user-images.githubusercontent.com/5466631/126979364-c5db9d22-52c6-493b-a51d-e45f0b62a64d.png)

後台

- 註冊、登入、登出功能
- 角色權限管理
- 用戶資料管理
- 分類管理
- 文章管理

![image](https://user-images.githubusercontent.com/5466631/126979610-dff9a319-63c6-441f-8448-e32ba500eeb0.png)


## 技術

- 前端相關 (ejs, bootstrap, jQuery)
- 後端相關 (node.js, express, ejs, heroku)
  - 暫存登入訊息使用 session
- 資料庫相關 (firebase realtime database)

## 初次設定

1. 將 .env.example 修改為 .env，並將 Firebase 資料填入
    - firebase client 端的資訊 (專案總覽 -> 齒輪 -> 一般設定 -> 新增應用程式)
    - firebase admin 端的資訊 (專案設定 -> 服務帳戶 -> Firebase Admin SDK -> 貼上 SDK)
2. 執行 npm install
3. 執行 npm start

## 參考密碼

管理者帳密
admin@gmail.com
password

編輯者aaa帳密 (無法進入角色管理、用戶管理。無法刪除文章、分類)
a@gmail.com
aaaaaaaa

