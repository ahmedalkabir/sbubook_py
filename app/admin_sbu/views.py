from flask import render_template, request,redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import admin
from .. import db, login_manager
from ..models import User
from .forms import LoginForm


# in case someone get access to /admin_sbu
@admin.route('/', methods=['GET'])
def refer_to_login():
    return redirect(url_for('admin.login'))

@admin.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('admin.dashboard')
            return redirect(next)
        flash('خطأ في كلمة السر أو البريد الإلكتروني .')
    return render_template('admin/login.html', form=form)

@admin.route('/dashboard')
def dashboard():
    print("H")
    return render_template('admin/dashboard.html')

@login_manager.user_loader
def load_user(user_id):
    return None

