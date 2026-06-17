-- 电商数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecommerce;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品分类表
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(10, 2) DEFAULT 0.00,
    image VARCHAR(500),
    description TEXT,
    specs JSON,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    stock INT DEFAULT 0,
    status TINYINT DEFAULT 1 COMMENT '1-上架 0-下架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品图片表
CREATE TABLE IF NOT EXISTS product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT,
    user_name VARCHAR(50),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    tags VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 购物车表
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(100),
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TINYINT DEFAULT 1 COMMENT '1-待支付 2-已支付 3-已发货 4-已完成 5-已取消',
    receiver_name VARCHAR(50),
    receiver_phone VARCHAR(20),
    receiver_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单商品表
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(100),
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, product_id),
    UNIQUE KEY unique_favorite_session (session_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建索引
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);

-- 插入分类数据
INSERT INTO categories (name, description, sort_order) VALUES
('电脑整机', '台式机、笔记本、一体机', 1),
('外设配件', '键盘、鼠标、显示器等', 2),
('女装', '女士服装、鞋包配饰', 3),
('男装', '男士服装、鞋包配饰', 4),
('鞋靴', '运动鞋、皮鞋、休闲鞋', 5),
('数码配件', '充电器、数据线、耳机', 6),
('食品', '零食、茶叶、咖啡', 7),
('图书', '小说、儿童读物、专业书籍', 8),
('家居用品', '家纺、收纳、清洁用品', 9),
('美妆护肤', '化妆品、护肤品、个护', 10),
('母婴用品', '奶粉、尿裤、玩具', 11),
('运动户外', '运动装备、户外用品', 12),
('汽车用品', '行车记录仪、装饰用品', 13),
('宠物用品', '宠物食品、玩具、出行', 14),
('办公用品', '文具、打印设备、收纳', 15),
('手机数码', '手机、平板、智能穿戴', 16);

