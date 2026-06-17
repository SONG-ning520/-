# 电商平台后端系统

## 📋 项目概述

这是一个基于 Python Flask + MySQL 的电商平台后端系统，提供完整的 RESTful API 接口。

## 🚀 快速开始

### 1. 环境要求

- Python 3.8+
- MySQL 5.7+ 或 MySQL 8.0+
- Node.js (可选，用于前端)

### 2. 安装步骤

#### 2.1 安装Python依赖

```bash
cd backend
pip install -r requirements.txt
```

#### 2.2 配置MySQL数据库

1. 登录MySQL：
```bash
mysql -u root -p
```

2. 执行数据库初始化脚本：
```bash
source database.sql
```

或者使用命令行：
```bash
mysql -u root -p < database.sql
```

#### 2.3 修改数据库配置

编辑 `backend/app.py` 文件中的数据库配置：

```python
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'your_password',  # 修改为你的密码
    'database': 'ecommerce',
    'charset': 'utf8mb4',
    'pool_name': 'ecommerce_pool',
    'pool_size': 5
}
```

#### 2.4 启动后端服务

```bash
cd backend
python app.py
```

服务启动后，访问：`http://localhost:5000/api/health` 进行健康检查。

## 📡 API接口文档

### 商品接口

| 接口 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/products` | GET | 获取商品列表 | page, page_size, category_id, keyword |
| `/api/product/<id>` | GET | 获取商品详情 | - |
| `/api/product/<id>/reviews` | GET | 获取商品评价 | page, page_size |

### 分类接口

| 接口 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/categories` | GET | 获取所有分类 | - |

### 购物车接口

| 接口 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/cart` | GET | 获取购物车列表 | user_id, session_id |
| `/api/cart` | POST | 添加商品到购物车 | product_id, quantity |
| `/api/cart/<id>` | PUT | 更新购物车数量 | quantity |
| `/api/cart/<id>` | DELETE | 删除购物车商品 | - |

### 收藏接口

| 接口 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/favorites` | GET | 获取收藏列表 | user_id, session_id |
| `/api/favorite/<id>` | POST | 添加收藏 | user_id |
| `/api/favorite/<id>` | DELETE | 取消收藏 | user_id |

### 订单接口

| 接口 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/orders` | GET | 获取订单列表 | user_id |
| `/api/order` | POST | 创建订单 | cart_items |

### 搜索接口

| 接口 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/search` | GET | 搜索商品 | keyword, page, page_size |

## 🗄️ 数据库结构

### 主要表

- `users` - 用户表
- `categories` - 商品分类表
- `products` - 商品表
- `product_images` - 商品图片表
- `reviews` - 评价表
- `cart` - 购物车表
- `orders` - 订单表
- `order_items` - 订单商品表
- `favorites` - 收藏表

## 🔧 前端集成

前端JavaScript文件已集成API调用功能：

- `js/xiahezi.js` - 商品列表页
- `js/商品详情.js` - 商品详情页

修改 `USE_API_MODE` 变量来切换API/本地模式：

```javascript
const USE_API_MODE = true; // true=使用API, false=使用本地数据
```

## 📝 示例请求

### 获取商品列表

```javascript
fetch('http://localhost:5000/api/products?page=1&page_size=20')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 获取商品详情

```javascript
fetch('http://localhost:5000/api/product/1')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 添加到购物车

```javascript
fetch('http://localhost:5000/api/cart', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    product_id: 1,
    quantity: 2,
    session_id: 'session_xxx'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🐛 常见问题

### 1. 数据库连接失败

检查：
- MySQL服务是否启动
- 端口是否正确（默认3306）
- 用户名密码是否正确

### 2. 跨域问题

Flask-CORS已配置，如仍有问题，检查浏览器控制台。

### 3. 端口被占用

修改 `app.py` 中的端口或停止占用进程：

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```

## 📄 许可证

MIT License

## 👨‍💻 作者

电商平台开发团队
