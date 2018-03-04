from flask import render_template, request,redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import admin
from .. import db, login_manager
from ..models import User
from .forms import LoginForm
from .controller import ManagerController

# global variables 
manager = ManagerController()

# in case someone get access to /admin_sbu
@admin.route('/', methods=['GET'])
def refer_to_login():
    return redirect(url_for('admin.login'))

@admin.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # user = User.query.filter_by(email=form.email.data).first()
        # if user is not None and user.verify_password(form.password.data):
        #     login_user(user, form.remember_me.data)
        #     next = request.args.get('next')
        #     if next is None or not next.startswith('/'):
        #         next = url_for('admin.dashboard')
        #     return redirect(next)
        # Mocking just for Development 
        if form.email.data == 'sbu@sbubook.com' and form.password.data == 'sbu123':
            login_user(form.email.data, form.remember_me.data)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('admin.dashboard')
            return redirect(next)
        flash('خطأ في كلمة السر أو البريد الإلكتروني .')
    return render_template('admin/login.html', form=form)

@admin.route('/dashboard')
# @login_required
def dashboard():
    return render_template('admin/dashboard.html')

"""
    TODO: clean some stuffs 
    TODO: make methods of ManagerController returns True or Flase to indicate the status of success of process 
    """
@admin.route('/departments')
@admin.route('/departments/<requests>', methods=['GET', 'POST'])
# @login_required
def departments(requests=None):
    if requests is not None and requests in ('get_departments', 'add_department', 'edit_department', 'delete_department'):
        if requests == 'get_departments':
            return manager.get_departments(bjson=True)
        elif requests == 'add_department':
            return manager.add_department(request.get_json())
        elif requests == 'delete_department':
            return manager.delete_department(request.get_json())
        elif requests == 'edit_department':
            return manager.edit_department(request.get_json())
    elif requests is None:
        return render_template('admin/departments.html')

@admin.route('/subjects')
@admin.route('/subjects/<sbj>')
# @login_required
def subjects(sbj=None):
    return render_template('admin/subjects.html', departs=manager.get_departments())

@admin.route('/books')
# @login_required
def books():
    return render_template('admin/books.html')

@admin.route('/blogs')
# @login_required
def blogs():
    return render_template('admin/blogs.html')

@login_manager.user_loader
def load_user(user_id):
    return None

