/**
 * 电商平台API调用模块
 * 封装所有与后端的API交互
 */

const API_BASE_URL = 'http://localhost:5000/api';

// API工具类
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.sessionId = this.getSessionId();
    }

    // 获取或创建会话ID
    getSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    // 通用GET请求
    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });
            
            const response = await fetch(url.toString());
            return await response.json();
        } catch (error) {
            console.error('API GET请求失败:', error);
            return { code: 500, message: '网络请求失败', data: null };
        }
    }

    // 通用POST请求
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API POST请求失败:', error);
            return { code: 500, message: '网络请求失败', data: null };
        }
    }

    // 通用PUT请求
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API PUT请求失败:', error);
            return { code: 500, message: '网络请求失败', data: null };
        }
    }

    // 通用DELETE请求
    async delete(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });
            
            const response = await fetch(url.toString(), {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('API DELETE请求失败:', error);
            return { code: 500, message: '网络请求失败', data: null };
        }
    }
}

// 创建API客户端实例
const api = new ApiClient(API_BASE_URL);

// ==================== 商品API ====================

export const productApi = {
    /**
     * 获取商品列表
     * @param {Object} params - 查询参数
     * @param {number} params.page - 页码
     * @param {number} params.page_size - 每页数量
     * @param {number} params.category_id - 分类ID
     * @param {string} params.keyword - 搜索关键词
     * @returns {Promise}
     */
    getList: (params = {}) => {
        return api.get('/products', params);
    },

    /**
     * 获取单个商品详情
     * @param {number} productId - 商品ID
     * @returns {Promise}
     */
    getDetail: (productId) => {
        return api.get(`/product/${productId}`);
    },

    /**
     * 获取商品评价列表
     * @param {number} productId - 商品ID
     * @param {Object} params - 查询参数
     * @returns {Promise}
     */
    getReviews: (productId, params = {}) => {
        return api.get(`/product/${productId}/reviews`, params);
    },

    /**
     * 添加商品评价
     * @param {number} productId - 商品ID
     * @param {Object} reviewData - 评价数据
     * @returns {Promise}
     */
    addReview: (productId, reviewData) => {
        return api.post(`/product/${productId}/review`, reviewData);
    }
};

// ==================== 分类API ====================

export const categoryApi = {
    /**
     * 获取所有分类
     * @returns {Promise}
     */
    getAll: () => {
        return api.get('/categories');
    }
};

// ==================== 购物车API ====================

export const cartApi = {
    /**
     * 获取购物车列表
     * @param {number} userId - 用户ID（可选）
     * @returns {Promise}
     */
    getList: (userId = null) => {
        return api.get('/cart', {
            user_id: userId,
            session_id: userId ? null : api.sessionId
        });
    },

    /**
     * 添加商品到购物车
     * @param {number} productId - 商品ID
     * @param {number} quantity - 数量
     * @param {number} userId - 用户ID（可选）
     * @returns {Promise}
     */
    add: (productId, quantity = 1, userId = null) => {
        return api.post('/cart', {
            product_id: productId,
            quantity: quantity,
            user_id: userId,
            session_id: userId ? null : api.sessionId
        });
    },

    /**
     * 更新购物车商品数量
     * @param {number} cartId - 购物车项ID
     * @param {number} quantity - 新数量
     * @returns {Promise}
     */
    update: (cartId, quantity) => {
        return api.put(`/cart/${cartId}`, { quantity });
    },

    /**
     * 从购物车移除商品
     * @param {number} cartId - 购物车项ID
     * @returns {Promise}
     */
    remove: (cartId) => {
        return api.delete(`/cart/${cartId}`);
    }
};

// ==================== 收藏API ====================

export const favoriteApi = {
    /**
     * 获取收藏列表
     * @param {number} userId - 用户ID（可选）
     * @returns {Promise}
     */
    getList: (userId = null) => {
        return api.get('/favorites', {
            user_id: userId,
            session_id: userId ? null : api.sessionId
        });
    },

    /**
     * 添加收藏
     * @param {number} productId - 商品ID
     * @param {number} userId - 用户ID（可选）
     * @returns {Promise}
     */
    add: (productId, userId = null) => {
        return api.post(`/favorite/${productId}`, {
            user_id: userId,
            session_id: userId ? null : api.sessionId
        });
    },

    /**
     * 取消收藏
     * @param {number} productId - 商品ID
     * @param {number} userId - 用户ID（可选）
     * @returns {Promise}
     */
    remove: (productId, userId = null) => {
        return api.delete(`/favorite/${productId}`, {
            user_id: userId,
            session_id: userId ? null : api.sessionId
        });
    }
};

// ==================== 订单API ====================

export const orderApi = {
    /**
     * 获取订单列表
     * @param {number} userId - 用户ID
     * @returns {Promise}
     */
    getList: (userId) => {
        return api.get('/orders', { user_id: userId });
    },

    /**
     * 创建订单
     * @param {Object} orderData - 订单数据
     * @returns {Promise}
     */
    create: (orderData) => {
        return api.post('/order', orderData);
    }
};

// ==================== 搜索API ====================

export const searchApi = {
    /**
     * 搜索商品
     * @param {string} keyword - 搜索关键词
     * @param {Object} params - 查询参数
     * @returns {Promise}
     */
    search: (keyword, params = {}) => {
        return api.get('/search', { keyword, ...params });
    }
};

// ==================== 系统API ====================

export const systemApi = {
    /**
     * 健康检查
     * @returns {Promise}
     */
    healthCheck: () => {
        return api.get('/health');
    }
};

// 导出默认API实例
export default api;
