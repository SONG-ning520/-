// 订单管理模块
const OrderManager = (function() {
    // 订单状态常量
    const ORDER_STATUS = {
        PENDING_PAYMENT: 'pending_payment',    // 待付款
        PENDING_SHIPMENT: 'pending_shipment',  // 待发货
        PENDING_RECEIPT: 'pending_receipt',    // 待收货
        COMPLETED: 'completed',                // 已完成
        CANCELLED: 'cancelled'                 // 已取消
    };

    // 获取订单列表
    function getOrders(status = null) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        if (status) {
            return orders.filter(order => order.status === status);
        }
        return orders;
    }

    // 保存订单
    function saveOrder(order) {
        const orders = getOrders();
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        return order;
    }

    // 更新订单状态
    function updateOrderStatus(orderId, newStatus) {
        const orders = getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = newStatus;
            orders[index].updatedAt = new Date().toISOString();
            localStorage.setItem('orders', JSON.stringify(orders));
            return orders[index];
        }
        return null;
    }

    // 删除订单
    function deleteOrder(orderId) {
        const orders = getOrders();
        const filteredOrders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(filteredOrders));
    }

    // 创建新订单
    function createOrder(product, address, quantity = 1) {
        const order = {
            id: generateOrderId(),
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            price: product.price,
            originalPrice: product.original_price,
            quantity: quantity,
            totalAmount: product.price * quantity,
            address: address,
            status: ORDER_STATUS.PENDING_PAYMENT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3 * 60 * 1000).toISOString() // 3分钟后过期
        };
        return saveOrder(order);
    }

    // 生成订单号
    function generateOrderId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD${timestamp}${random}`;
    }

    // 检查并清理过期订单
    function cleanExpiredOrders() {
        const orders = getOrders(ORDER_STATUS.PENDING_PAYMENT);
        const now = new Date();
        orders.forEach(order => {
            if (new Date(order.expiresAt) < now) {
                deleteOrder(order.id);
            }
        });
    }

    // 自动状态转换
    function setupAutoStatusTransition(orderId) {
        const now = Date.now();
        const orders = getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index === -1) return;
        
        // 记录自动转换时间戳
        orders[index].autoShipAt = new Date(now + 5 * 60 * 1000).toISOString();
        orders[index].autoCompleteAt = new Date(now + 15 * 60 * 1000).toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 5分钟后：待发货 -> 待收货
        setTimeout(() => {
            const allOrders = getOrders();
            const order = allOrders.find(o => o.id === orderId);
            if (order && order.status === ORDER_STATUS.PENDING_SHIPMENT) {
                order.status = ORDER_STATUS.PENDING_RECEIPT;
                order.shippedAt = new Date().toISOString();
                order.updatedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(allOrders));
            }
        }, 5 * 60 * 1000);

        // 15分钟后（待发货5分钟 + 待收货10分钟）：待收货 -> 已完成
        setTimeout(() => {
            const allOrders = getOrders();
            const order = allOrders.find(o => o.id === orderId);
            if (order && order.status === ORDER_STATUS.PENDING_RECEIPT) {
                order.status = ORDER_STATUS.COMPLETED;
                order.completedAt = new Date().toISOString();
                order.updatedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(allOrders));
            }
        }, 15 * 60 * 1000);
    }

    // 检查并更新已过期订单状态
    function checkAndUpdateExpiredOrders() {
        const now = new Date();
        const orders = getOrders();
        let updated = false;
        
        orders.forEach(order => {
            // 待发货 -> 待收货（5分钟）
            if (order.status === ORDER_STATUS.PENDING_SHIPMENT && order.autoShipAt) {
                if (new Date(order.autoShipAt) <= now) {
                    order.status = ORDER_STATUS.PENDING_RECEIPT;
                    order.shippedAt = order.autoShipAt;
                    order.updatedAt = now.toISOString();
                    updated = true;
                }
            }
            
            // 待收货 -> 已完成（10分钟）
            if (order.status === ORDER_STATUS.PENDING_RECEIPT && order.autoCompleteAt) {
                if (new Date(order.autoCompleteAt) <= now) {
                    order.status = ORDER_STATUS.COMPLETED;
                    order.completedAt = order.autoCompleteAt;
                    order.updatedAt = now.toISOString();
                    updated = true;
                }
            }
        });
        
        if (updated) {
            localStorage.setItem('orders', JSON.stringify(orders));
        }
        
        return updated;
    }

    // 获取订单状态中文描述
    function getStatusText(status) {
        const statusMap = {
            [ORDER_STATUS.PENDING_PAYMENT]: '待付款',
            [ORDER_STATUS.PENDING_SHIPMENT]: '待发货',
            [ORDER_STATUS.PENDING_RECEIPT]: '待收货',
            [ORDER_STATUS.COMPLETED]: '已完成',
            [ORDER_STATUS.CANCELLED]: '已取消'
        };
        return statusMap[status] || '未知';
    }

    // 获取订单数量统计
    function getOrderStats() {
        const orders = getOrders();
        return {
            total: orders.length,
            pendingPayment: orders.filter(o => o.status === ORDER_STATUS.PENDING_PAYMENT).length,
            pendingShipment: orders.filter(o => o.status === ORDER_STATUS.PENDING_SHIPMENT).length,
            pendingReceipt: orders.filter(o => o.status === ORDER_STATUS.PENDING_RECEIPT).length,
            completed: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length
        };
    }

    return {
        ORDER_STATUS,
        getOrders,
        saveOrder,
        updateOrderStatus,
        deleteOrder,
        createOrder,
        cleanExpiredOrders,
        setupAutoStatusTransition,
        checkAndUpdateExpiredOrders,
        getStatusText,
        getOrderStats
    };
})();

// 支付模块
const PaymentManager = (function() {
    // 支付方式
    const PAYMENT_METHODS = [
        { id: 'alipay', name: '支付宝', icon: 'fab fa-alipay' },
        { id: 'wechat', name: '微信支付', icon: 'fab fa-weixin' },
        { id: 'card', name: '银行卡', icon: 'fas fa-credit-card' }
    ];

    // 当前支付订单
    let currentOrder = null;
    let selectedAddress = null;
    let selectedPaymentMethod = 'alipay';

    // 设置当前订单
    function setCurrentOrder(order) {
        currentOrder = order;
        sessionStorage.setItem('currentOrder', JSON.stringify(order));
    }

    // 获取当前订单
    function getCurrentOrder() {
        if (!currentOrder) {
            const stored = sessionStorage.getItem('currentOrder');
            currentOrder = stored ? JSON.parse(stored) : null;
        }
        return currentOrder;
    }

    // 设置选中的地址
    function setSelectedAddress(address) {
        selectedAddress = address;
        sessionStorage.setItem('selectedAddress', JSON.stringify(address));
    }

    // 获取选中的地址
    function getSelectedAddress() {
        if (!selectedAddress) {
            const stored = sessionStorage.getItem('selectedAddress');
            selectedAddress = stored ? JSON.parse(stored) : null;
        }
        return selectedAddress;
    }

    // 设置支付方式
    function setPaymentMethod(methodId) {
        selectedPaymentMethod = methodId;
        sessionStorage.setItem('selectedPaymentMethod', methodId);
    }

    // 获取支付方式
    function getPaymentMethod() {
        if (!selectedPaymentMethod) {
            selectedPaymentMethod = sessionStorage.getItem('selectedPaymentMethod') || 'alipay';
        }
        return selectedPaymentMethod;
    }

    // 验证支付密码
    function validatePaymentPassword(password) {
        // 获取当前登录用户
        const userId = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        
        console.log('验证支付密码 - userId:', userId, 'username:', username);
        
        if (!userId && !username) {
            return { valid: false, message: '请先登录' };
        }
        
        // 从用户列表中查找当前用户
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('用户列表:', users);
        
        let currentUser = users.find(u => u.id === userId || u.username === username);
        console.log('找到的用户:', currentUser);
        
        if (!currentUser) {
            return { valid: false, message: '用户不存在' };
        }
        
        // 检查是否设置了支付密码
        console.log('用户支付密码:', currentUser.payPassword, '输入密码:', password);
        
        if (!currentUser.payPassword) {
            return { valid: false, message: '请先在安全中心设置支付密码', needSetup: true };
        }
        
        // 验证支付密码
        if (password === currentUser.payPassword) {
            return { valid: true, message: '验证成功' };
        }
        
        return { valid: false, message: '支付密码错误' };
    }

    // 执行支付
    function executePayment(orderId, password) {
        const validation = validatePaymentPassword(password);
        
        if (!validation.valid) {
            return { success: false, message: validation.message, needSetup: validation.needSetup };
        }

        const result = OrderManager.updateOrderStatus(orderId, OrderManager.ORDER_STATUS.PENDING_SHIPMENT);
        if (result) {
            OrderManager.setupAutoStatusTransition(orderId);
            clearSession();
            return { success: true, message: '支付成功', order: result };
        }
        return { success: false, message: '支付失败' };
    }

    // 取消支付
    function cancelPayment(orderId) {
        OrderManager.deleteOrder(orderId);
        clearSession();
    }

    // 清除会话数据
    function clearSession() {
        currentOrder = null;
        selectedAddress = null;
        sessionStorage.removeItem('currentOrder');
        sessionStorage.removeItem('selectedAddress');
        sessionStorage.removeItem('selectedPaymentMethod');
    }

    return {
        PAYMENT_METHODS,
        setCurrentOrder,
        getCurrentOrder,
        setSelectedAddress,
        getSelectedAddress,
        setPaymentMethod,
        getPaymentMethod,
        validatePaymentPassword,
        executePayment,
        cancelPayment,
        clearSession
    };
})();

// 地址选择模块
const AddressSelector = (function() {
    // 获取保存的地址列表（统一字段名）
    function getAddresses() {
        const rawAddresses = JSON.parse(localStorage.getItem('addressList') || '[]');
        // 统一字段名，兼容不同格式的地址数据
        return rawAddresses.map(addr => ({
            id: addr.id || '',
            name: addr.name || addr.recipientName || '',
            phone: addr.phone || addr.phoneNumber || '',
            province: addr.province || '',
            city: addr.city || '',
            district: addr.district || '',
            detail: addr.detail || addr.detail_address || addr.detailAddress || '',
            postalCode: addr.postal_code || addr.postalCode || '',
            isDefault: addr.isDefault || addr.is_default || false,
            coords: addr.coords || null,
            createdAt: addr.created_at || addr.createdAt || ''
        }));
    }

    // 获取默认地址
    function getDefaultAddress() {
        const addresses = getAddresses();
        return addresses.find(a => a.isDefault) || addresses[0] || null;
    }

    // 选择地址回调
    let onSelectCallback = null;

    function setOnSelectCallback(callback) {
        onSelectCallback = callback;
    }

    function selectAddress(address) {
        if (onSelectCallback) {
            onSelectCallback(address);
        }
        PaymentManager.setSelectedAddress(address);
    }

    return {
        getAddresses,
        getDefaultAddress,
        setOnSelectCallback,
        selectAddress
    };
})();

// 导出到全局
window.OrderManager = OrderManager;
window.PaymentManager = PaymentManager;
window.AddressSelector = AddressSelector;
