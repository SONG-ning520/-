// 待付款订单页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const backBtn = document.getElementById('backBtn');
    const orderList = document.getElementById('orderList');
    const emptyState = document.getElementById('emptyState');
    const goShoppingBtn = document.getElementById('goShoppingBtn');

    // 初始化
    function init() {
        // 清理过期订单
        OrderManager.cleanExpiredOrders();
        
        // 检查并更新过期订单状态（自动转换：待发货->待收货->已完成）
        OrderManager.checkAndUpdateExpiredOrders();
        
        // 加载订单列表
        loadOrders();

        // 绑定事件
        bindEvents();

        // 设置定时器检查过期订单
        setInterval(() => {
            OrderManager.cleanExpiredOrders();
            OrderManager.checkAndUpdateExpiredOrders();
            loadOrders();
        }, 60000); // 每分钟检查一次
    }

    // 加载订单列表
    function loadOrders() {
        const orders = OrderManager.getOrders(OrderManager.ORDER_STATUS.PENDING_PAYMENT);
        
        if (orders.length === 0) {
            orderList.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        orderList.style.display = 'flex';
        emptyState.style.display = 'none';

        orderList.innerHTML = orders.map(order => {
            const remainingTime = getRemainingTime(order.expiresAt);
            // 获取地址信息
            const address = order.address || {};
            const contact = address.name && address.phone 
                ? `${address.name} ${address.phone}` 
                : '未设置联系人';
            const fullAddress = address.province && address.city && address.district && address.detail
                ? `${address.province}${address.city}${address.district}${address.detail}`
                : '未设置详细地址';

            // 判断是否是购物车订单（多个商品）
            const isCartOrder = order.items && order.items.length > 0;

            // 生成商品列表HTML
            let itemsHtml = '';
            let productId = order.productId;

            if (isCartOrder) {
                // 购物车订单 - 多个商品
                itemsHtml = order.items.map(item => {
                    const qty = item.quantity || item.qty || 1;
                    return `
                        <div class="order-item">
                            <img src="${item.image || '../tupian/placeholder.png'}" alt="${item.name || '商品'}">
                            <div class="item-info">
                                <span class="item-name">${item.name || '商品'}</span>
                                <span class="item-spec">规格：默认</span>
                                <div>
                                    <span class="item-price">¥${item.price || 0}</span>
                                    <span class="item-quantity">x${qty}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                productId = order.items[0]?.id;
            } else {
                // 单个商品订单
                itemsHtml = `
                    <div class="order-item">
                        <img src="${order.productImage || '../tupian/placeholder.png'}" alt="${order.productName || '商品'}">
                        <div class="item-info">
                            <span class="item-name">${order.productName || '商品'}</span>
                            <span class="item-spec">规格：${order.spec || '默认'}</span>
                            <div>
                                <span class="item-price">¥${order.price || 0}</span>
                                <span class="item-quantity">x${order.quantity || 1}</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="order-card" data-order-id="${order.id}">
                    <div class="order-header">
                        <div>
                            <span class="order-id">订单号：<span>${order.id}</span></span>
                            <div class="countdown-wrapper">
                                <i class="fas fa-clock"></i>
                                <span class="countdown-time">${remainingTime}</span>
                                <span>后订单自动取消</span>
                            </div>
                        </div>
                        <span class="order-status pending-payment">待付款</span>
                    </div>
                    <div class="order-items">
                        ${itemsHtml}
                    </div>
                    <div class="order-details">
                        <div class="detail-row">
                            <span class="label">收货人</span>
                            <span class="value">${contact}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">收货地址</span>
                            <span class="value">${fullAddress}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">下单时间</span>
                            <span class="value">${formatTime(order.createdAt)}</span>
                        </div>
                    </div>
                    <div class="order-footer">
                            <div class="order-total">应付金额：<span>¥${order.totalAmount || 0}</span></div>
                            <div class="order-actions">
                                <button class="btn btn-outline" onclick="window.location.href='商品详情.html?id=${productId}'">
                                    <i class="fas fa-info-circle"></i>
                                    查看详情
                                </button>
                                <button class="btn btn-secondary cancel-btn" data-order-id="${order.id}">
                                    <i class="fas fa-times"></i>
                                    取消订单
                                </button>
                                <button class="btn btn-primary pay-btn" data-order-id="${order.id}">
                                    <i class="fas fa-credit-card"></i>
                                    立即支付
                                </button>
                            </div>
                        </div>
                </div>
            `;
        }).join('');

        // 绑定订单操作事件
        bindOrderActions();
    }

    // 获取剩余时间
    function getRemainingTime(expiresAt) {
        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires - now;

        if (diff <= 0) {
            return '已过期';
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        return `${minutes}分${seconds}秒`;
    }

    // 格式化时间
    function formatTime(dateStr) {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    // 绑定订单操作事件
    function bindOrderActions() {
        // 取消订单按钮
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                if (confirm('确定要取消订单吗？')) {
                    OrderManager.deleteOrder(orderId);
                    loadOrders();
                }
            });
        });

        // 立即支付按钮
        document.querySelectorAll('.pay-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                PaymentManager.setCurrentOrder({ id: orderId });
                window.location.href = `payment-page.html?orderId=${orderId}`;
            });
        });
    }

    // 绑定事件
    function bindEvents() {
        // 返回按钮
        backBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });

        // 去购物按钮
        goShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // 初始化
    init();
});
