// 商品数据 - 16个分类，每个分类7种商品，共112种商品
// 注意：此文件使用本地数据，当后端API可用时，将切换到API调用模式
const USE_API_MODE = true; // 设置为true启用API模式，false使用本地数据
const API_BASE_URL = 'http://localhost:5000/api';

// API工具函数
async function fetchFromAPI(endpoint, params = {}) {
    try {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        return { code: 500, message: error.message, data: null };
    }
}

async function postToAPI(endpoint, data = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        return { code: 500, message: error.message, data: null };
    }
}

// 从后端API获取商家商品列表
async function fetchMerchantProducts() {
    console.log('开始从API获取商家商品...');
    
    try {
        const response = await fetchFromAPI('/merchant/products');
        
        if (response.code === 200 && response.data) {
            console.log('API获取商家商品成功，共', response.data.length, '个商品');
            return response.data;
        } else {
            console.error('获取商家商品失败:', response.message);
            return [];
        }
    } catch (error) {
        console.error('API请求异常:', error);
        return [];
    }
}

// 获取商家商品（优先API，失败回退localStorage）
async function getMerchantProducts() {
    let apiProducts = [];
    
    try {
        apiProducts = await fetchMerchantProducts();
    } catch (error) {
        console.warn('API获取失败，使用localStorage备份');
    }
    
    if (apiProducts.length > 0) {
        localStorage.setItem('home_products', JSON.stringify(apiProducts));
        return apiProducts;
    }
    
    const localProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
    return localProducts;
}

