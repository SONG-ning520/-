/** 购物车页面逻辑 */

// 从localStorage获取购物车
function getCart() {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('读取购物车数据失败:', e);
        return [];
    }
}

// 保存购物车到localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 渲染购物车
function renderCart() {
    const cart = getCart();
    const listEl = document.getElementById('cartList');
    const containerEl = document.getElementById('cartContainer');
    const emptyEl = document.getElementById('emptyState');
    const countEl = document.getElementById('cartCount');

    // 兼容qty字段
    cart.forEach(item => {
        if (item.qty !== undefined && item.quantity === undefined) {
            item.quantity = item.qty;
        }
    });

    // 更新数量
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
    countEl.textContent = `共 ${totalItems} 件商品`;

    // 空状态
    if (cart.length === 0) {
        containerEl.classList.remove('visible');
        emptyEl.classList.add('visible');
        return;
    }

    containerEl.classList.add('visible');
    emptyEl.classList.remove('visible');

    // 渲染列表
    listEl.innerHTML = cart.map((item, index) => {
        const qty = item.quantity || item.qty || 1;
        return `
        <div class="cart-item" data-id="${item.id}" data-index="${index}">
            <input type="checkbox" class="item-checkbox" checked onchange="updateTotal()">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='../tupian/placeholder.png'">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-category">${item.category || '未分类'}</div>
                <div class="item-unit-price">单价：¥${item.price.toLocaleString()}</div>
            </div>
            <div class="item-quantity-area">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <input type="text" class="qty-input" value="${qty}" readonly>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="item-subtotal">¥${(item.price * qty).toLocaleString()}</div>
            <button class="item-remove" onclick="removeFromCart(${item.id})" title="移出购物车">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
    `}).join('');

    updateTotal();
}

// 修改数量
function changeQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find(c => c.id === id);
    if (!item) return;

    // 兼容qty字段
    if (item.qty !== undefined && item.quantity === undefined) {
        item.quantity = item.qty;
        delete item.qty;
    }

    item.quantity = (item.quantity || 1) + delta;
    if (item.quantity < 1) {
        item.quantity = 1;
        return; // 最小为1
    }

    saveCart(cart);
    renderCart();
}

// 移出购物车
function removeFromCart(id) {
    if (!confirm('确定要移出购物车吗？')) return;

    const cart = getCart();
    const newCart = cart.filter(item => item.id !== id);
    saveCart(newCart);
    renderCart();

    showToast('已移出购物车');
}

// 清空购物车
function clearCart() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('购物车已经是空的');
        return;
    }

    if (!confirm('确定要清空购物车吗？')) return;

    saveCart([]);
    renderCart();
    showToast('购物车已清空');
}

// 更新总价
function updateTotal() {
    const cart = getCart();
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let total = 0;
    let selectedCount = 0;

    checkboxes.forEach((cb, index) => {
        if (cb.checked && cart[index]) {
            const qty = cart[index].quantity || cart[index].qty || 1;
            total += cart[index].price * qty;
            selectedCount += qty;
        }
    });

    document.getElementById('totalPrice').textContent = `¥${total.toLocaleString()}`;

    // 更新全选状态
    const selectAll = document.getElementById('selectAll');
    if (checkboxes.length > 0) {
        selectAll.checked = Array.from(checkboxes).every(cb => cb.checked);
    }
}

// 全选/取消全选
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.item-checkbox');

    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });

    updateTotal();
}

// 结算
function checkout() {
    const cart = getCart();
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const selectedItems = [];

    checkboxes.forEach((cb, index) => {
        if (cb.checked && cart[index]) {
            selectedItems.push(cart[index]);
        }
    });

    if (selectedItems.length === 0) {
        showToast('请选择要结算的商品');
        return;
    }

    const total = selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || item.qty || 1), 0);
    
    localStorage.setItem('checkout_items', JSON.stringify(selectedItems));
    localStorage.setItem('checkout_total', total.toString());
    
    window.location.href = 'payment-modal.html?fromCart=1';
}

// 显示提示
function showToast(message) {
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderCart();

    // 绑定全选事件
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', toggleSelectAll);
    }
});