-- 插入商品数据
INSERT INTO products (category_id, name, price, original_price, image, description, specs, rating, review_count, stock) VALUES
-- 电脑整机（分类ID=1）
(1, '惠普 HyperX 暗影精灵 PRO 16', 8999.00, 11699.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-26-19.png', '全新一代暗影精灵PRO系列，搭载Intel Core Ultra处理器，配合RTX 50系列显卡，为游戏玩家带来极致体验。240Hz高刷新率屏幕，流畅无拖影。', '{"brand": "惠普 (HP)", "model": "暗影精灵 PRO 16", "processor": "Intel Core Ultra7 255HX", "graphics": "NVIDIA RTX 5060 Laptop GPU", "memory": "16GB DDR5", "storage": "512GB PCIe SSD", "screen": "16英寸 2.5K 240Hz IPS", "weight": "2.3kg"}', 4.9, 20000, 50),
(1, '华硕天选7 Pro Max', 14999.00, 19499.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-02.png', '天选系列旗舰机型，二次元美学设计，AMD锐龙9处理器搭配RTX 5070 Ti显卡，18英寸大屏幕带来沉浸式游戏体验。', '{"brand": "华硕 (ASUS)", "model": "天选7 Pro Max", "processor": "AMD Ryzen 9 9955HX", "graphics": "NVIDIA RTX 5070 Ti Laptop GPU", "memory": "32GB DDR5", "storage": "2TB PCIe SSD", "screen": "18英寸 2.5K 300Hz IPS", "weight": "2.6kg"}', 4.8, 15000, 30),
(1, '惠普星Book Pro 16 2025', 5948.00, 7732.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-22.png', '轻薄便携的生产力工具，OLED屏幕色彩鲜艳，适合办公和创意设计，长续航设计满足全天使用需求。', '{"brand": "惠普 (HP)", "model": "星Book Pro 16 2025", "processor": "Intel Core Ultra5 125H", "graphics": "Intel Arc Graphics", "memory": "16GB DDR5", "storage": "512GB PCIe SSD", "screen": "16英寸 2.5K 120Hz OLED", "weight": "1.8kg"}', 4.7, 18000, 80),
(1, '联想拯救者 R7000P 2025', 10188.00, 13244.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-36.png', '拯救者系列经典游戏本，霜刃散热系统，性能释放强劲，适合高端游戏和专业创作。', '{"brand": "联想 (Lenovo)", "model": "拯救者 R7000P 2025", "processor": "AMD Ryzen 9 8945HX", "graphics": "NVIDIA RTX 5060 Laptop GPU", "memory": "16GB DDR5", "storage": "1TB PCIe SSD", "screen": "16英寸 2.5K 240Hz IPS", "weight": "2.4kg"}', 4.9, 25000, 60),
(1, '小米 Redmi Book 16 焕新版', 3599.00, 4679.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-28-42.png', '高性价比轻薄本，2.5K高清屏幕，适合日常办公和学习，小米生态联动更便捷。', '{"brand": "小米 (MI)", "model": "Redmi Book 16 焕新版", "processor": "Intel Core i5-13420H", "graphics": "Intel UHD Graphics", "memory": "16GB DDR4", "storage": "512GB PCIe SSD", "screen": "16英寸 2.5K 120Hz IPS", "weight": "1.7kg"}', 4.6, 30000, 100),
(1, '华硕天选7 Pro 酷睿版', 8999.00, 11699.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-43.png', '天选7 Pro酷睿版本，Intel处理器带来更强单核性能，300Hz高刷屏适合电竞玩家。', '{"brand": "华硕 (ASUS)", "model": "天选7 Pro 酷睿版", "processor": "Intel Core Ultra7 251HX", "graphics": "NVIDIA RTX 5060 Laptop GPU", "memory": "16GB DDR5", "storage": "1TB PCIe SSD", "screen": "16英寸 2.5K 300Hz IPS", "weight": "2.2kg"}', 4.8, 12000, 45),
(1, '华硕无畏16Pro 锐龙AI版', 4504.00, 5855.00, '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-57.png', '搭载AMD锐龙AI处理器，支持AI加速功能，适合创意设计和AI应用，性价比出众。', '{"brand": "华硕 (ASUS)", "model": "无畏16Pro 锐龙AI版", "processor": "AMD Ryzen AI 9-HX370", "graphics": "AMD Radeon 800M", "memory": "16GB LPDDR5", "storage": "512GB PCIe SSD", "screen": "16英寸 2.5K 144Hz IPS", "weight": "1.9kg"}', 4.5, 8000, 70);

-- 外设配件（分类ID=2）
(2, '机械键盘（红轴/RGB背光）', 299.00, 389.00, '../tupian/Snipaste_2026-06-13_16-59-18.png', '采用红轴设计，打字手感舒适，RGB背光支持多种灯光效果，多模连接适配各种场景。', '{"brand": "通用", "model": "机械键盘", "switch": "红轴", "backlight": "RGB", "keys": 87, "connection": "有线/2.4G/蓝牙"}', 4.7, 5000, 200),
(2, '无线鼠标（静音/可充电）', 89.00, 116.00, '../tupian/Snipaste_2026-06-13_16-51-27.png', '静音按键设计，深夜办公不打扰他人，可充电设计环保方便，人体工学造型长时间使用不累。', '{"brand": "通用", "model": "无线鼠标", "buttons": 6, "dpi": 4000, "battery": "6个月续航", "connection": "2.4G无线"}', 4.5, 8000, 350);

-- 插入评价数据
INSERT INTO reviews (product_id, user_id, user_name, rating, content, tags) VALUES
(1, NULL, '***王', 5, '电脑非常棒，性能强劲，运行游戏非常流畅！', '性能强,游戏流畅'),
(1, NULL, '***李', 4, '整体满意，屏幕显示效果很好，就是价格稍高。', '屏幕好,价格偏高'),
(1, NULL, '***张', 5, '物流超快，第二天就到了，电脑颜值很高，推荐购买！', '物流快,颜值高'),
(2, NULL, '***赵', 5, '天选7 Pro Max太强了，跑分超高，玩3A大作完全无压力！', '性能强,性价比高'),
(3, NULL, '***钱', 4, '轻薄本首选，OLED屏幕显示效果惊艳，适合办公使用。', '屏幕好,轻薄'),
(4, NULL, '***孙', 5, '拯救者系列一直很靠谱，这次入手R7000P很满意！', '品质好,服务好');

-- 插入测试用户
INSERT INTO users (username, password, email, phone) VALUES
('admin', 'admin123', 'admin@example.com', '13800138000'),
('testuser', 'test123', 'test@example.com', '13900139000');

-- 创建默认管理员会话测试数据
INSERT INTO cart (user_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1);
