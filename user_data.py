"""
用户数据存储模块
包含收藏、购物车、订单、商品盒等用户专属数据管理功能
所有数据严格关联到已认证用户账户
"""

from flask import Blueprint, request, jsonify, session
from datetime import datetime
from functools import wraps
import json

user_data_bp = Blueprint('user_data', __name__)

# 模拟模式下的数据存储（内存）
mock_favorites = {}
mock_cart = {}
mock_orders = {}
mock_product_boxes = {}

# 订单状态常量
ORDER_STATUS = {
    'pending_payment': '待付款',
    'in_transit': '运输中',
    'awaiting_receipt': '待收货',
    'completed': '已完成'
}

def login_required(f):
    """登录验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'code': 401, 'message': '请先登录', 'data': None})
        return f(*args, **kwargs)
    return decorated_function

def get_db_connection_from_app():
    """从主应用获取数据库连接"""
    from app import get_db_connection, MYSQL_ENABLED
    return get_db_connection(), MYSQL_ENABLED

# ==================== 收藏API ====================

@user_data_bp.route('/api/user/favorites', methods=['GET'])
@login_required
def get_user_favorites():
    """获取当前用户的收藏列表"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                cursor.execute('''
                    SELECT f.*, p.name, p.price, p.image, p.rating, p.review_count
                    FROM favorites f
                    JOIN products p ON f.product_id = p.id
                    WHERE f.user_id = %s
                    ORDER BY f.created_at DESC
                ''', (user_id,))
                favorites = cursor.fetchall()
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '获取收藏列表成功',
                    'data': favorites
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取收藏列表失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_favorites = mock_favorites.get(user_id, [])
            return jsonify({
                'code': 200,
                'message': '获取收藏列表成功（模拟模式）',
                'data': user_favorites
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/favorite/<int:product_id>', methods=['POST'])
@login_required
def add_favorite(product_id):
    """添加商品到收藏"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id FROM products WHERE id = %s', (product_id,))
                if not cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
                
                cursor.execute('SELECT id FROM favorites WHERE user_id = %s AND product_id = %s', (user_id, product_id))
                if cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 400, 'message': '该商品已在收藏中', 'data': None})
                
                cursor.execute('''
                    INSERT INTO favorites (user_id, product_id, created_at)
                    VALUES (%s, %s, NOW())
                ''', (user_id, product_id))
                conn.commit()
                
                cursor.execute('''
                    SELECT f.*, p.name, p.price, p.image, p.rating, p.review_count
                    FROM favorites f
                    JOIN products p ON f.product_id = p.id
                    WHERE f.id = %s
                ''', (cursor.lastrowid,))
                new_favorite = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '收藏成功',
                    'data': new_favorite
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'收藏失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            from app import MOCK_PRODUCTS
            product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
            if not product:
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            if user_id not in mock_favorites:
                mock_favorites[user_id] = []
            
            for item in mock_favorites[user_id]:
                if item['product_id'] == product_id:
                    return jsonify({'code': 400, 'message': '该商品已在收藏中', 'data': None})
            
            new_favorite = {
                'id': len(mock_favorites[user_id]) + 1,
                'user_id': user_id,
                'product_id': product_id,
                'name': product['name'],
                'price': product['price'],
                'image': product['image'],
                'rating': product['rating'],
                'review_count': product['review_count'],
                'created_at': datetime.now().isoformat()
            }
            mock_favorites[user_id].append(new_favorite)
            
            return jsonify({
                'code': 200,
                'message': '收藏成功（模拟模式）',
                'data': new_favorite
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/favorite/<int:product_id>', methods=['DELETE'])
@login_required
def remove_favorite(product_id):
    """从收藏中移除商品"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor()
                
                cursor.execute('DELETE FROM favorites WHERE user_id = %s AND product_id = %s', (user_id, product_id))
                affected_rows = cursor.rowcount
                conn.commit()
                
                cursor.close()
                conn.close()
                
                if affected_rows > 0:
                    return jsonify({'code': 200, 'message': '取消收藏成功', 'data': None})
                else:
                    return jsonify({'code': 404, 'message': '该商品不在收藏中', 'data': None})
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'取消收藏失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_favorites:
                return jsonify({'code': 404, 'message': '该商品不在收藏中', 'data': None})
            
            removed = False
            for i, item in enumerate(mock_favorites[user_id]):
                if item['product_id'] == product_id:
                    mock_favorites[user_id].pop(i)
                    removed = True
                    break
            
            if removed:
                return jsonify({'code': 200, 'message': '取消收藏成功（模拟模式）', 'data': None})
            else:
                return jsonify({'code': 404, 'message': '该商品不在收藏中', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/favorite/check/<int:product_id>', methods=['GET'])
@login_required
def check_favorite(product_id):
    """检查商品是否已收藏"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor()
                cursor.execute('SELECT id FROM favorites WHERE user_id = %s AND product_id = %s', (user_id, product_id))
                is_favorite = cursor.fetchone() is not None
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': 'success',
                    'data': {'is_favorite': is_favorite}
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'检查收藏失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_favorites:
                return jsonify({'code': 200, 'message': 'success', 'data': {'is_favorite': False}})
            
            is_favorite = any(item['product_id'] == product_id for item in mock_favorites[user_id])
            return jsonify({
                'code': 200,
                'message': 'success',
                'data': {'is_favorite': is_favorite}
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

# ==================== 购物车API ====================

@user_data_bp.route('/api/user/cart', methods=['GET'])
@login_required
def get_user_cart():
    """获取当前用户的购物车"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                cursor.execute('''
                    SELECT c.*, p.name, p.price, p.image, p.stock
                    FROM cart c
                    JOIN products p ON c.product_id = p.id
                    WHERE c.user_id = %s
                    ORDER BY c.created_at DESC
                ''', (user_id,))
                cart_items = cursor.fetchall()
                cursor.close()
                conn.close()
                
                total_count = sum(item['quantity'] for item in cart_items)
                total_amount = sum(item['price'] * item['quantity'] for item in cart_items)
                
                return jsonify({
                    'code': 200,
                    'message': '获取购物车成功',
                    'data': {
                        'items': cart_items,
                        'total_count': total_count,
                        'total_amount': total_amount
                    }
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取购物车失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_cart = mock_cart.get(user_id, [])
            total_count = sum(item['quantity'] for item in user_cart)
            total_amount = sum(item['price'] * item['quantity'] for item in user_cart)
            
            return jsonify({
                'code': 200,
                'message': '获取购物车成功（模拟模式）',
                'data': {
                    'items': user_cart,
                    'total_count': total_count,
                    'total_amount': total_amount
                }
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/cart', methods=['POST'])
@login_required
def add_to_cart():
    """添加商品到购物车"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'code': 400, 'message': '商品ID不能为空', 'data': None})
        
        if quantity < 1:
            return jsonify({'code': 400, 'message': '数量不能小于1', 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id, name, price, image, stock FROM products WHERE id = %s', (product_id,))
                product = cursor.fetchone()
                if not product:
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
                
                cursor.execute('SELECT id, quantity FROM cart WHERE user_id = %s AND product_id = %s', (user_id, product_id))
                existing_item = cursor.fetchone()
                
                if existing_item:
                    new_quantity = existing_item['quantity'] + quantity
                    cursor.execute('UPDATE cart SET quantity = %s WHERE id = %s', (new_quantity, existing_item['id']))
                    conn.commit()
                    
                    cursor.execute('''
                        SELECT c.*, p.name, p.price, p.image, p.stock
                        FROM cart c
                        JOIN products p ON c.product_id = p.id
                        WHERE c.id = %s
                    ''', (existing_item['id'],))
                    updated_item = cursor.fetchone()
                else:
                    cursor.execute('''
                        INSERT INTO cart (user_id, product_id, quantity, created_at)
                        VALUES (%s, %s, %s, NOW())
                    ''', (user_id, product_id, quantity))
                    conn.commit()
                    
                    cursor.execute('''
                        SELECT c.*, p.name, p.price, p.image, p.stock
                        FROM cart c
                        JOIN products p ON c.product_id = p.id
                        WHERE c.id = %s
                    ''', (cursor.lastrowid,))
                    updated_item = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '添加购物车成功',
                    'data': updated_item
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'添加购物车失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            from app import MOCK_PRODUCTS
            product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
            if not product:
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            if user_id not in mock_cart:
                mock_cart[user_id] = []
            
            updated_item = None
            for item in mock_cart[user_id]:
                if item['product_id'] == product_id:
                    item['quantity'] += quantity
                    updated_item = item
                    break
            
            if not updated_item:
                updated_item = {
                    'id': len(mock_cart[user_id]) + 1,
                    'user_id': user_id,
                    'product_id': product_id,
                    'name': product['name'],
                    'price': product['price'],
                    'image': product['image'],
                    'stock': product['stock'],
                    'quantity': quantity,
                    'created_at': datetime.now().isoformat()
                }
                mock_cart[user_id].append(updated_item)
            
            return jsonify({
                'code': 200,
                'message': '添加购物车成功（模拟模式）',
                'data': updated_item
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/cart/<int:cart_id>', methods=['PUT'])
@login_required
def update_cart_item(cart_id):
    """更新购物车商品数量"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        quantity = data.get('quantity', 1)
        
        if quantity < 1:
            return jsonify({'code': 400, 'message': '数量不能小于1', 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id FROM cart WHERE id = %s AND user_id = %s', (cart_id, user_id))
                if not cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '购物车项不存在或无权限修改', 'data': None})
                
                cursor.execute('UPDATE cart SET quantity = %s WHERE id = %s', (quantity, cart_id))
                conn.commit()
                
                cursor.execute('''
                    SELECT c.*, p.name, p.price, p.image, p.stock
                    FROM cart c
                    JOIN products p ON c.product_id = p.id
                    WHERE c.id = %s
                ''', (cart_id,))
                updated_item = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '更新购物车成功',
                    'data': updated_item
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'更新购物车失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_cart:
                return jsonify({'code': 404, 'message': '购物车项不存在', 'data': None})
            
            updated_item = None
            for item in mock_cart[user_id]:
                if item['id'] == cart_id:
                    item['quantity'] = quantity
                    updated_item = item
                    break
            
            if updated_item:
                return jsonify({
                    'code': 200,
                    'message': '更新购物车成功（模拟模式）',
                    'data': updated_item
                })
            else:
                return jsonify({'code': 404, 'message': '购物车项不存在', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/cart/<int:cart_id>', methods=['DELETE'])
@login_required
def remove_cart_item(cart_id):
    """从购物车移除商品"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor()
                
                cursor.execute('DELETE FROM cart WHERE id = %s AND user_id = %s', (cart_id, user_id))
                affected_rows = cursor.rowcount
                conn.commit()
                
                cursor.close()
                conn.close()
                
                if affected_rows > 0:
                    return jsonify({'code': 200, 'message': '删除购物车项成功', 'data': None})
                else:
                    return jsonify({'code': 404, 'message': '购物车项不存在或无权限删除', 'data': None})
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'删除购物车项失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_cart:
                return jsonify({'code': 404, 'message': '购物车项不存在', 'data': None})
            
            removed = False
            for i, item in enumerate(mock_cart[user_id]):
                if item['id'] == cart_id:
                    mock_cart[user_id].pop(i)
                    removed = True
                    break
            
            if removed:
                return jsonify({'code': 200, 'message': '删除购物车项成功（模拟模式）', 'data': None})
            else:
                return jsonify({'code': 404, 'message': '购物车项不存在', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/cart/clear', methods=['POST'])
@login_required
def clear_cart():
    """清空购物车"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM cart WHERE user_id = %s', (user_id,))
                conn.commit()
                cursor.close()
                conn.close()
                
                return jsonify({'code': 200, 'message': '清空购物车成功', 'data': None})
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'清空购物车失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id in mock_cart:
                mock_cart[user_id] = []
            
            return jsonify({'code': 200, 'message': '清空购物车成功（模拟模式）', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

# ==================== 订单API ====================

@user_data_bp.route('/api/user/orders', methods=['GET'])
@login_required
def get_user_orders():
    """获取当前用户的订单列表，支持状态筛选"""
    try:
        user_id = session['user_id']
        status = request.args.get('status', '')
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                where_clause = 'WHERE user_id = %s'
                params = [user_id]
                
                if status and status in ORDER_STATUS:
                    where_clause += ' AND status = %s'
                    params.append(status)
                
                cursor.execute(f'''
                    SELECT o.*, 
                           (SELECT SUM(oi.price * oi.quantity) FROM order_items oi WHERE oi.order_id = o.id) as total_amount,
                           (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as total_items
                    FROM orders o
                    {where_clause}
                    ORDER BY o.created_at DESC
                ''', params)
                orders = cursor.fetchall()
                
                for order in orders:
                    if order['items']:
                        try:
                            order['items'] = json.loads(order['items'])
                        except:
                            pass
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '获取订单列表成功',
                    'data': orders
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取订单列表失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_orders = mock_orders.get(user_id, [])
            
            if status and status in ORDER_STATUS:
                user_orders = [o for o in user_orders if o['status'] == status]
            
            return jsonify({
                'code': 200,
                'message': '获取订单列表成功（模拟模式）',
                'data': user_orders
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/orders/status', methods=['GET'])
@login_required
def get_order_status_counts():
    """获取订单状态统计（待付款、运输中、待收货、已完成）"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                cursor.execute('''
                    SELECT status, COUNT(*) as count
                    FROM orders
                    WHERE user_id = %s
                    GROUP BY status
                ''', (user_id,))
                status_counts = cursor.fetchall()
                
                cursor.close()
                conn.close()
                
                counts = {status: 0 for status in ORDER_STATUS}
                for item in status_counts:
                    if item['status'] in counts:
                        counts[item['status']] = item['count']
                
                return jsonify({
                    'code': 200,
                    'message': '获取订单状态统计成功',
                    'data': counts
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取订单状态统计失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_orders = mock_orders.get(user_id, [])
            
            counts = {status: 0 for status in ORDER_STATUS}
            for order in user_orders:
                status = order.get('status', '')
                if status in counts:
                    counts[status] += 1
            
            return jsonify({
                'code': 200,
                'message': '获取订单状态统计成功（模拟模式）',
                'data': counts
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/order/<int:order_id>', methods=['GET'])
@login_required
def get_order_detail(order_id):
    """获取订单详情"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('''
                    SELECT o.*, 
                           (SELECT SUM(oi.price * oi.quantity) FROM order_items oi WHERE oi.order_id = o.id) as total_amount
                    FROM orders o
                    WHERE o.id = %s AND o.user_id = %s
                ''', (order_id, user_id))
                order = cursor.fetchone()
                
                if not order:
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '订单不存在或无权限查看', 'data': None})
                
                cursor.execute('''
                    SELECT oi.*, p.name, p.image
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = %s
                ''', (order_id,))
                order_items = cursor.fetchall()
                order['items'] = order_items
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '获取订单详情成功',
                    'data': order
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取订单详情失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_orders = mock_orders.get(user_id, [])
            order = next((o for o in user_orders if o['id'] == order_id), None)
            
            if not order:
                return jsonify({'code': 404, 'message': '订单不存在', 'data': None})
            
            return jsonify({
                'code': 200,
                'message': '获取订单详情成功（模拟模式）',
                'data': order
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/order', methods=['POST'])
@login_required
def create_order():
    """创建订单"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        items = data.get('items', [])
        address_id = data.get('address_id')
        
        if not items:
            return jsonify({'code': 400, 'message': '订单商品不能为空', 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                total_amount = 0
                order_items_data = []
                
                for item in items:
                    product_id = item.get('product_id')
                    quantity = item.get('quantity', 1)
                    
                    cursor.execute('SELECT id, name, price, stock FROM products WHERE id = %s', (product_id,))
                    product = cursor.fetchone()
                    if not product:
                        cursor.close()
                        conn.close()
                        return jsonify({'code': 404, 'message': f'商品ID {product_id} 不存在', 'data': None})
                    
                    if product['stock'] < quantity:
                        cursor.close()
                        conn.close()
                        return jsonify({'code': 400, 'message': f'商品 {product["name"]} 库存不足', 'data': None})
                    
                    total_amount += product['price'] * quantity
                    order_items_data.append({
                        'product_id': product_id,
                        'name': product['name'],
                        'price': product['price'],
                        'quantity': quantity
                    })
                
                order_no = datetime.now().strftime('%Y%m%d%H%M%S') + str(user_id).zfill(4)
                
                cursor.execute('''
                    INSERT INTO orders (user_id, order_no, total_amount, address_id, status, created_at)
                    VALUES (%s, %s, %s, %s, %s, NOW())
                ''', (user_id, order_no, total_amount, address_id, 'pending_payment'))
                order_id = cursor.lastrowid
                
                for item in order_items_data:
                    cursor.execute('''
                        INSERT INTO order_items (order_id, product_id, name, price, quantity)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (order_id, item['product_id'], item['name'], item['price'], item['quantity']))
                
                    cursor.execute('UPDATE products SET stock = stock - %s WHERE id = %s', (item['quantity'], item['product_id']))
                
                cursor.execute('DELETE FROM cart WHERE user_id = %s', (user_id,))
                
                conn.commit()
                
                cursor.execute('''
                    SELECT o.*
                    FROM orders o
                    WHERE o.id = %s
                ''', (order_id,))
                new_order = cursor.fetchone()
                new_order['items'] = order_items_data
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '创建订单成功',
                    'data': new_order
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'创建订单失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            from app import MOCK_PRODUCTS
            
            total_amount = 0
            order_items_data = []
            
            for item in items:
                product_id = item.get('product_id')
                quantity = item.get('quantity', 1)
                
                product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
                if not product:
                    return jsonify({'code': 404, 'message': f'商品ID {product_id} 不存在', 'data': None})
                
                total_amount += product['price'] * quantity
                order_items_data.append({
                    'product_id': product_id,
                    'name': product['name'],
                    'price': product['price'],
                    'quantity': quantity,
                    'image': product['image']
                })
            
            order_no = datetime.now().strftime('%Y%m%d%H%M%S') + str(user_id).zfill(4)
            
            if user_id not in mock_orders:
                mock_orders[user_id] = []
            
            new_order = {
                'id': len(mock_orders[user_id]) + 1,
                'user_id': user_id,
                'order_no': order_no,
                'total_amount': total_amount,
                'address_id': address_id,
                'status': 'pending_payment',
                'status_text': ORDER_STATUS['pending_payment'],
                'items': order_items_data,
                'created_at': datetime.now().isoformat(),
                'updated_at': None
            }
            mock_orders[user_id].append(new_order)
            
            if user_id in mock_cart:
                mock_cart[user_id] = []
            
            return jsonify({
                'code': 200,
                'message': '创建订单成功（模拟模式）',
                'data': new_order
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/order/<int:order_id>/pay', methods=['POST'])
@login_required
def pay_order(order_id):
    """支付订单"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id, status FROM orders WHERE id = %s AND user_id = %s', (order_id, user_id))
                order = cursor.fetchone()
                
                if not order:
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '订单不存在或无权限操作', 'data': None})
                
                if order['status'] != 'pending_payment':
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 400, 'message': '订单状态不允许支付', 'data': None})
                
                cursor.execute('UPDATE orders SET status = %s, updated_at = NOW() WHERE id = %s', ('in_transit', order_id))
                conn.commit()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '支付成功',
                    'data': {'status': 'in_transit', 'status_text': ORDER_STATUS['in_transit']}
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'支付失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_orders = mock_orders.get(user_id, [])
            order = next((o for o in user_orders if o['id'] == order_id), None)
            
            if not order:
                return jsonify({'code': 404, 'message': '订单不存在', 'data': None})
            
            if order['status'] != 'pending_payment':
                return jsonify({'code': 400, 'message': '订单状态不允许支付', 'data': None})
            
            order['status'] = 'in_transit'
            order['status_text'] = ORDER_STATUS['in_transit']
            order['updated_at'] = datetime.now().isoformat()
            
            return jsonify({
                'code': 200,
                'message': '支付成功（模拟模式）',
                'data': {'status': 'in_transit', 'status_text': ORDER_STATUS['in_transit']}
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/order/<int:order_id>/receive', methods=['POST'])
@login_required
def receive_order(order_id):
    """确认收货"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id, status FROM orders WHERE id = %s AND user_id = %s', (order_id, user_id))
                order = cursor.fetchone()
                
                if not order:
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '订单不存在或无权限操作', 'data': None})
                
                if order['status'] != 'in_transit':
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 400, 'message': '订单状态不允许确认收货', 'data': None})
                
                cursor.execute('UPDATE orders SET status = %s, updated_at = NOW() WHERE id = %s', ('awaiting_receipt', order_id))
                conn.commit()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '确认收货成功',
                    'data': {'status': 'awaiting_receipt', 'status_text': ORDER_STATUS['awaiting_receipt']}
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'确认收货失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_orders = mock_orders.get(user_id, [])
            order = next((o for o in user_orders if o['id'] == order_id), None)
            
            if not order:
                return jsonify({'code': 404, 'message': '订单不存在', 'data': None})
            
            if order['status'] != 'in_transit':
                return jsonify({'code': 400, 'message': '订单状态不允许确认收货', 'data': None})
            
            order['status'] = 'awaiting_receipt'
            order['status_text'] = ORDER_STATUS['awaiting_receipt']
            order['updated_at'] = datetime.now().isoformat()
            
            return jsonify({
                'code': 200,
                'message': '确认收货成功（模拟模式）',
                'data': {'status': 'awaiting_receipt', 'status_text': ORDER_STATUS['awaiting_receipt']}
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/order/<int:order_id>/complete', methods=['POST'])
@login_required
def complete_order(order_id):
    """完成订单"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id, status FROM orders WHERE id = %s AND user_id = %s', (order_id, user_id))
                order = cursor.fetchone()
                
                if not order:
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '订单不存在或无权限操作', 'data': None})
                
                if order['status'] != 'awaiting_receipt':
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 400, 'message': '订单状态不允许完成', 'data': None})
                
                cursor.execute('UPDATE orders SET status = %s, updated_at = NOW() WHERE id = %s', ('completed', order_id))
                conn.commit()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '订单完成成功',
                    'data': {'status': 'completed', 'status_text': ORDER_STATUS['completed']}
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'订单完成失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_orders = mock_orders.get(user_id, [])
            order = next((o for o in user_orders if o['id'] == order_id), None)
            
            if not order:
                return jsonify({'code': 404, 'message': '订单不存在', 'data': None})
            
            if order['status'] != 'awaiting_receipt':
                return jsonify({'code': 400, 'message': '订单状态不允许完成', 'data': None})
            
            order['status'] = 'completed'
            order['status_text'] = ORDER_STATUS['completed']
            order['updated_at'] = datetime.now().isoformat()
            
            return jsonify({
                'code': 200,
                'message': '订单完成成功（模拟模式）',
                'data': {'status': 'completed', 'status_text': ORDER_STATUS['completed']}
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

# ==================== 商品盒API ====================

@user_data_bp.route('/api/user/product-box', methods=['GET'])
@login_required
def get_product_box():
    """获取用户的商品盒"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                cursor.execute('''
                    SELECT pb.*, p.name, p.price, p.image
                    FROM product_boxes pb
                    JOIN products p ON pb.product_id = p.id
                    WHERE pb.user_id = %s
                    ORDER BY pb.created_at DESC
                ''', (user_id,))
                product_boxes = cursor.fetchall()
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '获取商品盒成功',
                    'data': product_boxes
                })
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取商品盒失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_boxes = mock_product_boxes.get(user_id, [])
            return jsonify({
                'code': 200,
                'message': '获取商品盒成功（模拟模式）',
                'data': user_boxes
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/product-box', methods=['POST'])
@login_required
def add_product_box():
    """添加商品到商品盒"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        product_id = data.get('product_id')
        
        if not product_id:
            return jsonify({'code': 400, 'message': '商品ID不能为空', 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('SELECT id FROM products WHERE id = %s', (product_id,))
                if not cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
                
                cursor.execute('SELECT id FROM product_boxes WHERE user_id = %s AND product_id = %s', (user_id, product_id))
                if cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 400, 'message': '该商品已在商品盒中', 'data': None})
                
                cursor.execute('''
                    INSERT INTO product_boxes (user_id, product_id, created_at)
                    VALUES (%s, %s, NOW())
                ''', (user_id, product_id))
                conn.commit()
                
                cursor.execute('''
                    SELECT pb.*, p.name, p.price, p.image
                    FROM product_boxes pb
                    JOIN products p ON pb.product_id = p.id
                    WHERE pb.id = %s
                ''', (cursor.lastrowid,))
                new_box = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '添加商品盒成功',
                    'data': new_box
                })
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'添加商品盒失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            from app import MOCK_PRODUCTS
            product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
            if not product:
                return jsonify({'code': 404, 'message': '商品不存在', 'data': None})
            
            if user_id not in mock_product_boxes:
                mock_product_boxes[user_id] = []
            
            for item in mock_product_boxes[user_id]:
                if item['product_id'] == product_id:
                    return jsonify({'code': 400, 'message': '该商品已在商品盒中', 'data': None})
            
            new_box = {
                'id': len(mock_product_boxes[user_id]) + 1,
                'user_id': user_id,
                'product_id': product_id,
                'name': product['name'],
                'price': product['price'],
                'image': product['image'],
                'created_at': datetime.now().isoformat()
            }
            mock_product_boxes[user_id].append(new_box)
            
            return jsonify({
                'code': 200,
                'message': '添加商品盒成功（模拟模式）',
                'data': new_box
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@user_data_bp.route('/api/user/product-box/<int:box_id>', methods=['DELETE'])
@login_required
def remove_product_box(box_id):
    """从商品盒移除商品"""
    try:
        user_id = session['user_id']
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor()
                
                cursor.execute('DELETE FROM product_boxes WHERE id = %s AND user_id = %s', (box_id, user_id))
                affected_rows = cursor.rowcount
                conn.commit()
                
                cursor.close()
                conn.close()
                
                if affected_rows > 0:
                    return jsonify({'code': 200, 'message': '删除商品盒成功', 'data': None})
                else:
                    return jsonify({'code': 404, 'message': '商品盒项不存在或无权限删除', 'data': None})
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'删除商品盒失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_product_boxes:
                return jsonify({'code': 404, 'message': '商品盒项不存在', 'data': None})
            
            removed = False
            for i, item in enumerate(mock_product_boxes[user_id]):
                if item['id'] == box_id:
                    mock_product_boxes[user_id].pop(i)
                    removed = True
                    break
            
            if removed:
                return jsonify({'code': 200, 'message': '删除商品盒成功（模拟模式）', 'data': None})
            else:
                return jsonify({'code': 404, 'message': '商品盒项不存在', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})