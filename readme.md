# 麥部落格

一個用 node.js + express + ejs +  完成的 blog 系統

- [麥部落格](https://morning-taiga-19005.herokuapp.com/?page=2)

## 功能

![image](https://user-images.githubusercontent.com/5466631/126979364-c5db9d22-52c6-493b-a51d-e45f0b62a64d.png)


前台

- 全文章列表、文章內頁
- 全分類列表、同分類文章列表
- 留言板

![image](https://user-images.githubusercontent.com/5466631/126979610-dff9a319-63c6-441f-8448-e32ba500eeb0.png)


後台

- 註冊、登入、登出功能
- 角色權限管理
- 用戶資料管理
- 分類管理
- 文章管理

## 技術

- 前端相關 (ejs, bootstrap, jQuery)
- 後端相關 (node.js, express, ejs, heroku)
  - 暫存登入訊息使用 session
- 資料庫相關 (firebase realtime database)

## 初次設定

1. 將 .env.example 修改為 .env，並將 Firebase 資料填入
  - firebase client 端的資訊 (專案總覽 -> 齒輪 -> 一般設定 -> 新增應用程式)
  - firebase admin 端的資訊 (專案設定 -> 服務帳戶 -> Firebase Admin SDK -> 貼上 SDK)
3. 執行 npm install
4. 執行 npm start
