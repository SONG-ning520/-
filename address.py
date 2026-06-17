"""
收货地址管理模块
包含地址的创建、读取、更新、删除等操作
"""

from flask import Blueprint, request, jsonify, session
import re
from datetime import datetime
from functools import wraps

# 创建地址管理蓝图
address_bp = Blueprint('address', __name__)

# 模拟模式下的地址数据存储（内存）- 启动时清空
mock_addresses = {}

# 默认演示用户ID（用于模拟模式）
DEMO_USER_ID = 1

def validate_phone(phone):
    """验证手机号格式（允许空值）"""
    if not phone or phone.strip() == '':
        return True, ""
    pattern = r'^1[3-9]\d{9}$'
    if not re.match(pattern, phone):
        return False, "手机号格式不正确（请输入11位手机号码）"
    return True, ""

def validate_name(name):
    """验证姓名"""
    if not name or len(name.strip()) < 2 or len(name.strip()) > 20:
        return False, "姓名长度必须在2-20个字符之间"
    return True, ""

def validate_address_field(field, field_name, max_length=100):
    """验证地址字段"""
    if not field or len(field.strip()) == 0:
        return False, f"{field_name}不能为空"
    if len(field.strip()) > max_length:
        return False, f"{field_name}长度不能超过{max_length}个字符"
    return True, ""

