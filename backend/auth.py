from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import uuid

from models import db, User, Admin, Role, AdminRole
from utils import validate_email, validate_phone, sanitize_string

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        full_name = data.get('fullName', '').strip()
        phone = data.get('phone', '').strip()
        
        # Validation
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        if phone and not validate_phone(phone):
            return jsonify({'success': False, 'message': 'Invalid phone format'}), 400
        
        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        # Create user
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            password_hash=generate_password_hash(password),
            full_name=sanitize_string(full_name) if full_name else None,
            phone=phone.replace('-', '').replace(' ', '') if phone else None,
            is_verified=False
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(
            identity=user.id,
            additional_claims={'type': 'user', 'email': user.email}
        )
        
        response = make_response(jsonify({
            'success': True,
            'user': user.to_dict(),
            'token': access_token
        }))
        
        # Set HTTP-only cookie
        response.set_cookie(
            'auth-token',
            access_token,
            max_age=7*24*60*60,  # 7 days
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.password_hash:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        if not check_password_hash(user.password_hash, password):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(
            identity=user.id,
            additional_claims={'type': 'user', 'email': user.email}
        )
        
        response = make_response(jsonify({
            'success': True,
            'user': user.to_dict(),
            'token': access_token
        }))
        
        # Set HTTP-only cookie
        response.set_cookie(
            'auth-token',
            access_token,
            max_age=7*24*60*60,  # 7 days
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        return response
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }))
    
    # Clear the auth cookie
    response.set_cookie(
        'auth-token',
        '',
        max_age=0,
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    
    return response

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required'}), 400
        
        # Find admin by username or email
        admin = Admin.query.filter(
            (Admin.username == username) | (Admin.email == username)
        ).filter_by(is_active=True).first()
        
        if not admin or not check_password_hash(admin.password_hash, password):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Update last login
        admin.last_login_at = datetime.utcnow()
        db.session.commit()
        
        # Get admin roles
        admin_roles = []
        for admin_role in admin.roles:
            admin_roles.append({
                'role': admin_role.role.name,
                'cafe': admin_role.cafe.name if admin_role.cafe else None,
                'permissions': admin_role.role.permissions
            })
        
        # Create access token
        access_token = create_access_token(
            identity=admin.id,
            additional_claims={'type': 'admin', 'username': admin.username}
        )
        
        response = make_response(jsonify({
            'success': True,
            'admin': {
                **admin.to_dict(),
                'roles': admin_roles
            },
            'token': access_token
        }))
        
        # Set HTTP-only cookie
        response.set_cookie(
            'admin-token',
            access_token,
            max_age=24*60*60,  # 1 day
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax'
        )
        
        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/admin/logout', methods=['POST'])
def admin_logout():
    response = make_response(jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }))
    
    # Clear the admin cookie
    response.set_cookie(
        'admin-token',
        '',
        max_age=0,
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    
    return response
