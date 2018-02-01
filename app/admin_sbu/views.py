from flask import render_template, request,redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import admin
from .. import db, login_manager
from ..models import User
from .forms import LoginForm


@admin.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.is_submitted():
        user = User.query.filter_by(email=form.email.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('admin.dashboard')
            return redirect(next)
        flash('Invalid email or passwrod.')
    return render_template('admin/login.html', form=form)


@admin.route('/dashboard')
def dashboard():
    return render_template('admin/dashboard.html')

@login_manager.user_loader
def load_user(user_id):
    return None

