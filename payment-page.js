// 支付页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const backBtn = document.getElementById('backBtn');
    const amountCard = document.getElementById('amountCard');
    const passwordInput = document.getElementById('passwordInput');
    const returnBtn = document.getElementById('returnBtn');
    const payBtn = document.getElementById('payBtn');
    const successOverlay = document.getElementById('successOverlay');
    const goToOrdersBtn = document.getElementById('goToOrdersBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // 当前订单
    let currentOrder = null;
    // 结算商品列表（从购物车过来的）
    let checkoutItems = [];

    // 初始化
    function init() {
        // 获取当前订单（PaymentManager 已经在 payment-modal.js 中设置）
        currentOrder = PaymentManager.getCurrentOrder();
        
        // 尝试从URL参数获取订单ID
        if (!currentOrder) {
            const params = new URLSearchParams(window.location.search);
            const orderId = params.get('orderId');
            
            if (orderId) {
                const orders = OrderManager.getOrders();
                currentOrder = orders.find(o => o.id === orderId);
            }
        }
        
        // 检查是否是从购物车结算的订单
        if (currentOrder && currentOrder.items && currentOrder.items.length > 0) {
            checkoutItems = currentOrder.items;
        }

        if (!currentOrder) {
            alert('订单信息不存在');
            window.location.href = 'index.html';
            return;
        }

        // 渲染订单信息
        renderOrderInfo();

        // 绑定事件
        bindEvents();
    }

    // 渲染订单信息
    function renderOrderInfo() {
        const isCartOrder = currentOrder.items && currentOrder.items.length > 0;
        
        let productHtml = '';
        if (isCartOrder) {
            // 购物车订单 - 多个商品
            productHtml = currentOrder.items.map(item => {
                const qty = item.quantity || item.qty || 1;
                return `
                    <div class="order-product">
                        <img src="${item.image || '../tupian/placeholder.png'}" alt="${item.name || '商品'}">
                        <div class="product-info">
                            <h3>${item.name || '商品'}</h3>
                            <p>数量：${qty}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            // 单个商品订单
            productHtml = `
                <div class="order-product">
                    <img src="${currentOrder.productImage || '../tupian/placeholder.png'}" alt="${currentOrder.productName || '商品'}">
                    <div class="product-info">
                        <h3>${currentOrder.productName || '商品'}</h3>
                        <p>数量：${currentOrder.quantity || 1}</p>
                    </div>
                </div>
            `;
        }

        amountCard.innerHTML = `
            <div class="order-info">
                <div class="order-id">
                    <span>订单号：${currentOrder.id}</span>
                </div>
                ${productHtml}
                <div class="order-price">
                    <span class="label">商品金额</span>
                    <span class="value">¥${currentOrder.totalAmount || 0}</span>
                </div>
                <div class="order-price">
                    <span class="label">运费</span>
                    <span class="value">免运费</span>
                </div>
                <div class="order-total">
                    <span class="label">应付金额</span>
                    <span class="value">¥${currentOrder.totalAmount || 0}</span>
                </div>
            </div>
        `;
    }

    // 绑定事件
    function bindEvents() {
        // 返回按钮
        backBtn.addEventListener('click', function() {
            if (confirm('确定要离开支付页面吗？订单将保存为待付款状态。')) {
                handleReturn();
            }
        });

        // 返回我再想想按钮
        returnBtn.addEventListener('click', function() {
            if (confirm('确定要离开支付页面吗？订单将保存为待付款状态。')) {
                handleReturn();
            }
        });

        // 支付按钮
        payBtn.addEventListener('click', handlePayment);

        // 查看订单按钮
        goToOrdersBtn.addEventListener('click', function() {
            window.location.href = 'order-pending-shipment.html';
        });

        // 密码输入限制
        passwordInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
            // 清除错误状态
            hideError();
            passwordInput.classList.remove('error');
        });

        // 回车支付
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                handlePayment();
            }
        });
    }

    // 处理返回
    function handleReturn() {
        // 订单已经是待付款状态，直接跳转
        window.location.href = 'order-pending-payment.html';
    }

    // 显示错误信息
    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.add('show');
        passwordInput.classList.add('error');
        // 3秒后自动隐藏错误
        setTimeout(hideError, 3000);
    }

    // 隐藏错误信息
    function hideError() {
        errorMessage.classList.remove('show');
        errorMessage.classList.remove('clickable');
        passwordInput.classList.remove('error');
        errorMessage.onclick = null;
    }

    // 显示加载状态
    function showLoading(show) {
        loadingOverlay.classList.toggle('show', show);
    }

    // 处理支付
    function handlePayment() {
        const password = passwordInput.value.trim();
        
        // 清除之前的错误状态
        hideError();
        
        // 验证密码是否为空
        if (!password) {
            showError('请输入支付密码');
            passwordInput.focus();
            return;
        }

        // 验证密码长度
        if (password.length < 6) {
            showError('支付密码长度不足6位');
            passwordInput.focus();
            return;
        }

        // 显示加载状态
        showLoading(true);

        // 模拟支付处理延迟
        setTimeout(() => {
            // 先验证支付密码
            const validation = PaymentManager.validatePaymentPassword(password);
            
            // 调试信息
            console.log('支付密码验证结果:', validation);
            
            showLoading(false);
            
            if (!validation.valid) {
                // 支付密码验证失败
                if (validation.needSetup) {
                    showError(validation.message + '，点击前往设置');
                    errorMessage.classList.add('clickable');
                    errorMessage.onclick = function() {
                        window.location.href = 'security-center.html';
                    };
                } else {
                    showError(validation.message);
                    errorMessage.classList.remove('clickable');
                }
                passwordInput.value = '';
                passwordInput.focus();
                return;
            }
            
            // 支付密码验证成功，处理订单
            // 更新订单状态为待发货
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(o => o.id === currentOrder.id);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'pending_shipment';
                orders[orderIndex].paidAt = new Date().toISOString();
                orders[orderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // 设置自动状态转换
                OrderManager.setupAutoStatusTransition(currentOrder.id);
                
                // 如果是从购物车结算的，清除购物车中的商品
                if (checkoutItems.length > 0) {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const remainingCart = cart.filter(item => !checkoutItems.some(ci => ci.id === item.id));
                    localStorage.setItem('cart', JSON.stringify(remainingCart));
                }
            }
            
            // 清除会话数据
            PaymentManager.clearSession();
            
            // 支付成功，显示成功弹窗
            successOverlay.classList.add('show');
        }, 800); // 模拟支付处理时间
    }

    // 初始化
    init();
});
