"""
电商平台后端API - Flask应用程序
提供商品、分类、购物车、订单等RESTful API
"""

from flask import Flask, request, jsonify, send_from_directory  # type: ignore
# import pymysql  # 已注释掉，使用 mysql-connector-python 替代
import json
import math
import random
from datetime import datetime
import uuid
import os

# 尝试导入CORS，如果失败则继续
try:
    from flask_cors import CORS
    CORS_ENABLED = True
except ImportError:
    CORS_ENABLED = False
    print("警告: flask-cors未安装，跨域请求可能受限")

# 尝试导入MySQL，如果失败则使用模拟模式
MYSQL_ENABLED = False
try:
    import mysql.connector
    from mysql.connector import pooling, Error as MySQLError
    MYSQL_ENABLED = True
except ImportError:
    print("警告: mysql-connector-python未安装，将使用模拟数据模式")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'  # 生产环境请使用更安全的密钥

# Session配置
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1小时

# CORS配置
if CORS_ENABLED:
    CORS(app)

# 注册认证蓝图
try:
    from auth import auth_bp
    app.register_blueprint(auth_bp)
    print("认证模块已注册")
except Exception as e:
    print(f"认证模块注册失败: {e}")

# 注册地址管理蓝图
try:
    from address import address_bp
    app.register_blueprint(address_bp)
    print("地址管理模块已注册")
except Exception as e:
    print(f"地址管理模块注册失败: {e}")

# 注册用户数据管理蓝图
try:
    from user_data import user_data_bp
    app.register_blueprint(user_data_bp)
    print("用户数据管理模块已注册")
except Exception as e:
    print(f"用户数据管理模块注册失败: {e}")

# 数据库配置
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '#Smh3635473484*',  # 根据实际情况修改
    'database': 'ecommerce',
    'charset': 'utf8mb4'
}

# 创建数据库连接池
db_pool = None
if MYSQL_ENABLED:
    try:
        db_pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="ecommerce_pool",
            pool_size=5,
            **DB_CONFIG
        )
    except MySQLError as err:
        print(f"数据库连接池创建失败: {err}")
        MYSQL_ENABLED = False  # 数据库不可用，切换到模拟模式
        print("警告: 数据库不可用，将使用模拟数据模式")

def get_db_connection():
    """获取数据库连接"""
    if db_pool:
        try:
            return db_pool.get_connection()
        except MySQLError as err:
            print(f"获取数据库连接失败: {err}")
            return None
    return None

