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
    """
    it simply we received the json data based on request
    let's say we send POST Request to http://127.0.0.1:5000/admin_sbu/departments/edit_department
    which hold Request Payload like this {"id":"1","code":"GS","name":"قسم العام"} we send it to function based the end_point
    request to manager object's methods
    """
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
@admin.route('/subjects/<requests>', methods=['GET', 'POST'])
# @login_required
def subjects(requests=None):
    if requests is not None and requests in ('get_subjects', 'add_subject', 'edit_subject', 'delete_subject'):
        if requests == 'get_subjects':
            return manager.get_subjects(request.get_json()['departmentSubject'], bjson=True)
        elif requests == 'add_subject':
            return manager.add_subject(request.get_json())
        elif requests == 'delete_subject':
            return manager.delete_subject(request.get_json())
        elif requests == 'edit_subject':
            return manager.edit_subject(request.get_json())
    elif requests is None:
        return render_template('admin/subjects.html', departs=manager.get_departments())


@admin.route('/books')
@admin.route('/books/<requests>', methods=['GET', 'POST'])
# @login_required
def books(requests=None):
    if requests is not None and requests in ('get_books', 'add_book', 'edit_book', 'delete_book'):
        if requests == 'get_books':
            return manager.get_books(request.get_json()['code_subject'], bjson=True)
        elif requests == 'add_book':
            return manager.add_book(request.get_json())
        elif requests == 'delete_book':
            return manager.delete_book(request.get_json())
        elif requests == 'edit_book':
            return manager.edit_book(request.get_json())
    elif requests is None:
        return render_template('admin/books.html', departs=manager.get_departments())


@admin.route('/blog')
@admin.route('/blog/<requests>', methods=['GET', 'POST'])
# @login_required
def blogs(requests=None):
    if requests is not None and requests in ('get_posts', 'add_post', 'edit_post', 'delete_post', 'get_post'):
        if requests == 'get_posts':
            return manager.get_posts(bjson=True)
        if requests == 'get_post':
            return manager.get_post_by_id(request.get_json()['id_post'])
        elif requests == 'add_post':
            return manager.add_post(request.get_json())
        elif requests == 'delete_post':
            return manager.delete_post(request.get_json())
        elif requests == 'edit_post':
            return manager.edit_post(request.get_json())
    elif requests is None:
        return render_template('admin/blogs.html')


@login_manager.user_loader
def load_user(user_id):
    return None

