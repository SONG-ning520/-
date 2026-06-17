/**
 * 商品详情页JavaScript
 * 前后端分离模式：JS负责渲染页面，后端负责提供数据
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ========== 本地商品数据（作为fallback）==========
const LOCAL_PRODUCTS = [
    {"id": 1, "name": "惠普 HyperX 暗影精灵 PRO 16", "category": "电脑整机", "price": 8999, "original_price": 11699, "image": "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222013_80_1.jpg", "rating": 4.9, "review_count": 20000, "stock": 50, "description": "全新一代暗影精灵PRO系列，搭载Intel Core Ultra处理器，性能强劲，游戏体验出色。", "specs": {"品牌": "惠普", "处理器": "Intel Core Ultra7 255HX", "内存": "16GB DDR5", "存储": "1TB SSD", "屏幕": "16英寸 2.5K 240Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/1/lunbotu/微信视频2026-06-14_222054_475.mp4", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222013_80_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222014_81_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222015_82_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222016_83_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222017_84_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222018_85_1.jpg", "../tupian/shangpinxiangqing/1/lunbotu/微信图片_20260614222019_86_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222013_80_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222014_81_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222015_82_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222016_83_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222017_84_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222018_85_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222019_86_1.jpg", "../tupian/shangpinxiangqing/1/xiangqingjieshao/微信图片_20260614222019_87_1.jpg"]},
    {"id": 2, "name": "华硕天选7 Pro Max", "category": "电脑整机", "price": 14999, "original_price": 19499, "image": "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222753_92_1.jpg", "rating": 4.8, "review_count": 15000, "stock": 30, "description": "天选系列旗舰机型，AMD锐龙9处理器，炫酷外观设计，适合高端游戏玩家。", "specs": {"品牌": "华硕", "处理器": "AMD Ryzen 9 9955HX", "内存": "32GB DDR5", "存储": "2TB SSD", "屏幕": "16英寸 2.5K 240Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/2/lunbotu/微信视频2026-06-14_224050_705.mp4", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/2/lunbotu/微信图片_20260614222755_95_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222750_89_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222751_90_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222752_91_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/2/xiangqingjieshao/微信图片_20260614222755_95_1.jpg"]},
    {"id": 3, "name": "惠普星Book Pro 16 2025", "category": "电脑整机", "price": 5948, "original_price": 7732, "image": "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223038_103_1.jpg", "rating": 4.7, "review_count": 18000, "stock": 80, "description": "轻薄便携的生产力工具，OLED屏幕色彩鲜艳，适合办公和创作。", "specs": {"品牌": "惠普", "处理器": "Intel Core Ultra5 125H", "内存": "16GB DDR5", "存储": "512GB SSD", "屏幕": "16英寸 OLED 2.8K"}, "carousel_images": ["../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223038_103_1.jpg", "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223039_104_1.jpg", "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223040_105_1.jpg", "../tupian/shangpinxiangqing/3/lunbotu/微信图片_20260614223041_106_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223035_99_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223036_100_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223037_101_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223038_102_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223038_103_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223039_104_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223040_105_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223041_106_1.jpg", "../tupian/shangpinxiangqing/3/xiangqingjieshao/微信图片_20260614223041_107_1.jpg"]},
    {"id": 4, "name": "联想拯救者 R7000P 2025", "category": "电脑整机", "price": 10188, "original_price": 13244, "image": "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223350_116_1.jpg", "rating": 4.9, "review_count": 25000, "stock": 60, "description": "拯救者系列经典游戏本，霜刃散热系统，性能释放强劲。", "specs": {"品牌": "联想", "处理器": "AMD Ryzen 9 8945HX", "内存": "16GB DDR5", "存储": "1TB SSD", "屏幕": "16英寸 2.5K 240Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/4/lunbotu/微信视频2026-06-14_224729_814.mp4", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223350_116_1.jpg", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223351_117_1.jpg", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223352_118_1.jpg", "../tupian/shangpinxiangqing/4/lunbotu/微信图片_20260614223352_119_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223350_116_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223351_117_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223352_118_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223352_119_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223353_120_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223354_121_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223355_122_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223356_123_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223357_124_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223358_125_1.jpg", "../tupian/shangpinxiangqing/4/xiangqingjieshao/微信图片_20260614223359_126_1.jpg"]},
    {"id": 5, "name": "小米 Redmi Book 16 焕新版", "category": "电脑整机", "price": 3599, "original_price": 4679, "image": "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223649_130_1.jpg", "rating": 4.6, "review_count": 30000, "stock": 100, "description": "高性价比轻薄本，2.5K高清屏幕，适合学生和办公人群。", "specs": {"品牌": "小米", "处理器": "Intel Core i5-13420H", "内存": "16GB DDR4", "存储": "512GB SSD", "屏幕": "16英寸 2.5K"}, "carousel_images": ["../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223649_130_1.jpg", "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223650_131_1.jpg", "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223651_132_1.jpg", "../tupian/shangpinxiangqing/5/lunbotu/微信图片_20260614223652_133_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223648_128_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223649_129_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223649_130_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223650_131_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223651_132_1.jpg", "../tupian/shangpinxiangqing/5/xiangqingjieshao/微信图片_20260614223652_133_1.jpg"]},
    {"id": 6, "name": "华硕天选7 Pro 酷睿版", "category": "电脑整机", "price": 8999, "original_price": 11699, "image": "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222753_92_1.jpg", "rating": 4.8, "review_count": 12000, "stock": 45, "description": "天选7 Pro酷睿版本，Intel处理器，性能与颜值兼备。", "specs": {"品牌": "华硕", "处理器": "Intel Core Ultra7 251HX", "内存": "16GB DDR5", "存储": "1TB SSD", "屏幕": "16英寸 2.5K 165Hz"}, "carousel_images": ["../tupian/shangpinxiangqing/6/lunbotu/微信视频2026-06-14_224050_705.mp4", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/6/lunbotu/微信图片_20260614222755_95_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222750_89_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222751_90_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222752_91_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222753_92_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222754_93_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222754_94_1.jpg", "../tupian/shangpinxiangqing/6/xiangqingjieshao/微信图片_20260614222755_95_1.jpg"]},
    {"id": 7, "name": "华硕无畏16Pro 锐龙AI版", "category": "电脑整机", "price": 4504, "original_price": 5855, "image": "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224019_139_1.jpg", "rating": 4.5, "review_count": 8000, "stock": 70, "description": "搭载AMD锐龙AI处理器，AI性能出色，适合创意工作。", "specs": {"品牌": "华硕", "处理器": "AMD Ryzen AI 9-HX370", "内存": "16GB LPDDR5", "存储": "512GB SSD", "屏幕": "16英寸 2.5K"}, "carousel_images": ["../tupian/shangpinxiangqing/7/lunbotu/微信视频2026-06-14_224414_769.mp4", "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224019_139_1.jpg", "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224020_140_1.jpg", "../tupian/shangpinxiangqing/7/lunbotu/微信图片_20260614224021_141_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224014_134_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224015_135_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224016_136_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224017_137_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224018_138_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224019_139_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224020_140_1.jpg", "../tupian/shangpinxiangqing/7/xiangqingjieshao/微信图片_20260614224021_141_1.jpg"]},
    {"id": 8, "name": "狼蛛键盘（红轴/RGB背光）", "category": "外设配件", "price": 299, "original_price": 389, "image": "../tupian/shangpinxiangqing/8/lunbotu/微信图片_20260615154546_194_1.jpg", "rating": 4.7, "review_count": 5000, "stock": 200, "description": "狼蛛机械键盘，红轴设计，RGB背光，游戏办公两相宜。", "specs": {"品牌": "狼蛛", "轴体": "红轴", "背光": "RGB", "按键数": "104键", "连接方式": "有线"}, "carousel_images": ["../tupian/shangpinxiangqing/8/lunbotu/微信视频2026-06-15_154616_373.mp4", "../tupian/shangpinxiangqing/8/lunbotu/微信图片_20260615154546_194_1.jpg", "../tupian/shangpinxiangqing/8/lunbotu/微信图片_20260615154547_195_1.jpg", "../tupian/shangpinxiangqing/8/lunbotu/微信图片_20260615154549_196_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/8/xiangqingjieshao/微信图片_20260615154544_193_1.jpg", "../tupian/shangpinxiangqing/8/xiangqingjieshao/微信图片_20260615154546_194_1.jpg", "../tupian/shangpinxiangqing/8/xiangqingjieshao/微信图片_20260615154547_195_1.jpg", "../tupian/shangpinxiangqing/8/xiangqingjieshao/微信图片_20260615154549_196_1.jpg"]},
    {"id": 9, "name": "DMA（三角洲/无畏契约）", "category": "外设配件", "price": 89, "original_price": 116, "image": "../tupian/shangpinxiangqing/9/lunbotu/微信图片_20260615154329_189_1.jpg", "rating": 4.5, "review_count": 3000, "stock": 500, "description": "专业电竞鼠标垫，高精度定位，顺滑操控体验。", "specs": {"品牌": "DMA", "尺寸": "450x400mm", "材质": "细编织布", "底部": "防滑橡胶"}, "carousel_images": ["../tupian/shangpinxiangqing/9/lunbotu/微信图片_20260615154329_189_1.jpg", "../tupian/shangpinxiangqing/9/lunbotu/微信图片_20260615154330_190_1.jpg", "../tupian/shangpinxiangqing/9/lunbotu/微信图片_20260615154331_191_1.jpg", "../tupian/shangpinxiangqing/9/lunbotu/微信图片_20260615154331_192_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/9/xiangqingjieshao/微信图片_20260615154329_189_1.jpg", "../tupian/shangpinxiangqing/9/xiangqingjieshao/微信图片_20260615154330_190_1.jpg", "../tupian/shangpinxiangqing/9/xiangqingjieshao/微信图片_20260615154331_191_1.jpg", "../tupian/shangpinxiangqing/9/xiangqingjieshao/微信图片_20260615154331_192_1.jpg"]},
    {"id": 10, "name": "狼蛛（F2088AIr）", "category": "外设配件", "price": 183, "original_price": 240, "image": "../tupian/shangpinxiangqing/10/lunbotu/微信图片_20260615153439_176_1.jpg", "rating": 4.6, "review_count": 4000, "stock": 150, "description": "狼蛛F2088Air无线机械键盘，蓝牙/2.4G双模连接。", "specs": {"品牌": "狼蛛", "型号": "F2088Air", "连接": "蓝牙+2.4G", "续航": "30天", "轴体": "青轴"}, "carousel_images": ["../tupian/shangpinxiangqing/10/lunbotu/微信图片_20260615153439_176_1.jpg", "../tupian/shangpinxiangqing/10/lunbotu/微信图片_20260615153440_177_1.jpg", "../tupian/shangpinxiangqing/10/lunbotu/微信图片_20260615153441_178_1.jpg", "../tupian/shangpinxiangqing/10/lunbotu/微信图片_20260615153442_179_1.jpg", "../tupian/shangpinxiangqing/10/lunbotu/微信图片_20260615153443_180_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153444_181_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153445_182_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153445_183_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153446_184_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153447_185_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153448_186_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153449_187_1.jpg", "../tupian/shangpinxiangqing/10/xiangqingjieshao/微信图片_20260615153450_188_1.jpg"]},
    {"id": 11, "name": "U盘（苹果/安卓）", "category": "外设配件", "price": 138, "original_price": 188, "image": "../tupian/shangpinxiangqing/11/lunbotu/Snipaste_2026-06-14_16-40-54.png", "rating": 4.4, "review_count": 2000, "stock": 300, "description": "多接口U盘，支持苹果Lightning和安卓Type-C，高速传输。", "specs": {"品牌": "中性", "容量": "128GB", "接口": "Lightning+Type-C", "速度": "USB 3.0"}, "carousel_images": ["../tupian/shangpinxiangqing/11/lunbotu/Snipaste_2026-06-14_16-40-54.png"], "detail_images": ["../tupian/shangpinxiangqing/11/xiangqingjieshao/Snipaste_2026-06-14_16-40-54.png"]},
    {"id": 12, "name": "罗技G（PROX2头戴式）", "category": "外设配件", "price": 988, "original_price": 1088, "image": "../tupian/shangpinxiangqing/12/lunbotu/微信图片_20260615153232_167_1.jpg", "rating": 4.8, "review_count": 8000, "stock": 80, "description": "罗技G PRO X2无线游戏耳机，7.1环绕声，主动降噪。", "specs": {"品牌": "罗技", "型号": "G PRO X2", "连接": "无线", "续航": "30小时", "降噪": "主动降噪"}, "carousel_images": ["../tupian/shangpinxiangqing/12/lunbotu/微信视频2026-06-15_153906_510.mp4", "../tupian/shangpinxiangqing/12/lunbotu/微信图片_20260615153232_167_1.jpg", "../tupian/shangpinxiangqing/12/lunbotu/微信图片_20260615153233_168_1.jpg", "../tupian/shangpinxiangqing/12/lunbotu/微信图片_20260615153234_169_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153232_167_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153233_168_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153234_169_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153235_170_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153236_171_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153237_172_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153238_173_1.jpg", "../tupian/shangpinxiangqing/12/xiangqingjieshao/微信图片_20260615153239_174_1.jpg"]},
    {"id": 13, "name": "华硕2K（260HZ/高刷）", "category": "外设配件", "price": 1816, "original_price": 2070, "image": "../tupian/shangpinxiangqing/13/lunbotu/微信图片_20260615153000_157_1.jpg", "rating": 4.9, "review_count": 6000, "stock": 40, "description": "华硕ROG电竞显示器，2K分辨率，260Hz超高刷新率。", "specs": {"品牌": "华硕", "尺寸": "27英寸", "分辨率": "2K", "刷新率": "260Hz", "面板": "IPS"}, "carousel_images": ["../tupian/shangpinxiangqing/13/lunbotu/微信图片_20260615153000_157_1.jpg", "../tupian/shangpinxiangqing/13/lunbotu/微信图片_20260615153000_158_1.jpg", "../tupian/shangpinxiangqing/13/lunbotu/微信图片_20260615153001_159_1.jpg", "../tupian/shangpinxiangqing/13/lunbotu/微信图片_20260615153003_160_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/13/xiangqingjieshao/微信图片_20260615153004_161_1.jpg", "../tupian/shangpinxiangqing/13/xiangqingjieshao/微信图片_20260615153005_162_1.jpg", "../tupian/shangpinxiangqing/13/xiangqingjieshao/微信图片_20260615153006_163_1.jpg", "../tupian/shangpinxiangqing/13/xiangqingjieshao/微信图片_20260615153007_164_1.jpg", "../tupian/shangpinxiangqing/13/xiangqingjieshao/微信图片_20260615153008_165_1.jpg", "../tupian/shangpinxiangqing/13/xiangqingjieshao/微信图片_20260615153009_166_1.jpg"]},
    {"id": 14, "name": "七彩虹酷睿（14代I5/RTX5060Ti）", "category": "外设配件", "price": 3399, "original_price": 3909, "image": "../tupian/shangpinxiangqing/14/lunbotu/微信图片_20260615152840_143_1.jpg", "rating": 4.7, "review_count": 4500, "stock": 60, "description": "七彩虹游戏主机，14代酷睿I5，RTX5060Ti显卡。", "specs": {"品牌": "七彩虹", "处理器": "Intel i5-14400F", "显卡": "RTX 5060 Ti", "内存": "16GB", "存储": "512GB SSD"}, "carousel_images": ["../tupian/shangpinxiangqing/14/lunbotu/微信图片_20260615152840_143_1.jpg", "../tupian/shangpinxiangqing/14/lunbotu/微信图片_20260615152841_144_1.jpg", "../tupian/shangpinxiangqing/14/lunbotu/微信图片_20260615152842_145_1.jpg", "../tupian/shangpinxiangqing/14/lunbotu/微信图片_20260615152843_146_1.jpg"], "detail_images": ["../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152843_146_1.jpg", "../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152844_147_1.jpg", "../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152844_148_1.jpg", "../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152845_149_1.jpg", "../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152849_153_1.jpg", "../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152850_154_1.jpg", "../tupian/shangpinxiangqing/14/xiangqingjieshao/微信图片_20260615152851_155_1.jpg"]}
]

// ========== 工具函数 ==========

/** 获取URL参数中的商品ID */
function getProductIdFromURL() {
    console.log('当前URL:', window.location.href);
    console.log('URL参数:', window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('获取到的商品ID:', id);
    // 支持整数ID和字符串ID（如 store_123）
    if (id && !isNaN(parseInt(id))) {
        return parseInt(id);
    }
    return id || null;
}

/** 显示错误信息 */
function showError(title, message) {
    document.getElementById('errorTitle').textContent = title || '商品不存在';
    document.getElementById('errorMessage').textContent = message || '请返回首页重新选择商品';
    document.getElementById('errorOverlay').style.display = 'flex';
}

/** 显示提示消息 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast visible';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2500);
}

// ========== 数据获取 ==========

/** 从后端API获取商品数据 */
async function fetchProductData(productId) {
    // 先尝试从localStorage获取商家发布的商品
    try {
        const homeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
        const storeProduct = homeProducts.find(p => p.id === productId);
        if (storeProduct) {
            console.log('使用商家发布的商品数据:', storeProduct);
            // 转换为商品详情页面需要的格式
            return {
                id: storeProduct.id,
                name: storeProduct.name,
                category: storeProduct.category || '商家商品',
                price: storeProduct.price,
                original_price: storeProduct.originalPrice || Math.floor(storeProduct.price * 1.3),
                image: storeProduct.image,
                rating: storeProduct.rating || 4.5,
                review_count: 0,
                stock: 999,
                description: storeProduct.description || `来自${storeProduct.storeName}的优质商品`,
                specs: {
                    品牌: storeProduct.storeName || '商家店铺',
                    商品类型: storeProduct.category || '商家商品',
                    商品ID: storeProduct.id
                },
                carousel_images: [storeProduct.image],
                detail_images: [storeProduct.image],
                isStoreProduct: true
            };
        }
    } catch (error) {
        console.warn('获取商家商品数据失败:', error);
    }
    
    // 先尝试从API获取
    try {
        const response = await fetch(`${API_BASE_URL}/product?id=${productId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const result = await response.json();
            if (result.code === 200 && result.data) {
                return result.data;
            }
        }
    } catch (error) {
        console.warn('API请求失败，尝试使用本地数据:', error);
    }
    
    // 如果API失败，从本地数据获取
    const localProduct = LOCAL_PRODUCTS.find(p => p.id === productId);
    if (localProduct) {
        console.log('使用本地数据');
        return localProduct;
    }
    
    return null;
}

/** 生成模拟评价数据 */
function generateMockReviews(product) {
    const reviewTemplates = [
        { content: "非常不错的商品，性价比很高，值得推荐！", tags: ["性价比高", "质量好"] },
        { content: "物流很快，包装完好，实物与描述一致。", tags: ["物流快", "包装好"] },
        { content: "做工精细，用料扎实，使用起来很满意。", tags: ["做工精细", "用料好"] },
        { content: "整体体验很好，客服态度也很热情。", tags: ["体验好", "服务好"] },
        { content: "已经是第二次购买了，一如既往的好品质。", tags: ["复购", "品质好"] }
    ];
    
    const count = Math.min(product.review_count || 5, 5);
    const reviews = [];
    
    for (let i = 0; i < count; i++) {
        const template = reviewTemplates[i % reviewTemplates.length];
        reviews.push({
            user: `***${['用', '哥', '姐', '弟', '妹'][i % 5]}`,
            rating: product.rating || 4.5,
            date: `2026-06-${String(10 + i).padStart(2, '0')}`,
            content: template.content,
            tags: template.tags
        });
    }
    
    return reviews;
}

// ========== 工具函数 ==========

/** 判断是否是视频文件 */
function isVideoFile(path) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const ext = path.split('.').pop().toLowerCase();
    return videoExtensions.includes(`.${ext}`);
}

/** 获取视频的第一帧作为缩略图 */
function getVideoThumbnail(videoPath) {
    return videoPath.replace(/\.[^.]+$/, '_thumb.jpg');
}

// ========== 页面渲染 ==========

/** 渲染轮播图 */
function renderCarousel(product) {
    const wrapper = document.getElementById('carouselWrapper');
    const indicators = document.getElementById('carouselIndicators');
    const thumbnailNav = document.getElementById('thumbnailNav');
    
    // 使用商品的轮播图数组，如果没有则使用单个图片
    const mediaItems = product.carousel_images && product.carousel_images.length > 0 
        ? product.carousel_images 
        : [product.image];
    
    // 清空现有内容
    wrapper.innerHTML = '';
    indicators.innerHTML = '';
    thumbnailNav.innerHTML = '';
    
    // 生成轮播项
    mediaItems.forEach((media, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.dataset.index = index;
        
        if (isVideoFile(media)) {
            // 视频元素
            item.innerHTML = `
                <div class="video-container">
                    <video 
                        src="${media}" 
                        loop 
                        preload="metadata"
                        class="carousel-video"
                        poster="${getVideoThumbnail(media)}"
                        aria-label="商品视频"
                    >
                    </video>
                    <div class="video-overlay">
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 图片元素
            item.innerHTML = `<img src="${media}" alt="${product.name}" onerror="this.src='../tupian/placeholder.png'">`;
        }
        
        wrapper.appendChild(item);
        
        // 指示器
        const indicator = document.createElement('button');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.dataset.index = index;
        indicator.setAttribute('aria-label', `第${index + 1}张`);
        indicators.appendChild(indicator);
        
        // 缩略图（视频使用默认图片）
        const thumb = document.createElement('button');
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.dataset.index = index;
        thumb.setAttribute('aria-label', `缩略图${index + 1}`);
        
        const thumbSrc = isVideoFile(media) ? product.image : media;
        thumb.innerHTML = `<img src="${thumbSrc}" alt="缩略图${index + 1}" onerror="this.src='../tupian/placeholder.png'">`;
        thumbnailNav.appendChild(thumb);
    });
    
    // 重新绑定轮播事件
    bindCarouselEvents();
    
    // 绑定视频悬停事件
    bindVideoEvents();
}

