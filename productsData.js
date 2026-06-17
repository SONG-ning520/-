// 所有商品数据 - 包含112个商品，16个分类，每个分类7种商品
// 图片路径使用实际存在的图片循环
const productImages = [
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-26-19.png',
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-02.png',
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-22.png',
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-36.png',
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-28-42.png',
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-43.png',
    '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-57.png',
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

// 商品完整数据
const allProducts = [
    // 一、电脑整机（7种）
    {
        id: 1,
        name: '惠普 HyperX 暗影精灵 PRO 16',
        category: '电脑整机',
        price: 8999,
        originalPrice: 11699,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-26-19.png',
        rating: 4.9,
        reviewCount: 20000,
        specs: {
            brand: '惠普 (HP)',
            model: '暗影精灵 PRO 16',
            processor: 'Intel Core Ultra7 255HX',
            graphics: 'NVIDIA RTX 5060 Laptop GPU',
            memory: '16GB DDR5',
            storage: '512GB PCIe SSD',
            screen: '16英寸 2.5K 240Hz IPS',
            weight: '2.3kg'
        },
        description: '全新一代暗影精灵PRO系列，搭载Intel Core Ultra处理器，配合RTX 50系列显卡，为游戏玩家带来极致体验。240Hz高刷新率屏幕，流畅无拖影。'
    },
    {
        id: 2,
        name: '华硕天选7 Pro Max',
        category: '电脑整机',
        price: 14999,
        originalPrice: 19499,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-02.png',
        rating: 4.8,
        reviewCount: 15000,
        specs: {
            brand: '华硕 (ASUS)',
            model: '天选7 Pro Max',
            processor: 'AMD Ryzen 9 9955HX',
            graphics: 'NVIDIA RTX 5070 Ti Laptop GPU',
            memory: '32GB DDR5',
            storage: '2TB PCIe SSD',
            screen: '18英寸 2.5K 300Hz IPS',
            weight: '2.6kg'
        },
        description: '天选系列旗舰机型，二次元美学设计，AMD锐龙9处理器搭配RTX 5070 Ti显卡，18英寸大屏幕带来沉浸式游戏体验。'
    },
    {
        id: 3,
        name: '惠普星Book Pro 16 2025',
        category: '电脑整机',
        price: 5948,
        originalPrice: 7732,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-22.png',
        rating: 4.7,
        reviewCount: 18000,
        specs: {
            brand: '惠普 (HP)',
            model: '星Book Pro 16 2025',
            processor: 'Intel Core Ultra5 125H',
            graphics: 'Intel Arc Graphics',
            memory: '16GB DDR5',
            storage: '512GB PCIe SSD',
            screen: '16英寸 2.5K 120Hz OLED',
            weight: '1.8kg'
        },
        description: '轻薄便携的生产力工具，OLED屏幕色彩鲜艳，适合办公和创意设计，长续航设计满足全天使用需求。'
    },
    {
        id: 4,
        name: '联想拯救者 R7000P 2025',
        category: '电脑整机',
        price: 10188,
        originalPrice: 13244,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-27-36.png',
        rating: 4.9,
        reviewCount: 25000,
        specs: {
            brand: '联想 (Lenovo)',
            model: '拯救者 R7000P 2025',
            processor: 'AMD Ryzen 9 8945HX',
            graphics: 'NVIDIA RTX 5060 Laptop GPU',
            memory: '16GB DDR5',
            storage: '1TB PCIe SSD',
            screen: '16英寸 2.5K 240Hz IPS',
            weight: '2.4kg'
        },
        description: '拯救者系列经典游戏本，霜刃散热系统，性能释放强劲，适合高端游戏和专业创作。'
    },
    {
        id: 5,
        name: '小米 Redmi Book 16 焕新版',
        category: '电脑整机',
        price: 3599,
        originalPrice: 4679,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-28-42.png',
        rating: 4.6,
        reviewCount: 30000,
        specs: {
            brand: '小米 (MI)',
            model: 'Redmi Book 16 焕新版',
            processor: 'Intel Core i5-13420H',
            graphics: 'Intel UHD Graphics',
            memory: '16GB DDR4',
            storage: '512GB PCIe SSD',
            screen: '16英寸 2.5K 120Hz IPS',
            weight: '1.7kg'
        },
        description: '高性价比轻薄本，2.5K高清屏幕，适合日常办公和学习，小米生态联动更便捷。'
    },
    {
        id: 6,
        name: '华硕天选7 Pro 酷睿版',
        category: '电脑整机',
        price: 8999,
        originalPrice: 11699,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-43.png',
        rating: 4.8,
        reviewCount: 12000,
        specs: {
            brand: '华硕 (ASUS)',
            model: '天选7 Pro 酷睿版',
            processor: 'Intel Core Ultra7 251HX',
            graphics: 'NVIDIA RTX 5060 Laptop GPU',
            memory: '16GB DDR5',
            storage: '1TB PCIe SSD',
            screen: '16英寸 2.5K 300Hz IPS',
            weight: '2.2kg'
        },
        description: '天选7 Pro酷睿版本，Intel处理器带来更强单核性能，300Hz高刷屏适合电竞玩家。'
    },
    {
        id: 7,
        name: '华硕无畏16Pro 锐龙AI版',
        category: '电脑整机',
        price: 4504,
        originalPrice: 5855,
        image: '../tupian/shangpin/diannao/Snipaste_2026-06-13_19-30-57.png',
        rating: 4.5,
        reviewCount: 8000,
        specs: {
            brand: '华硕 (ASUS)',
            model: '无畏16Pro 锐龙AI版',
            processor: 'AMD Ryzen AI 9-HX370',
            graphics: 'AMD Radeon 800M',
            memory: '16GB LPDDR5',
            storage: '512GB PCIe SSD',
            screen: '16英寸 2.5K 144Hz IPS',
            weight: '1.9kg'
        },
        description: '搭载AMD锐龙AI处理器，支持AI加速功能，适合创意设计和AI应用，性价比出众。'
    },
    
    // 二、外设配件（7种）
    {
        id: 8,
        name: '机械键盘（红轴/RGB背光）',
        category: '外设配件',
        price: 299,
        originalPrice: 389,
        image: productImages[7],
        rating: 4.7,
        reviewCount: 5000,
        specs: {
            brand: '通用',
            model: '机械键盘',
            switch: '红轴',
            backlight: 'RGB',
            keys: 87,
            connection: '有线/2.4G/蓝牙'
        },
        description: '采用红轴设计，打字手感舒适，RGB背光支持多种灯光效果，多模连接适配各种场景。'
    },
    {
        id: 9,
        name: '无线鼠标（静音/可充电）',
        category: '外设配件',
        price: 89,
        originalPrice: 116,
        image: productImages[8],
        rating: 4.5,
        reviewCount: 8000,
        specs: {
            brand: '通用',
            model: '无线鼠标',
            buttons: 6,
            dpi: 4000,
            battery: '6个月续航',
            connection: '2.4G无线'
        },
        description: '静音按键设计，深夜办公不打扰他人，可充电设计环保方便，人体工学造型长时间使用不累。'
    },
    {
        id: 10,
        name: '27寸4K显示器（IPS/144Hz）',
        category: '外设配件',
        price: 1899,
        originalPrice: 2469,
        image: productImages[9],
        rating: 4.8,
        reviewCount: 3000,
        specs: {
            brand: '通用',
            model: '27寸4K显示器',
            panel: 'IPS',
            resolution: '3840x2160',
            refreshRate: '144Hz',
            ports: 'HDMI/DP/USB-C'
        },
        description: '4K高清分辨率，144Hz刷新率，IPS面板色彩准确，适合游戏和专业设计。'
    },
    {
        id: 11,
        name: '蓝牙音箱（便携/防水）',
        category: '外设配件',
        price: 199,
        originalPrice: 259,
        image: productImages[10],
        rating: 4.4,
        reviewCount: 6000,
        specs: {
            brand: '通用',
            model: '蓝牙音箱',
            waterproof: 'IPX7',
            battery: '20小时',
            drivers: '双5W'
        },
        description: 'IPX7防水等级，可在浴室使用，20小时续航满足户外需求，立体声效果出色。'
    },
    {
        id: 12,
        name: 'USB扩展坞（Type-C/多口）',
        category: '外设配件',
        price: 129,
        originalPrice: 168,
        image: productImages[11],
        rating: 4.6,
        reviewCount: 4000,
        specs: {
            brand: '通用',
            model: 'USB扩展坞',
            ports: 'HDMI/USB3.0x3/SD/TF/PD',
            powerDelivery: '100W',
            compatibility: 'Type-C/Thunderbolt3/4'
        },
        description: '多接口合一，解决轻薄本接口不足问题，支持100W PD快充，办公必备神器。'
    },
    {
        id: 13,
        name: '摄像头（1080P/自动对焦）',
        category: '外设配件',
        price: 159,
        originalPrice: 207,
        image: productImages[12],
        rating: 4.5,
        reviewCount: 3500,
        specs: {
            brand: '通用',
            model: '高清摄像头',
            resolution: '1080P',
            autofocus: '支持',
            microphone: '双降噪麦克风',
            fieldOfView: '90度'
        },
        description: '1080P高清画质，自动对焦快速准确，内置降噪麦克风，视频会议清晰流畅。'
    },
    {
        id: 14,
        name: '电竞椅（人体工学/可躺）',
        category: '外设配件',
        price: 699,
        originalPrice: 909,
        image: productImages[13],
        rating: 4.7,
        reviewCount: 2500,
        specs: {
            brand: '通用',
            model: '电竞椅',
            material: 'PU皮',
            weightCapacity: '150kg',
            recline: '160度',
            armrests: '4D可调'
        },
        description: '人体工学设计，160度大角度后仰，4D扶手多向调节，久坐不累，游戏办公两相宜。'
    },
    
    // 三、女装（7种）
    {
        id: 15,
        name: '连衣裙（碎花/中长款）',
        category: '女装',
        price: 199,
        originalPrice: 259,
        image: productImages[14],
        rating: 4.6,
        reviewCount: 10000,
        specs: {
            brand: '通用',
            model: '碎花连衣裙',
            fabric: '雪纺',
            length: '中长款',
            sizes: 'S/M/L/XL',
            colors: '粉色/蓝色/白色'
        },
        description: '清新碎花图案，雪纺面料轻盈透气，中长款设计适合春夏季节，日常约会通勤皆宜。'
    },
    {
        id: 16,
        name: 'T恤（纯棉/基础款）',
        category: '女装',
        price: 59,
        originalPrice: 77,
        image: productImages[15],
        rating: 4.5,
        reviewCount: 15000,
        specs: {
            brand: '通用',
            model: '纯棉T恤',
            fabric: '100%棉',
            fit: '修身',
            sizes: 'S/M/L/XL/XXL',
            colors: '多色可选'
        },
        description: '100%纯棉面料，柔软舒适透气，基础款百搭，四季皆宜的经典单品。'
    },
    {
        id: 17,
        name: '牛仔裤（高腰/直筒）',
        category: '女装',
        price: 159,
        originalPrice: 207,
        image: productImages[16],
        rating: 4.7,
        reviewCount: 8000,
        specs: {
            brand: '通用',
            model: '高腰牛仔裤',
            fabric: '牛仔布',
            waist: '高腰',
            fit: '直筒',
            sizes: '25-30'
        },
        description: '高腰设计拉长腿部线条，直筒版型显瘦显腿直，经典牛仔蓝百搭不挑人。'
    },
    {
        id: 18,
        name: '针织开衫（宽松/春秋款）',
        category: '女装',
        price: 129,
        originalPrice: 168,
        image: productImages[0],
        rating: 4.4,
        reviewCount: 6000,
        specs: {
            brand: '通用',
            model: '针织开衫',
            fabric: '针织',
            fit: '宽松',
            sleeves: '长袖',
            colors: '多色可选'
        },
        description: '柔软针织面料，宽松版型遮肉显瘦，春秋季节必备单品，搭配T恤衬衫都好看。'
    },
    {
        id: 19,
        name: '风衣（中长款/英伦风）',
        category: '女装',
        price: 299,
        originalPrice: 389,
        image: productImages[1],
        rating: 4.6,
        reviewCount: 4000,
        specs: {
            brand: '通用',
            model: '英伦风衣',
            fabric: '聚酯纤维',
            length: '中长款',
            closure: '双排扣',
            sizes: 'S/M/L/XL'
        },
        description: '经典英伦风设计，双排扣中长款，春秋季节穿气质满满，防风又时尚。'
    },
    {
        id: 20,
        name: '卫衣（加绒/连帽）',
        category: '女装',
        price: 89,
        originalPrice: 116,
        image: productImages[2],
        rating: 4.5,
        reviewCount: 12000,
        specs: {
            brand: '通用',
            model: '连帽卫衣',
            fabric: '加绒',
            fit: '宽松',
            hood: '连帽',
            colors: '多色可选'
        },
        description: '加绒保暖设计，连帽款式休闲时尚，宽松版型舒适自在，秋冬必备单品。'
    },
    {
        id: 21,
        name: '半身裙（A字/高腰）',
        category: '女装',
        price: 99,
        originalPrice: 129,
        image: productImages[3],
        rating: 4.4,
        reviewCount: 7000,
        specs: {
            brand: '通用',
            model: 'A字半身裙',
            fabric: '西装料',
            waist: '高腰',
            length: '中裙',
            sizes: 'S/M/L/XL'
        },
        description: '高腰A字版型显瘦显高，西装面料挺括有型，适合通勤和日常穿搭。'
    },
    
    // 四、男装（7种）
    {
        id: 22,
        name: '衬衫（纯棉/商务）',
        category: '男装',
        price: 169,
        originalPrice: 220,
        image: productImages[4],
        rating: 4.6,
        reviewCount: 9000,
        specs: {
            brand: '通用',
            model: '商务衬衫',
            fabric: '纯棉',
            fit: '修身',
            collar: '标准领',
            colors: '白/蓝/黑'
        },
        description: '纯棉面料舒适透气，修身版型显精神，商务休闲两相宜，职场男士必备。'
    },
    {
        id: 23,
        name: 'T恤（纯棉/印花）',
        category: '男装',
        price: 69,
        originalPrice: 90,
        image: productImages[5],
        rating: 4.5,
        reviewCount: 11000,
        specs: {
            brand: '通用',
            model: '印花T恤',
            fabric: '纯棉',
            fit: '宽松',
            design: '印花',
            sizes: 'M/L/XL/XXL'
        },
        description: '潮流印花设计，纯棉面料舒适透气，宽松版型适合日常休闲穿搭。'
    },
    {
        id: 24,
        name: '牛仔裤（直筒/弹力）',
        category: '男装',
        price: 149,
        originalPrice: 194,
        image: productImages[6],
        rating: 4.7,
        reviewCount: 8500,
        specs: {
            brand: '通用',
            model: '直筒牛仔裤',
            fabric: '牛仔布+弹力',
            fit: '直筒',
            waist: '中腰',
            sizes: '28-36'
        },
        description: '弹力牛仔面料舒适不紧绷，直筒版型经典百搭，四季皆宜的基础款。'
    },
    {
        id: 25,
        name: '夹克（工装/休闲）',
        category: '男装',
        price: 249,
        originalPrice: 324,
        image: productImages[7],
        rating: 4.5,
        reviewCount: 5000,
        specs: {
            brand: '通用',
            model: '工装夹克',
            fabric: '聚酯纤维',
            style: '工装',
            pockets: '多口袋',
            sizes: 'M/L/XL/XXL'
        },
        description: '工装风格设计，多口袋实用，休闲百搭，春秋季节穿帅气有型。'
    },
    {
        id: 26,
        name: '卫衣（连帽/加绒）',
        category: '男装',
        price: 99,
        originalPrice: 129,
        image: productImages[8],
        rating: 4.4,
        reviewCount: 10000,
        specs: {
            brand: '通用',
            model: '连帽卫衣',
            fabric: '加绒',
            fit: '宽松',
            hood: '连帽',
            colors: '多色可选'
        },
        description: '加绒保暖，连帽设计时尚休闲，宽松版型舒适自在，秋冬必备。'
    },
    {
        id: 27,
        name: '西装（商务/修身）',
        category: '男装',
        price: 599,
        originalPrice: 779,
        image: productImages[9],
        rating: 4.7,
        reviewCount: 3000,
        specs: {
            brand: '通用',
            model: '商务西装',
            fabric: '羊毛混纺',
            fit: '修身',
            pieces: '两件套',
            sizes: '46-54'
        },
        description: '修身版型显身材，羊毛混纺面料质感好，商务场合穿着得体大方。'
    },
    {
        id: 28,
        name: '休闲裤（商务/直筒）',
        category: '男装',
        price: 129,
        originalPrice: 168,
        image: productImages[10],
        rating: 4.6,
        reviewCount: 7000,
        specs: {
            brand: '通用',
            model: '休闲裤',
            fabric: '聚酯纤维',
            fit: '直筒',
            waist: '中腰',
            colors: '黑/灰/藏青'
        },
        description: '垂感好不易皱，直筒版型显腿直，商务休闲都能穿，职场男士必备单品。'
    },
    
    // 五、鞋靴（7种）
    {
        id: 29,
        name: '运动鞋（跑步/轻便）',
        category: '鞋靴',
        price: 299,
        originalPrice: 389,
        image: productImages[11],
        rating: 4.7,
        reviewCount: 12000,
        specs: {
            brand: '通用',
            model: '跑步鞋',
            upper: '网面',
            sole: '橡胶',
            closure: '系带',
            sizes: '39-45'
        },
        description: '网面透气设计，轻便舒适，缓震鞋底适合跑步运动，日常穿搭也好看。'
    },
    {
        id: 30,
        name: '皮鞋（商务/真皮）',
        category: '鞋靴',
        price: 399,
        originalPrice: 519,
        image: productImages[12],
        rating: 4.6,
        reviewCount: 5000,
        specs: {
            brand: '通用',
            model: '商务皮鞋',
            upper: '真皮',
            sole: '橡胶',
            closure: '系带',
            sizes: '38-44'
        },
        description: '真皮材质质感好，舒适透气不磨脚，商务场合穿着得体，职场男士必备。'
    },
    {
        id: 31,
        name: '帆布鞋（休闲/百搭）',
        category: '鞋靴',
        price: 89,
        originalPrice: 116,
        image: productImages[13],
        rating: 4.5,
        reviewCount: 15000,
        specs: {
            brand: '通用',
            model: '帆布鞋',
            upper: '帆布',
            sole: '橡胶',
            closure: '系带',
            colors: '多色可选'
        },
        description: '经典帆布鞋设计，百搭时尚，轻便舒适，适合日常休闲穿搭。'
    },
    {
        id: 32,
        name: '马丁靴（英伦/短筒）',
        category: '鞋靴',
        price: 199,
        originalPrice: 259,
        image: productImages[14],
        rating: 4.6,
        reviewCount: 6000,
        specs: {
            brand: '通用',
            model: '马丁靴',
            upper: 'PU皮',
            sole: '橡胶',
            height: '短筒',
            sizes: '35-43'
        },
        description: '英伦风马丁靴，短筒设计显腿长，百搭时尚，秋冬季节必备单品。'
    },
    {
        id: 33,
        name: '拖鞋（居家/防滑）',
        category: '鞋靴',
        price: 29,
        originalPrice: 38,
        image: productImages[15],
        rating: 4.4,
        reviewCount: 20000,
        specs: {
            brand: '通用',
            model: '居家拖鞋',
            material: 'EVA',
            sole: '防滑',
            style: '全包',
            sizes: '36-45'
        },
        description: 'EVA材质轻便舒适，防滑鞋底安全，居家必备，四季皆宜。'
    },
    {
        id: 34,
        name: '凉鞋（夏季/透气）',
        category: '鞋靴',
        price: 129,
        originalPrice: 168,
        image: productImages[16],
        rating: 4.5,
        reviewCount: 8000,
        specs: {
            brand: '通用',
            model: '凉鞋',
            upper: '真皮',
            sole: '橡胶',
            style: '沙滩',
            sizes: '37-44'
        },
        description: '真皮材质舒适透气，沙滩凉鞋款式，夏季海边度假必备。'
    },
    {
        id: 35,
        name: '棉鞋（冬季/保暖）',
        category: '鞋靴',
        price: 159,
        originalPrice: 207,
        image: productImages[0],
        rating: 4.6,
        reviewCount: 4000,
        specs: {
            brand: '通用',
            model: '棉鞋',
            upper: 'PU皮',
            lining: '加绒',
            sole: '防滑',
            sizes: '35-44'
        },
        description: '加绒保暖设计，防滑鞋底安全，冬季必备，居家外出都能穿。'
    },
    
    // 六、数码配件（7种）
    {
        id: 36,
        name: '充电宝（大容量/快充）',
        category: '数码配件',
        price: 129,
        originalPrice: 168,
        image: productImages[1],
        rating: 4.7,
        reviewCount: 15000,
        specs: {
            brand: '通用',
            model: '充电宝',
            capacity: '20000mAh',
            output: '22.5W快充',
            ports: 'USB-A/USB-C/Lightning',
            weight: '350g'
        },
        description: '20000mAh大容量，支持22.5W快充，多接口适配各种设备，出行必备。'
    },
    {
        id: 37,
        name: '耳机（无线/降噪）',
        category: '数码配件',
        price: 299,
        originalPrice: 389,
        image: productImages[2],
        rating: 4.8,
        reviewCount: 6000,
        specs: {
            brand: '通用',
            model: '无线耳机',
            type: '入耳式',
            battery: '6+24小时',
            noiseCancelling: '主动降噪',
            connection: '蓝牙5.3'
        },
        description: '主动降噪功能，蓝牙5.3稳定连接，音质出色，适合通勤和运动。'
    },
    {
        id: 38,
        name: '数据线（快充/编织）',
        category: '数码配件',
        price: 39,
        originalPrice: 51,
        image: productImages[3],
        rating: 4.5,
        reviewCount: 18000,
        specs: {
            brand: '通用',
            model: '数据线',
            type: 'USB-C',
            length: '1.5m',
            material: '编织',
            output: '100W'
        },
        description: '编织材质耐用不易断，支持100W快充，1.5米长度使用方便。'
    },
    {
        id: 39,
        name: '充电器（GaN/多口）',
        category: '数码配件',
        price: 89,
        originalPrice: 116,
        image: productImages[4],
        rating: 4.6,
        reviewCount: 8000,
        specs: {
            brand: '通用',
            model: 'GaN充电器',
            power: '65W',
            ports: 'USB-A/USB-C',
            size: '迷你',
            compatibility: '多设备'
        },
        description: 'GaN材质小巧便携，65W大功率，多口输出同时充多个设备。'
    },
    {
        id: 40,
        name: '手机壳（防摔/透明）',
        category: '数码配件',
        price: 29,
        originalPrice: 38,
        image: productImages[5],
        rating: 4.4,
        reviewCount: 25000,
        specs: {
            brand: '通用',
            model: '透明手机壳',
            material: 'TPU',
            protection: '防摔',
            design: '透明',
            compatibility: '多机型'
        },
        description: '透明设计不遮挡手机外观，TPU材质防摔抗震，轻薄不厚重。'
    },
    {
        id: 41,
        name: '钢化膜（高清/防指纹）',
        category: '数码配件',
        price: 19,
        originalPrice: 25,
        image: productImages[6],
        rating: 4.5,
        reviewCount: 30000,
        specs: {
            brand: '通用',
            model: '钢化膜',
            material: '钢化玻璃',
            hardness: '9H',
            features: '防指纹/防刮',
            compatibility: '多机型'
        },
        description: '9H硬度防刮耐磨，防指纹涂层保持屏幕清洁，高清透光不影响显示。'
    },
    {
        id: 42,
        name: 'U盘（高速/大容量）',
        category: '数码配件',
        price: 69,
        originalPrice: 90,
        image: productImages[7],
        rating: 4.6,
        reviewCount: 10000,
        specs: {
            brand: '通用',
            model: 'U盘',
            capacity: '128GB',
            interface: 'USB3.2',
            speed: '高速',
            design: '金属'
        },
        description: 'USB3.2高速传输，128GB大容量，金属外壳耐用，商务办公必备。'
    },
    
    // 七、食品（7种）
    {
        id: 43,
        name: '坚果礼盒（混合/每日坚果）',
        category: '食品',
        price: 89,
        originalPrice: 116,
        image: productImages[8],
        rating: 4.7,
        reviewCount: 12000,
        specs: {
            brand: '通用',
            model: '坚果礼盒',
            contents: '核桃/杏仁/腰果/榛子/葡萄干',
            weight: '500g',
            packaging: '独立小包',
            shelfLife: '6个月'
        },
        description: '精选多种坚果果干，独立小包方便携带，每日一包补充营养。'
    },
    {
        id: 44,
        name: '巧克力（黑巧/礼盒装）',
        category: '食品',
        price: 69,
        originalPrice: 90,
        image: productImages[9],
        rating: 4.6,
        reviewCount: 8000,
        specs: {
            brand: '通用',
            model: '黑巧克力',
            cocoa: '70%',
            weight: '200g',
            packaging: '礼盒',
            shelfLife: '12个月'
        },
        description: '70%可可含量，口感醇厚，礼盒包装适合送礼，情人节必备。'
    },
    {
        id: 45,
        name: '饼干（曲奇/手工）',
        category: '食品',
        price: 39,
        originalPrice: 51,
        image: productImages[10],
        rating: 4.5,
        reviewCount: 15000,
        specs: {
            brand: '通用',
            model: '曲奇饼干',
            flavor: '黄油',
            weight: '300g',
            packaging: '罐装',
            shelfLife: '6个月'
        },
        description: '手工黄油曲奇，酥香可口，罐装保存新鲜，下午茶必备零食。'
    },
    {
        id: 46,
        name: '茶叶（绿茶/明前龙井）',
        category: '食品',
        price: 199,
        originalPrice: 259,
        image: productImages[11],
        rating: 4.8,
        reviewCount: 5000,
        specs: {
            brand: '通用',
            model: '明前龙井',
            origin: '浙江杭州',
            grade: '特级',
            weight: '100g',
            shelfLife: '18个月'
        },
        description: '明前采摘特级龙井，香气清幽，汤色清澈，品味春天的味道。'
    },
    {
        id: 47,
        name: '咖啡（速溶/冻干）',
        category: '食品',
        price: 59,
        originalPrice: 77,
        image: productImages[12],
        rating: 4.6,
        reviewCount: 10000,
        specs: {
            brand: '通用',
            model: '冻干咖啡',
            type: '黑咖啡',
            count: '20包',
            flavor: '原味',
            shelfLife: '24个月'
        },
        description: '冻干工艺保留香气，无添加糖，方便快捷，上班族必备。'
    },
    {
        id: 48,
        name: '蜂蜜（天然/农家）',
        category: '食品',
        price: 79,
        originalPrice: 103,
        image: productImages[13],
        rating: 4.7,
        reviewCount: 6000,
        specs: {
            brand: '通用',
            model: '农家蜂蜜',
            type: '百花蜜',
            weight: '500g',
            origin: '山区',
            shelfLife: '24个月'
        },
        description: '农家自产百花蜜，口感醇厚，无添加天然纯正，养生佳品。'
    },
    {
        id: 49,
        name: '零食大礼包（混合/网红）',
        category: '食品',
        price: 129,
        originalPrice: 168,
        image: productImages[14],
        rating: 4.5,
        reviewCount: 9000,
        specs: {
            brand: '通用',
            model: '零食礼包',
            contents: '薯片/坚果/糖果/肉干等',
            pieces: '50+',
            packaging: '礼盒',
            shelfLife: '6个月'
        },
        description: '精选50+种网红零食，礼盒包装适合送礼，追剧必备。'
    },
    
    // 八、图书（7种）
    {
        id: 50,
        name: '小说（悬疑/畅销）',
        category: '图书',
        price: 49,
        originalPrice: 64,
        image: productImages[15],
        rating: 4.8,
        reviewCount: 15000,
        specs: {
            brand: '通用',
            model: '悬疑小说',
            genre: '悬疑推理',
            pages: '352',
            binding: '平装',
            language: '中文'
        },
        description: '年度畅销悬疑小说，情节跌宕起伏，层层反转，通宵也要读完。'
    },
    {
        id: 51,
        name: '儿童读物（绘本/注音）',
        category: '图书',
        price: 29,
        originalPrice: 38,
        image: productImages[16],
        rating: 4.7,
        reviewCount: 18000,
        specs: {
            brand: '通用',
            model: '儿童绘本',
            age: '3-6岁',
            pages: '48',
            binding: '精装',
            features: '注音/彩图'
        },
        description: '精美彩图注音绘本，适合亲子共读，培养孩子阅读兴趣。'
    },
    {
        id: 52,
        name: '历史传记（名人故事）',
        category: '图书',
        price: 59,
        originalPrice: 77,
        image: productImages[0],
        rating: 4.6,
        reviewCount: 6000,
        specs: {
            brand: '通用',
            model: '历史传记',
            subject: '名人传记',
            pages: '420',
            binding: '平装',
            language: '中文'
        },
        description: '讲述名人传奇一生，激励人心，了解历史汲取智慧。'
    },
    {
        id: 53,
        name: '心理学（自我成长类）',
        category: '图书',
        price: 45,
        originalPrice: 59,
        image: productImages[1],
        rating: 4.7,
        reviewCount: 8000,
        specs: {
            brand: '通用',
            model: '心理学书籍',
            genre: '心理学',
            pages: '288',
            binding: '平装',
            language: '中文'
        },
        description: '通俗易懂的心理学入门，帮助了解自己，实现自我成长。'
    },
    {
        id: 54,
        name: '投资理财（实操指南）',
        category: '图书',
        price: 55,
        originalPrice: 72,
        image: productImages[2],
        rating: 4.6,
        reviewCount: 7000,
        specs: {
            brand: '通用',
            model: '理财书籍',
            genre: '投资理财',
            pages: '320',
            binding: '平装',
            language: '中文'
        },
        description: '实操性强的理财指南，从零开始学习投资，实现财富增值。'
    },
    {
        id: 55,
        name: '外语学习（语法+词汇）',
        category: '图书',
        price: 39,
        originalPrice: 51,
        image: productImages[3],
        rating: 4.5,
        reviewCount: 10000,
        specs: {
            brand: '通用',
            model: '英语学习',
            subject: '英语',
            pages: '256',
            binding: '平装',
            features: '语法+词汇'
        },
        description: '系统学习英语语法和词汇，适合备考和日常学习。'
    },
    {
        id: 56,
        name: '漫画（日系/经典）',
        category: '图书',
        price: 35,
        originalPrice: 46,
        image: productImages[4],
        rating: 4.8,
        reviewCount: 12000,
        specs: {
            brand: '通用',
            model: '漫画书',
            origin: '日本',
            volumes: '单册',
            binding: '平装',
            language: '中文'
        },
        description: '经典日系漫画，画风精美故事精彩，童年回忆杀。'
    },
    
    // 继续添加剩余商品（简化版本，使用循环图片）
    // 九、家居用品（7种）
    { id: 57, name: '枕头（记忆棉/护颈）', category: '家居用品', price: 129, originalPrice: 168, image: productImages[5], rating: 4.6, reviewCount: 8000, specs: { brand: '通用', material: '记忆棉', type: '护颈', size: '标准' }, description: '记忆棉材质贴合颈椎，缓解疲劳，改善睡眠质量。' },
    { id: 58, name: '被子（羽绒/保暖）', category: '家居用品', price: 299, originalPrice: 389, image: productImages[6], rating: 4.7, reviewCount: 5000, specs: { brand: '通用', material: '羽绒', weight: '2kg', season: '冬季' }, description: '90%白鸭绒填充，轻盈保暖，冬季必备。' },
    { id: 59, name: '毛巾（纯棉/柔软）', category: '家居用品', price: 39, originalPrice: 51, image: productImages[7], rating: 4.5, reviewCount: 15000, specs: { brand: '通用', material: '纯棉', count: '3条', color: '多色' }, description: '新疆长绒棉，柔软吸水不掉毛，家庭必备。' },
    { id: 60, name: '收纳盒（塑料/抽屉）', category: '家居用品', price: 29, originalPrice: 38, image: productImages[8], rating: 4.4, reviewCount: 12000, specs: { brand: '通用', material: '塑料', size: '多规格', color: '透明' }, description: '透明设计一目了然，分类收纳让家居更整洁。' },
    { id: 61, name: '垃圾桶（带盖/脚踏）', category: '家居用品', price: 49, originalPrice: 64, image: productImages[9], rating: 4.5, reviewCount: 7000, specs: { brand: '通用', material: '塑料', capacity: '12L', type: '脚踏' }, description: '脚踏开盖免接触，带盖设计防异味，厨房客厅皆宜。' },
    { id: 62, name: '晾衣架（落地/折叠）', category: '家居用品', price: 89, originalPrice: 116, image: productImages[10], rating: 4.6, reviewCount: 6000, specs: { brand: '通用', material: '不锈钢', type: '落地折叠', capacity: '20kg' }, description: '不锈钢材质结实耐用，折叠设计节省空间，晾晒方便。' },
    { id: 63, name: '地毯（客厅/防滑）', category: '家居用品', price: 199, originalPrice: 259, image: productImages[11], rating: 4.5, reviewCount: 4000, specs: { brand: '通用', material: '涤纶', size: '1.4x2m', backing: '防滑' }, description: '北欧风格简约设计，防滑底背安全，提升家居格调。' },
    
    // 十、美妆护肤（7种）
    { id: 64, name: '面膜（补水/保湿）', category: '美妆护肤', price: 59, originalPrice: 77, image: productImages[12], rating: 4.7, reviewCount: 18000, specs: { brand: '通用', type: '贴片', count: '10片', function: '补水保湿' }, description: '深层补水保湿，敷一片水润透亮，日常护肤必备。' },
    { id: 65, name: '面霜（抗皱/紧致）', category: '美妆护肤', price: 199, originalPrice: 259, image: productImages[13], rating: 4.6, reviewCount: 8000, specs: { brand: '通用', type: '面霜', function: '抗皱紧致', capacity: '50ml' }, description: '抗皱紧致配方，淡化细纹，让肌肤焕发青春光彩。' },
    { id: 66, name: '口红（哑光/显白）', category: '美妆护肤', price: 89, originalPrice: 116, image: productImages[14], rating: 4.8, reviewCount: 12000, specs: { brand: '通用', finish: '哑光', color: '正红', capacity: '3.5g' }, description: '丝绒哑光质地，显白不挑肤色，气场全开。' },
    { id: 67, name: '粉底液（持妆/遮瑕）', category: '美妆护肤', price: 129, originalPrice: 168, image: productImages[15], rating: 4.6, reviewCount: 9000, specs: { brand: '通用', function: '持妆遮瑕', coverage: '中等', finish: '自然' }, description: '持妆8小时不脱妆，遮瑕力强，打造完美底妆。' },
    { id: 68, name: '眼影盘（大地色/日常）', category: '美妆护肤', price: 69, originalPrice: 90, image: productImages[16], rating: 4.5, reviewCount: 10000, specs: { brand: '通用', colors: '16色', type: '大地色系', finish: '珠光哑光' }, description: '日常百搭大地色系，珠光哑光兼备，新手也能轻松驾驭。' },
    { id: 69, name: '卸妆水（温和/敏感肌）', category: '美妆护肤', price: 49, originalPrice: 64, image: productImages[0], rating: 4.6, reviewCount: 15000, specs: { brand: '通用', type: '卸妆水', capacity: '500ml', suitable: '敏感肌' }, description: '温和配方不刺激，敏感肌也能用，轻松卸除彩妆。' },
    { id: 70, name: '精华液（美白/提亮）', category: '美妆护肤', price: 249, originalPrice: 324, image: productImages[1], rating: 4.7, reviewCount: 6000, specs: { brand: '通用', function: '美白提亮', ingredients: '烟酰胺', capacity: '30ml' }, description: '高浓度烟酰胺，美白提亮肤色，改善暗沉。' },
    
    // 十一、母婴用品（7种）
    { id: 71, name: '纸尿裤（婴儿/透气）', category: '母婴用品', price: 89, originalPrice: 116, image: productImages[2], rating: 4.7, reviewCount: 20000, specs: { brand: '通用', size: 'M', count: '60片', feature: '透气干爽' }, description: '3层透气设计，干爽不闷热，宝宝屁屁更舒适。' },
    { id: 72, name: '奶粉（婴儿配方）', category: '母婴用品', price: 299, originalPrice: 389, image: productImages[3], rating: 4.8, reviewCount: 10000, specs: { brand: '通用', stage: '1段', weight: '900g', type: '配方奶粉' }, description: '科学配方接近母乳，营养均衡，宝宝健康成长。' },
    { id: 73, name: '奶瓶（玻璃/宽口）', category: '母婴用品', price: 49, originalPrice: 64, image: productImages[4], rating: 4.6, reviewCount: 12000, specs: { brand: '通用', material: '玻璃', capacity: '240ml', type: '宽口' }, description: '高硼硅玻璃材质，宽口易清洗，安全放心。' },
    { id: 74, name: '湿巾（婴儿/无酒精）', category: '母婴用品', price: 29, originalPrice: 38, image: productImages[5], rating: 4.5, reviewCount: 18000, specs: { brand: '通用', count: '80片', feature: '无酒精', packaging: '带盖' }, description: '无酒精配方温和不刺激，加厚材质不易破，宝宝日常护理必备。' },
    { id: 75, name: '婴儿车（轻便/折叠）', category: '母婴用品', price: 399, originalPrice: 519, image: productImages[6], rating: 4.6, reviewCount: 5000, specs: { brand: '通用', type: '轻便折叠', weight: '6kg', capacity: '15kg' }, description: '一键折叠轻便出行，四轮避震舒适安全。' },
    { id: 76, name: '安抚奶嘴（硅胶/柔软）', category: '母婴用品', price: 29, originalPrice: 38, image: productImages[7], rating: 4.4, reviewCount: 8000, specs: { brand: '通用', material: '硅胶', age: '0-6个月', count: '2个' }, description: '柔软硅胶材质，仿母乳设计，安抚宝宝情绪。' },
    { id: 77, name: '辅食机（多功能/蒸煮）', category: '母婴用品', price: 199, originalPrice: 259, image: productImages[8], rating: 4.5, reviewCount: 4000, specs: { brand: '通用', function: '蒸煮搅拌一体', capacity: '600ml', material: '不锈钢' }, description: '蒸煮搅拌一体，轻松制作宝宝辅食，营养不流失。' },
    
    // 十二、运动户外（7种）
    { id: 78, name: '瑜伽垫（防滑/加厚）', category: '运动户外', price: 69, originalPrice: 90, image: productImages[9], rating: 4.6, reviewCount: 10000, specs: { brand: '通用', material: 'TPE', thickness: '6mm', feature: '防滑' }, description: '6mm加厚设计，TPE环保材质，防滑耐用，瑜伽健身必备。' },
    { id: 79, name: '哑铃（可调/家用）', category: '运动户外', price: 199, originalPrice: 259, image: productImages[10], rating: 4.5, reviewCount: 5000, specs: { brand: '通用', type: '可调节', weight: '20kg', material: '水泥' }, description: '可调节重量设计，满足不同训练需求，家庭健身好帮手。' },
    { id: 80, name: '运动水壶（大容量/保温）', category: '运动户外', price: 89, originalPrice: 116, image: productImages[11], rating: 4.7, reviewCount: 8000, specs: { brand: '通用', capacity: '1L', insulation: '24小时', material: '不锈钢' }, description: '304不锈钢材质，24小时保温保冷，运动出行必备。' },
    { id: 81, name: '登山包（户外/防水）', category: '运动户外', price: 199, originalPrice: 259, image: productImages[12], rating: 4.6, reviewCount: 4000, specs: { brand: '通用', capacity: '40L', feature: '防水', compartments: '多仓' }, description: '防水面料，多仓位设计，适合户外登山旅行。' },
    { id: 82, name: '速干衣（运动/透气）', category: '运动户外', price: 99, originalPrice: 129, image: productImages[13], rating: 4.5, reviewCount: 7000, specs: { brand: '通用', material: '速干面料', fit: '修身', feature: '透气' }, description: '速干透气面料，运动出汗不粘身，保持干爽舒适。' },
    { id: 83, name: '跳绳（计数/负重）', category: '运动户外', price: 39, originalPrice: 51, image: productImages[14], rating: 4.5, reviewCount: 12000, specs: { brand: '通用', type: '计数负重', material: '钢丝', length: '可调' }, description: '智能计数功能，负重设计燃脂更快，居家健身神器。' },
    { id: 84, name: '护腕（运动/加压）', category: '运动户外', price: 29, originalPrice: 38, image: productImages[15], rating: 4.4, reviewCount: 6000, specs: { brand: '通用', material: '弹性面料', function: '加压防护', count: '2只' }, description: '弹性加压设计，保护手腕关节，运动必备护具。' },
    
    // 十三、汽车用品（7种）
    { id: 85, name: '行车记录仪（高清/夜视）', category: '汽车用品', price: 299, originalPrice: 389, image: productImages[16], rating: 4.7, reviewCount: 8000, specs: { brand: '通用', resolution: '4K', feature: '夜视', storage: '支持TF卡' }, description: '4K高清录制，夜视功能清晰，行车安全保障。' },
    { id: 86, name: '车载香水（香薰/持久）', category: '汽车用品', price: 49, originalPrice: 64, image: productImages[0], rating: 4.5, reviewCount: 10000, specs: { brand: '通用', type: '香薰', scent: '海洋', duration: '60天' }, description: '天然植物精油，持久留香，车内空气清新。' },
    { id: 87, name: '座套（四季/通用）', category: '汽车用品', price: 199, originalPrice: 259, image: productImages[1], rating: 4.6, reviewCount: 6000, specs: { brand: '通用', material: '亚麻', type: '四季通用', fit: '全包' }, description: '亚麻材质透气舒适，四季通用，保护座椅。' },
    { id: 88, name: '脚垫（防水/防滑）', category: '汽车用品', price: 129, originalPrice: 168, image: productImages[2], rating: 4.5, reviewCount: 7000, specs: { brand: '通用', material: 'TPE', feature: '防水防滑', fit: '专车定制' }, description: 'TPE环保材质，防水易清洗，专车定制贴合。' },
    { id: 89, name: '手机支架（车载/出风口）', category: '汽车用品', price: 39, originalPrice: 51, image: productImages[3], rating: 4.4, reviewCount: 15000, specs: { brand: '通用', type: '出风口', grip: '自动夹紧', compatibility: '通用' }, description: '出风口卡扣设计，自动夹紧不脱落，导航更方便。' },
    { id: 90, name: '应急启动电源（汽车/便携）', category: '汽车用品', price: 199, originalPrice: 259, image: productImages[4], rating: 4.6, reviewCount: 4000, specs: { brand: '通用', capacity: '12000mAh', peak: '400A', features: 'USB快充' }, description: '12V汽车应急启动，支持USB快充，自驾必备神器。' },
    { id: 91, name: '后备箱收纳箱（折叠/大容量）', category: '汽车用品', price: 69, originalPrice: 90, image: productImages[5], rating: 4.5, reviewCount: 5000, specs: { brand: '通用', capacity: '40L', feature: '折叠', material: '牛津布' }, description: '大容量折叠设计，收纳后备箱杂物，保持整洁。' },
    
    // 十四、宠物用品（7种）
    { id: 92, name: '狗粮（幼犬/天然粮）', category: '宠物用品', price: 199, originalPrice: 259, image: productImages[6], rating: 4.7, reviewCount: 8000, specs: { brand: '通用', type: '幼犬粮', weight: '5kg', feature: '天然配方' }, description: '天然配方营养均衡，专为幼犬设计，助力健康成长。' },
    { id: 93, name: '猫砂（膨润土/除臭）', category: '宠物用品', price: 49, originalPrice: 64, image: productImages[7], rating: 4.6, reviewCount: 12000, specs: { brand: '通用', type: '膨润土', weight: '10kg', feature: '除臭结团' }, description: '快速结团不易散，除臭效果好，猫咪如厕更舒适。' },
    { id: 94, name: '宠物玩具（耐咬/发声）', category: '宠物用品', price: 29, originalPrice: 38, image: productImages[8], rating: 4.5, reviewCount: 9000, specs: { brand: '通用', material: '橡胶', type: '发声球', feature: '耐咬' }, description: '天然橡胶材质耐咬，发声设计吸引宠物注意力。' },
    { id: 95, name: '宠物窝（四季/保暖）', category: '宠物用品', price: 89, originalPrice: 116, image: productImages[9], rating: 4.6, reviewCount: 6000, specs: { brand: '通用', material: '毛绒', size: '中型', feature: '可拆卸' }, description: '柔软毛绒材质，四季通用，可拆卸清洗方便。' },
    { id: 96, name: '宠物牵引绳（反光/防爆冲）', category: '宠物用品', price: 39, originalPrice: 51, image: productImages[10], rating: 4.5, reviewCount: 7000, specs: { brand: '通用', material: '尼龙', length: '1.5m', feature: '反光防爆冲' }, description: '反光设计夜间安全，防爆冲设计更牢固。' },
    { id: 97, name: '宠物碗（不锈钢/防滑）', category: '宠物用品', price: 29, originalPrice: 38, image: productImages[11], rating: 4.4, reviewCount: 8000, specs: { brand: '通用', material: '不锈钢', type: '双碗', feature: '防滑' }, description: '不锈钢材质易清洗，防滑底座不打翻，保护宠物颈椎。' },
    { id: 98, name: '宠物梳子（脱毛/按摩）', category: '宠物用品', price: 29, originalPrice: 38, image: productImages[12], rating: 4.5, reviewCount: 6000, specs: { brand: '通用', type: '脱毛梳', material: '不锈钢针', feature: '按摩' }, description: '不锈钢针梳，有效去除浮毛，按摩宠物皮肤促进血液循环。' },
    
    // 十五、办公用品（7种）
    { id: 99, name: '打印机（无线/家用）', category: '办公用品', price: 499, originalPrice: 649, image: productImages[13], rating: 4.6, reviewCount: 5000, specs: { brand: '通用', type: '喷墨', feature: '无线打印', functions: '打印复印扫描' }, description: '无线连接方便快捷，打印复印扫描一体，家庭办公必备。' },
    { id: 100, name: '文件夹（A4/透明）', category: '办公用品', price: 9, originalPrice: 12, image: productImages[14], rating: 4.5, reviewCount: 20000, specs: { brand: '通用', size: 'A4', material: 'PP', count: '10个' }, description: '透明设计一目了然，PP材质耐用，文件整理好帮手。' },
    { id: 101, name: '便签纸（彩色/便利贴）', category: '办公用品', price: 12, originalPrice: 16, image: productImages[15], rating: 4.4, reviewCount: 15000, specs: { brand: '通用', colors: '多色', count: '100张', size: '76x76mm' }, description: '多色便利贴，粘性强不易脱落，办公学习必备。' },
    { id: 102, name: '订书机（省力/大号）', category: '办公用品', price: 29, originalPrice: 38, image: productImages[16], rating: 4.5, reviewCount: 8000, specs: { brand: '通用', type: '省力', capacity: '20页', size: '大号' }, description: '省力设计轻松装订，大号尺寸装订更稳固。' },
    { id: 103, name: '计算器（办公/太阳能）', category: '办公用品', price: 39, originalPrice: 51, image: productImages[0], rating: 4.4, reviewCount: 6000, specs: { brand: '通用', power: '太阳能+电池', feature: '办公计算' }, description: '太阳能+电池设计，办公计算方便快捷' },]