"""
用户认证模块
包含注册、登录、登出等认证功能
"""

from flask import Blueprint, request, jsonify, session
import hashlib
import re
from datetime import datetime, timedelta
from functools import wraps

# 创建认证蓝图
auth_bp = Blueprint('auth', __name__)

# 登录尝试记录（用于限流）
login_attempts = {}

# 模拟模式下的用户数据存储（内存）
mock_users = {}

def hash_password(password):
    """密码哈希"""
    return hashlib.sha256(password.encode()).hexdigest()

def validate_username(username):
    """验证用户名格式"""
    if not username or len(username) < 3 or len(username) > 20:
        return False, "用户名长度必须在3-20个字符之间"
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "用户名只能包含字母、数字和下划线"
    return True, ""

def validate_password(password):
    """验证密码强度"""
    if not password or len(password) < 6 or len(password) > 20:
        return False, "密码长度必须在6-20个字符之间"
    if not re.search(r'[a-zA-Z]', password):
        return False, "密码必须包含至少一个字母"
    if not re.search(r'\d', password):
        return False, "密码必须包含至少一个数字"
    return True, ""

def validate_email(email):
    """验证邮箱格式"""
    if not email:
        return True, ""  # 邮箱为可选
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "邮箱格式不正确"
    return True, ""

def validate_phone(phone):
    """验证手机号格式"""
    if not phone:
        return True, ""  # 手机号为可选
    pattern = r'^1[3-9]\d{9}$'
    if not re.match(pattern, phone):
        return False, "手机号格式不正确"
    return True, ""

def check_login_limit(ip_address):
    """检查登录尝试次数限制"""
    current_time = datetime.now()
    
    if ip_address in login_attempts:
        attempts, first_attempt_time = login_attempts[ip_address]
        
        # 如果距离第一次尝试已经超过15分钟，重置计数
        if current_time - first_attempt_time > timedelta(minutes=15):
            login_attempts[ip_address] = [0, current_time]
            return True
        
        # 如果5次内，拒绝登录
        if attempts >= 5:
            remaining_time = 15 * 60 - (current_time - first_attempt_time).seconds
            return False, f"登录尝试次数过多，请 {remaining_time // 60 + 1} 分钟后再试"
    
    return True

def record_login_attempt(ip_address):
    """记录登录尝试"""
    current_time = datetime.now()
    
    if ip_address in login_attempts:
        attempts, first_attempt_time = login_attempts[ip_address]
        
        # 如果距离第一次尝试已经超过15分钟，重置计数
        if current_time - first_attempt_time > timedelta(minutes=15):
            login_attempts[ip_address] = [1, current_time]
        else:
            login_attempts[ip_address][0] += 1
    else:
        login_attempts[ip_address] = [1, current_time]

def clear_login_attempts(ip_address):
    """清除登录尝试记录"""
    if ip_address in login_attempts:
        del login_attempts[ip_address]

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
    from app import get_db_connection, db_pool, MYSQL_ENABLED
    return get_db_connection()

