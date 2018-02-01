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
            print('{}-{}'.format(form.email.data, form.password.data))
            login_user(user, form.remember_me.data)
            return redirect('/dashboard')
        flash('Invalid email or passwrod.')
    else:
        print('Error Validator')
    return render_template('admin/login.html', form=form)


@login_manager.user_loader
def load_user(user_id):
    return None