// 本地商品数据
const productData = [
    // 一、电脑整机（7种）
    { id: 1, name: '惠普 HyperX 暗影精灵 PRO 16', category: '电脑整机', price: 8999, originalPrice: 11699, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-26-19.png' },
    { id: 2, name: '华硕天选7 Pro Max', category: '电脑整机', price: 14999, originalPrice: 19499, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-02.png' },
    { id: 3, name: '惠普星Book Pro 16 2025', category: '电脑整机', price: 5948, originalPrice: 7732, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-22.png' },
    { id: 4, name: '联想拯救者 R7000P 2025', category: '电脑整机', price: 10188, originalPrice: 13244, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-36.png' },
    { id: 5, name: '小米 Redmi Book 16 焕新版', category: '电脑整机', price: 3599, originalPrice: 4679, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-28-42.png' },
    { id: 6, name: '华硕天选7 Pro 酷睿版', category: '电脑整机', price: 8999, originalPrice: 11699, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-43.png' },
    { id: 7, name: '华硕无畏16Pro 锐龙AI版', category: '电脑整机', price: 4504, originalPrice: 5855, image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-57.png' },
    
    // 二、外设配件（7种） - waishe文件夹
    { id: 8, name: '狼蛛键盘（红轴/RGB背光）', category: '外设配件', price: 299, originalPrice: 389, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-38-56.png' },
    { id: 9, name: 'DMA（三角洲/无畏契约）', category: '外设配件', price: 89, originalPrice: 116, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-39-46.png' },
    { id: 10, name: '狼蛛（F2088AIr）', category: '外设配件', price: 183, originalPrice: 240, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-40-06.png' },
    { id: 11, name: 'U盘（苹果/安卓）', category: '外设配件', price: 138, originalPrice: 188, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-40-54.png' },
    { id: 12, name: '罗技G（PROX2头戴式）', category: '外设配件', price: 988, originalPrice: 1088, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-41-06.png' },
    { id: 13, name: '华硕2K（260HZ/高刷）', category: '外设配件', price: 1816, originalPrice: 2070, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-41-28.png' },
    { id: 14, name: '七彩虹酷睿（14代I5/RTX5060Ti）', category: '外设配件', price: 3399, originalPrice: 3909, image: '../tupian/shangpin/waishe/Snipaste_2026-06-14_16-41-43.png' },
    
    // 三、女装（7种） - nuzhuang文件夹
    { id: 15, name: '连衣裙（碎花/中长款）', category: '女装', price: 199, originalPrice: 259, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-46-26.png' },
    { id: 16, name: '连衣裙（ROJITA/日系学院风）', category: '女装', price: 188, originalPrice: 218, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-46-45.png' },
    { id: 17, name: '短袖（回力/纯棉）', category: '女装', price: 159, originalPrice: 207, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-46-58.png' },
    { id: 18, name: '阔腿裤（宽松/夏款）', category: '女装', price: 129, originalPrice: 168, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-09.png' },
    { id: 19, name: '运动装（韩系/下款）', category: '女装', price: 139, originalPrice: 181, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-27.png' },
    { id: 20, name: '蝴蝶结衣裙（荷叶边/宽松）', category: '女装', price: 299, originalPrice: 389, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-33.png' },
    { id: 21, name: '防晒衣（桑蚕丝/宽松）', category: '女装', price: 169, originalPrice: 220, image: '../tupian/shangpin/nuzhuang/Snipaste_2026-06-14_16-47-44.png' },
    
    // 四、男装（7种） - nanzhuang文件夹
    { id: 22, name: '斐乐（商务/短袖）', category: '男装', price: 129, originalPrice: 168, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-44-02.png' },
    { id: 23, name: '短袖（海澜之家/冰爽棉）', category: '男装', price: 149, originalPrice: 194, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-44-25.png' },
    { id: 24, name: 'T恤（雾卡/春秋）', category: '男装', price: 259, originalPrice: 337, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-44-42.png' },
    { id: 25, name: '短袖短裤（罗蒙/夏季）', category: '男装', price: 169, originalPrice: 220, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-44-55.png' },
    { id: 26, name: '休闲裤（海澜之家/基础款）', category: '男装', price: 79, originalPrice: 103, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-45-27.png' },
    { id: 27, name: 'T恤（森马/修身）', category: '男装', price: 189, originalPrice: 246, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-45-37.png' },
    { id: 28, name: '短袖（商务/父亲节）', category: '男装', price: 399, originalPrice: 519, image: '../tupian/shangpin/nanzhuang/Snipaste_2026-06-14_16-45-54.png' },
    
    // 五、鞋靴（7种） - xiexue文件夹
    { id: 29, name: '运动鞋（耐克/透气）', category: '鞋靴', price: 299, originalPrice: 389, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-48-55.png' },
    { id: 30, name: '鬼冢虎（休闲/经典）', category: '鞋靴', price: 399, originalPrice: 519, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-49-27.png' },
    { id: 31, name: '361（休闲/春夏）', category: '鞋靴', price: 99, originalPrice: 129, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-50-07.png' },
    { id: 32, name: '斐乐（休闲/耐磨）', category: '鞋靴', price: 359, originalPrice: 467, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-50-18.png' },
    { id: 33, name: '鸿星尔克（轻薄/夏季）', category: '鞋靴', price: 259, originalPrice: 337, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-50-32.png' },
    { id: 34, name: '东方骆驼（经典/百搭）', category: '鞋靴', price: 129, originalPrice: 168, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-51-06.png' },
    { id: 35, name: '安踏（居家/舒适）', category: '鞋靴', price: 49, originalPrice: 64, image: '../tupian/shangpin/xiexue/Snipaste_2026-06-14_16-51-22.png' },
    // 六、家居（7种） - jiaju文件夹
    { id: 36, name: '臻享家（实木床）', category: '家居', price: 1899, originalPrice: 2469, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-52-46.png' },
    { id: 37, name: '床（1.8m/实木框架）', category: '家居', price: 2299, originalPrice: 2989, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-53-00.png' },
    { id: 38, name: '餐桌（尚溪）', category: '家居', price: 1599, originalPrice: 2079, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-53-21.png' },
    { id: 39, name: '衣柜（简约/带抽屉）', category: '家居', price: 1999, originalPrice: 2649, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-53-37.png' },
    { id: 40, name: '婚床（韩夏中国古风）', category: '家居', price: 2199, originalPrice: 2259, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-09.png' },
    { id: 41, name: '茶几（现代/储物）', category: '家居', price: 699, originalPrice: 909, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-20.png' },
    { id: 42, name: '有家（茶几）', category: '家居', price: 299, originalPrice: 389, image: '../tupian/shangpin/jiaju/Snipaste_2026-06-14_16-54-53.png' },
    
    // 七、家纺（7种） - jiafang文件夹
    { id: 43, name: '夏凉被（1.8m）', category: '家纺', price: 199, originalPrice: 259, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-04.png' },
    { id: 44, name: '夏凉被（1.5*2.0）', category: '家纺', price: 399, originalPrice: 519, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-19.png' },
    { id: 45, name: '春秋被（无印良品）', category: '家纺', price: 129, originalPrice: 168, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-57-28.png' },
    { id: 46, name: '床单（罗莱家纺）', category: '家纺', price: 59, originalPrice: 77, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-58-16.png' },
    { id: 47, name: '浴巾（三立）', category: '家纺', price: 59, originalPrice: 69, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-58-43.png' },
    { id: 48, name: '窗帘（抗菌隔音）', category: '家纺', price: 199, originalPrice: 259, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-59-07.png' },
    { id: 49, name: '地毯（布迪斯）', category: '家纺', price: 49, originalPrice: 64, image: '../tupian/shangpin/jiafang/Snipaste_2026-06-14_16-59-26.png' },
    
    // 八、水果（7种） - shuiguo文件夹
    { id: 50, name: '猕猴桃', category: '水果', price: 39, originalPrice: 51, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-00-04.png' },
    { id: 51, name: '橙子', category: '水果', price: 29, originalPrice: 38, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-00-19.png' },
    { id: 52, name: '樱桃', category: '水果', price: 49, originalPrice: 64, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-00-27.png' },
    { id: 53, name: '桃', category: '水果', price: 39, originalPrice: 51, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-00-37.png' },
    { id: 54, name: '荔枝', category: '水果', price: 69, originalPrice: 90, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-00-47.png' },
    { id: 55, name: '蓝莓', category: '水果', price: 35, originalPrice: 46, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-01-14.png' },
    { id: 56, name: '榴莲', category: '水果', price: 45, originalPrice: 59, image: '../tupian/shangpin/shuiguo/Snipaste_2026-06-14_17-01-33.png' },
    
    // 九、肉类（7种） - roulei文件夹
    { id: 57, name: '猪肉（五花肉/500g）', category: '肉类', price: 25, originalPrice: 33, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-01-56.png' },
    { id: 58, name: '牛肉（牛腩/500g）', category: '肉类', price: 45, originalPrice: 59, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-02-14.png' },
    { id: 59, name: '羊肉串', category: '肉类', price: 55, originalPrice: 72, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-02-24.png' },
    { id: 60, name: '烤肠', category: '肉类', price: 35, originalPrice: 46, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-02-32.png' },
    { id: 61, name: '北京烤鸭', category: '肉类', price: 20, originalPrice: 26, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-02-41.png' },
    { id: 62, name: '牛肉干', category: '肉类', price: 65, originalPrice: 85, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-02-59.png' },
    { id: 63, name: '酱排骨', category: '肉类', price: 55, originalPrice: 72, image: '../tupian/shangpin/roulei/Snipaste_2026-06-14_17-03-09.png' },
    
    // 十、零食（7种） - lingshi文件夹
    { id: 64, name: '零食大礼包）', category: '零食', price: 49, originalPrice: 64, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-03-29.png' },
    { id: 65, name: '零食大礼包）', category: '零食', price: 39, originalPrice: 51, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-03-42.png' },
    { id: 66, name: '零食大礼包', category: '零食', price: 15, originalPrice: 20, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-03-50.png' },
    { id: 67, name: '零食大礼包', category: '零食', price: 25, originalPrice: 33, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-04-06.png' },
    { id: 68, name: '零食大礼包', category: '零食', price: 29, originalPrice: 38, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-04-19.png' },
    { id: 69, name: '零食大礼包）', category: '零食', price: 19, originalPrice: 25, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-04-35.png' },
    { id: 70, name: '零食大礼包', category: '零食', price: 29, originalPrice: 38, image: '../tupian/shangpin/lingshi/Snipaste_2026-06-14_17-04-44.png' },
    
    // 十一、护肤（7种） - hufu文件夹
    { id: 71, name: '护肤品', category: '护肤', price: 69, originalPrice: 90, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-05-17.png' },
    { id: 72, name: '护肤品', category: '护肤', price: 49, originalPrice: 64, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-05-27.png' },
    { id: 73, name: '护肤品', category: '护肤', price: 129, originalPrice: 168, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-05-35.png' },
    { id: 74, name: '护肤品', category: '护肤', price: 89, originalPrice: 116, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-05-47.png' },
    { id: 75, name: '护肤品', category: '护肤', price: 159, originalPrice: 207, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-06-00.png' },
    { id: 76, name: '护肤品', category: '护肤', price: 79, originalPrice: 103, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-06-10.png' },
    { id: 77, name: '护肤品', category: '护肤', price: 119, originalPrice: 155, image: '../tupian/shangpin/hufu/Snipaste_2026-06-14_17-06-18.png' },
    
    // 十二、彩妆（7种） - caizhuang文件夹
    { id: 78, name: '彩妆', category: '彩妆', price: 89, originalPrice: 116, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-06-52.png' },
    { id: 79, name: '彩妆', category: '彩妆', price: 69, originalPrice: 90, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-07-07.png' },
    { id: 80, name: '彩妆', category: '彩妆', price: 129, originalPrice: 168, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-07-16.png' },
    { id: 81, name: '彩妆', category: '彩妆', price: 59, originalPrice: 77, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-07-25.png' },
    { id: 82, name: '彩妆', category: '彩妆', price: 49, originalPrice: 64, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-07-44.png' },
    { id: 83, name: '彩妆', category: '彩妆', price: 39, originalPrice: 51, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-07-54.png' },
    { id: 84, name: '彩妆', category: '彩妆', price: 59, originalPrice: 77, image: '../tupian/shangpin/caizhuang/Snipaste_2026-06-14_17-08-08.png' },
    
    // 十三、运动（7种） - yundong文件夹
    { id: 85, name: '运动', category: '运动', price: 359, originalPrice: 467, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-08-36.png' },
    { id: 86, name: '运动', category: '运动', price: 459, originalPrice: 597, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-08-53.png' },
    { id: 87, name: '运动', category: '运动', price: 129, originalPrice: 168, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-09-03.png' },
    { id: 88, name: '运动', category: '运动', price: 69, originalPrice: 90, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-09-15.png' },
    { id: 89, name: '运动', category: '运动', price: 89, originalPrice: 116, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-10-00.png' },
    { id: 90, name: '运动', category: '运动', price: 39, originalPrice: 51, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-10-19.png' },
    { id: 91, name: '运动', category: '运动', price: 49, originalPrice: 64, image: '../tupian/shangpin/yundong/Snipaste_2026-06-14_17-10-29.png' },
    
    // 十四、户外装备（7种） - huwaizhuangbei文件夹
    { id: 92, name: '户外', category: '户外装备', price: 299, originalPrice: 389, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-11-02.png' },
    { id: 93, name: '户外', category: '户外装备', price: 199, originalPrice: 259, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-11-19.png' },
    { id: 94, name: '户外', category: '户外装备', price: 89, originalPrice: 116, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-11-29.png' },
    { id: 95, name: '户外', category: '户外装备', price: 159, originalPrice: 207, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-11-42.png' },
    { id: 96, name: '户外', category: '户外装备', price: 59, originalPrice: 77, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-11-54.png' },
    { id: 97, name: '户外', category: '户外装备', price: 49, originalPrice: 64, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-12-07.png' },
    { id: 98, name: '户外', category: '户外装备', price: 69, originalPrice: 90, image: '../tupian/shangpin/huwaizhuangbei/Snipaste_2026-06-14_17-13-24.png' },
    
    // 十五、图书（7种） - tushu文件夹
    { id: 99, name: '图书', category: '图书', price: 49, originalPrice: 64, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-13-43.png' },
    { id: 100, name: '图书', category: '图书', price: 39, originalPrice: 51, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-13-59.png' },
    { id: 101, name: '图书', category: '图书', price: 29, originalPrice: 38, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-14-22.png' },
    { id: 102, name: '图书', category: '图书', price: 59, originalPrice: 77, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-14-50.png' },
    { id: 103, name: '图书', category: '图书', price: 45, originalPrice: 59, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-15-32.png' },
    { id: 104, name: '图书', category: '图书', price: 55, originalPrice: 72, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-16-11.png' },
    { id: 105, name: '图书', category: '图书', price: 39, originalPrice: 51, image: '../tupian/shangpin/tushu/Snipaste_2026-06-14_17-16-49.png' },
    
    // 十六、文具（7种） - wunju文件夹
    { id: 106, name: '文具', category: '玩具', price: 59, originalPrice: 77, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-17-08.png' },
    { id: 107, name: '文具', category: '玩具', price: 89, originalPrice: 116, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-17-23.png' },
    { id: 108, name: '文具', category: '玩具', price: 49, originalPrice: 64, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-17-32.png' },
    { id: 109, name: '文具', category: '玩具', price: 39, originalPrice: 51, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-17-42.png' },
    { id: 110, name: '文具', category: '玩具', price: 69, originalPrice: 90, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-19.png' },
    { id: 111, name: '文具', category: '玩具', price: 29, originalPrice: 38, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-31.png' },
    { id: 112, name: '文具', category: '玩具', price: 79, originalPrice: 103, image: '../tupian/shangpin/wunju/Snipaste_2026-06-14_17-18-53.png' }
];

const availableImages = [
    // 其他商品默认图片（用于没有指定图片的商品）
    '../tupian/Snipaste_2026-06-13_16-59-18.png',
    '../tupian/Snipaste_2026-06-13_16-51-27.png',
    '../tupian/Snipaste_2026-06-13_16-50-54.png',
    '../tupian/Snipaste_2026-06-13_16-50-44.png',
    '../tupian/Snipaste_2026-06-12_22-08-48.png',
    '../tupian/Snipaste_2026-06-12_22-08-34.png',
    '../tupian/Snipaste_2026-06-12_22-08-18.png',
    '../tupian/Snipaste_2026-06-12_22-08-00.png',
    '../tupian/Snipaste_2026-06-12_22-07-13.png',
    '../tupian/Snipaste_2026-06-12_22-06-55.png'
];

// 生成完整商品列表（添加id、原价、图片、评分）并乱序排列
function generateProducts() {
    const products = productData.map((item, index) => ({
        id: index + 1,
        name: item.name,
        category: item.category,
        price: item.price,
        originalPrice: item.price > 0 ? Math.floor(item.price * 1.3) : 0,
        // 优先使用商品数据中的图片，否则使用默认图片
        image: item.image || availableImages[index % availableImages.length],
        rating: (Math.random() * 2 + 3).toFixed(1)
    }));
    
    // Fisher-Yates 洗牌算法实现乱序
    for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
    }
    
    return products;
}

// 全局变量
const products = generateProducts();
const totalProducts = products.length; // 112个商品
const productsPerPage = 20;
const totalPages = Math.ceil(totalProducts / productsPerPage); // 6页
let currentPage = 1;

// 商品卡片模板
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `商品：${product.name}，价格${product.price > 0 ? '¥' + parseFloat(product.price).toFixed(2) : '价格待定'}`);
    card.setAttribute('data-product-id', product.id);
    
    // 标准化图片路径
    const imageSrc = normalizeImagePath(product.image);
    
    card.innerHTML = `
        <div class="product-image-wrapper" style="min-height: 160px;">
            <img 
                src="${imageSrc}" 
                alt="${product.name}" 
                class="product-image"
                loading="lazy"
                onload="this.style.opacity='1'; this.parentElement.querySelector('.image-loading')?.remove();"
                onerror="this.src='../tupian/Snipaste_2026-06-13_16-59-18.png'; this.style.opacity='1'; this.parentElement.querySelector('.image-loading')?.remove();"
                style="opacity: 0; transition: opacity 0.3s ease;"
            >
            <div class="image-loading">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </div>
        <div class="product-info">
            <span class="product-name" title="${product.name}">${product.name}</span>
            <div class="product-price-row">
                <span class="product-price">${product.price > 0 ? '¥' + parseFloat(product.price).toFixed(2) : '价格待定'}</span>
                ${product.price > 0 && product.originalPrice > 0 ? '<span class="product-original-price">¥' + parseFloat(product.originalPrice).toFixed(2) + '</span>' : ''}
            </div>
            <div class="product-actions">
                <button class="favorite-btn" aria-label="收藏商品" tabindex="0">
                    <i class="far fa-star"></i>
                </button>
                <button class="cart-btn" aria-label="加入购物车" tabindex="0">
                    <i class="fas fa-shopping-cart"></i>
                    <span>加入购物车</span>
                </button>
            </div>
        </div>
    `;
    
    // 在innerHTML之后添加点击事件
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // 检查是否点击的是按钮（收藏或购物车）
        if (e.target.closest('.favorite-btn') || e.target.closest('.cart-btn')) {
            return; // 如果点击的是按钮，不触发卡片点击
        }
        
        console.log('商品卡片被点击，商品ID:', product.id);
        const message = {
            type: 'navigate',
            url: `商品详情.html?id=${product.id}`
        };
        console.log('发送消息:', message);
        window.parent.postMessage(message, '*');
    });
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            console.log('商品卡片键盘Enter，商品ID:', product.id);
            window.parent.postMessage({
                type: 'navigate',
                url: `商品详情.html?id=${product.id}`
            }, '*');
        }
    });
    
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('favorited');
        const icon = this.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        icon.style.color = this.classList.contains('favorited') ? '#ffd700' : '#999';
    });
    
    const cartBtn = card.querySelector('.cart-btn');
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('added');
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        if (this.classList.contains('added')) {
            icon.style.color = '#ff4444';
            text.style.color = '#ff4444';
            text.textContent = '已加入';
        } else {
            icon.style.color = '#666';
            text.style.color = '#666';
            text.textContent = '加入购物车';
        }
    });
    
    return card;
}

// 空白盒子唯一ID计数器
let emptyCardIdCounter = 1;

// 创建空白占位符商品卡片（支持动态填充）
function createEmptyProductCard(productData = null) {
    // 生成唯一ID
    const uniqueId = `empty-card-${emptyCardIdCounter++}`;
    
    const card = document.createElement('div');
    card.id = uniqueId;
    card.className = 'product-card empty-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', productData ? `商品：${productData.name}` : '占位商品');
    card.setAttribute('data-product-id', productData ? productData.id : 'empty');
    
    // 如果有商品数据，直接填充实际内容
    if (productData) {
        fillEmptyCardWithProduct(card, productData);
    } else {
        // 显示空白占位符
        card.innerHTML = `
            <div class="product-image-wrapper empty-image">
                <div class="empty-placeholder">
                    <i class="fas fa-image"></i>
                </div>
            </div>
            <div class="product-info">
                <span class="product-name empty-text"></span>
                <div class="product-price-row">
                    <span class="product-price empty-text"></span>
                </div>
                <div class="product-actions">
                    <button class="favorite-btn empty-btn" aria-label="收藏商品" tabindex="0" disabled>
                        <i class="far fa-star"></i>
                    </button>
                    <button class="cart-btn empty-btn" aria-label="加入购物车" tabindex="0" disabled>
                        <i class="fas fa-shopping-cart"></i>
                        <span>加入购物车</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    return card;
}

// 将空白卡片填充为实际商品
function fillEmptyCardWithProduct(card, product) {
    // 更新卡片类名
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // 格式化价格（保留两位小数，包含货币符号）
    const formattedPrice = formatPrice(product.price);
    const formattedOriginalPrice = product.originalPrice ? formatPrice(product.originalPrice) : '';
    
    // 标准化图片路径
    const imageSrc = normalizeImagePath(product.image || product.mainImage);
    
    // 截取商品描述（最多显示50个字符）
    const shortDescription = product.intro || product.description || '';
    const truncatedDescription = shortDescription.length > 50 ? shortDescription.substring(0, 50) + '...' : shortDescription;
    
    card.innerHTML = `
        <div class="product-image-wrapper" style="min-height: 160px;">
            <img 
                src="${imageSrc}" 
                alt="${product.name}" 
                class="product-image"
                loading="lazy"
                onload="this.style.opacity='1'; this.parentElement.querySelector('.image-loading')?.remove();"
                onerror="this.src='../tupian/Snipaste_2026-06-13_16-59-18.png'; this.style.opacity='1'; this.parentElement.querySelector('.image-loading')?.remove();"
                style="opacity: 0; transition: opacity 0.3s ease;"
            >
            <div class="image-loading">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </div>
        <div class="product-info">
            <span class="product-name" title="${product.name}">${product.name}</span>
            ${truncatedDescription ? `<p class="product-description" title="${shortDescription}">${truncatedDescription}</p>` : ''}
            <div class="product-price-row">
                <span class="product-price">${formattedPrice}</span>
                ${formattedOriginalPrice ? '<span class="product-original-price">' + formattedOriginalPrice + '</span>' : ''}
            </div>
            <div class="product-actions">
                <button class="favorite-btn" aria-label="收藏商品" tabindex="0">
                    <i class="far fa-star"></i>
                </button>
                <button class="cart-btn" aria-label="加入购物车" tabindex="0">
                    <i class="fas fa-shopping-cart"></i>
                    <span>加入购物车</span>
                </button>
            </div>
        </div>
    `;
    
    // 添加交互事件
    card.style.cursor = 'pointer';
    
    // 收藏按钮点击事件
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#ffd700';
            showToast('已加入收藏');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            showToast('已取消收藏');
        }
    });
    
    // 购物车按钮点击事件
    const cartBtn = card.querySelector('.cart-btn');
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        icon.style.color = '#ff4444';
        text.style.color = '#ff4444';
        text.textContent = '已加入';
        showToast('已加入购物车');
        
        setTimeout(() => {
            icon.style.color = '#666';
            text.style.color = '#666';
            text.textContent = '加入购物车';
        }, 2000);
    });
    
    // 卡片点击事件（跳转到商品详情）
    card.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn') || e.target.closest('.cart-btn')) {
            return;
        }
        window.parent.postMessage({
            type: 'navigate',
            url: `商品详情.html?id=${product.id}`
        }, '*');
    });
    
    // 键盘事件
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.parent.postMessage({
                type: 'navigate',
                url: `商品详情.html?id=${product.id}`
            }, '*');
        }
    });
    
    return card;
}

// 格式化价格（保留两位小数，包含货币符号）
function formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) {
        return '¥0.00';
    }
    return '¥' + parseFloat(price).toFixed(2);
}

// 标准化图片路径（处理商家后台和首页的路径差异）
// xiahezi.html 在 html/ 目录下，图片在 tupian/ 目录下（同级）
// 所以正确路径应该是 ../tupian/
function normalizeImagePath(imagePath) {
    if (!imagePath) {
        return '../tupian/Snipaste_2026-06-13_16-59-18.png';
    }
    
    // Base64图片直接返回
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }
    
    // 绝对路径直接返回
    if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // 如果路径已经是 tupian/ 开头，需要加上 ../
    if (imagePath.startsWith('tupian/')) {
        return '../' + imagePath;
    }
    
    // 如果路径已经是 ../tupian/ 开头，直接返回
    if (imagePath.startsWith('../tupian/')) {
        return imagePath;
    }
    
    // 其他情况保持原样
    return imagePath;
}

// 创建商家店铺商品卡片（特殊样式）
function createStoreProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card store-product';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `商品：${product.name}，店铺：${product.storeName || ''}，价格${product.price > 0 ? '¥' + parseFloat(product.price).toFixed(2) : '价格待定'}`);
    card.setAttribute('data-product-id', product.id);
    
    // 标准化图片路径
    const imageSrc = normalizeImagePath(product.image || product.mainImage);
    
    card.innerHTML = `
        <!-- 上盒子 - 商品图片 -->
        <div class="product-image-wrapper" style="min-height: 160px;">
            <img 
                src="${imageSrc}" 
                alt="${product.name}" 
                class="product-image"
                loading="lazy"
                onload="this.style.opacity='1'; this.parentElement.querySelector('.image-loading')?.remove();"
                onerror="this.src='tupian/Snipaste_2026-06-13_16-59-18.png'; this.style.opacity='1'; this.parentElement.querySelector('.image-loading')?.remove();"
                style="opacity: 0; transition: opacity 0.3s ease;"
            >
            <div class="image-loading">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </div>
        <!-- 中盒子 - 商品信息（包含店铺名称） -->
        <div class="product-info store-info">
            ${product.storeName ? `<span class="store-name" title="${product.storeName}">${product.storeName}</span>` : ''}
            <span class="product-name" title="${product.name}">${product.name}</span>
            <div class="product-price-row">
                <span class="product-price">${product.price > 0 ? '¥' + parseFloat(product.price).toFixed(2) : '价格待定'}</span>
                ${product.price > 0 && product.originalPrice > 0 ? '<span class="product-original-price">¥' + parseFloat(product.originalPrice).toFixed(2) + '</span>' : ''}
            </div>
        </div>
        <!-- 下盒子 - 操作按钮 -->
        <div class="product-actions store-actions">
            <button class="favorite-btn" aria-label="收藏商品" tabindex="0">
                <i class="far fa-star"></i>
                <span>收藏</span>
            </button>
            <button class="cart-btn" aria-label="加入购物车" tabindex="0">
                <i class="fas fa-shopping-cart"></i>
                <span>加入购物车</span>
            </button>
        </div>
    `;
    
    // 在innerHTML之后添加点击事件
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // 检查是否点击的是按钮（收藏或购物车）
        if (e.target.closest('.favorite-btn') || e.target.closest('.cart-btn')) {
            return; // 如果点击的是按钮，不触发卡片点击
        }
        
        console.log('商家商品卡片被点击，商品ID:', product.id);
        const message = {
            type: 'navigate',
            url: `商品详情.html?id=${product.id}`
        };
        console.log('发送消息:', message);
        window.parent.postMessage(message, '*');
    });
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            console.log('商家商品卡片键盘Enter，商品ID:', product.id);
            window.parent.postMessage({
                type: 'navigate',
                url: `商品详情.html?id=${product.id}`
            }, '*');
        }
    });
    
    // 添加收藏按钮点击事件
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('favorited');
        const icon = this.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        icon.style.color = this.classList.contains('favorited') ? '#ffd700' : '#999';
    });
    
    // 添加购物车按钮点击事件
    const cartBtn = card.querySelector('.cart-btn');
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('added');
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        if (this.classList.contains('added')) {
            icon.style.color = '#ff4444';
            text.style.color = '#ff4444';
            text.textContent = '已加入';
        } else {
            icon.style.color = '#666';
            text.style.color = '#666';
            text.textContent = '加入购物车';
        }
    });
    
    return card;
}

// 渲染指定页码的商品（包含商家商品）
// 当前搜索关键词
let currentSearchKeyword = '';

async function renderProducts(page) {
    console.log('renderProducts被调用，页码:', page);
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('找不到productsGrid元素');
        return;
    }
    
    // 显示加载状态
    grid.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i>
            <span>加载商品中...</span>
        </div>
    `;
    
    let storeProducts = [];
    
    try {
        // 从API获取商家商品
        storeProducts = await getMerchantProducts();
        console.log('获取商家商品成功，数量:', storeProducts.length);
    } catch (error) {
        console.error('获取商家商品失败，使用localStorage:', error);
        storeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
        console.log('使用localStorage中的商家商品，数量:', storeProducts.length);
    }
    
    // 过滤掉无效的商家商品
    const validStoreProducts = storeProducts.filter(product => {
        const isValid = validateProductData(product);
        if (!isValid) {
            console.warn('跳过无效商家商品:', product);
        }
        return isValid;
    });
    
    console.log('商家商品数量:', validStoreProducts.length);
    if (validStoreProducts.length > 0) {
        console.log('商家商品列表:', validStoreProducts);
    }
    
    // 清空现有内容
    grid.innerHTML = '';
    
    // 添加过渡动画类
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';
    
    // 使用requestAnimationFrame确保DOM更新
    requestAnimationFrame(() => {
        // 批量添加商品卡片
        const fragment = document.createDocumentFragment();
        
        // 如果有搜索关键词，过滤商品
        let filteredProducts = [...productData];
        let filteredStoreProducts = [...validStoreProducts];
        
        if (currentSearchKeyword) {
            const keyword = currentSearchKeyword.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(keyword) ||
                p.category.toLowerCase().includes(keyword)
            );
            filteredStoreProducts = filteredStoreProducts.filter(p => 
                p.name.toLowerCase().includes(keyword) ||
                p.category.toLowerCase().includes(keyword)
            );
            console.log(`搜索"${currentSearchKeyword}"，普通商品找到${filteredProducts.length}个，商家商品找到${filteredStoreProducts.length}个`);
        }
        
        const totalProducts = filteredProducts.length;
        
        // 只有第一页显示商家商品和空白盒子（搜索模式下不显示空白盒子）
        if (page === 1) {
            // 第一页：普通商品 + 商家商品 + 空白盒子 = 20个
            // 计算需要的普通商品数量
            const totalCards = productsPerPage;
            const storeCount = filteredStoreProducts.length;
            const emptyCount = currentSearchKeyword ? 0 : 1;
            const normalCount = Math.max(0, totalCards - storeCount - emptyCount);
            
            console.log(`第一页：普通商品${normalCount}个 + 商家商品${storeCount}个 + 空白盒子${emptyCount}个 = ${totalCards}个`);
            
            // 添加普通商品（从索引0开始）
            for (let i = 0; i < normalCount && i < totalProducts; i++) {
                const card = createProductCard(filteredProducts[i]);
                fragment.appendChild(card);
            }
            
            // 添加商家发布的商品
            filteredStoreProducts.forEach((product) => {
                console.log('创建商家商品卡片:', product.name);
                const card = createStoreProductCard(product);
                fragment.appendChild(card);
            });
            
            // 如果不是搜索模式，添加一个空白占位符商品卡片
            if (!currentSearchKeyword) {
                fragment.appendChild(createEmptyProductCard());
            }
        } else {
            // 非第一页：只显示普通商品，每页20个
            // 注意：第一页已经显示了一部分普通商品，所以第二页需要跳过这些
            const storeCount = filteredStoreProducts.length;
            const emptyCount = currentSearchKeyword ? 0 : 1;
            const firstPageNormalCount = Math.max(0, productsPerPage - storeCount - emptyCount);
            const startIndex = firstPageNormalCount + (page - 2) * productsPerPage;
            const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
            const pageProducts = filteredProducts.slice(startIndex, endIndex);
            
            console.log(`第${page}页：从索引${startIndex}到${endIndex}，共${pageProducts.length}个普通商品`);
            
            pageProducts.forEach((product) => {
                const card = createProductCard(product);
                fragment.appendChild(card);
            });
        }
        
        // 如果搜索结果为空，显示提示
        if (fragment.children.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-search-result';
            emptyDiv.innerHTML = `
                <i class="fas fa-search"></i>
                <p>未找到与"${currentSearchKeyword}"相关的商品</p>
            `;
            fragment.appendChild(emptyDiv);
        }
        
        grid.appendChild(fragment);
        console.log('总商品卡片数量:', grid.children.length);
        
        // 触发过渡动画
        requestAnimationFrame(() => {
            grid.style.transition = 'all 0.3s ease-out';
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        });
    });
}

// 更新分页按钮状态
function updatePaginationButtons(page) {
    // 获取商家商品数量
    const storeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
    const validStoreProducts = storeProducts.filter(validateProductData);
    const storeCount = validStoreProducts.length;
    
    // 第一页显示的普通商品数量
    const firstPageNormalCount = Math.max(0, productsPerPage - storeCount - 1);
    
    // 剩余普通商品数量
    const remainingNormalCount = Math.max(0, totalProducts - firstPageNormalCount);
    
    // 总页数 = 1（第一页） + 剩余普通商品需要的页数
    const totalPages = 1 + Math.ceil(remainingNormalCount / productsPerPage);
    
    const paginationContainer = document.querySelector('.pagination-container');
    
    // 动态生成分页按钮
    let buttonsHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        buttonsHTML += `
            <button 
                class="pagination-btn ${i === page ? 'active' : ''}" 
                data-page="${i}" 
                ${i === page ? 'aria-current="page"' : ''}
                tabindex="0"
                aria-label="${i === page ? `第${i}页，当前页` : `第${i}页`}"
            >
                ${i}
            </button>
        `;
    }
    paginationContainer.innerHTML = buttonsHTML;
    
    // 更新当前页码
    currentPage = page;
}

// 初始化事件监听
function initEventListeners() {
    const paginationContainer = document.querySelector('.pagination-container');
    
    // 分页按钮点击事件（使用委托）
    paginationContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('pagination-btn')) {
            const page = parseInt(target.dataset.page);
            
            if (page !== currentPage) {
                updatePaginationButtons(page);
                renderProducts(page);
                
                // 滚动到商品区域顶部
                const productsBox = document.querySelector('.products-box');
                productsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // 键盘事件支持（使用委托）
    paginationContainer.addEventListener('keydown', (e) => {
        const target = e.target;
        
        if (target.classList.contains('pagination-btn')) {
            // 计算总页数（与updatePaginationButtons一致）
            const storeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
            const validStoreProducts = storeProducts.filter(validateProductData);
            const storeCount = validStoreProducts.length;
            const firstPageNormalCount = Math.max(0, productsPerPage - storeCount - 1);
            const remainingNormalCount = Math.max(0, totalProducts - firstPageNormalCount);
            const totalPages = 1 + Math.ceil(remainingNormalCount / productsPerPage);
            
            let nextPage = currentPage;
            
            switch (e.key) {
                case 'ArrowLeft':
                    nextPage = Math.max(1, currentPage - 1);
                    break;
                case 'ArrowRight':
                    nextPage = Math.min(totalPages, currentPage + 1);
                    break;
                case 'Home':
                    nextPage = 1;
                    break;
                case 'End':
                    nextPage = totalPages;
                    break;
                case 'Enter':
                    // 点击当前按钮不重复触发
                    return;
            }
            
            if (nextPage !== currentPage) {
                e.preventDefault();
                updatePaginationButtons(nextPage);
                renderProducts(nextPage);
                
                // 聚焦到对应的分页按钮
                const nextBtn = document.querySelector(`[data-page="${nextPage}"]`);
                if (nextBtn) {
                    nextBtn.focus();
                }
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                <span>正在加载商品...</span>
            </div>
        `;
    }
    
    try {
        console.log('开始初始化首页...');
        
        // 获取商家商品（用于计算分页）
        let storeProducts = [];
        try {
            storeProducts = await getMerchantProducts();
            console.log('获取商家商品成功，数量:', storeProducts.length);
        } catch (storeError) {
            console.error('获取商家商品失败:', storeError);
            storeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
            console.log('使用localStorage中的商家商品，数量:', storeProducts.length);
        }
        
        // 初始化分页按钮
        updatePaginationButtons(1);
        console.log('分页按钮初始化完成');
        
        // 渲染第一页商品
        await renderProducts(1);
        console.log('第一页商品渲染完成');
        
        // 初始化事件监听
        initEventListeners();
        console.log('事件监听器初始化完成');
        
        // 初始化商品发布监听
        initProductPublishListener();
        console.log('商品发布监听器初始化完成');
        
        const totalWithStore = totalProducts + storeProducts.length;
        const totalPages = Math.ceil(totalWithStore / productsPerPage);
        console.log(`商品分页组件初始化完成，共${totalWithStore}个商品（含${storeProducts.length}个商家商品），分${totalPages}页展示`);
    } catch (error) {
        console.error('页面初始化失败:', error);
        console.error('错误堆栈:', error.stack);
        
        if (grid) {
            grid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>商品加载失败，请刷新页面重试</span>
                    <div style="margin-top: 10px; font-size: 12px; color: #999;">
                        错误信息: ${error.message}
                    </div>
                </div>
            `;
        }
        showToast('页面初始化失败，请刷新重试', 'error');
    }
});

// 初始化商品发布监听
function initProductPublishListener() {
    let lastProductIds = new Set();
    
    function updateLastProductIds(products) {
        lastProductIds = new Set(products.map(p => p.id));
    }
    
    const initialProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
    updateLastProductIds(initialProducts);
    
    console.log('商品发布监听器初始化，当前商家商品数量:', lastProductIds.size);
    
    // 使用 setInterval 轮询检测商品变化（优先API）
    setInterval(async () => {
        try {
            let currentProducts = [];
            
            // 优先从API获取最新商品
            const apiProducts = await fetchMerchantProducts();
            
            if (apiProducts.length > 0) {
                localStorage.setItem('home_products', JSON.stringify(apiProducts));
                currentProducts = apiProducts;
            } else {
                currentProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
            }
            
            const currentIds = new Set(currentProducts.map(p => p.id));
            
            // 检测被删除的商品
            const deletedIds = [...lastProductIds].filter(id => !currentIds.has(id));
            if (deletedIds.length > 0) {
                console.log('轮询检测到', deletedIds.length, '个商品被删除:', deletedIds);
                
                deletedIds.forEach(productId => {
                    removeProductFromGrid(productId);
                });
            }
            
            // 检测新发布的商品
            const newIds = [...currentIds].filter(id => !lastProductIds.has(id));
            if (newIds.length > 0) {
                console.log('轮询检测到', newIds.length, '个新商品:', newIds);
                
                newIds.forEach(id => {
                    const product = currentProducts.find(p => p.id === id);
                    if (product && validateProductData(product)) {
                        addProductToGrid(product);
                    }
                });
            }
            
            updateLastProductIds(currentProducts);
            
        } catch (error) {
            console.error('检测商品变化时发生错误:', error);
        }
    }, 3000);
    
    // 使用 storage 事件监听（跨页面通信方案）
    window.addEventListener('storage', (event) => {
        if (event.key === 'home_products') {
            console.log('storage事件触发，home_products发生变化');
            
            try {
                const currentProducts = JSON.parse(event.newValue || '[]');
                const previousProducts = event.oldValue ? JSON.parse(event.oldValue) : [];
                
                const currentIds = new Set(currentProducts.map(p => p.id));
                const previousIds = new Set(previousProducts.map(p => p.id));
                
                // 检测被删除的商品
                const deletedIds = [...previousIds].filter(id => !currentIds.has(id));
                if (deletedIds.length > 0) {
                    console.log('storage事件检测到', deletedIds.length, '个商品被删除:', deletedIds);
                    
                    deletedIds.forEach(productId => {
                        removeProductFromGrid(productId);
                    });
                }
                
                // 检测新发布的商品
                const newIds = [...currentIds].filter(id => !previousIds.has(id));
                if (newIds.length > 0) {
                    console.log('storage事件检测到', newIds.length, '个新商品:', newIds);
                    
                    newIds.forEach(id => {
                        const product = currentProducts.find(p => p.id === id);
                        if (product && validateProductData(product)) {
                            addProductToGrid(product);
                        }
                    });
                }
                
                updateLastProductIds(currentProducts);
                
            } catch (error) {
                console.error('处理storage事件时发生错误:', error);
            }
        }
    });
    
    // 监听父页面消息（用于手动刷新和搜索）
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'refreshProducts') {
            console.log('收到刷新商品消息');
            refreshProducts();
        } else if (event.data && event.data.type === 'deleteProduct') {
            console.log('收到删除商品消息:', event.data.productId);
            removeProductFromGrid(event.data.productId);
        } else if (event.data && event.data.type === 'search') {
            console.log('收到搜索消息:', event.data.keyword);
            currentSearchKeyword = event.data.keyword;
            updatePaginationButtons(1);
            renderProducts(1);
        }
    });
}

// 从网格中移除指定ID的商品卡片
function removeProductFromGrid(productId) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('找不到productsGrid元素');
        return;
    }
    
    console.log('尝试移除商品卡片，商品ID:', productId);
    
    const card = grid.querySelector(`[data-product-id="${productId}"]`);
    
    if (card) {
        card.style.transition = 'all 0.3s ease-out';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.height = '0';
        card.style.margin = '0';
        card.style.padding = '0';
        
        setTimeout(() => {
            card.remove();
            console.log('商品卡片已移除:', productId);
            
            const emptyCard = grid.querySelector('.empty-card');
            if (!emptyCard && currentPage === 1) {
                const emptyCardElement = createEmptyProductCard();
                grid.appendChild(emptyCardElement);
                console.log('添加空白占位符卡片');
            }
            
            updatePaginationButtons(currentPage);
        }, 300);
    } else {
        console.warn('未找到商品卡片:', productId);
    }
}

// 验证商品数据完整性
function validateProductData(product) {
    if (!product) {
        console.warn('商品数据为空');
        return false;
    }
    if (!product.id && product.id !== 0) {
        console.warn('商品缺少ID:', product);
        return false;
    }
    if (!product.name) {
        console.warn('商品缺少名称:', product);
        return false;
    }
    // 价格可以为0，但不能为undefined/null/NaN
    if (product.price === undefined || product.price === null || isNaN(product.price)) {
        console.warn('商品价格无效:', product);
        return false;
    }
    // 图片可以为空字符串，但不能为undefined/null
    if (product.image === undefined || product.image === null) {
        console.warn('商品图片无效:', product);
        return false;
    }
    
    return true;
}

// 添加商品到网格末尾（优先填充空白卡片）
function addProductToGrid(product) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('找不到productsGrid元素');
        return;
    }
    
    console.log('开始添加商品:', product.name);
    
    // 查找空白占位符卡片
    const emptyCard = grid.querySelector('.empty-card');
    
    if (emptyCard) {
        console.log('找到空白卡片，开始填充...');
        
        // 设置加载状态
        emptyCard.innerHTML = `
            <div class="product-image-wrapper">
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>加载中...</span>
                </div>
            </div>
            <div class="product-info">
                <span class="product-name">加载中...</span>
                <div class="product-price-row">
                    <span class="product-price">¥--.--</span>
                </div>
                <div class="product-actions">
                    <button class="favorite-btn" aria-label="收藏商品" tabindex="0" disabled>
                        <i class="far fa-star"></i>
                    </button>
                    <button class="cart-btn" aria-label="加入购物车" tabindex="0" disabled>
                        <i class="fas fa-shopping-cart"></i>
                        <span>加入购物车</span>
                    </button>
                </div>
            </div>
        `;
        
        // 模拟网络延迟，展示加载状态
        setTimeout(() => {
            try {
                // 使用新数据填充空白卡片
                const filledCard = fillEmptyCardWithProduct(emptyCard, product);
                
                // 添加淡入动画
                filledCard.style.opacity = '0';
                filledCard.style.transform = 'scale(0.95)';
                
                requestAnimationFrame(() => {
                    filledCard.style.transition = 'all 0.4s ease-out';
                    filledCard.style.opacity = '1';
                    filledCard.style.transform = 'scale(1)';
                });
                
                console.log('空白卡片已填充为:', product.name);
                showToast('新商品已发布！');
            } catch (error) {
                console.error('填充空白卡片失败:', error);
                // 恢复空白卡片状态
                const newEmptyCard = createEmptyProductCard();
                emptyCard.parentNode.replaceChild(newEmptyCard, emptyCard);
                showToast('商品加载失败，请刷新页面重试', 'error');
            }
        }, 500);
    } else {
        console.log('未找到空白卡片，创建新卡片...');
        
        // 创建商品卡片
        const card = createStoreProductCard(product);
        
        // 设置初始状态用于动画
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.4s ease-out';
        
        // 添加到网格末尾
        grid.appendChild(card);
        
        // 触发动画
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        // 添加新的空白卡片
        grid.appendChild(createEmptyProductCard());
        
        console.log('新商品卡片已添加');
        showToast('新商品已发布！');
    }
}

// 刷新商品列表
function refreshProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('找不到productsGrid元素');
        return;
    }
    
    // 添加加载状态
    grid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';
    
    setTimeout(() => {
        // 更新分页按钮（确保总页数正确）
        updatePaginationButtons(currentPage);
        renderProducts(currentPage);
    }, 300);
}

// 更新分页信息
function updatePageInfo() {
    const storeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
    const validStoreProducts = storeProducts.filter(validateProductData);
    const totalWithStore = totalProducts + validStoreProducts.length;
    const newTotalPages = Math.ceil(totalWithStore / productsPerPage);
    
    if (newTotalPages !== totalPages) {
        totalPages = newTotalPages;
        console.log(`商品总数更新为${totalWithStore}，共${totalPages}页`);
    }
}

// Toast 消息提示函数
function showToast(message, type = 'success') {
    // 移除已存在的 toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的 toast
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}