@auth_bp.route('/api/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        username = data.get('username', '').strip() if data.get('username') else ''
        password = data.get('password', '')
        email = data.get('email', '').strip() if data.get('email') else ''
        phone = data.get('phone', '').strip() if data.get('phone') else ''
        
        # 验证用户名
        valid, msg = validate_username(username)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证密码
        valid, msg = validate_password(password)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证邮箱
        valid, msg = validate_email(email)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 验证手机号
        valid, msg = validate_phone(phone)
        if not valid:
            return jsonify({'code': 400, 'message': msg, 'data': None})
        
        # 密码哈希
        password_hash = hash_password(password)
        
        # 获取数据库连接
        from app import get_db_connection, MYSQL_ENABLED
        
        if MYSQL_ENABLED:
            conn = get_db_connection()
            if not conn:
                return jsonify({'code': 500, 'message': '数据库连接失败', 'data': None})
            
            try:
                cursor = conn.cursor()
                
                # 检查用户名是否已存在
                cursor.execute('SELECT id FROM users WHERE username = %s', (username,))
                if cursor.fetchone():
                    return jsonify({'code': 400, 'message': '用户名已存在', 'data': None})
                
                # 插入新用户
                cursor.execute('''
                    INSERT INTO users (username, password, email, phone, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                ''', (username, password_hash, email if email else None, phone if phone else None))
                
                conn.commit()
                user_id = cursor.lastrowid
                
                cursor.close()
                conn.close()
                
                return jsonify({
                    'code': 200,
                    'message': '注册成功',
                    'data': {
                        'user_id': user_id,
                        'username': username
                    }
                })
                
            except Exception as e:
                conn.rollback()
                return jsonify({'code': 500, 'message': f'注册失败: {str(e)}', 'data': None})
        else:
            # 模拟模式 - 保存用户到内存
            if username in mock_users:
                return jsonify({'code': 400, 'message': '用户名已存在', 'data': None})
            
            user_id = len(mock_users) + 1
            mock_users[username] = {
                'id': user_id,
                'username': username,
                'password': password_hash,  # 存储哈希后的密码
                'email': email if email else None,
                'phone': phone if phone else None,
                'created_at': datetime.now().isoformat()
            }
            
            return jsonify({
                'code': 200,
                'message': '注册成功（模拟模式）',
                'data': {
                    'user_id': user_id,
                    'username': username
                }
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@auth_bp.route('/api/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        # 获取客户端IP
        ip_address = request.remote_addr or '127.0.0.1'
        
        # 检查登录限制
        result = check_login_limit(ip_address)
        if isinstance(result, tuple):
            return jsonify({'code': 429, 'message': result[1], 'data': None})
        
        data = request.get_json()
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据不能为空', 'data': None})
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({'code': 400, 'message': '用户名和密码不能为空', 'data': None})
        
        # 密码哈希
        password_hash = hash_password(password)
        
        # 获取数据库连接
        from app import get_db_connection, MYSQL_ENABLED
        
        if MYSQL_ENABLED:
            conn = get_db_connection()
            if not conn:
                return jsonify({'code': 500, 'message': '数据库连接失败', 'data': None})
            
            try:
                cursor = conn.cursor(dictionary=True)
                
                # 查询用户
                cursor.execute('''
                    SELECT id, username, email, phone, created_at
                    FROM users
                    WHERE username = %s AND password = %s
                ''', (username, password_hash))
                
                user = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                if not user:
                    # 记录失败的登录尝试
                    record_login_attempt(ip_address)
                    return jsonify({'code': 401, 'message': '用户名或密码不正确', 'data': None})
                
                # 登录成功，清除登录尝试记录
                clear_login_attempts(ip_address)
                
                # 设置session
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['login_time'] = datetime.now().isoformat()
                
                return jsonify({
                    'code': 200,
                    'message': '登录成功',
                    'data': {
                        'user_id': user['id'],
                        'username': user['username'],
                        'email': user.get('email'),
                        'phone': user.get('phone')
                    }
                })
                
            except Exception as e:
                return jsonify({'code': 500, 'message': f'登录失败: {str(e)}', 'data': None})
        else:
            # 模拟模式 - 验证内存中的用户
            if username in mock_users:
                user = mock_users[username]
                # 验证密码（比较哈希值）
                if user['password'] == password_hash:
                    clear_login_attempts(ip_address)
                    session['user_id'] = user['id']
                    session['username'] = user['username']
                    session['login_time'] = datetime.now().isoformat()
                    
                    return jsonify({
                        'code': 200,
                        'message': '登录成功（模拟模式）',
                        'data': {
                            'user_id': user['id'],
                            'username': user['username'],
                            'email': user.get('email'),
                            'phone': user.get('phone')
                        }
                    })
            
            # 用户不存在或密码错误
            record_login_attempt(ip_address)
            return jsonify({'code': 401, 'message': '用户名或密码不正确', 'data': None})
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    """用户登出"""
    try:
        session.clear()
        return jsonify({'code': 200, 'message': '退出登录成功', 'data': None})
    except Exception as e:
        return jsonify({'code': 500, 'message': f'退出登录失败: {str(e)}', 'data': None})

@auth_bp.route('/api/user/info', methods=['GET'])
def get_user_info():
    """获取当前用户信息"""
    try:
        if 'user_id' not in session:
            return jsonify({'code': 401, 'message': '请先登录', 'data': None})
        
        from app import get_db_connection, MYSQL_ENABLED
        
        if MYSQL_ENABLED:
            conn = get_db_connection()
            if not conn:
                return jsonify({'code': 500, 'message': '数据库连接失败', 'data': None})
            
            try:
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute('''
                    SELECT id, username, email, phone, created_at
                    FROM users
                    WHERE id = %s
                ''', (session['user_id'],))
                
                user = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                if not user:
                    session.clear()
                    return jsonify({'code': 401, 'message': '用户不存在', 'data': None})
                
                return jsonify({
                    'code': 200,
                    'message': '获取用户信息成功',
                    'data': user
                })
                
            except Exception as e:
                return jsonify({'code': 500, 'message': f'获取用户信息失败: {str(e)}', 'data': None})
        else:
            # 模拟模式
            return jsonify({
                'code': 200,
                'message': '获取用户信息成功（模拟模式）',
                'data': {
                    'id': session['user_id'],
                    'username': session['username'],
                    'email': 'admin@example.com',
                    'phone': '13800138000',
                    'created_at': datetime.now().isoformat()
                }
            })
    
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})

@auth_bp.route('/api/user/check', methods=['GET'])
def check_login_status():
    """检查登录状态"""
    try:
        if 'user_id' in session:
            return jsonify({
                'code': 200,
                'message': '已登录',
                'data': {
                    'logged_in': True,
                    'user_id': session['user_id'],
                    'username': session['username']
                }
            })
        else:
            return jsonify({
                'code': 200,
                'message': '未登录',
                'data': {
                    'logged_in': False
                }
            })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}', 'data': None})