/** 绑定视频悬停播放事件 */
function bindVideoEvents() {
    const videos = document.querySelectorAll('.carousel-video');
    
    videos.forEach(video => {
        const container = video.parentElement;
        const overlay = container.querySelector('.video-overlay');
        
        // 鼠标悬停时播放
        container.addEventListener('mouseenter', () => {
            video.play().catch(() => {
                // 自动播放失败时显示播放按钮
                overlay.style.display = 'flex';
            });
            overlay.style.display = 'none';
        });
        
        // 鼠标移出时暂停
        container.addEventListener('mouseleave', () => {
            video.pause();
            overlay.style.display = 'flex';
        });
        
        // 点击播放/暂停
        container.addEventListener('click', () => {
            if (video.paused) {
                video.play().then(() => {
                    overlay.style.display = 'none';
                }).catch(() => {
                    overlay.style.display = 'flex';
                });
            } else {
                video.pause();
                overlay.style.display = 'flex';
            }
        });
        
        // 视频播放完毕显示遮罩
        video.addEventListener('ended', () => {
            overlay.style.display = 'flex';
        });
    });
}

/** 渲染用户评价 */
function renderReviews(product) {
    const container = document.getElementById('reviewsScroll');
    const countEl = document.getElementById('reviewCount');
    
    const reviews = generateMockReviews(product);
    countEl.textContent = `${product.review_count || 0}条评价`;
    
    container.innerHTML = reviews.map(review => {
        const stars = Array(5).fill(0).map((_, i) => 
            `<i class="fas fa-star ${i < Math.floor(review.rating) ? 'filled' : ''}"></i>`
        ).join('');
        
        const tags = review.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="user-info">
                        <div class="user-avatar"><i class="fas fa-user"></i></div>
                        <div class="user-details">
                            <span class="user-name">${review.user}户</span>
                            <div class="review-rating">
                                ${stars}
                                <span>${review.rating}</span>
                            </div>
                        </div>
                    </div>
                    <span class="review-date">${review.date}</span>
                </div>
                <p class="review-content">${review.content}</p>
                <div class="review-tags">${tags}</div>
            </div>
        `;
    }).join('');
}

/** 渲染商品详情 */
function renderDetails(product) {
    // 商品描述
    const descEl = document.getElementById('productDescription');
    descEl.innerHTML = `<p>${product.description || '暂无描述'}</p>`;
    
    // 商品参数表
    const tableEl = document.getElementById('specsTable');
    const specs = product.specs || {};
    tableEl.innerHTML = Object.entries(specs).map(([key, value]) => `
        <tr>
            <td class="spec-label">${key}</td>
            <td class="spec-value">${value}</td>
        </tr>
    `).join('');
    
    // 详情图片（支持多图）
    const imagesEl = document.getElementById('detailImages');
    const detailImages = product.detail_images && product.detail_images.length > 0 
        ? product.detail_images 
        : [product.image];
    
    imagesEl.innerHTML = detailImages.map((img, index) => `
        <div class="detail-image-wrapper" data-index="${index}">
            <img 
                src="${img}" 
                alt="${product.name} - 详情图${index + 1}" 
                onerror="this.src='../tupian/placeholder.png'"
                loading="lazy"
            >
            <div class="image-caption">${product.name} - 详情图${index + 1}</div>
        </div>
    `).join('');
    
    // 添加图片点击放大功能
    bindDetailImageClick();
}

/** 绑定详情图片点击事件 */
function bindDetailImageClick() {
    const imageWrappers = document.querySelectorAll('.detail-image-wrapper');
    
    imageWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const img = wrapper.querySelector('img');
            if (img) {
                // 创建图片预览遮罩
                const overlay = document.createElement('div');
                overlay.className = 'image-preview-overlay';
                overlay.innerHTML = `
                    <div class="preview-content">
                        <button class="preview-close" aria-label="关闭预览">
                            <i class="fas fa-times"></i>
                        </button>
                        <img src="${img.src}" alt="预览图片">
                        <button class="preview-prev" aria-label="上一张">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="preview-next" aria-label="下一张">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                `;
                document.body.appendChild(overlay);
                
                // 关闭预览
                const closeBtn = overlay.querySelector('.preview-close');
                closeBtn.addEventListener('click', () => overlay.remove());
                
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) overlay.remove();
                });
                
                // 键盘关闭
                document.addEventListener('keydown', function handleKeydown(e) {
                    if (e.key === 'Escape') {
                        overlay.remove();
                        document.removeEventListener('keydown', handleKeydown);
                    }
                });
            }
        });
    });
}

/** 渲染整个页面 */
function renderPage(product) {
    // 更新页面标题
    document.title = `商品详情 - ${product.name}`;
    
    // 渲染各区域
    renderCarousel(product);
    renderReviews(product);
    renderDetails(product);
    
    // 存储当前商品价格用于购买计算
    window.currentProduct = product;
}

// ========== 轮播图交互 ==========

let currentIndex = 0;
let carouselItems = [];
let carouselIndicators = [];
let carouselThumbnails = [];

function bindCarouselEvents() {
    carouselItems = document.querySelectorAll('.carousel-item');
    carouselIndicators = document.querySelectorAll('.indicator');
    carouselThumbnails = document.querySelectorAll('.thumbnail');
    currentIndex = 0;
    
    // 指示器点击
    carouselIndicators.forEach(ind => {
        ind.addEventListener('click', () => goToSlide(parseInt(ind.dataset.index)));
    });
    
    // 缩略图点击
    carouselThumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => goToSlide(parseInt(thumb.dataset.index)));
    });
}

function goToSlide(index) {
    if (!carouselItems.length) return;
    
    // 边界处理
    if (index < 0) index = carouselItems.length - 1;
    if (index >= carouselItems.length) index = 0;
    
    // 移除当前激活状态
    carouselItems[currentIndex]?.classList.remove('active');
    carouselIndicators[currentIndex]?.classList.remove('active');
    carouselThumbnails[currentIndex]?.classList.remove('active');
    
    // 设置新的激活状态
    currentIndex = index;
    carouselItems[currentIndex]?.classList.add('active');
    carouselIndicators[currentIndex]?.classList.add('active');
    carouselThumbnails[currentIndex]?.classList.add('active');
}

// ========== 按钮交互 ==========

/** 加入收藏 */
function addToFavorites() {
    const product = window.currentProduct;
    if (!product) return;
    
    // 获取现有收藏数据
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // 查找是否已存在
    const existing = favorites.find(item => item.id === product.id);
    if (existing) {
        showToast('该商品已在收藏中');
        return;
    }
    
    favorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        addedTime: new Date().toISOString()
    });
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 更新按钮状态
    updateFavButtonState();
    
    // 显示提示
    showToast(`已将"${product.name}"加入收藏`);
}

/** 更新收藏按钮状态 */
function updateFavButtonState() {
    const product = window.currentProduct;
    if (!product) return;
    
    const favBtn = document.getElementById('addFavBtn');
    if (!favBtn) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorited = favorites.some(item => item.id === product.id);
    
    if (isFavorited) {
        favBtn.classList.add('favorited');
        favBtn.innerHTML = '<i class="fas fa-heart"></i><span>已收藏</span>';
    } else {
        favBtn.classList.remove('favorited');
        favBtn.innerHTML = '<i class="far fa-heart"></i><span>收藏</span>';
    }
}

/** 加入购物车 */
function addToCart() {
    const product = window.currentProduct;
    if (!product) return;
    
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    
    // 获取现有购物车数据
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 查找是否已存在
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            qty: qty
        });
    }
    
    // 保存到本地存储
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车数量显示
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalQty;
    }
    
    // 显示提示
    showToast(`已将 ${qty} 件"${product.name}"加入购物车`);
}

/** 立即支付 */
function buyNow() {
    const product = window.currentProduct;
    if (!product) return;
    
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    
    // 跳转到支付弹窗页面
    window.location.href = `payment-modal.html?productId=${product.id}&quantity=${qty}`;
}

/** 数量控制 */
function updateQuantity(delta) {
    const input = document.getElementById('quantity');
    const min = parseInt(input.min) || 1;
    const max = parseInt(input.max) || 10;
    let value = parseInt(input.value) || 1;
    
    value += delta;
    if (value < min) value = min;
    if (value > max) value = max;
    
    input.value = value;
}

// ========== 事件绑定 ==========

function bindEvents() {
    // 轮播导航按钮
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }
    
    // 数量控制
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    
    if (qtyMinus) qtyMinus.addEventListener('click', () => updateQuantity(-1));
    if (qtyPlus) qtyPlus.addEventListener('click', () => updateQuantity(1));
    
    // 购物车按钮
    const addCartBtn = document.getElementById('addCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    const addFavBtn = document.getElementById('addFavBtn');
    
    if (addCartBtn) addCartBtn.addEventListener('click', addToCart);
    if (buyNowBtn) buyNowBtn.addEventListener('click', buyNow);
    if (addFavBtn) addFavBtn.addEventListener('click', addToFavorites);
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToSlide(currentIndex + 1);
        }
    });
}

// ========== 页面初始化 ==========

async function initPage() {
    // 获取商品ID
    const productId = getProductIdFromURL();
    
    if (!productId) {
        showError('缺少商品ID', 'URL中未找到商品ID参数，请从商品列表进入');
        return;
    }
    
    // 获取商品数据
    const product = await fetchProductData(productId);
    
    if (!product) {
        showError('商品不存在', `未找到ID为 ${productId} 的商品，请返回首页重新选择`);
        return;
    }
    
    // 渲染页面
    renderPage(product);
    
    // 绑定交互事件
    bindEvents();
    
    // 初始化购物车数量
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalQty;
    }
    
    // 初始化收藏按钮状态
    updateFavButtonState();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);

// 将商品数据暴露到全局，供其他页面使用
window.LOCAL_PRODUCTS = LOCAL_PRODUCTS;
