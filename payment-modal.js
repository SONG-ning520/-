// 支付弹窗逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const paymentModal = document.getElementById('paymentModal');
    const modalClose = document.getElementById('modalClose');
    const addressSelector = document.getElementById('addressSelector');
    const addressPlaceholder = document.getElementById('addressPlaceholder');
    const addressBtn = document.getElementById('addressBtn');
    const paymentMethods = document.getElementById('paymentMethods');
    const orderSummary = document.getElementById('orderSummary');
    const returnBtn = document.getElementById('returnBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    // 地址选择弹窗元素
    const addressModalOverlay = document.getElementById('addressModalOverlay');
    const addressModalClose = document.getElementById('addressModalClose');
    const addressList = document.getElementById('addressList');

    // 当前订单信息
    let currentProduct = null;
    let quantity = 1;
    let checkoutItems = [];
    let isFromCart = false;

    // 初始化
    function init() {
        // 获取URL参数
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('productId');
        const qty = params.get('quantity');
        isFromCart = params.get('fromCart') === '1';

        if (isFromCart) {
            // 从购物车结算
            loadCheckoutItems();
        } else if (productId) {
            // 从商品详情页立即购买
            loadProduct(productId);
            quantity = qty ? parseInt(qty) : 1;
        } else {
            alert('缺少商品信息');
            window.location.href = 'index.html';
            return;
        }

        // 加载支付方式
        loadPaymentMethods();

        // 加载已选地址
        loadSelectedAddress();

        // 绑定事件
        bindEvents();
    }

    // 加载购物车结算商品
    function loadCheckoutItems() {
        const savedItems = localStorage.getItem('checkout_items');
        if (savedItems) {
            checkoutItems = JSON.parse(savedItems);
            renderOrderSummary();
        } else {
            alert('购物车结算数据不存在');
            window.location.href = 'gouwuche.html';
        }
    }

    // 加载商品信息
    function loadProduct(productId) {
        console.log('loadProduct被调用，商品ID:', productId);
        
        // 首先检查全局变量是否已存在（如果商品详情.js已加载）
        if (window.LOCAL_PRODUCTS && window.LOCAL_PRODUCTS.length > 0) {
            currentProduct = window.LOCAL_PRODUCTS.find(p => p.id == productId);
            if (currentProduct) {
                console.log('从LOCAL_PRODUCTS找到商品:', currentProduct.name);
                renderOrderSummary();
                return;
            }
        }
        
        // 从 localStorage 获取（可能由其他页面存储）
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        currentProduct = products.find(p => p.id == productId);
        
        if (currentProduct) {
            console.log('从localStorage products找到商品:', currentProduct.name);
            renderOrderSummary();
            return;
        }
        
        // 从商家发布的商品中查找（home_products）
        const homeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
        const storeProduct = homeProducts.find(p => p.id == productId);
        if (storeProduct) {
            console.log('从home_products找到商家商品:', storeProduct.name);
            currentProduct = {
                id: storeProduct.id,
                name: storeProduct.name,
                price: storeProduct.price,
                image: storeProduct.image,
                category: storeProduct.category || '商家商品',
                original_price: storeProduct.originalPrice || Math.floor(storeProduct.price * 1.3),
                description: storeProduct.description || storeProduct.intro || '',
                specs: {
                    品牌: storeProduct.storeName || '商家店铺',
                    商品类型: storeProduct.category || '商家商品',
                    商品ID: storeProduct.id
                },
                rating: storeProduct.rating || 4.5,
                review_count: 0,
                stock: storeProduct.stock || 999
            };
            renderOrderSummary();
            return;
        }
        
        // 动态加载商品详情.js
        const script = document.createElement('script');
        script.src = '../js/商品详情.js';
        script.onload = function() {
            // 脚本加载并执行后，window.LOCAL_PRODUCTS 应该已定义
            const localProducts = window.LOCAL_PRODUCTS || [];
            currentProduct = localProducts.find(p => p.id == productId);
            
            if (currentProduct) {
                console.log('动态加载后从LOCAL_PRODUCTS找到商品:', currentProduct.name);
                renderOrderSummary();
            } else {
                // 再次尝试从home_products查找（可能脚本加载过程中数据已更新）
                const updatedHomeProducts = JSON.parse(localStorage.getItem('home_products') || '[]');
                const updatedStoreProduct = updatedHomeProducts.find(p => p.id == productId);
                
                if (updatedStoreProduct) {
                    console.log('动态加载后从home_products找到商家商品:', updatedStoreProduct.name);
                    currentProduct = {
                        id: updatedStoreProduct.id,
                        name: updatedStoreProduct.name,
                        price: updatedStoreProduct.price,
                        image: updatedStoreProduct.image,
                        category: updatedStoreProduct.category || '商家商品',
                        original_price: updatedStoreProduct.originalPrice || Math.floor(updatedStoreProduct.price * 1.3),
                        description: updatedStoreProduct.description || updatedStoreProduct.intro || '',
                        specs: {
                            品牌: updatedStoreProduct.storeName || '商家店铺',
                            商品类型: updatedStoreProduct.category || '商家商品',
                            商品ID: updatedStoreProduct.id
                        },
                        rating: updatedStoreProduct.rating || 4.5,
                        review_count: 0,
                        stock: updatedStoreProduct.stock || 999
                    };
                    renderOrderSummary();
                } else {
                    alert('商品不存在');
                    window.location.href = 'index.html';
                }
            }
        };
        script.onerror = function() {
            alert('加载商品数据失败');
            window.location.href = 'index.html';
        };
        document.head.appendChild(script);
    }

    // 加载支付方式
    function loadPaymentMethods() {
        const methods = PaymentManager.PAYMENT_METHODS;
        const selectedMethod = PaymentManager.getPaymentMethod();

        paymentMethods.innerHTML = methods.map(method => `
            <div class="payment-method ${selectedMethod === method.id ? 'selected' : ''}" data-method="${method.id}">
                <div class="method-icon">
                    <i class="${method.icon}"></i>
                </div>
                <span class="method-name">${method.name}</span>
                <div class="method-check"></div>
            </div>
        `).join('');

        // 绑定支付方式选择事件
        document.querySelectorAll('.payment-method').forEach(el => {
            el.addEventListener('click', function() {
                document.querySelectorAll('.payment-method').forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                PaymentManager.setPaymentMethod(this.dataset.method);
            });
        });
    }

    // 加载选中的地址
    function loadSelectedAddress() {
        // 优先使用已选择的地址
        let address = PaymentManager.getSelectedAddress();
        
        // 如果没有选中的地址，尝试获取默认地址
        if (!address) {
            address = AddressSelector.getDefaultAddress();
        }
        
        if (address) {
            renderAddress(address);
            PaymentManager.setSelectedAddress(address);
        }
    }

    // 渲染地址
    function renderAddress(address) {
        addressSelector.classList.add('selected');
        addressPlaceholder.innerHTML = `
            <div class="address-info">
                <div class="name-phone">
                    <span>${address.name}</span>
                    <span>${address.phone}</span>
                </div>
                <div class="address-detail">
                    ${address.province}${address.city}${address.district}${address.detail}
                </div>
            </div>
        `;
    }

    // 渲染订单摘要
    function renderOrderSummary() {
        if (isFromCart) {
            renderCartOrderSummary();
        } else {
            renderSingleOrderSummary();
        }
    }

    // 渲染单个商品订单摘要（商品详情页立即购买）
    function renderSingleOrderSummary() {
        if (!currentProduct) return;

        const totalAmount = currentProduct.price * quantity;

        orderSummary.innerHTML = `
            <div class="order-item">
                <img src="${currentProduct.image}" alt="${currentProduct.name}" onerror="this.style.display='none'">
                <div class="item-info">
                    <span class="item-name">${currentProduct.name}</span>
                    <span class="item-price">¥${currentProduct.price}</span>
                </div>
                <span style="color: #999;">x${quantity}</span>
            </div>
            <div class="summary-row label">
                <span>商品金额</span>
                <span>¥${totalAmount}</span>
            </div>
            <div class="summary-row label">
                <span>运费</span>
                <span>免运费</span>
            </div>
            <div class="summary-row total">
                <span>应付金额</span>
                <span>¥${totalAmount}</span>
            </div>
        `;
    }

    // 渲染购物车订单摘要（多个商品）
    function renderCartOrderSummary() {
        if (checkoutItems.length === 0) return;

        const totalAmount = checkoutItems.reduce((sum, item) => {
            return sum + item.price * (item.quantity || item.qty || 1);
        }, 0);

        const itemsHtml = checkoutItems.map(item => {
            const qty = item.quantity || item.qty || 1;
            return `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">¥${item.price}</span>
                    </div>
                    <span style="color: #999;">x${qty}</span>
                </div>
            `;
        }).join('');

        orderSummary.innerHTML = `
            ${itemsHtml}
            <div class="summary-row label">
                <span>商品金额</span>
                <span>¥${totalAmount}</span>
            </div>
            <div class="summary-row label">
                <span>运费</span>
                <span>免运费</span>
            </div>
            <div class="summary-row total">
                <span>应付金额</span>
                <span>¥${totalAmount}</span>
            </div>
        `;
    }

    // 加载地址列表
    function loadAddressList() {
        const addresses = AddressSelector.getAddresses();
        
        if (addresses.length === 0) {
            addressList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-map-marker-alt" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>暂无收货地址</p>
                    <p style="font-size: 14px; margin-top: 8px;">请先添加收货地址</p>
                    <button class="add-address-btn" style="margin-top: 16px; padding: 10px 24px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-plus"></i> 添加地址
                    </button>
                </div>
            `;
            
            // 绑定添加地址按钮事件
            document.querySelector('.add-address-btn')?.addEventListener('click', function() {
                window.open('../html/ditu.html', '_blank');
                addressModalOverlay.classList.remove('active');
            });
            return;
        }

        const selectedAddress = PaymentManager.getSelectedAddress();
        let html = addresses.map(address => `
            <div class="address-item ${selectedAddress && selectedAddress.id === address.id ? 'selected' : ''}" data-address='${JSON.stringify(address)}'>
                <div class="address-header">
                    <span class="name">${address.name}</span>
                    <span class="phone">${address.phone}</span>
                </div>
                <div class="address-detail">
                    ${address.province}${address.city}${address.district}${address.detail}
                </div>
                ${address.isDefault ? '<span class="is-default">默认地址</span>' : ''}
            </div>
        `).join('');

        // 添加管理地址按钮
        html += `
            <div style="margin-top: 16px; border-top: 1px dashed #eee; padding-top: 16px;">
                <button class="manage-address-btn" style="width: 100%; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-cog"></i> 管理收货地址
                </button>
            </div>
        `;

        addressList.innerHTML = html;

        // 绑定地址选择事件
        document.querySelectorAll('.address-item').forEach(el => {
            el.addEventListener('click', function() {
                const address = JSON.parse(this.dataset.address);
                AddressSelector.selectAddress(address);
                renderAddress(address);
                addressModalOverlay.classList.remove('active');
            });
        });

        // 绑定管理地址按钮事件
        document.querySelector('.manage-address-btn')?.addEventListener('click', function() {
            window.open('../html/ditu.html', '_blank');
            addressModalOverlay.classList.remove('active');
        });
    }

    // 绑定事件
    function bindEvents() {
        // 关闭按钮 - 返回上一页
        modalClose.addEventListener('click', function() {
            window.history.back();
        });

        // 打开地址选择弹窗
        addressBtn.addEventListener('click', function() {
            loadAddressList();
            addressModalOverlay.classList.add('active');
        });

        // 关闭地址选择弹窗
        addressModalClose.addEventListener('click', function() {
            addressModalOverlay.classList.remove('active');
        });

        addressModalOverlay.addEventListener('click', function(e) {
            if (e.target === addressModalOverlay) {
                addressModalOverlay.classList.remove('active');
            }
        });

        // 返回按钮
        returnBtn.addEventListener('click', handleReturn);

        // 确认支付按钮
        confirmBtn.addEventListener('click', handleConfirmPayment);
    }

    // 处理返回
    function handleReturn() {
        const address = PaymentManager.getSelectedAddress();
        if (!address) {
            alert('请先选择收货地址');
            return;
        }

        if (isFromCart) {
            // 从购物车结算 - 创建待付款订单
            createCartOrder(address);
            alert('订单已保存，3分钟内完成支付有效');
        } else {
            // 从商品详情页立即购买
            if (!currentProduct) {
                alert('商品信息加载失败');
                return;
            }
            OrderManager.createOrder(currentProduct, address, quantity);
            alert('订单已保存，3分钟内完成支付有效');
        }
        
        // 跳转到待付款页面
        window.location.href = 'order-pending-payment.html';
    }

    // 处理确认支付
    function handleConfirmPayment() {
        const address = PaymentManager.getSelectedAddress();
        if (!address) {
            alert('请先选择收货地址');
            return;
        }

        let order = null;

        if (isFromCart) {
            // 从购物车结算
            order = createCartOrder(address);
        } else {
            // 从商品详情页立即购买
            if (!currentProduct) {
                alert('商品信息加载失败');
                return;
            }
            order = OrderManager.createOrder(currentProduct, address, quantity);
        }

        PaymentManager.setCurrentOrder(order);
        
        // 跳转到支付页面
        window.location.href = 'payment-page.html';
    }

    // 创建购物车订单
    function createCartOrder(address) {
        const totalAmount = checkoutItems.reduce((sum, item) => {
            return sum + item.price * (item.quantity || item.qty || 1);
        }, 0);

        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const orderId = `ORD${timestamp}${random}`;

        const order = {
            id: orderId,
            items: checkoutItems,
            totalAmount: totalAmount,
            status: 'pending_payment',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
            address: address
        };

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        return order;
    }

    // 初始化
    init();
});
