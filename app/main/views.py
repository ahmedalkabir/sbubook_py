from flask import render_template, redirect, url_for, abort, flash, request, \
    current_app, make_response
from . import main
from .. import db
from ..models import Departments, Subjects, Books, Posts


# show the main page
@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('main.html', departs=get_department_lists(),
                           last_books=get_list_of_books(),
                           last_posts=get_list_of_posts())


@main.route('/department/')
@main.route('/department/<depart_>')
def view_departments_subjects(depart_=None):
    if depart_ is None:
        return render_template('departments.html', departs=get_department_lists())
    else:
        return render_template('subjects.html', departs=get_department_lists(),
                               subjects=get_subjects_lists_by_department(depart_))


@main.route('/subjects/<sub>')
def view_books_of_subject(sub=None):
    if sub is not None:
        return render_template('books.html', departs=get_department_lists(),
                               books=get_books_lists_by_subject(sub))


# to show news feed
@main.route('/blog/')
@main.route('/blog/<id>')
def blogs(id=None):
    return 'Blogger'


# to get department list from database
def get_department_lists():
    return Departments.query.order_by(Departments.id).all()


# to get subject list by department
def get_subjects_lists_by_department(department='GS'):
    return Subjects.query.filter_by(code_department=department).order_by(Subjects.id).all()


# to get books by its subject
def get_books_lists_by_subject(subject=None):
    if subject is not None:
        return Books.query.filter_by(code_subject=subject).all()


# get list of books by specific number of books
def get_list_of_books(limit=3):
    return Books.query.limit(limit).all()


# to get list of posts at main page
def get_list_of_posts(limit=4):
    return Posts.query.limit(limit).all()