# 模拟数据（当数据库不可用时使用）
MOCK_PRODUCTS = [
    {"id": 1, "name": "惠普 HyperX 暗影精灵 PRO 16", "category": "电脑整机", "price": 8999, "original_price": 11699, "image": "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222013_80_1.jpg", "rating": 4.9, "review_count": 20000, "stock": 50, "description": "全新一代暗影精灵PRO系列，搭载Intel Core Ultra处理器，性能强劲，游戏体验出色。", "specs": {"brand": "惠普", "processor": "Intel Core Ultra7 255HX", "memory": "16GB DDR5", "storage": "1TB SSD", "screen": "16英寸 2.5K 240Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/1/lunbotu/微信视频2026-06-14_222054_475.mp4", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222013_80_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222014_81_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222015_82_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222016_83_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222017_84_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222018_85_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222019_86_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222013_80_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222014_81_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222015_82_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222016_83_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222017_84_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222018_85_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222019_86_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222019_87_1.jpg"]},
    {"id": 2, "name": "华硕天选7 Pro Max", "category": "电脑整机", "price": 14999, "original_price": 19499, "image": "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222753_92_1.jpg", "rating": 4.8, "review_count": 15000, "stock": 30, "description": "天选系列旗舰机型，AMD锐龙9处理器，炫酷外观设计，适合高端游戏玩家。", "specs": {"brand": "华硕", "processor": "AMD Ryzen 9 9955HX", "memory": "32GB DDR5", "storage": "2TB SSD", "screen": "16英寸 2.5K 240Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/2/lunbotu/微信视频2026-06-14_224050_705.mp4", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222755_95_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222750_89_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222751_90_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222752_91_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222755_95_1.jpg"]},
    {"id": 3, "name": "惠普星Book Pro 16 2025", "category": "电脑整机", "price": 5948, "original_price": 7732, "image": "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223038_103_1.jpg", "rating": 4.7, "review_count": 18000, "stock": 80, "description": "轻薄便携的生产力工具，OLED屏幕色彩鲜艳，适合办公和创作。", "specs": {"brand": "惠普", "processor": "Intel Core Ultra5 125H", "memory": "16GB DDR5", "storage": "512GB SSD", "screen": "16英寸 OLED 2.8K"}, "carousel_images": ["../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223038_103_1.jpg", "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223039_104_1.jpg", "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223040_105_1.jpg", "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223041_106_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223035_99_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223036_100_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223037_101_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223038_102_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223038_103_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223039_104_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223040_105_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223041_106_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223041_107_1.jpg"]},
    {"id": 4, "name": "联想拯救者 R7000P 2025", "category": "电脑整机", "price": 10188, "original_price": 13244, "image": "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223350_116_1.jpg", "rating": 4.9, "review_count": 25000, "stock": 60, "description": "拯救者系列经典游戏本，霜刃散热系统，性能释放强劲。", "specs": {"brand": "联想", "processor": "AMD Ryzen 9 8945HX", "memory": "16GB DDR5", "storage": "1TB SSD", "screen": "16英寸 2.5K 240Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/4/lunbotu/微信视频2026-06-14_224729_814.mp4", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223350_116_1.jpg", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223351_117_1.jpg", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223352_118_1.jpg", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223352_119_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223350_116_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223351_117_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223352_118_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223352_119_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223353_120_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223354_121_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223355_122_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223356_123_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223357_124_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223358_125_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223359_126_1.jpg"]},
    {"id": 5, "name": "小米 Redmi Book 16 焕新版", "category": "电脑整机", "price": 3599, "original_price": 4679, "image": "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223649_130_1.jpg", "rating": 4.6, "review_count": 30000, "stock": 100, "description": "高性价比轻薄本，2.5K高清屏幕，适合学生和办公人群。", "specs": {"brand": "小米", "processor": "Intel Core i5-13420H", "memory": "16GB DDR4", "storage": "512GB SSD", "screen": "16英寸 2.5K"}, "carousel_images": ["../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223649_130_1.jpg", "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223650_131_1.jpg", "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223651_132_1.jpg", "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223652_133_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223648_128_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223649_129_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223649_130_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223650_131_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223651_132_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223652_133_1.jpg"]},
    {"id": 6, "name": "华硕天选7 Pro 酷睿版", "category": "电脑整机", "price": 8999, "original_price": 11699, "image": "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222753_92_1.jpg", "rating": 4.8, "review_count": 12000, "stock": 45, "description": "天选7 Pro酷睿版本，Intel处理器，性能与颜值兼备。", "specs": {"brand": "华硕", "processor": "Intel Core Ultra7 251HX", "memory": "16GB DDR5", "storage": "1TB SSD", "screen": "16英寸 2.5K 165Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/6/lunbotu/微信视频2026-06-14_224050_705.mp4", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222755_95_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222750_89_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222751_90_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222752_91_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222755_95_1.jpg"]},
    {"id": 7, "name": "华硕无畏16Pro 锐龙AI版", "category": "电脑整机", "price": 4504, "original_price": 5855, "image": "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224019_139_1.jpg", "rating": 4.5, "review_count": 8000, "stock": 70, "description": "搭载AMD锐龙AI处理器，AI性能出色，适合创意工作。", "specs": {"brand": "华硕", "processor": "AMD Ryzen AI 9-HX370", "memory": "16GB LPDDR5", "storage": "512GB SSD", "screen": "16英寸 2.5K"}, "carousel_images": ["../tupian/shangpinxiangqing/7/lunbotu/微信视频2026-06-14_224414_769.mp4", "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224019_139_1.jpg", "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224020_140_1.jpg", "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224021_141_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224014_134_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224015_135_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224016_136_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224017_137_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224018_138_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224019_139_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224020_140_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224021_141_1.jpg"]},
    {"id": 8, "name": "机械键盘（红轴/RGB背光）", "category": "外设配件", "price": 299, "original_price": 389, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-38-56.png", "rating": 4.7, "review_count": 5000, "stock": 200, "description": "采用红轴设计，打字手感舒适，RGB背光支持多种灯光效果，多模连接适配各种场景。", "specs": {"switch": "红轴", "backlight": "RGB", "keys": 87, "connection": "有线/2.4G/蓝牙"}},
    {"id": 9, "name": "无线鼠标（静音/可充电）", "category": "外设配件", "price": 89, "original_price": 116, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-39-46.png", "rating": 4.5, "review_count": 8000, "stock": 350, "description": "静音按键设计，深夜办公不打扰他人，可充电设计环保方便，人体工学造型长时间使用不累。", "specs": {"buttons": 6, "dpi": 4000, "battery": "6个月续航", "connection": "2.4G无线"}},
    {"id": 10, "name": "27寸4K显示器（IPS/144Hz）", "category": "外设配件", "price": 1899, "original_price": 2469, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-40-06.png", "rating": 4.8, "review_count": 3000, "stock": 40, "description": "4K超清分辨率，144Hz高刷新率，IPS面板色彩精准，适合专业设计和游戏。", "specs": {"size": "27英寸", "resolution": "4K", "refresh": "144Hz", "panel": "IPS"}},
    {"id": 11, "name": "蓝牙音箱（便携/防水）", "category": "外设配件", "price": 199, "original_price": 259, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-40-54.png", "rating": 4.6, "review_count": 6000, "stock": 150, "description": "小巧便携，IPX7防水设计，户外使用无忧，音质出色续航持久。", "specs": {"bluetooth": "5.0", "waterproof": "IPX7", "battery": "12小时", "power": "20W"}},
    {"id": 12, "name": "USB扩展坞（Type-C/多口）", "category": "外设配件", "price": 129, "original_price": 168, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-41-06.png", "rating": 4.5, "review_count": 4000, "stock": 180, "description": "Type-C接口，支持多设备同时连接，高速传输，兼容Mac和Windows。", "specs": {"ports": "7合1", "usb": "USB3.0", "video": "4K@60Hz", "pd": "100W"}},
    {"id": 13, "name": "摄像头（1080P/自动对焦）", "category": "外设配件", "price": 159, "original_price": 207, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-41-28.png", "rating": 4.4, "review_count": 3500, "stock": 220, "description": "1080P高清画质，自动对焦功能，内置降噪麦克风，适合视频会议和直播。", "specs": {"resolution": "1080P", "focus": "自动", "microphone": "内置", "frame": "30fps"}},
    {"id": 14, "name": "电竞椅（人体工学/可躺）", "category": "外设配件", "price": 699, "original_price": 909, "image": "../tupian/shangpin/waishe/Snipaste_2026-06-14_16-41-43.png", "rating": 4.7, "review_count": 2000, "stock": 50, "description": "人体工学设计，支持180度平躺，可调节扶手和腰枕，久坐不累。", "specs": {"material": "PU皮革", "recline": "180度", "weight": "150kg", "wheels": "静音"}},
    {"id": 15, "name": "连衣裙（碎花/中长款）", "category": "女装", "price": 199, "original_price": 259, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-46-26.png", "rating": 4.6, "review_count": 8000, "stock": 120, "description": "清新碎花设计，中长款版型，收腰显瘦，适合春夏季节穿着。", "specs": {"material": "棉混纺", "length": "中长款", "style": "碎花", "size": "S/M/L/XL"}},
    {"id": 16, "name": "T恤（纯棉/基础款）", "category": "女装", "price": 59, "original_price": 77, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-46-45.png", "rating": 4.5, "review_count": 15000, "stock": 300, "description": "100%纯棉面料，柔软舒适，基础版型百搭，多色可选。", "specs": {"material": "100%棉", "style": "基础款", "color": "多色", "size": "XS/S/M/L/XL"}},
    {"id": 17, "name": "牛仔裤（高腰/直筒）", "category": "女装", "price": 159, "original_price": 207, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-46-58.png", "rating": 4.7, "review_count": 6000, "stock": 150, "description": "高腰设计显腿长，直筒版型显瘦，弹力面料舒适不紧绷。", "specs": {"material": "牛仔布", "style": "高腰直筒", "wash": "中洗水", "size": "25-32"}},
    {"id": 18, "name": "针织开衫（宽松/春秋款）", "category": "女装", "price": 129, "original_price": 168, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-09.png", "rating": 4.5, "review_count": 7000, "stock": 100, "description": "宽松版型，柔软针织面料，春秋季节必备单品，百搭时尚。", "specs": {"material": "针织", "style": "宽松", "season": "春秋", "size": "均码"}},
    {"id": 19, "name": "卫衣（连帽/加绒）", "category": "女装", "price": 179, "original_price": 233, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-19.png", "rating": 4.6, "review_count": 9000, "stock": 130, "description": "加绒内里保暖舒适，连帽设计时尚休闲，宽松版型适合各种身材。", "specs": {"material": "加绒棉", "style": "连帽", "season": "秋冬", "size": "S/M/L/XL"}},
    {"id": 20, "name": "风衣（中长款/英伦风）", "category": "女装", "price": 299, "original_price": 389, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-30.png", "rating": 4.7, "review_count": 5000, "stock": 80, "description": "经典英伦风格，中长款设计显气质，双排扣设计复古优雅。", "specs": {"material": "风衣面料", "length": "中长款", "style": "英伦风", "size": "S/M/L/XL"}},
    {"id": 21, "name": "羽绒服（轻薄/保暖）", "category": "女装", "price": 399, "original_price": 519, "image": "../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-54.png", "rating": 4.8, "review_count": 4000, "stock": 60, "description": "轻薄设计不臃肿，90%白鸭绒填充保暖性强，多色可选。", "specs": {"material": "聚酯纤维", "filling": "90%白鸭绒", "season": "冬季", "size": "S/M/L/XL"}},
    {"id": 22, "name": "短袖T恤（纯棉/印花）", "category": "男装", "price": 79, "original_price": 103, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-49-01.png", "rating": 4.5, "review_count": 12000, "stock": 250, "description": "100%纯棉面料，印花图案时尚潮流，舒适透气适合日常穿着。", "specs": {"material": "100%棉", "style": "印花", "season": "春夏", "size": "M/L/XL/XXL"}},
    {"id": 23, "name": "休闲裤（修身/直筒）", "category": "男装", "price": 149, "original_price": 194, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-49-16.png", "rating": 4.6, "review_count": 8000, "stock": 160, "description": "修身版型显瘦，直筒设计百搭，舒适面料适合商务休闲。", "specs": {"material": "棉混纺", "style": "修身直筒", "occasion": "商务休闲", "size": "28-36"}},
    {"id": 24, "name": "衬衫（长袖/商务）", "category": "男装", "price": 199, "original_price": 259, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-49-25.png", "rating": 4.7, "review_count": 6000, "stock": 120, "description": "商务休闲两相宜，免烫面料易打理，多色可选适合各种场合。", "specs": {"material": "棉混纺", "style": "长袖", "occasion": "商务", "size": "M/L/XL/XXL"}},
    {"id": 25, "name": "夹克（休闲/春秋）", "category": "男装", "price": 269, "original_price": 350, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-49-33.png", "rating": 4.6, "review_count": 5000, "stock": 100, "description": "休闲版型，防风面料，春秋季节必备，多口袋设计实用。", "specs": {"material": "聚酯纤维", "style": "休闲", "season": "春秋", "size": "M/L/XL/XXL"}},
    {"id": 26, "name": "卫衣（圆领/简约）", "category": "男装", "price": 159, "original_price": 207, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-49-48.png", "rating": 4.5, "review_count": 7000, "stock": 140, "description": "简约圆领设计，加绒内里保暖舒适，日常穿搭百搭。", "specs": {"material": "加绒棉", "style": "圆领", "season": "秋冬", "size": "M/L/XL/XXL"}},
    {"id": 27, "name": "牛仔裤（直筒/经典）", "category": "男装", "price": 179, "original_price": 233, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-49-56.png", "rating": 4.7, "review_count": 9000, "stock": 180, "description": "经典直筒版型，耐磨牛仔布，百搭款式适合各种场合。", "specs": {"material": "牛仔布", "style": "直筒", "wash": "经典洗水", "size": "28-36"}},
    {"id": 28, "name": "羽绒服（加厚/保暖）", "category": "男装", "price": 459, "original_price": 597, "image": "../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-50-10.png", "rating": 4.8, "review_count": 4000, "stock": 70, "description": "加厚设计保暖性强，防风面料，连帽设计时尚实用。", "specs": {"material": "聚酯纤维", "filling": "90%白鸭绒", "season": "冬季", "size": "M/L/XL/XXL"}},
    {"id": 29, "name": "运动鞋（跑步/轻便）", "category": "鞋靴", "price": 299, "original_price": 389, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-51-20.png", "rating": 4.7, "review_count": 8000, "stock": 150, "description": "轻便舒适，缓震鞋底适合跑步运动，透气网面设计。", "specs": {"material": "网面", "sole": "橡胶", "purpose": "跑步", "size": "39-45"}},
    {"id": 30, "name": "皮鞋（商务/真皮）", "category": "鞋靴", "price": 399, "original_price": 519, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-51-36.png", "rating": 4.8, "review_count": 5000, "stock": 100, "description": "头层牛皮材质，经典商务款式，舒适透气适合正装场合。", "specs": {"material": "头层牛皮", "style": "商务", "sole": "橡胶", "size": "38-44"}},
    {"id": 31, "name": "休闲鞋（板鞋/潮流）", "category": "鞋靴", "price": 199, "original_price": 259, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-51-46.png", "rating": 4.6, "review_count": 10000, "stock": 200, "description": "潮流板鞋设计，帆布材质舒适透气，百搭款式。", "specs": {"material": "帆布", "style": "板鞋", "sole": "橡胶", "size": "38-45"}},
    {"id": 32, "name": "高跟鞋（细跟/优雅）", "category": "鞋靴", "price": 259, "original_price": 337, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-52-00.png", "rating": 4.5, "review_count": 6000, "stock": 120, "description": "细跟设计显气质，优雅百搭，适合各种场合。", "specs": {"material": "PU", "heel": "细跟", "height": "8cm", "size": "34-40"}},
    {"id": 33, "name": "雪地靴（保暖/加厚）", "category": "鞋靴", "price": 199, "original_price": 259, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-52-13.png", "rating": 4.7, "review_count": 4000, "stock": 80, "description": "加绒内里保暖舒适，防滑鞋底适合冬季穿着。", "specs": {"material": "绒面", "lining": "加绒", "sole": "防滑", "size": "35-43"}},
    {"id": 34, "name": "凉鞋（平底/休闲）", "category": "鞋靴", "price": 129, "original_price": 168, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-52-26.png", "rating": 4.4, "review_count": 7000, "stock": 160, "description": "平底舒适，透气设计适合夏季穿着，简约百搭。", "specs": {"material": "PU", "style": "平底", "season": "夏季", "size": "35-41"}},
    {"id": 35, "name": "拖鞋（居家/防滑）", "category": "鞋靴", "price": 39, "original_price": 51, "image": "../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-52-40.png", "rating": 4.5, "review_count": 15000, "stock": 300, "description": "居家必备，防滑底设计安全舒适，柔软材质。", "specs": {"material": "EVA", "style": "居家", "sole": "防滑", "size": "36-45"}},
    {"id": 36, "name": "沙发（布艺/三人座）", "category": "家居", "price": 1999, "original_price": 2599, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-53-56.png", "rating": 4.7, "review_count": 3000, "stock": 30, "description": "布艺材质舒适透气，三人座设计适合家庭使用，多色可选。", "specs": {"material": "布艺", "seats": "三人座", "style": "现代简约", "color": "多色"}},
    {"id": 37, "name": "餐桌（实木/圆形）", "category": "家居", "price": 899, "original_price": 1169, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-08.png", "rating": 4.6, "review_count": 2000, "stock": 40, "description": "实木材质环保健康，圆形设计节省空间，适合小户型。", "specs": {"material": "实木", "shape": "圆形", "seats": "4人", "diameter": "90cm"}},
    {"id": 38, "name": "床（实木/1.8米）", "category": "家居", "price": 1599, "original_price": 2079, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-23.png", "rating": 4.8, "review_count": 2500, "stock": 25, "description": "实木床架坚固耐用，1.8米大床舒适宽敞，简约设计。", "specs": {"material": "实木", "size": "1.8米", "style": "简约", "weight": "150kg"}},
    {"id": 39, "name": "书架（简约/多层）", "category": "家居", "price": 499, "original_price": 649, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-36.png", "rating": 4.5, "review_count": 3500, "stock": 60, "description": "多层设计收纳空间大，简约风格百搭，稳固耐用。", "specs": {"material": "木质", "shelves": "5层", "style": "简约", "weight": "30kg"}},
    {"id": 40, "name": "衣柜（推拉门/大容量）", "category": "家居", "price": 1299, "original_price": 1689, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-48.png", "rating": 4.6, "review_count": 2000, "stock": 35, "description": "推拉门设计节省空间，大容量收纳，多色可选。", "specs": {"material": "木质", "doors": "推拉门", "capacity": "大容量", "color": "多色"}},
    {"id": 41, "name": "台灯（护眼/LED）", "category": "家居", "price": 99, "original_price": 129, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-55-00.png", "rating": 4.6, "review_count": 6000, "stock": 180, "description": "LED护眼灯，多档调光，无频闪保护视力。", "specs": {"type": "LED", "dimming": "多档", "power": "12W", "color": "暖白光"}},
    {"id": 42, "name": "地毯（北欧风/防滑）", "category": "家居", "price": 199, "original_price": 259, "image": "../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-55-13.png", "rating": 4.5, "review_count": 4000, "stock": 100, "description": "北欧风格简约时尚，防滑底设计，柔软舒适。", "specs": {"material": "涤纶", "style": "北欧风", "size": "1.6x2.3m", "backing": "防滑"}},
    {"id": 43, "name": "床单（纯棉/印花）", "category": "家纺", "price": 89, "original_price": 116, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-56-30.png", "rating": 4.6, "review_count": 7000, "stock": 200, "description": "100%纯棉面料，印花图案时尚，柔软舒适亲肤。", "specs": {"material": "100%棉", "style": "印花", "size": "1.8米床", "color": "多色"}},
    {"id": 44, "name": "被子（冬被/加厚）", "category": "家纺", "price": 199, "original_price": 259, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-56-45.png", "rating": 4.7, "review_count": 5000, "stock": 120, "description": "加厚保暖冬被，透气舒适，四季可用。", "specs": {"material": "聚酯纤维", "filling": "丝绵", "season": "冬季", "weight": "4kg"}},
    {"id": 45, "name": "枕头（记忆棉/护颈）", "category": "家纺", "price": 129, "original_price": 168, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-56-57.png", "rating": 4.8, "review_count": 8000, "stock": 150, "description": "记忆棉材质，护颈设计，缓解颈椎压力。", "specs": {"material": "记忆棉", "height": "可调", "cover": "可拆洗", "firmness": "中软"}},
    {"id": 46, "name": "四件套（纯棉/简约）", "category": "家纺", "price": 299, "original_price": 389, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-15.png", "rating": 4.7, "review_count": 4000, "stock": 80, "description": "纯棉四件套，简约设计，亲肤舒适。", "specs": {"material": "100%棉", "pieces": "4件", "style": "简约", "size": "1.8米床"}},
    {"id": 47, "name": "毛巾（纯棉/吸水）", "category": "家纺", "price": 29, "original_price": 38, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-28.png", "rating": 4.5, "review_count": 12000, "stock": 350, "description": "纯棉材质，吸水快干，柔软舒适。", "specs": {"material": "100%棉", "size": "34x75cm", "weight": "100g", "color": "多色"}},
    {"id": 48, "name": "窗帘（遮光/简约）", "category": "家纺", "price": 159, "original_price": 207, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-41.png", "rating": 4.6, "review_count": 3000, "stock": 100, "description": "遮光效果好，简约设计百搭，多色可选。", "specs": {"material": "涤纶", "function": "遮光", "style": "简约", "width": "2米"}},
    {"id": 49, "name": "空调被（夏凉被/薄款）", "category": "家纺", "price": 99, "original_price": 129, "image": "../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-55.png", "rating": 4.5, "review_count": 6000, "stock": 180, "description": "轻薄透气夏凉被，适合空调房使用，柔软舒适。", "specs": {"material": "聚酯纤维", "season": "夏季", "weight": "1.5kg", "color": "多色"}},
    {"id": 50, "name": "苹果（红富士/新鲜）", "category": "水果", "price": 29, "original_price": 38, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-01-10.png", "rating": 4.8, "review_count": 15000, "stock": 500, "description": "新鲜红富士苹果，脆甜多汁，产地直发。", "specs": {"variety": "红富士", "origin": "陕西", "weight": "5斤装", "season": "秋季"}},
    {"id": 51, "name": "香蕉（进口/香甜）", "category": "水果", "price": 19, "original_price": 25, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-01-24.png", "rating": 4.6, "review_count": 12000, "stock": 400, "description": "进口香蕉，香甜软糯，富含钾元素。", "specs": {"variety": "进口香蕉", "origin": "菲律宾", "weight": "2斤装", "ripeness": "7成熟"}},
    {"id": 52, "name": "葡萄（巨峰/无籽）", "category": "水果", "price": 39, "original_price": 51, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-01-37.png", "rating": 4.7, "review_count": 8000, "stock": 300, "description": "巨峰葡萄，无籽多汁，酸甜可口。", "specs": {"variety": "巨峰", "origin": "山东", "weight": "3斤装", "seedless": "无籽"}},
    {"id": 53, "name": "橙子（赣南脐橙/新鲜）", "category": "水果", "price": 29, "original_price": 38, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-01-51.png", "rating": 4.8, "review_count": 10000, "stock": 450, "description": "赣南脐橙，皮薄多汁，酸甜适中。", "specs": {"variety": "赣南脐橙", "origin": "江西", "weight": "5斤装", "season": "冬季"}},
    {"id": 54, "name": "草莓（丹东99/新鲜）", "category": "水果", "price": 59, "original_price": 77, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-02-03.png", "rating": 4.9, "review_count": 6000, "stock": 200, "description": "丹东99草莓，香甜多汁，果肉饱满。", "specs": {"variety": "丹东99", "origin": "辽宁", "weight": "2斤装", "season": "春季"}},
    {"id": 55, "name": "西瓜（麒麟瓜/甜脆）", "category": "水果", "price": 49, "original_price": 64, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-02-16.png", "rating": 4.7, "review_count": 7000, "stock": 150, "description": "麒麟西瓜，皮薄肉厚，甜脆可口。", "specs": {"variety": "麒麟瓜", "origin": "海南", "weight": "约5斤", "season": "夏季"}},
    {"id": 56, "name": "芒果（贵妃芒/香甜）", "category": "水果", "price": 39, "original_price": 51, "image": "../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-02-31.png", "rating": 4.8, "review_count": 9000, "stock": 350, "description": "贵妃芒，果肉细腻，香甜多汁。", "specs": {"variety": "贵妃芒", "origin": "海南", "weight": "3斤装", "season": "夏季"}},
    {"id": 57, "name": "猪肉（五花肉/新鲜）", "category": "肉类", "price": 39, "original_price": 51, "image": "../tupian/shangpin/roulei/Snipaste_2026-06-14_17-03-30.png", "rating": 4.6, "review_count": 8000, "stock": 250, "description": "新鲜五花肉，肥瘦相间，适合红烧炖煮。", "specs": {"cut": "五花肉", "origin": "本地", "weight": "1斤装", "freshness": "当日鲜"}},
    {"id": 58, "name": "牛肉（牛腩/新鲜）", "category": "肉类", "price": 59, "original_price": 77, "image": "../tupian/shangpin/roulei/Snipaste_2026-06-14_17-03-46.png", "rating": 4.7, "review_count": 6000, "stock": 180, "description": "新鲜牛腩，肉质鲜嫩，适合红烧炖煮。", "specs": {"cut": "牛腩", "origin": "内蒙古", "weight": "1斤装", "grade": "A"}},
    {"id": 59, "name": "鸡肉（鸡胸肉/新鲜）", "category": "肉类", "price": 29, "original_price": 38, "image": "../tupian/shangpin/roulei/Snipaste_2026-06-14_17-03-58.png", "rating": 4.6, "review_count": 9000, "stock": 300, "description": "新鲜鸡胸肉，低脂高蛋白，适合健身人群。", "specs": {"cut": "鸡胸肉", "origin": "本地", "weight": "1斤装", "protein": "高"}},
    {"id": 60, "name": "羊肉（羊腿肉/新鲜）", "category": "肉类", "price": 69, "original_price": 90, "image": "../tupian/shangpin/roulei/Snipaste_2026-06-14_17-04-11.png", "rating": 4.7, "review_count": 5000, "stock": 150, "description": "新鲜羊腿肉，肉质鲜嫩，适合烧烤炖煮。", "specs": {"cut": "羊腿肉", "origin": "内蒙古", "weight": "1斤装", "grade": "A"}},
    {"id": 61, "name": "鱼肉（三文鱼/进口）", "category": "肉类", "price": 79, "original_price": 103, "image": "../tupian/shangpin/roulei/Snipaste_2026-06-14_17-04-24.png", "rating": 4.8, "review_count": 4000, "stock": 100, "description": "进口三文鱼，肉质细腻，富含Omega-3。", "specs": {"cut": "三文鱼", "origin": "挪威", "weight": "200g", "freshness": "冷冻"}},
    {"id": 62, "name": "排骨（猪肋排/新鲜）", "category": "肉类", "price": 49, "original_price": 64, "image": "../tupian/shangpin/roulei/Snipaste_2026-06-14_17-04-40.png", "rating": 4.6, "review_count": 7000, "stock": 200, "description": "新鲜猪肋排，肉质鲜嫩，适合红烧糖醋。", "specs": {"cut": "猪肋排", "origin": "本地", "weight": "1斤装", "freshness": "当日鲜"}},
    {"id": 63, "name": "薯片（原味/大包装）", "category": "零食", "price": 19, "original_price": 25, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-05-30.png", "rating": 4.5, "review_count": 15000, "stock": 400, "description": "原味薯片，酥脆可口，大包装实惠。", "specs": {"flavor": "原味", "weight": "100g", "packaging": "袋装", "brand": "乐事"}},
    {"id": 64, "name": "巧克力（黑巧克力/进口）", "category": "零食", "price": 39, "original_price": 51, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-05-44.png", "rating": 4.7, "review_count": 8000, "stock": 250, "description": "进口黑巧克力，可可含量70%，丝滑细腻。", "specs": {"flavor": "黑巧克力", "cocoa": "70%", "weight": "100g", "origin": "比利时"}},
    {"id": 65, "name": "坚果礼盒（混合/精选）", "category": "零食", "price": 89, "original_price": 116, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-05-58.png", "rating": 4.8, "review_count": 6000, "stock": 180, "description": "精选混合坚果，营养丰富，适合送礼。", "specs": {"contents": "核桃/杏仁/腰果/榛子", "weight": "500g", "packaging": "礼盒", "shelf": "6个月"}},
    {"id": 66, "name": "饼干（曲奇/黄油味）", "category": "零食", "price": 29, "original_price": 38, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-06-11.png", "rating": 4.6, "review_count": 10000, "stock": 300, "description": "黄油曲奇饼干，奶香浓郁，口感酥脆。", "specs": {"flavor": "黄油味", "weight": "200g", "packaging": "盒装", "brand": "丹麦蓝罐"}},
    {"id": 67, "name": "糖果（水果硬糖/混合）", "category": "零食", "price": 15, "original_price": 20, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-06-25.png", "rating": 4.4, "review_count": 12000, "stock": 450, "description": "混合水果硬糖，多种口味，酸甜可口。", "specs": {"flavors": "草莓/橙子/葡萄/柠檬", "weight": "100g", "packaging": "袋装", "brand": "不二家"}},
    {"id": 68, "name": "辣条（麻辣/大包装）", "category": "零食", "price": 12, "original_price": 16, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-06-38.png", "rating": 4.5, "review_count": 18000, "stock": 500, "description": "麻辣辣条，香辣可口，童年回忆。", "specs": {"flavor": "麻辣", "weight": "100g", "packaging": "袋装", "brand": "卫龙"}},
    {"id": 69, "name": "方便面（红烧牛肉面/5连包）", "category": "零食", "price": 15, "original_price": 20, "image": "../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-06-51.png", "rating": 4.5, "review_count": 20000, "stock": 550, "description": "经典红烧牛肉面，5连包装，方便快捷。", "specs": {"flavor": "红烧牛肉", "packs": "5连包", "weight": "85g*5", "brand": "康师傅"}},
    {"id": 70, "name": "洗面奶（氨基酸/温和）", "category": "护肤", "price": 59, "original_price": 77, "image": "../tupian/shangpin/hufu/Snipaste_2026-06-14_17-07-50.png", "rating": 4.7, "review_count": 10000, "stock": 200, "description": "氨基酸洗面奶，温和不刺激，深层清洁。", "specs": {"type": "氨基酸", "suit": "敏感肌", "capacity": "150ml", "brand": "芙丽芳丝"}},
    {"id": 71, "name": "面膜（补水/玻尿酸）", "category": "护肤", "price": 69, "original_price": 90, "image": "../tupian/shangpin/hufu/Snipaste_2026-06-14_17-08-03.png", "rating": 4.6, "review_count": 8000, "stock": 180, "description": "玻尿酸补水面膜，深层补水，滋润肌肤。", "specs": {"type": "补水", "ingredient": "玻尿酸", "pieces": "10片", "brand": "春雨"}},
    {"id": 72, "name": "乳液（保湿/清爽）", "category": "护肤", "price": 89, "original_price": 116, "image": "../tupian/shangpin/hufu/Snipaste_2026-06-14_17-08-17.png", "rating": 4.7, "review_count": 7000, "stock": 150, "description": "保湿乳液，质地清爽不油腻，适合夏季使用。", "specs": {"type": "保湿", "texture": "清爽", "capacity": "100ml", "brand": "珂润"}},
    {"id": 73, "name": "面霜（滋润/晚霜）", "category": "护肤", "price": 129, "original_price": 168, "image": "../tupian/shangpin/hufu/Snipaste_2026-06-14_17-08-30.png", "rating": 4.8, "review_count": 5000, "stock": 100, "description": "滋润晚霜，夜间修护，深层滋养肌肤。", "specs": {"type": "晚霜", "function": "修护", "capacity": "50ml", "brand": "兰蔻"}},
    {"id": 74, "name": "精华液（抗老/玻尿酸）", "category": "护肤", "price": 199, "original_price": 259, "image": "../tupian/shangpin/hufu/Snipaste_2026-06-14_17-08-46.png", "rating": 4.9, "review_count": 4000, "stock": 80, "description": "抗老精华液，玻尿酸配方，紧致肌肤。", "specs": {"type": "精华液", "function": "抗老", "capacity": "30ml", "brand": "雅诗兰黛"}},
    {"id": 75, "name": "防晒霜（SPF50+/防水）", "category": "护肤", "price": 79, "original_price": 103, "image": "../tupian/shangpin/hufu/Snipaste_2026-06-14_17-09-00.png", "rating": 4.6, "review_count": 9000, "stock": 160, "description": "SPF50+高倍防晒，防水防汗，适合户外使用。", "specs": {"spf": "SPF50+", "pa": "PA+++", "waterproof": "防水", "capacity": "50ml"}},
    {"id": 76, "name": "口红（哑光/正红色）", "category": "彩妆", "price": 129, "original_price": 168, "image": "../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-10-03.png", "rating": 4.8, "review_count": 6000, "stock": 120, "description": "哑光口红，正红色显白，持久不脱色。", "specs": {"type": "哑光", "color": "正红色", "brand": "MAC", "shade": "Chili"}},
    {"id": 77, "name": "眼影盘（大地色/日常）", "category": "彩妆", "price": 89, "original_price": 116, "image": "../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-10-16.png", "rating": 4.7, "review_count": 5000, "stock": 100, "description": "大地色眼影盘，日常百搭，粉质细腻。", "specs": {"colors": "16色", "type": "大地色", "finish": "哑光/珠光", "brand": "完美日记"}},
    {"id": 78, "name": "粉底液（遮瑕/持久）", "category": "彩妆", "price": 159, "original_price": 207, "image": "../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-10-30.png", "rating": 4.7, "review_count": 4000, "stock": 80, "description": "高遮瑕粉底液，持久不脱妆，适合各种肤质。", "specs": {"type": "粉底液", "coverage": "高遮瑕", "finish": "哑光", "brand": "雅诗兰黛"}},
    {"id": 79, "name": "眉笔（防水/双头）", "category": "彩妆", "price": 49, "original_price": 64, "image": "../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-10-44.png", "rating": 4.6, "review_count": 7000, "stock": 140, "description": "防水眉笔，双头设计，易上色不脱色。", "specs": {"type": "眉笔", "waterproof": "防水", "color": "深棕/浅棕", "brand": "卡其色彩"}},
    {"id": 80, "name": "睫毛膏（纤长/浓密）", "category": "彩妆", "price": 59, "original_price": 77, "image": "../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-10-57.png", "rating": 4.5, "review_count": 6000, "stock": 120, "description": "纤长浓密睫毛膏，卷翘持久，防水不晕染。", "specs": {"type": "睫毛膏", "effect": "纤长浓密", "waterproof": "防水", "brand": "美宝莲"}},
    {"id": 81, "name": "腮红（自然/蜜桃色）", "category": "彩妆", "price": 69, "original_price": 90, "image": "../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-11-10.png", "rating": 4.6, "review_count": 5000, "stock": 100, "description": "自然蜜桃色腮红，粉质细腻，显气色。", "specs": {"type": "腮红", "color": "蜜桃色", "finish": "哑光/珠光", "brand": "NARS"}},
    {"id": 82, "name": "篮球（室内外/标准）", "category": "运动", "price": 129, "original_price": 168, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-12-06.png", "rating": 4.7, "review_count": 4000, "stock": 80, "description": "标准篮球，室内外通用，耐磨防滑。", "specs": {"type": "篮球", "size": "7号", "material": "PU", "use": "室内外"}},
    {"id": 83, "name": "瑜伽垫（防滑/环保）", "category": "运动", "price": 89, "original_price": 116, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-12-19.png", "rating": 4.6, "review_count": 6000, "stock": 120, "description": "环保瑜伽垫，防滑耐用，厚度适中。", "specs": {"type": "瑜伽垫", "material": "TPE", "thickness": "6mm", "color": "多色"}},
    {"id": 84, "name": "跑步鞋（轻便/减震）", "category": "运动", "price": 299, "original_price": 389, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-12-32.png", "rating": 4.8, "review_count": 5000, "stock": 100, "description": "轻便跑步鞋，减震设计，适合日常慢跑。", "specs": {"type": "跑步鞋", "sole": "气垫", "weight": "轻便", "size": "36-45"}},
    {"id": 85, "name": "运动服套装（速干/透气）", "category": "运动", "price": 199, "original_price": 259, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-12-45.png", "rating": 4.6, "review_count": 4000, "stock": 90, "description": "速干运动套装，透气舒适，适合健身运动。", "specs": {"type": "套装", "material": "速干面料", "pieces": "2件", "size": "S/M/L/XL"}},
    {"id": 86, "name": "哑铃（可调节/家用）", "category": "运动", "price": 199, "original_price": 259, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-12-58.png", "rating": 4.5, "review_count": 3000, "stock": 70, "description": "可调节哑铃，家用健身必备，安全稳固。", "specs": {"type": "哑铃", "weight": "20kg", "adjustable": "可调节", "material": "铸铁"}},
    {"id": 87, "name": "羽毛球拍（碳素/轻量）", "category": "运动", "price": 159, "original_price": 207, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-13-11.png", "rating": 4.7, "review_count": 3500, "stock": 85, "description": "碳素羽毛球拍，轻量耐用，适合业余爱好者。", "specs": {"type": "羽毛球拍", "material": "碳素", "weight": "80g", "brand": "尤尼克斯"}},
    {"id": 88, "name": "游泳镜（防雾/高清）", "category": "运动", "price": 69, "original_price": 90, "image": "../tupian/shangpin/yundong/Snipaste_2026-06-14_17-13-24.png", "rating": 4.6, "review_count": 5000, "stock": 150, "description": "防雾游泳镜，高清视野，舒适不漏水。", "specs": {"type": "游泳镜", "anti-fog": "防雾", "vision": "高清", "color": "多色"}},
    {"id": 89, "name": "帐篷（户外/双人）", "category": "户外装备", "price": 299, "original_price": 389, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-14-21.png", "rating": 4.7, "review_count": 3000, "stock": 60, "description": "户外双人帐篷，防风防雨，搭建便捷。", "specs": {"type": "帐篷", "capacity": "双人", "material": "防水布", "season": "四季"}},
    {"id": 90, "name": "背包（户外/大容量）", "category": "户外装备", "price": 199, "original_price": 259, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-14-34.png", "rating": 4.6, "review_count": 4000, "stock": 80, "description": "大容量户外背包，多功能分区，舒适背负。", "specs": {"type": "背包", "capacity": "40L", "material": "尼龙", "waterproof": "防水"}},
    {"id": 91, "name": "睡袋（户外/保暖）", "category": "户外装备", "price": 149, "original_price": 194, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-14-47.png", "rating": 4.6, "review_count": 2500, "stock": 50, "description": "户外保暖睡袋，轻便易携带，适合露营。", "specs": {"type": "睡袋", "temperature": "0度", "material": "羽绒棉", "weight": "1.5kg"}},
    {"id": 92, "name": "登山杖（碳纤维/轻便）", "category": "户外装备", "price": 99, "original_price": 129, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-15-02.png", "rating": 4.5, "review_count": 3000, "stock": 100, "description": "碳纤维登山杖，轻便坚固，减震设计。", "specs": {"type": "登山杖", "material": "碳纤维", "adjustable": "可调节", "weight": "200g"}},
    {"id": 93, "name": "户外水壶（不锈钢/保温）", "category": "户外装备", "price": 79, "original_price": 103, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-15-16.png", "rating": 4.5, "review_count": 5000, "stock": 150, "description": "不锈钢保温水壶，大容量，保温持久。", "specs": {"type": "水壶", "material": "不锈钢", "capacity": "1L", "insulation": "24小时"}},
    {"id": 94, "name": "户外炉具（便携/防风）", "category": "户外装备", "price": 129, "original_price": 168, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-15-29.png", "rating": 4.6, "review_count": 2000, "stock": 60, "description": "便携户外炉具，防风设计，高效燃烧。", "specs": {"type": "炉具", "fuel": "气罐", "weight": "300g", "power": "3000W"}},
    {"id": 95, "name": "户外灯（露营/LED）", "category": "户外装备", "price": 59, "original_price": 77, "image": "../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-15-43.png", "rating": 4.5, "review_count": 4000, "stock": 120, "description": "LED露营灯，多档调光，续航持久。", "specs": {"type": "露营灯", "type": "LED", "battery": "可充电", "lumens": "500lm"}},
    {"id": 96, "name": "图书（小说/经典）", "category": "图书", "price": 39, "original_price": 51, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-16-33.png", "rating": 4.8, "review_count": 8000, "stock": 200, "description": "经典文学小说，精装版，值得收藏。", "specs": {"type": "小说", "binding": "精装", "pages": "300", "language": "中文"}},
    {"id": 97, "name": "图书（科普/百科）", "category": "图书", "price": 59, "original_price": 77, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-16-46.png", "rating": 4.7, "review_count": 5000, "stock": 150, "description": "科普百科全书，图文并茂，适合全家阅读。", "specs": {"type": "科普", "binding": "平装", "pages": "400", "language": "中文"}},
    {"id": 98, "name": "图书（儿童绘本/启蒙）", "category": "图书", "price": 29, "original_price": 38, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-16-58.png", "rating": 4.8, "review_count": 6000, "stock": 250, "description": "儿童启蒙绘本，色彩丰富，适合3-6岁儿童。", "specs": {"type": "绘本", "binding": "精装", "pages": "48", "age": "3-6岁"}},
    {"id": 99, "name": "图书（教材/教辅）", "category": "图书", "price": 49, "original_price": 64, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-17-11.png", "rating": 4.6, "review_count": 7000, "stock": 180, "description": "中小学教辅教材，知识点全面，讲解清晰。", "specs": {"type": "教辅", "binding": "平装", "grade": "初中", "subject": "数学"}},
    {"id": 100, "name": "图书（历史/传记）", "category": "图书", "price": 45, "original_price": 59, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-17-25.png", "rating": 4.7, "review_count": 4000, "stock": 120, "description": "历史人物传记，内容详实，引人入胜。", "specs": {"type": "传记", "binding": "平装", "pages": "280", "language": "中文"}},
    {"id": 101, "name": "图书（励志/成功）", "category": "图书", "price": 35, "original_price": 46, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-17-38.png", "rating": 4.5, "review_count": 5000, "stock": 150, "description": "励志成功书籍，激励人生，启发思考。", "specs": {"type": "励志", "binding": "平装", "pages": "200", "language": "中文"}},
    {"id": 102, "name": "图书（漫画/动漫）", "category": "图书", "price": 25, "original_price": 33, "image": "../tupian/shangpin/tushu/Snipaste_2026-06-14_17-17-51.png", "rating": 4.7, "review_count": 9000, "stock": 220, "description": "热门漫画连载，画面精美，情节精彩。", "specs": {"type": "漫画", "binding": "平装", "volume": "第1卷", "language": "中文"}},
    {"id": 103, "name": "玩具（益智/积木）", "category": "玩具", "price": 89, "original_price": 116, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-06.png", "rating": 4.7, "review_count": 6000, "stock": 150, "description": "益智积木玩具，锻炼动手能力，激发创造力。", "specs": {"type": "积木", "material": "塑料", "pieces": "200+", "age": "3-12岁"}},
    {"id": 104, "name": "玩具（遥控车/四驱）", "category": "玩具", "price": 129, "original_price": 168, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-19.png", "rating": 4.6, "review_count": 4000, "stock": 100, "description": "四驱遥控车，高速行驶，操控灵敏。", "specs": {"type": "遥控车", "power": "充电", "speed": "30km/h", "age": "6+"}},
    {"id": 105, "name": "玩具（玩偶/毛绒）", "category": "玩具", "price": 49, "original_price": 64, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-32.png", "rating": 4.8, "review_count": 8000, "stock": 200, "description": "可爱毛绒玩偶，柔软舒适，适合陪伴。", "specs": {"type": "毛绒", "material": "毛绒", "size": "30cm", "age": "3+"}},
    {"id": 106, "name": "玩具（拼图/益智）", "category": "玩具", "price": 39, "original_price": 51, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-45.png", "rating": 4.6, "review_count": 5000, "stock": 180, "description": "益智拼图玩具，培养专注力，锻炼思维。", "specs": {"type": "拼图", "pieces": "500", "material": "纸质", "age": "6+"}},
    {"id": 107, "name": "玩具（变形金刚/机器人）", "category": "玩具", "price": 99, "original_price": 129, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-58.png", "rating": 4.7, "review_count": 4500, "stock": 120, "description": "变形金刚玩具，造型酷炫，变形流畅。", "specs": {"type": "变形", "material": "塑料", "height": "20cm", "age": "5+"}},
    {"id": 108, "name": "玩具（益智桌游/卡牌）", "category": "玩具", "price": 59, "original_price": 77, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-19-11.png", "rating": 4.6, "review_count": 3000, "stock": 100, "description": "益智桌游卡牌，适合家庭聚会，增进互动。", "specs": {"type": "桌游", "players": "2-4人", "age": "8+", "time": "30分钟"}},
    {"id": 109, "name": "玩具（水枪/户外）", "category": "玩具", "price": 29, "original_price": 38, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-19-24.png", "rating": 4.5, "review_count": 7000, "stock": 250, "description": "户外水枪玩具，射程远，夏天必备。", "specs": {"type": "水枪", "capacity": "500ml", "range": "10m", "age": "3+"}},
    {"id": 110, "name": "玩具（遥控飞机/无人机）", "category": "玩具", "price": 199, "original_price": 259, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-19-37.png", "rating": 4.6, "review_count": 3000, "stock": 80, "description": "遥控无人机，航拍功能，操控稳定。", "specs": {"type": "无人机", "camera": "1080P", "flight": "15分钟", "age": "14+"}},
    {"id": 111, "name": "玩具（儿童自行车/平衡车）", "category": "玩具", "price": 199, "original_price": 259, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-19-50.png", "rating": 4.7, "review_count": 4000, "stock": 90, "description": "儿童平衡车，无脚踏设计，锻炼平衡能力。", "specs": {"type": "平衡车", "material": "铝合金", "size": "12寸", "age": "2-6岁"}},
    {"id": 112, "name": "玩具（户外玩具/飞盘滑板）", "category": "玩具", "price": 79, "original_price": 103, "image": "../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-53.png", "rating": 4.5, "review_count": 5000, "stock": 140, "description": "户外玩具套装，包含飞盘和滑板，适合户外活动。", "specs": {"type": "户外", "material": "塑料/枫木", "pieces": "2件", "age": "6+"}},
]

MOCK_CART = []
MOCK_FAVORITES = []

def dict_to_json(data, fields):
    """将字典中指定字段转换为JSON字符串"""
    result = []
    for item in data:
        item_dict = dict(item)
        for field in fields:
            if field in item_dict and item_dict[field]:
                try:
                    item_dict[field] = json.loads(item_dict[field])
                except:
                    pass
        result.append(item_dict)
    return result

# ==================== 分类API ====================

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """获取所有分类"""
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT * FROM categories ORDER BY sort_order')
            categories = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify({'code': 200, 'message': 'success', 'data': categories})
        else:
            # 返回模拟分类数据
            return jsonify({'code': 200, 'message': 'success', 'data': [
                {"id": 1, "name": "电脑整机"},
                {"id": 2, "name": "外设配件"}
            ]})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 商品API ====================

@app.route('/api/products', methods=['GET'])
def get_products():
    """获取商品列表，支持分页和筛选"""
    try:
        page = request.args.get('page', 1, type=int)
        page_size = request.args.get('page_size', 20, type=int)
        category_id = request.args.get('category_id', type=int)
        keyword = request.args.get('keyword', '')
        
        conn = get_db_connection()
        
        if conn:
            cursor = conn.cursor(dictionary=True)
            
            # 构建查询
            where_clauses = ['status = 1']
            params = []
            
            if category_id:
                where_clauses.append('category_id = %s')
                params.append(category_id)
            
            if keyword:
                where_clauses.append('(name LIKE %s OR description LIKE %s)')
                params.extend([f'%{keyword}%', f'%{keyword}%'])
            
            where_sql = ' AND '.join(where_clauses) if where_clauses else '1=1'
            
            # 查询总数
            count_sql = f'SELECT COUNT(*) as total FROM products WHERE {where_sql}'
            cursor.execute(count_sql, params)
            total = cursor.fetchone()['total']
            
            # 查询商品列表
            offset = (page - 1) * page_size
            query_sql = f'''
                SELECT id, category_id, name, price, original_price, image, 
                       rating, review_count, stock, created_at
                FROM products 
                WHERE {where_sql}
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            '''
            cursor.execute(query_sql, params + [page_size, offset])
            products = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'products': products,
                    'pagination': {
                        'page': page,
                        'page_size': page_size,
                        'total': total,
                        'total_pages': (total + page_size - 1) // page_size
                    }
                }
            })
        else:
            # 返回模拟商品数据
            filtered_products = MOCK_PRODUCTS.copy()
            if keyword:
                filtered_products = [p for p in filtered_products if keyword in p['name']]
            
            total = len(filtered_products)
            offset = (page - 1) * page_size
            products = filtered_products[offset:offset + page_size]
            
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'products': products,
                    'pagination': {
                        'page': page,
                        'page_size': page_size,
                        'total': total,
                        'total_pages': (total + page_size - 1) // page_size
                    }
                }
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/product', methods=['GET'])
def get_product_by_id():
    """获取单个商品详情（支持查询参数 id）"""
    try:
        product_id = request.args.get('id', type=int)
        
        if not product_id:
            return jsonify({'code': 400, 'message': '商品ID不能为空', 'data': None})
        
        conn = get_db_connection()
        
        if conn:
            cursor = conn.cursor(dictionary=True)
            
            # 查询商品基本信息
            cursor.execute('''
                SELECT p.*, c.name as category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = %s
            ''', (product_id,))
            product = cursor.fetchone()
            
            if not product:
                cursor.close()
                conn.close()
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            # 转换specs字段为JSON对象
            if product['specs']:
                try:
                    product['specs'] = json.loads(product['specs'])
                except:
                    pass
            
            # 查询商品图片
            cursor.execute('SELECT * FROM product_images WHERE product_id = %s ORDER BY sort_order', (product_id,))
            images = cursor.fetchall()
            product['images'] = images
            
            cursor.close()
            conn.close()
            
            return jsonify({'code': 200, 'message': 'success', 'data': product})
        else:
            # 返回模拟商品数据
            product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
            
            if not product:
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            return jsonify({'code': 200, 'message': 'success', 'data': product})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """获取单个商品详情（支持路径参数）"""
    try:
        conn = get_db_connection()
        
        if conn:
            cursor = conn.cursor(dictionary=True)
            
            # 查询商品基本信息
            cursor.execute('''
                SELECT p.*, c.name as category_name 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = %s
            ''', (product_id,))
            product = cursor.fetchone()
            
            if not product:
                cursor.close()
                conn.close()
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            # 转换specs字段为JSON对象
            if product['specs']:
                try:
                    product['specs'] = json.loads(product['specs'])
                except:
                    pass
            
            # 查询商品图片
            cursor.execute('SELECT * FROM product_images WHERE product_id = %s ORDER BY sort_order', (product_id,))
            images = cursor.fetchall()
            product['images'] = images
            
            cursor.close()
            conn.close()
            
            return jsonify({'code': 200, 'message': 'success', 'data': product})
        else:
            # 返回模拟商品数据
            product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
            
            if not product:
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            return jsonify({'code': 200, 'message': 'success', 'data': product})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 评价API ====================

@app.route('/api/product/reviews', methods=['GET'])
def get_product_reviews_by_id():
    """获取商品评价列表（支持查询参数 id）"""
    try:
        product_id = request.args.get('id', type=int)
        page = request.args.get('page', 1, type=int)
        page_size = request.args.get('page_size', 5, type=int)
        
        if not product_id:
            return jsonify({'code': 400, 'message': '商品ID不能为空', 'data': None})
        
        conn = get_db_connection()
        
        if conn:
            cursor = conn.cursor(dictionary=True)
            
            # 查询评价总数
            cursor.execute('SELECT COUNT(*) as total FROM reviews WHERE product_id = %s', (product_id,))
            total = cursor.fetchone()['total']
            
            # 查询评价列表
            offset = (page - 1) * page_size
            cursor.execute('''
                SELECT id, user_name, rating, content, tags, created_at
                FROM reviews 
                WHERE product_id = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            ''', (product_id, page_size, offset))
            reviews = cursor.fetchall()
            
            # 格式化日期
            for review in reviews:
                if review['created_at']:
                    review['created_at'] = review['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                if review['tags']:
                    review['tags'] = review['tags'].split(',')
            
            cursor.close()
            conn.close()
            
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'reviews': reviews,
                    'pagination': {
                        'page': page,
                        'page_size': page_size,
                        'total': total,
                        'total_pages': (total + page_size - 1) // page_size
                    }
                }
            })
        else:
            # 返回模拟评价数据
            mock_reviews = [
                {"id": 1, "user_name": "***王", "rating": 5, "content": "商品非常棒，质量很好！", "tags": ["质量好", "满意"], "created_at": "2026-06-10"},
                {"id": 2, "user_name": "***李", "rating": 4, "content": "整体满意，物流很快。", "tags": ["物流快"], "created_at": "2026-06-09"}
            ]
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'reviews': mock_reviews,
                    'pagination': {'page': 1, 'page_size': 5, 'total': 2, 'total_pages': 1}
                }
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/product/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    """获取商品评价列表（支持路径参数）"""
    try:
        page = request.args.get('page', 1, type=int)
        page_size = request.args.get('page_size', 10, type=int)
        
        conn = get_db_connection()
        
        if conn:
            cursor = conn.cursor(dictionary=True)
            
            # 查询评价总数
            cursor.execute('SELECT COUNT(*) as total FROM reviews WHERE product_id = %s', (product_id,))
            total = cursor.fetchone()['total']
            
            # 查询评价列表
            offset = (page - 1) * page_size
            cursor.execute('''
                SELECT id, user_name, rating, content, tags, created_at
                FROM reviews 
                WHERE product_id = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            ''', (product_id, page_size, offset))
            reviews = cursor.fetchall()
            
            # 格式化日期
            for review in reviews:
                if review['created_at']:
                    review['created_at'] = review['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                if review['tags']:
                    review['tags'] = review['tags'].split(',')
            
            cursor.close()
            conn.close()
            
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'reviews': reviews,
                    'pagination': {
                        'page': page,
                        'page_size': page_size,
                        'total': total,
                        'total_pages': (total + page_size - 1) // page_size
                    }
                }
            })
        else:
            # 返回模拟评价数据
            mock_reviews = [
                {"id": 1, "user_name": "***王", "rating": 5, "content": "商品非常棒，性能强劲！", "tags": ["性能强"], "created_at": "2026-06-10"},
                {"id": 2, "user_name": "***李", "rating": 4, "content": "整体满意，屏幕效果很好。", "tags": ["屏幕好"], "created_at": "2026-06-09"}
            ]
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'reviews': mock_reviews,
                    'pagination': {'page': 1, 'page_size': 10, 'total': 2, 'total_pages': 1}
                }
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/product/<int:product_id>/review', methods=['POST'])
def add_review(product_id):
    """添加商品评价"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        user_name = data.get('user_name', '匿名用户')
        rating = data.get('rating', 5)
        content = data.get('content', '')
        tags = data.get('tags', '')
        
        if not content:
            return jsonify({'code': 400, 'message': '评价内容不能为空', 'data': None})
        
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            
            # 插入评价
            cursor.execute('''
                INSERT INTO reviews (product_id, user_id, user_name, rating, content, tags)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (product_id, user_id, user_name, rating, content, tags))
            
            conn.commit()
            cursor.close()
            conn.close()
        
        return jsonify({'code': 200, 'message': '评价提交成功', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 购物车API ====================

@app.route('/api/cart', methods=['GET'])
def get_cart():
    """获取购物车列表"""
    try:
        user_id = request.args.get('user_id', type=int)
        session_id = request.args.get('session_id', '')
        
        conn = get_db_connection()
        
        if conn:
            cursor = conn.cursor(dictionary=True)
            
            if user_id:
                cursor.execute('''
                    SELECT c.*, p.name, p.price, p.image, p.stock
                    FROM cart c
                    JOIN products p ON c.product_id = p.id
                    WHERE c.user_id = %s
                    ORDER BY c.created_at DESC
                ''', (user_id,))
            else:
                cursor.execute('''
                    SELECT c.*, p.name, p.price, p.image, p.stock
                    FROM cart c
                    JOIN products p ON c.product_id = p.id
                    WHERE c.session_id = %s
                    ORDER BY c.created_at DESC
                ''', (session_id,))
            
            cart_items = cursor.fetchall()
            cursor.close()
            conn.close()
            
            total_amount = sum(item['price'] * item['quantity'] for item in cart_items)
            total_count = sum(item['quantity'] for item in cart_items)
            
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'items': cart_items,
                    'total_count': total_count,
                    'total_amount': total_amount
                }
            })
        else:
            # 返回模拟购物车数据
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {
                    'items': MOCK_CART,
                    'total_count': len(MOCK_CART),
                    'total_amount': sum(item['price'] * item['quantity'] for item in MOCK_CART)
                }
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    """添加商品到购物车"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        session_id = data.get('session_id', '')
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'code': 400, 'message': '商品ID不能为空', 'data': None})
        
        # 获取商品信息
        product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
        if not product:
            return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
        
        # 检查购物车中是否已存在
        for item in MOCK_CART:
            if item['product_id'] == product_id:
                item['quantity'] += quantity
                return jsonify({'code': 200, 'message': '添加成功', 'data': {'session_id': session_id}})
        
        # 新增购物车项
        MOCK_CART.append({
            'product_id': product_id,
            'name': product['name'],
            'price': product['price'],
            'image': product['image'],
            'quantity': quantity
        })
        
        return jsonify({'code': 200, 'message': '添加成功', 'data': {'session_id': session_id}})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/cart/<int:cart_id>', methods=['PUT'])
def update_cart(cart_id):
    """更新购物车商品数量"""
    try:
        data = request.get_json()
        quantity = data.get('quantity', 1)
        
        if quantity < 1:
            return jsonify({'code': 400, 'message': '数量不能小于1', 'data': None})
        
        # 更新模拟购物车
        if cart_id < len(MOCK_CART):
            MOCK_CART[cart_id]['quantity'] = quantity
        
        return jsonify({'code': 200, 'message': '更新成功', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/cart/<int:cart_id>', methods=['DELETE'])
def remove_from_cart(cart_id):
    """从购物车移除商品"""
    try:
        if cart_id < len(MOCK_CART):
            MOCK_CART.pop(cart_id)
        return jsonify({'code': 200, 'message': '删除成功', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 收藏API ====================

@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    """获取收藏列表"""
    try:
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': MOCK_FAVORITES
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/favorite/<int:product_id>', methods=['POST'])
def add_favorite(product_id):
    """添加收藏"""
    try:
        product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
        if not product:
            return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
        
        # 检查是否已收藏
        for item in MOCK_FAVORITES:
            if item['product_id'] == product_id:
                return jsonify({'code': 400, 'message': '已收藏', 'data': None})
        
        MOCK_FAVORITES.append({
            'product_id': product_id,
            'name': product['name'],
            'price': product['price'],
            'image': product['image']
        })
        
        return jsonify({'code': 200, 'message': '收藏成功', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/favorite/<int:product_id>', methods=['DELETE'])
def remove_favorite(product_id):
    """取消收藏"""
    try:
        global MOCK_FAVORITES
        MOCK_FAVORITES = [f for f in MOCK_FAVORITES if f['product_id'] != product_id]
        return jsonify({'code': 200, 'message': '取消成功', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 订单API ====================

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """获取订单列表"""
    try:
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': []
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

@app.route('/api/order', methods=['POST'])
def create_order():
    """创建订单"""
    try:
        data = request.get_json()
        cart_items = data.get('cart_items', [])
        
        if not cart_items:
            return jsonify({'code': 400, 'message': '购物车不能为空', 'data': None})
        
        order_no = datetime.now().strftime('%Y%m%d%H%M%S') + str(uuid.uuid4())[:6]
        total_amount = 0
        
        for item_id in cart_items:
            if item_id < len(MOCK_CART):
                total_amount += MOCK_CART[item_id]['price'] * MOCK_CART[item_id]['quantity']
        
        return jsonify({
            'code': 200,
            'message': '订单创建成功',
            'data': {
                'order_id': 1,
                'order_no': order_no,
                'total_amount': total_amount
            }
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 搜索API ====================

@app.route('/api/search', methods=['GET'])
def search_products():
    """搜索商品"""
    try:
        keyword = request.args.get('keyword', '')
        
        if not keyword:
            return jsonify({'code': 400, 'message': '关键词不能为空', 'data': None})
        
        filtered_products = [p for p in MOCK_PRODUCTS if keyword in p['name']]
        
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': {
                'products': filtered_products,
                'pagination': {
                    'page': 1,
                    'page_size': 20,
                    'total': len(filtered_products),
                    'total_pages': 1
                }
            }
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e), 'data': None})

# ==================== 商家商品API ====================

# 模拟商家商品数据存储（当数据库不可用时使用）
MOCK_MERCHANT_PRODUCTS = []

@app.route('/api/merchant/product', methods=['POST'])
def add_merchant_product():
    """发布商家商品"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'code': 400, 'message': '请求数据为空'}), 400
        
        # 数据验证
        required_fields = ['name', 'price', 'image', 'category', 'intro', 'detail']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'code': 400, 
                'message': f'缺少必填字段: {", ".join(missing_fields)}'
            }), 400
        
        # 验证价格格式
        try:
            price = float(data['price'])
            if price <= 0:
                return jsonify({'code': 400, 'message': '商品价格必须大于0'}), 400
        except ValueError:
            return jsonify({'code': 400, 'message': '商品价格格式错误'}), 400
        
        # 验证图片格式
        image = data['image']
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
        if not image.startswith('data:image/') and not any(
            image.lower().endswith(ext) for ext in valid_extensions
        ):
            return jsonify({'code': 400, 'message': '商品图片格式不支持'}), 400
        
        # 创建商品数据
        product = {
            'id': 'store_' + str(uuid.uuid4()).replace('-', '')[:8],
            'name': data['name'],
            'category': data['category'],
            'price': price,
            'originalPrice': data.get('originalPrice', math.floor(price * 1.3)),
            'image': image,
            'intro': data.get('intro', ''),
            'description': data.get('detail', ''),
            'afterService': data.get('afterService', ''),
            'unit': data.get('unit', '件'),
            'stock': data.get('stock', 0),
            'merchantId': data.get('merchantId', 'default'),
            'storeName': data.get('storeName', '我的店铺'),
            'rating': round(3 + random.random() * 2, 1),
            'isStoreProduct': True,
            'publishedAt': datetime.now().isoformat(),
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        # 保存到数据库或模拟存储
        if MYSQL_ENABLED and db_pool:
            try:
                conn = get_db_connection()
                if conn:
                    cursor = conn.cursor()
                    insert_sql = """
                        INSERT INTO merchant_products (id, name, category, price, original_price, image, 
                                                       intro, description, after_service, unit, stock, 
                                                       merchant_id, store_name, rating, is_store_product,
                                                       published_at, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(insert_sql, (
                        product['id'], product['name'], product['category'], product['price'],
                        product['originalPrice'], product['image'], product['intro'],
                        product['description'], product['afterService'], product['unit'],
                        product['stock'], product['merchantId'], product['storeName'],
                        product['rating'], product['isStoreProduct'], product['publishedAt'],
                        product['createdAt'], product['updatedAt']
                    ))
                    conn.commit()
                    cursor.close()
                    conn.close()
                    print(f"商家商品已保存到数据库: {product['name']}")
            except MySQLError as err:
                print(f"数据库保存失败: {err}")
                # 降级到模拟存储
                MOCK_MERCHANT_PRODUCTS.append(product)
        else:
            MOCK_MERCHANT_PRODUCTS.append(product)
        
        print(f"商家商品发布成功: {product['name']}")
        return jsonify({
            'code': 200, 
            'message': '商品发布成功', 
            'data': product
        }), 200
        
    except Exception as e:
        print(f"发布商品时发生错误: {e}")
        return jsonify({'code': 500, 'message': '发布商品时发生错误: ' + str(e)}), 500

@app.route('/api/merchant/products', methods=['GET'])
def get_merchant_products():
    """获取商家商品列表"""
    try:
        products = []
        
        # 从数据库或模拟存储获取商品
        if MYSQL_ENABLED and db_pool:
            try:
                conn = get_db_connection()
                if conn:
                    cursor = conn.cursor(dictionary=True)
                    cursor.execute("""
                        SELECT * FROM merchant_products 
                        ORDER BY published_at DESC
                    """)
                    products = cursor.fetchall()
                    cursor.close()
                    conn.close()
            except MySQLError as err:
                print(f"数据库查询失败: {err}")
                products = MOCK_MERCHANT_PRODUCTS
        else:
            products = MOCK_MERCHANT_PRODUCTS
        
        # 转换为前端需要的格式
        result = []
        for product in products:
            result.append({
                'id': product.get('id', ''),
                'name': product.get('name', ''),
                'category': product.get('category', '商家商品'),
                'price': float(product.get('price', 0)),
                'originalPrice': float(product.get('originalPrice', 0)),
                'image': product.get('image', ''),
                'rating': float(product.get('rating', 4.5)),
                'storeName': product.get('storeName', '我的店铺'),
                'isStoreProduct': product.get('isStoreProduct', True),
                'unit': product.get('unit', '件'),
                'stock': int(product.get('stock', 0)),
                'intro': product.get('intro', ''),
                'description': product.get('description', ''),
                'afterService': product.get('afterService', '')
            })
        
        return jsonify({
            'code': 200, 
            'message': '获取成功', 
            'data': result,
            'count': len(result)
        }), 200
        
    except Exception as e:
        print(f"获取商家商品时发生错误: {e}")
        return jsonify({'code': 500, 'message': '获取商品时发生错误: ' + str(e)}), 500

@app.route('/api/merchant/product/<product_id>', methods=['DELETE'])
def delete_merchant_product(product_id):
    """删除商家商品"""
    try:
        if not product_id:
            return jsonify({'code': 400, 'message': '商品ID不能为空'}), 400
        
        actual_product_id = product_id
        if product_id.startswith('store_'):
            actual_product_id = product_id[6:]
        
        deleted = False
        
        if MYSQL_ENABLED and db_pool:
            try:
                conn = get_db_connection()
                if conn:
                    cursor = conn.cursor()
                    cursor.execute("DELETE FROM merchant_products WHERE id = %s", (actual_product_id,))
                    conn.commit()
                    deleted = cursor.rowcount > 0
                    cursor.close()
                    conn.close()
                    if deleted:
                        print(f"商品已从数据库删除: {actual_product_id}")
                    else:
                        print(f"未找到要删除的商品: {actual_product_id}")
            except MySQLError as err:
                print(f"数据库删除失败: {err}")
                # 降级到模拟存储
                pass
        
        if not deleted:
            global MOCK_MERCHANT_PRODUCTS
            original_len = len(MOCK_MERCHANT_PRODUCTS)
            MOCK_MERCHANT_PRODUCTS = [p for p in MOCK_MERCHANT_PRODUCTS if p.get('id') != actual_product_id]
            deleted = len(MOCK_MERCHANT_PRODUCTS) < original_len
            if deleted:
                print(f"商品已从模拟存储删除: {actual_product_id}")
        
        if deleted:
            return jsonify({
                'code': 200, 
                'message': '商品删除成功',
                'data': {'product_id': product_id}
            }), 200
        else:
            return jsonify({'code': 404, 'message': '商品不存在'}), 404
        
    except Exception as e:
        print(f"删除商品时发生错误: {e}")
        return jsonify({'code': 500, 'message': '删除商品时发生错误: ' + str(e)}), 500

# ==================== 健康检查 ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute('SELECT 1')
            cursor.fetchone()
            cursor.close()
            conn.close()
            return jsonify({'code': 200, 'message': 'OK', 'data': {'mode': 'database'}})
        else:
            return jsonify({'code': 200, 'message': 'OK', 'data': {'mode': 'mock'}})
    except Exception as e:
        return jsonify({'code': 200, 'message': 'OK', 'data': {'mode': 'mock', 'error': str(e)}})

# ==================== HTML页面路由 ====================

@app.route('/')
def index():
    return send_from_directory(os.path.join(PROJECT_ROOT, 'html'), 'index.html')

@app.route('/<path:filename>')
def serve_html(filename):
    html_dir = os.path.join(PROJECT_ROOT, 'html')
    file_path = os.path.join(html_dir, filename)
    if os.path.isfile(file_path):
        return send_from_directory(html_dir, filename)
    else:
        return jsonify({'code': 404, 'message': '页面不存在'}), 404

# ==================== 静态文件路由 ====================

@app.route('/js/<path:filename>')
def serve_js(filename):
    js_dir = os.path.join(PROJECT_ROOT, 'js')
    return send_from_directory(js_dir, filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    css_dir = os.path.join(PROJECT_ROOT, 'css')
    return send_from_directory(css_dir, filename)

@app.route('/tupian/<path:filename>')
def serve_images(filename):
    images_dir = os.path.join(PROJECT_ROOT, 'tupian')
    return send_from_directory(images_dir, filename)

# ==================== 启动应用 ====================

if __name__ == '__main__':
    print("=" * 50)
    print("电商平台后端API服务")
    print("=" * 50)
    print(f"运行模式: {'数据库' if MYSQL_ENABLED else '模拟数据'}")
    print(f"CORS支持: {'已启用' if CORS_ENABLED else '未启用'}")
    print("=" * 50)
    print("API文档: http://localhost:5000/api/")
    print("健康检查: http://localhost:5000/api/health")
    print("按 Ctrl+C 停止服务")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
