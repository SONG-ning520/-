/** 收藏页面逻辑 */

// 从localStorage获取收藏列表
function getFavorites() {
    try {
        const data = localStorage.getItem('favorites');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('读取收藏数据失败:', e);
        return [];
    }
}

// 保存收藏列表到localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

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

// 渲染收藏列表
function renderFavorites() {
    const favorites = getFavorites();
    const listEl = document.getElementById('favoritesList');
    const emptyEl = document.getElementById('emptyState');
    const countEl = document.getElementById('favCount');
    const clearBtn = document.getElementById('clearFavoritesBtn');

    // 更新数量
    countEl.textContent = `共 ${favorites.length} 件商品`;

    // 控制清空按钮显示
    if (clearBtn) {
        clearBtn.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }

    // 空状态
    if (favorites.length === 0) {
        listEl.style.display = 'none';
        emptyEl.classList.add('visible');
        return;
    }

    listEl.style.display = 'grid';
    emptyEl.classList.remove('visible');

    // 渲染列表
    listEl.innerHTML = favorites.map(item => `
        <div class="favorite-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='../tupian/placeholder.png'">
            </div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-category">${item.category || '未分类'}</div>
                <div class="item-price">¥${item.price.toLocaleString()}</div>
                <div class="item-actions">
                    <button class="btn-remove" onclick="removeFavorite(${item.id})">
                        <i class="far fa-trash-alt"></i> 移出收藏
                    </button>
                    <button class="btn-cart" onclick="addToCartFromFav(${item.id})">
                        <i class="fas fa-shopping-cart"></i> 加入购物车
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 移出收藏
function removeFavorite(id) {
    if (!confirm('确定要移出收藏吗？')) return;

    const favorites = getFavorites();
    const newFavorites = favorites.filter(item => item.id !== id);
    saveFavorites(newFavorites);
    renderFavorites();

    // 显示提示
    showToast('已移出收藏');
}

// 清空所有收藏
function clearAllFavorites() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        showToast('收藏列表为空');
        return;
    }

    if (!confirm(`确定要清空所有收藏吗？共 ${favorites.length} 件商品`)) return;

    saveFavorites([]);
    renderFavorites();
    showToast('已清空所有收藏');
}

// 从收藏加入购物车
function addToCartFromFav(id) {
    const favorites = getFavorites();
    const item = favorites.find(f => f.id === id);
    if (!item) return;

    const cart = getCart();
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            quantity: 1,
            addedTime: new Date().toISOString()
        });
    }

    saveCart(cart);
    showToast('已加入购物车');
}

// 显示提示
function showToast(message) {
    // 移除已有toast
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    // 动画进入
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 自动消失
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 初始化
 document.addEventListener('DOMContentLoaded', function() {
    renderFavorites();
});