def login_required(f):
    """登录验证装饰器 - 未登录时使用演示用户ID"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            # 未登录时自动使用演示用户ID，方便测试
            session['user_id'] = DEMO_USER_ID
        return f(*args, **kwargs)
    return decorated_function

def get_db_connection_from_app():
    """从主应用获取数据库连接"""
    from app import get_db_connection, MYSQL_ENABLED
    return get_db_connection(), MYSQL_ENABLED

@address_bp.route('/api/address/list', methods=['GET'])
@login_required
def get_address_list():
    """获取用户的所有收货地址"""
    try:
        user_id = session['user_id']
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('''
                    SELECT id, user_id, name, phone, province, city, district, 
                           detail_address, postal_code, is_default, created_at, updated_at
                    FROM addresses
                    WHERE user_id = %s
                    ORDER BY is_default DESC, created_at DESC
                ''', (user_id,))
                
                addresses = cursor.fetchall()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '获取地址列表成功',
                    'data': addresses
                })
                
            except Exception as e:
                if conn:
                    conn.close()
                return jsonify({'code': 500, 'message': f'获取地址列表失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            user_addresses = mock_addresses.get(user_id, [])
            return jsonify({
                'code': 200,
                'message': '获取地址列表成功（模拟模式）',
                'data': user_addresses
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@address_bp.route('/api/address/add', methods=['POST'])
@login_required
def add_address():
    """添加新收货地址"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        # 获取并验证数据
        name = data.get('name', '').strip() if data.get('name') else ''
        phone = data.get('phone', '').strip() if data.get('phone') else ''
        province = data.get('province', '').strip() if data.get('province') else ''
        city = data.get('city', '').strip() if data.get('city') else ''
        district = data.get('district', '').strip() if data.get('district') else ''
        detail_address = data.get('detailAddress', '').strip() if data.get('detailAddress') else ''
        postal_code = data.get('postalCode', '').strip() if data.get('postalCode') else ''
        is_default = data.get('isDefault', False)
        
        # 验证姓名
        valid, msg = validate_name(name)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证手机号
        valid, msg = validate_phone(phone)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证省份
        valid, msg = validate_address_field(province, '省份')
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证城市
        valid, msg = validate_address_field(city, '城市')
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证详细地址
        valid, msg = validate_address_field(detail_address, '详细地址', 200)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                # 检查重复地址
                cursor.execute('''
                    SELECT id FROM addresses
                    WHERE user_id = %s AND name = %s AND phone = %s 
                    AND province = %s AND city = %s AND detail_address = %s
                ''', (user_id, name, phone, province, city, detail_address))
                
                if cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 400, 'message': '该地址已存在，请勿重复添加', 'data': None})
                
                # 如果设置为默认地址，先取消其他默认地址
                if is_default:
                    cursor.execute('''
                        UPDATE addresses SET is_default = 0 WHERE user_id = %s
                    ''', (user_id,))
                
                # 插入新地址
                cursor.execute('''
                    INSERT INTO addresses (user_id, name, phone, province, city, district,
                                          detail_address, postal_code, is_default, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ''', (user_id, name, phone, province, city, district if district else None,
                      detail_address, postal_code if postal_code else None, is_default))
                
                conn.commit()
                address_id = cursor.lastrowid
                
                # 获取新插入的地址
                cursor.execute('''
                    SELECT id, user_id, name, phone, province, city, district,
                           detail_address, postal_code, is_default, created_at
                    FROM addresses WHERE id = %s
                ''', (address_id,))
                
                new_address = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '添加地址成功',
                    'data': new_address
                })
                
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'添加地址失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_addresses:
                mock_addresses[user_id] = []
            
            # 检查重复
            for addr in mock_addresses[user_id]:
                if addr['name'] == name and addr['phone'] == phone and \
                   addr['province'] == province and addr['city'] == city and \
                   addr['detail_address'] == detail_address:
                    return jsonify({'code': 400, 'message': '该地址已存在，请勿重复添加', 'data': None})
            
            # 如果设置为默认，取消其他默认
            if is_default:
                for addr in mock_addresses[user_id]:
                    addr['is_default'] = False
            
            address_id = len(mock_addresses[user_id]) + 1
            new_address = {
                'id': address_id,
                'user_id': user_id,
                'name': name,
                'phone': phone,
                'province': province,
                'city': city,
                'district': district if district else None,
                'detail_address': detail_address,
                'postal_code': postal_code if postal_code else None,
                'is_default': is_default,
                'created_at': datetime.now().isoformat(),
                'updated_at': None
            }
            
            mock_addresses[user_id].append(new_address)
            
            return jsonify({
                'code': 200,
                'message': '添加地址成功（模拟模式）',
                'data': new_address
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@address_bp.route('/api/address/update', methods=['PUT'])
@login_required
def update_address():
    """更新收货地址"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        address_id = data.get('id')
        if not address_id:
            return jsonify({'code': 400, 'message': '地址ID不能为空', 'data': None})
        
        # 获取并验证数据
        name = data.get('name', '').strip() if data.get('name') else ''
        phone = data.get('phone', '').strip() if data.get('phone') else ''
        province = data.get('province', '').strip() if data.get('province') else ''
        city = data.get('city', '').strip() if data.get('city') else ''
        district = data.get('district', '').strip() if data.get('district') else ''
        detail_address = data.get('detailAddress', '').strip() if data.get('detailAddress') else ''
        postal_code = data.get('postalCode', '').strip() if data.get('postalCode') else ''
        is_default = data.get('isDefault', False)
        
        # 验证姓名
        valid, msg = validate_name(name)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证手机号
        valid, msg = validate_phone(phone)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证省份
        valid, msg = validate_address_field(province, '省份')
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证城市
        valid, msg = validate_address_field(city, '城市')
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证详细地址
        valid, msg = validate_address_field(detail_address, '详细地址', 200)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                # 检查地址是否存在且属于当前用户
                cursor.execute('''
                    SELECT id FROM addresses WHERE id = %s AND user_id = %s
                ''', (address_id, user_id))
                
                if not cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '地址不存在或无权限修改', 'data': None})
                
                # 如果设置为默认地址，先取消其他默认地址
                if is_default:
                    cursor.execute('''
                        UPDATE addresses SET is_default = 0 WHERE user_id = %s
                    ''', (user_id,))
                
                # 更新地址
                cursor.execute('''
                    UPDATE addresses
                    SET name = %s, phone = %s, province = %s, city = %s, district = %s,
                        detail_address = %s, postal_code = %s, is_default = %s, updated_at = NOW()
                    WHERE id = %s AND user_id = %s
                ''', (name, phone, province, city, district if district else None,
                      detail_address, postal_code if postal_code else None, is_default,
                      address_id, user_id))
                
                conn.commit()
                
                # 获取更新后的地址
                cursor.execute('''
                    SELECT id, user_id, name, phone, province, city, district,
                           detail_address, postal_code, is_default, created_at, updated_at
                    FROM addresses WHERE id = %s
                ''', (address_id,))
                
                updated_address = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '更新地址成功',
                    'data': updated_address
                })
                
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'更新地址失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_addresses:
                return jsonify({'code': 404, 'message': '地址不存在', 'data': None})
            
            # 查找地址
            address_found = None
            for addr in mock_addresses[user_id]:
                if addr['id'] == address_id:
                    address_found = addr
                    break
            
            if not address_found:
                return jsonify({'code': 404, 'message': '地址不存在', 'data': None})
            
            # 如果设置为默认，取消其他默认
            if is_default:
                for addr in mock_addresses[user_id]:
                    addr['is_default'] = False
            
            # 更新地址
            address_found['name'] = name
            address_found['phone'] = phone
            address_found['province'] = province
            address_found['city'] = city
            address_found['district'] = district if district else None
            address_found['detail_address'] = detail_address
            address_found['postal_code'] = postal_code if postal_code else None
            address_found['is_default'] = is_default
            address_found['updated_at'] = datetime.now().isoformat()
            
            return jsonify({
                'code': 200,
                'message': '更新地址成功（模拟模式）',
                'data': address_found
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@address_bp.route('/api/address/delete', methods=['DELETE'])
@login_required
def delete_address():
    """删除收货地址"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        address_id = data.get('id')
        if not address_id:
            return jsonify({'code': 400, 'message': '地址ID不能为空', 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                # 检查地址是否存在且属于当前用户
                cursor.execute('''
                    SELECT id, is_default FROM addresses WHERE id = %s AND user_id = %s
                ''', (address_id, user_id))
                
                address = cursor.fetchone()
                if not address:
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '地址不存在或无权限删除', 'data': None})
                
                # 删除地址
                cursor.execute('''
                    DELETE FROM addresses WHERE id = %s AND user_id = %s
                ''', (address_id, user_id))
                
                conn.commit()
                
                # 如果删除的是默认地址，将第一个地址设为默认
                if address['is_default']:
                    cursor.execute('''
                        SELECT id FROM addresses WHERE user_id = %s ORDER BY created_at DESC LIMIT 1
                    ''', (user_id,))
                    
                    first_address = cursor.fetchone()
                    if first_address:
                        cursor.execute('''
                            UPDATE addresses SET is_default = 1 WHERE id = %s
                        ''', (first_address['id'],))
                        conn.commit()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '删除地址成功',
                    'data': None
                })
                
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'删除地址失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_addresses:
                return jsonify({'code': 404, 'message': '地址不存在', 'data': None})
            
            # 查找并删除地址
            address_found = False
            was_default = False
            for i, addr in enumerate(mock_addresses[user_id]):
                if addr['id'] == address_id:
                    was_default = addr['is_default']
                    mock_addresses[user_id].pop(i)
                    address_found = True
                    break
            
            if not address_found:
                return jsonify({'code': 404, 'message': '地址不存在', 'data': None})
            
            # 如果删除的是默认地址，将第一个地址设为默认
            if was_default and len(mock_addresses[user_id]) > 0:
                mock_addresses[user_id][0]['is_default'] = True
            
            return jsonify({
                'code': 200,
                'message': '删除地址成功（模拟模式）',
                'data': None
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@address_bp.route('/api/address/set-default', methods=['POST'])
@login_required
def set_default_address():
    """设置默认收货地址"""
    try:
        user_id = session['user_id']
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        address_id = data.get('id')
        if not address_id:
            return jsonify({'code': 400, 'message': '地址ID不能为空', 'data': None})
        
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor(dictionary=True)
                
                # 检查地址是否存在且属于当前用户
                cursor.execute('''
                    SELECT id FROM addresses WHERE id = %s AND user_id = %s
                ''', (address_id, user_id))
                
                if not cursor.fetchone():
                    cursor.close()
                    conn.close()
                    return jsonify({'code': 404, 'message': '地址不存在或无权限设置', 'data': None})
                
                # 取消所有默认地址
                cursor.execute('''
                    UPDATE addresses SET is_default = 0 WHERE user_id = %s
                ''', (user_id,))
                
                # 设置新的默认地址
                cursor.execute('''
                    UPDATE addresses SET is_default = 1 WHERE id = %s
                ''', (address_id,))
                
                conn.commit()
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '设置默认地址成功',
                    'data': None
                })
                
            except Exception as e:
                if conn:
                    conn.rollback()
                    conn.close()
                return jsonify({'code': 500, 'message': f'设置默认地址失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            if user_id not in mock_addresses:
                return jsonify({'code': 404, 'message': '地址不存在', 'data': None})
            
            # 查找地址
            address_found = False
            for addr in mock_addresses[user_id]:
                if addr['id'] == address_id:
                    address_found = True
                    break
            
            if not address_found:
                return jsonify({'code': 404, 'message': '地址不存在', 'data': None})
            
            # 取消所有默认，设置新的默认
            for addr in mock_addresses[user_id]:
                addr['is_default'] = (addr['id'] == address_id)
            
            return jsonify({
                'code': 200,
                'message': '设置默认地址成功（模拟模式）',
                'data': None
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})


@address_bp.route('/api/address/clear', methods=['POST'])
def clear_addresses():
    """清空所有地址数据（用于重置/测试）"""
    try:
        global mock_addresses
        mock_addresses = {}
        
        # 如果使用数据库，也清空数据库
        conn, MYSQL_ENABLED = get_db_connection_from_app()
        if MYSQL_ENABLED and conn:
            try:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM addresses')
                conn.commit()
                cursor.close()
                conn.close()
            except Exception:
                if conn:
                    conn.rollback()
                    conn.close()
        
        return jsonify({
            'code': 200,
            'message': '已清空所有地址数据',
            'data': None
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'清空失败: {str(e)}', 'data': None})