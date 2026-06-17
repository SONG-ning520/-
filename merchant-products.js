/**
 * 商家商品数据库管理模块
 * 使用 localStorage 存储商家出售商品数据
 */
class MerchantProductDB {
    constructor() {
        this.STORAGE_KEY = 'merchant_products_db';
        this.ID_COUNTER_KEY = 'merchant_product_id_counter';
    }

    /**
     * 获取所有商品
     * @returns {Array} 商品列表
     */
    getAllProducts() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('获取商品列表失败:', error);
            return [];
        }
    }

    /**
     * 获取商家的商品列表
     * @param {string} merchantId - 商家ID
     * @returns {Array} 该商家的商品列表
     */
    getProductsByMerchant(merchantId) {
        try {
            const allProducts = this.getAllProducts();
            return allProducts.filter(p => p.merchantId === merchantId);
        } catch (error) {
            console.error('获取商家商品列表失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取商品
     * @param {number} id - 商品ID
     * @returns {Object|null} 商品对象或null
     */
    getProductById(id) {
        try {
            const allProducts = this.getAllProducts();
            const targetId = typeof id === 'string' ? parseInt(id) : id;
            return allProducts.find(p => p.id === targetId) || null;
        } catch (error) {
            console.error('获取商品失败:', error);
            return null;
        }
    }

    /**
     * 添加商品
     * @param {Object} productData - 商品数据
     * @returns {Object} 操作结果
     */
    addProduct(productData) {
        try {
            const allProducts = this.getAllProducts();
            
            // 获取下一个ID
            let nextId = parseInt(localStorage.getItem(this.ID_COUNTER_KEY)) || 1;
            
            const product = {
                id: nextId,
                merchantId: productData.merchantId || '',
                name: productData.name || '',
                price: parseFloat(productData.price) || 0,
                stock: parseInt(productData.stock) || 0,
                image: productData.image || '',
                description: productData.description || '',
                category: productData.category || '',
                unit: productData.unit || '件',
                originalPrice: parseFloat(productData.originalPrice) || 0,
                intro: productData.intro || '',
                detail: productData.detail || '',
                afterService: productData.afterService || '',
                mainImage: productData.mainImage || '',
                detailImage1: productData.detailImage1 || '',
                detailImage2: productData.detailImage2 || '',
                detailImage3: productData.detailImage3 || '',
                published: productData.published || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: productData.publishedAt || null
            };

            allProducts.push(product);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProducts));
            localStorage.setItem(this.ID_COUNTER_KEY, (nextId + 1).toString());

            console.log('商品添加成功:', product.id);
            return { 
                success: true, 
                message: '商品添加成功',
                data: product 
            };
        } catch (error) {
            console.error('添加商品失败:', error);
            return { success: false, message: '添加商品失败，请稍后重试' };
        }
    }

    /**
     * 更新商品
     * @param {number} id - 商品ID
     * @param {Object} productData - 更新的商品数据
     * @returns {Object} 操作结果
     */
    updateProduct(id, productData) {
        try {
            const allProducts = this.getAllProducts();
            const targetId = typeof id === 'string' ? parseInt(id) : id;
            const index = allProducts.findIndex(p => p.id === targetId);
            
            if (index === -1) {
                return { success: false, message: '商品不存在' };
            }

            const existingProduct = allProducts[index];
            
            allProducts[index] = {
                ...existingProduct,
                ...productData,
                price: productData.price !== undefined ? parseFloat(productData.price) : existingProduct.price,
                stock: productData.stock !== undefined ? parseInt(productData.stock) : existingProduct.stock,
                originalPrice: productData.originalPrice !== undefined ? parseFloat(productData.originalPrice) : existingProduct.originalPrice,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProducts));

            console.log('商品更新成功:', id);
            return { 
                success: true, 
                message: '商品更新成功',
                data: allProducts[index] 
            };
        } catch (error) {
            console.error('更新商品失败:', error);
            return { success: false, message: '更新商品失败，请稍后重试' };
        }
    }

    /**
     * 删除商品
     * @param {number} id - 商品ID
     * @returns {Object} 操作结果
     */
    deleteProduct(id) {
        try {
            const allProducts = this.getAllProducts();
            const targetId = typeof id === 'string' ? parseInt(id) : id;
            const index = allProducts.findIndex(p => p.id === targetId);
            
            if (index === -1) {
                return { success: false, message: '商品不存在' };
            }

            const deletedProduct = allProducts[index];
            allProducts.splice(index, 1);
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProducts));

            console.log('商品删除成功:', id);
            return { 
                success: true, 
                message: '商品删除成功',
                data: deletedProduct 
            };
        } catch (error) {
            console.error('删除商品失败:', error);
            return { success: false, message: '删除商品失败，请稍后重试' };
        }
    }

    /**
     * 批量删除商品
     * @param {Array} ids - 商品ID数组
     * @returns {Object} 操作结果
     */
    deleteProducts(ids) {
        try {
            const allProducts = this.getAllProducts();
            const remainingProducts = allProducts.filter(p => !ids.includes(p.id));
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remainingProducts));

            console.log('批量删除商品成功:', ids.length);
            return { 
                success: true, 
                message: `成功删除${ids.length}件商品`,
                count: ids.length 
            };
        } catch (error) {
            console.error('批量删除商品失败:', error);
            return { success: false, message: '批量删除商品失败，请稍后重试' };
        }
    }

    /**
     * 统计商家商品数量
     * @param {string} merchantId - 商家ID
     * @returns {Object} 统计信息
     */
    getMerchantStats(merchantId) {
        try {
            const products = this.getProductsByMerchant(merchantId);
            const publishedCount = products.filter(p => p.published).length;
            const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
            
            return {
                total: products.length,
                published: publishedCount,
                unpublished: products.length - publishedCount,
                totalStock: totalStock
            };
        } catch (error) {
            console.error('获取统计信息失败:', error);
            return { total: 0, published: 0, unpublished: 0, totalStock: 0 };
        }
    }

    /**
     * 清空所有商品
     * @returns {Object} 操作结果
     */
    clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.ID_COUNTER_KEY);
            
            console.log('所有商品已清空');
            return { success: true, message: '所有商品已清空' };
        } catch (error) {
            console.error('清空商品失败:', error);
            return { success: false, message: '清空商品失败，请稍后重试' };
        }
    }

    /**
     * 导出商品数据
     * @returns {string} JSON字符串
     */
    exportData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data || '[]';
        } catch (error) {
            console.error('导出数据失败:', error);
            return '[]';
        }
    }

    /**
     * 导入商品数据
     * @param {string} jsonData - JSON字符串
     * @returns {Object} 操作结果
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!Array.isArray(data)) {
                return { success: false, message: '数据格式不正确' };
            }
            
            localStorage.setItem(this.STORAGE_KEY, jsonData);
            
            // 更新ID计数器
            if (data.length > 0) {
                const maxId = Math.max(...data.map(p => p.id || 0));
                localStorage.setItem(this.ID_COUNTER_KEY, (maxId + 1).toString());
            }
            
            console.log('商品数据导入成功:', data.length);
            return { 
                success: true, 
                message: `成功导入${data.length}件商品`,
                count: data.length 
            };
        } catch (error) {
            console.error('导入数据失败:', error);
            return { success: false, message: '导入数据失败，请检查数据格式' };
        }
    }
}

// 创建全局实例
const merchantProductDB = new MerchantProductDB();