// 已完成订单页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const orderList = document.getElementById('orderList');
    const emptyState = document.getElementById('emptyState');
    const goShoppingBtn = document.getElementById('goShoppingBtn');

    function init() {
        // 检查并更新过期订单状态（自动转换）
        if (OrderManager.checkAndUpdateExpiredOrders()) {
            console.log('订单状态已自动更新');
        }
        loadOrders();
        bindEvents();
    }

    function loadOrders() {
        const orders = OrderManager.getOrders(OrderManager.ORDER_STATUS.COMPLETED);
        
        if (orders.length === 0) {
            orderList.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        orderList.style.display = 'flex';
        emptyState.style.display = 'none';

        orderList.innerHTML = orders.map(order => {
            const address = order.address || {};
            const contact = address.name && address.phone 
                ? address.name + ' ' + address.phone 
                : '未设置联系人';
            const fullAddress = address.province && address.city && address.district && address.detail
                ? address.province + address.city + address.district + address.detail
                : '未设置详细地址';

            const isCartOrder = order.items && order.items.length > 0;
            let itemsHtml = '';
            let productId = order.productId;

            if (isCartOrder) {
                itemsHtml = order.items.map(item => {
                    const qty = item.quantity || item.qty || 1;
                    return '<div class="order-item">' +
                        '<img src="' + (item.image || '../tupian/placeholder.png') + '" alt="' + (item.name || '商品') + '">' +
                        '<div class="item-info">' +
                        '<span class="item-name">' + (item.name || '商品') + '</span>' +
                        '<span class="item-spec">规格：默认</span>' +
                        '<div>' +
                        '<span class="item-price">¥' + (item.price || 0) + '</span>' +
                        '<span class="item-quantity">x' + qty + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }).join('');
                productId = order.items[0]?.id;
            } else {
                itemsHtml = '<div class="order-item">' +
                    '<img src="' + (order.productImage || '../tupian/placeholder.png') + '" alt="' + (order.productName || '商品') + '">' +
                    '<div class="item-info">' +
                    '<span class="item-name">' + (order.productName || '商品') + '</span>' +
                    '<span class="item-spec">规格：' + (order.spec || '默认') + '</span>' +
                    '<div>' +
                    '<span class="item-price">¥' + (order.price || 0) + '</span>' +
                    '<span class="item-quantity">x' + (order.quantity || 1) + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }

            return '<div class="order-card" data-order-id="' + order.id + '">' +
                '<div class="order-header">' +
                '<span class="order-id">订单号：<span>' + order.id + '</span></span>' +
                '<span class="order-status completed">已完成</span>' +
                '</div>' +
                '<div class="order-items">' +
                itemsHtml +
                '</div>' +
                '<div class="order-details">' +
                '<div class="detail-row">' +
                '<span class="label">收货人</span>' +
                '<span class="value">' + contact + '</span>' +
                '</div>' +
                '<div class="detail-row">' +
                '<span class="label">收货地址</span>' +
                '<span class="value">' + fullAddress + '</span>' +
                '</div>' +
                '<div class="detail-row">' +
                '<span class="label">下单时间</span>' +
                '<span class="value">' + formatTime(order.createdAt) + '</span>' +
                '</div>' +
                '<div class="detail-row">' +
                '<span class="label">完成时间</span>' +
                '<span class="value">' + formatTime(order.completedAt || '-') + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="order-footer">' +
                '<div class="order-total">实付金额：<span>¥' + (order.totalAmount || 0) + '</span></div>' +
                '<div class="order-actions">' +
                '<button class="btn btn-outline" onclick="window.location.href=\'商品详情.html?id=' + productId + '\'">' +
                '<i class="fas fa-info-circle"></i>查看详情</button>' +
                '<button class="btn btn-secondary" onclick="window.location.href=\'index.html\'">' +
                '<i class="fas fa-redo"></i>再次购买</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    function formatTime(dateStr) {
        if (!dateStr || dateStr === '-') return '-';
        const date = new Date(dateStr);
        return date.getFullYear() + '-' + 
            String(date.getMonth() + 1).padStart(2, '0') + '-' + 
            String(date.getDate()).padStart(2, '0') + ' ' + 
            String(date.getHours()).padStart(2, '0') + ':' + 
            String(date.getMinutes()).padStart(2, '0');
    }

    function bindEvents() {
        backBtn.addEventListener('click', () => window.location.href = 'index.html');
        goShoppingBtn.addEventListener('click', () => window.location.href = 'index.html');
    }

    init();
});
