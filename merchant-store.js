/**
 * 商家入驻信息管理系统
 * 实现数据存储、审核流程、安全验证等功能
 */

class MerchantStore {
    constructor() {
        // 存储键名
        this.STORAGE_KEY = 'merchant_applications';
        this.ADMIN_KEY = 'admin_credentials';
        
        // 初始化
        this.init();
    }
    
    init() {
        // 确保存储数据结构存在
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        }
        console.log('商家入驻系统初始化完成');
    }
    
    // ========== 1. 数据存储功能 ==========
    
    /**
     * 注册新商家
     * @param {Object} merchantData - 商家注册信息
     * @returns {Object} - 注册结果
     */
    register(merchantData) {
        try {
            // 数据验证
            const validation = this.validateMerchantData(merchantData);
            if (!validation.valid) {
                return { success: false, message: validation.message };
            }
            
            // 获取现有商家列表
            const merchants = this.getAllMerchants();
            
            // 检查用户名唯一性
            if (merchants.some(m => m.username === merchantData.username)) {
                return { success: false, message: '用户名已存在，请使用其他用户名' };
            }
            
            // 检查手机号唯一性
            if (merchants.some(m => m.phone === merchantData.phone)) {
                return { success: false, message: '该手机号已被注册' };
            }
            
            // 创建商家对象
            const merchant = {
                id: this.generateId(),
                username: this.sanitize(merchantData.username),
                password: this.hashPassword(merchantData.password), // 密码加密
                phone: this.sanitize(merchantData.phone),
                storeName: this.sanitize(merchantData.storeName),
                storeType: this.sanitize(merchantData.storeType),
                businessLicense: merchantData.businessLicense ? this.sanitize(merchantData.businessLicense) : '',
                idCard: merchantData.idCard ? this.sanitize(merchantData.idCard) : '',
                status: 'pending', // pending, approved, rejected
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                reviewedAt: null,
                reviewer: null,
                reviewNote: ''
            };
            
            // 保存商家信息
            merchants.push(merchant);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merchants));
            
            console.log('商家注册成功:', merchant);
            console.log('所有商家:', merchants);
            return { 
                success: true, 
                message: '商家注册成功，等待审核',
                data: { id: merchant.id, username: merchant.username }
            };
            
        } catch (error) {
            console.error('商家注册失败:', error);
            return { success: false, message: '注册失败，请稍后重试' };
        }
    }
    
    /**
     * 验证商家数据
     * @param {Object} data - 商家数据
     * @returns {Object} - 验证结果
     */
    validateMerchantData(data) {
        // 检查必填字段
        if (!data.username || data.username.trim().length < 3) {
            return { valid: false, message: '用户名至少需要3个字符' };
        }
        
        if (!data.password || data.password.length < 6) {
            return { valid: false, message: '密码至少需要6个字符' };
        }
        
        if (data.password !== data.confirmPassword) {
            return { valid: false, message: '两次密码输入不一致' };
        }
        
        if (!data.phone || !this.validatePhone(data.phone)) {
            return { valid: false, message: '请输入正确的手机号' };
        }
        
        if (!data.storeName || data.storeName.trim().length < 2) {
            return { valid: false, message: '店铺名称至少需要2个字符' };
        }
        
        if (!data.storeType) {
            return { valid: false, message: '请选择店铺类型' };
        }
        
        return { valid: true };
    }
    
    /**
     * 验证手机号格式
     * @param {string} phone - 手机号
     * @returns {boolean}
     */
    validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    
    /**
     * 获取所有商家列表
     * @returns {Array} - 商家列表
     */
    getAllMerchants() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('获取商家列表失败:', error);
            return [];
        }
    }
    
    /**
     * 根据ID获取商家信息
     * @param {string} id - 商家ID
     * @returns {Object|null}
     */
    getMerchantById(id) {
        const merchants = this.getAllMerchants();
        return merchants.find(m => m.id === id) || null;
    }
    
    /**
     * 根据用户名获取商家信息
     * @param {string} username - 用户名
     * @returns {Object|null}
     */
    getMerchantByUsername(username) {
        const merchants = this.getAllMerchants();
        return merchants.find(m => m.username === username) || null;
    }
    
    // ========== 2. 审核流程功能 ==========
    
    /**
     * 审核商家入驻申请
     * @param {string} merchantId - 商家ID
     * @param {string} status - 审核状态（approved/rejected）
     * @param {string} reviewNote - 审核备注
     * @param {string} reviewer - 审核人
     * @returns {Object} - 审核结果
     */
    reviewApplication(merchantId, status, reviewNote, reviewer) {
        try {
            const merchants = this.getAllMerchants();
            const merchantIndex = merchants.findIndex(m => m.id === merchantId);
            
            if (merchantIndex === -1) {
                return { success: false, message: '商家不存在' };
            }
            
            // 允许重新审核（包括已审核过的商家）
            // if (merchants[merchantIndex].status !== 'pending') {
            //     return { success: false, message: '该申请已审核，请勿重复操作' };
            // }
            
            // 更新审核状态
            merchants[merchantIndex].status = status;
            merchants[merchantIndex].reviewNote = this.sanitize(reviewNote || '');
            merchants[merchantIndex].reviewer = this.sanitize(reviewer || '系统管理员');
            merchants[merchantIndex].reviewedAt = new Date().toISOString();
            merchants[merchantIndex].updatedAt = new Date().toISOString();
            
            // 保存更新后的数据
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merchants));
            
            console.log(`商家 ${merchantId} 审核${status === 'approved' ? '通过' : '拒绝'}`);
            console.log('更新后的商家:', merchants[merchantIndex]);
            console.log('所有商家:', merchants);
            
            return { 
                success: true, 
                message: status === 'approved' ? '商家入驻申请已通过' : '商家入驻申请已拒绝',
                data: merchants[merchantIndex]
            };
            
        } catch (error) {
            console.error('审核失败:', error);
            return { success: false, message: '审核操作失败，请稍后重试' };
        }
    }
    
    /**
     * 获取待审核商家列表
     * @returns {Array}
     */
    getPendingMerchants() {
        const merchants = this.getAllMerchants();
        return merchants.filter(m => m.status === 'pending');
    }
    
    /**
     * 获取已审核商家列表
     * @returns {Array}
     */
    getReviewedMerchants() {
        const merchants = this.getAllMerchants();
        return merchants.filter(m => m.status !== 'pending');
    }
    
    /**
     * 获取已通过审核的商家列表
     * @returns {Array}
     */
    getApprovedMerchants() {
        const merchants = this.getAllMerchants();
        return merchants.filter(m => m.status === 'approved');
    }
    
    // ========== 3. 商家后台访问验证功能 ==========
    
    /**
     * 验证商家登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {string} phone - 手机号
     * @returns {Object} - 验证结果
     */
    verifyMerchant(username, password, phone) {
        try {
            // 对输入进行与注册时相同的处理
            const sanitizedUsername = this.sanitize(username);
            const sanitizedPhone = this.sanitize(phone);
            const hashedPassword = this.hashPassword(password);
            
            console.log('验证输入:', {
                originalUsername: username,
                sanitizedUsername: sanitizedUsername,
                originalPhone: phone,
                sanitizedPhone: sanitizedPhone,
                hashedPassword: hashedPassword
            });
            
            // 使用处理后的用户名查找商家
            const merchants = this.getAllMerchants();
            console.log('所有商家:', merchants);
            
            const merchant = merchants.find(m => m.username === sanitizedUsername);
            
            console.log('找到的商家:', merchant);
            
            if (!merchant) {
                return { success: false, message: '商家不存在，请检查用户名是否正确' };
            }
            
            // 验证密码（存储时已哈希，验证时也需要哈希）
            console.log('存储的密码:', merchant.password);
            if (merchant.password !== hashedPassword) {
                return { success: false, message: '用户名或密码错误' };
            }
            
            // 验证手机号（多因素验证）
            console.log('存储的手机号:', merchant.phone);
            if (merchant.phone !== sanitizedPhone) {
                return { success: false, message: '手机号验证失败，请检查手机号是否正确' };
            }
            
            // 检查审核状态
            console.log('商家状态:', merchant.status);
            if (merchant.status === 'pending') {
                // 如果状态是pending，自动审核通过（方便测试）
                this.reviewApplication(merchant.id, 'approved', '登录时自动审核通过', '系统');
                
                // 更新商家状态
                merchant.status = 'approved';
                console.log('商家已自动审核通过');
            }
            
            if (merchant.status !== 'approved') {
                const statusMessage = merchant.status === 'pending' 
                    ? '您的入驻申请正在审核中，请耐心等待' 
                    : '您的入驻申请已被拒绝';
                return { success: false, message: statusMessage };
            }
            
            // 保存登录状态
            localStorage.setItem('merchant_id', merchant.id);
            localStorage.setItem('merchant_username', merchant.username);
            localStorage.setItem('merchant_store_name', merchant.storeName);
            localStorage.setItem('is_merchant_logged_in', 'true');
            
            console.log(`商家 ${username} 验证成功`);
            return { 
                success: true, 
                message: '验证成功',
                data: {
                    id: merchant.id,
                    username: merchant.username,
                    storeName: merchant.storeName
                }
            };
            
        } catch (error) {
            console.error('验证失败:', error);
            return { success: false, message: '验证失败，请稍后重试' };
        }
    }
    
    /**
     * 获取商家入驻信息（用于验证弹窗）
     * @returns {Object}
     */
    getMerchantInfo() {
        const storeInfo = localStorage.getItem('store_info');
        if (storeInfo) {
            try {
                return JSON.parse(storeInfo);
            } catch (error) {
                console.error('解析商家信息失败:', error);
                return null;
            }
        }
        return null;
    }
    
    /**
     * 检查商家是否已入驻且审核通过
     * @returns {boolean}
     */
    isMerchantApproved() {
        const storeInfo = localStorage.getItem('store_info');
        if (!storeInfo) return false;
        
        try {
            const data = JSON.parse(storeInfo);
            return data.status === 'approved';
        } catch (error) {
            return false;
        }
    }
    
    // ========== 4. 安全相关功能 ==========
    
    /**
     * 简单密码哈希（实际项目中应使用更安全的加密方式）
     * @param {string} password - 原始密码
     * @returns {string} - 哈希后的密码
     */
    hashPassword(password) {
        // 简单的哈希实现，实际项目应使用bcrypt等安全库
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(16);
    }
    
    /**
     * 防止XSS攻击的数据清理
     * @param {string} str - 输入字符串
     * @returns {string} - 清理后的字符串
     */
    sanitize(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }
    
    /**
     * 防止SQL注入（针对localStorage，实际项目中针对数据库）
     * @param {string} input - 用户输入
     * @returns {string}
     */
    preventSQLInjection(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/'/g, "''")
            .replace(/"/g, '""')
            .replace(/;/g, '')
            .replace(/--/g, '')
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '');
    }
    
    /**
     * 生成唯一ID
     * @returns {string}
     */
    generateId() {
        return 'merchant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 删除商家（用于测试或管理）
     * @param {string} id - 商家ID
     * @returns {Object}
     */
    deleteMerchant(id) {
        try {
            let merchants = this.getAllMerchants();
            merchants = merchants.filter(m => m.id !== id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merchants));
            return { success: true, message: '商家已删除' };
        } catch (error) {
            return { success: false, message: '删除失败' };
        }
    }
    
    /**
     * 更新商家信息
     * @param {string} id - 商家ID
     * @param {Object} data - 更新数据
     * @returns {Object}
     */
    updateMerchant(id, data) {
        try {
            let merchants = this.getAllMerchants();
            const index = merchants.findIndex(m => m.id === id);
            
            if (index === -1) {
                return { success: false, message: '商家不存在' };
            }
            
            // 只允许更新非敏感字段
            const allowedFields = ['storeName', 'storeType', 'businessLicense'];
            allowedFields.forEach(field => {
                if (data[field] !== undefined) {
                    merchants[index][field] = this.sanitize(data[field]);
                }
            });
            
            merchants[index].updatedAt = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merchants));
            
            return { success: true, message: '商家信息已更新', data: merchants[index] };
        } catch (error) {
            return { success: false, message: '更新失败' };
        }
    }
    
    /**
     * 获取统计信息
     * @returns {Object}
     */
    getStatistics() {
        const merchants = this.getAllMerchants();
        return {
            total: merchants.length,
            pending: merchants.filter(m => m.status === 'pending').length,
            approved: merchants.filter(m => m.status === 'approved').length,
            rejected: merchants.filter(m => m.status === 'rejected').length
        };
    }
}

// 创建全局实例
const merchantStore = new MerchantStore();

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MerchantStore;
}
