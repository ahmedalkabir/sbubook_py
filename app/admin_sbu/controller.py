import json
from flask import jsonify
from ..models import Departments, Subjects, Books, Posts
from .. import db


class ManagerController:
    def __init__(self):
        pass
    
    def get_departments(self, bjson: bool =False):
        # return it in json prototype, as I'm doing ajax request in dashboard 
        if bjson:
            return jsonify([department.serialize for department in Departments.query.order_by(Departments.id).all()])
        else:
            return Departments.query.order_by(Departments.id).all()

    def add_department(self, json_data):
        depart = Departments(code_department=json_data['code'], name_department=json_data['name'])
        db.session.add(depart)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم إضافة القسم بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})
    
    def delete_department(self, json_data):
        depart = Departments.query.filter_by(code_department=json_data['code']).first()
        db.session.delete(depart)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم الحذف بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def edit_department(self, json_data):
        depart = Departments.query.get(json_data['id'])
        depart.code_department = json_data['code']
        depart.name_department = json_data['name']
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم التعديل بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    # section for subjects
    def get_subjects(self, department_of_subject, bjson: bool = False):
        if bjson:
            return jsonify(
                [subject.serialize for subject in
                 Subjects.query.filter_by(code_department=department_of_subject).order_by(Subjects.id).all()])
        else:
            Subjects.query.filter_by(code_department=department_of_subject).order_by(Subjects.id).all()

    def add_subject(self, json_data):
        subject = Subjects(code_subject=json_data['code_subject'], name_subject=json_data['name_subject'],
                           units_subject=json_data['units_subject'], prerequisites=json_data['prerequisites'],
                           code_department=json_data['code_department'])
        db.session.add(subject)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم إضافة المادة بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def delete_subject(self, json_data):
        subject = Subjects.query.filter_by(code_subject=json_data['code_subject']).first()
        db.session.delete(subject)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم الحذف بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def edit_subject(self, json_data):
        subject = Subjects.query.get(json_data['id'])
        subject.code_subject = json_data['code_subject']
        subject.name_subject = json_data['name_subject']
        subject.units_subject = json_data['units_subject']
        subject.prerequisites = json_data['prerequisties']
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم التعديل بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def get_books(self, books_of_subject ,bjson: bool = False):
        if bjson:
            return jsonify([book.serialize
                            for book in Books.query.filter_by(code_subject=books_of_subject).order_by(Books.id).all()])
        else:
            Books.query.filter_by(code_subject=books_of_subject).order_by(Books.id).all()

    def add_book(self, json_data):
        book = Books(id=json_data['id'], code_subject=json_data['code_subject'],
                     name_book=json_data['name_book'], type_of_book=json_data['type_of_book'],
                     size_of_book=json_data['size_of_book'], url_of_book=json_data['url_of_book'])
        db.session.add(book)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم إضافة الكتاب بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def delete_book(self, json_data):
        book = Books.query.get(json_data['id'])
        db.session.delete(book)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم الحذف بنجاح'})
        except Exception as ex:
            return json_data({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def edit_book(self, json_data):
        book = Books.query.get(json_data['id'])
        book.name_book = json_data['name_book']
        book.type_of_book = json_data['type_of_book']
        book.size_of_book = json_data['size_of_book']
        book.url_of_book = json_data['url_of_book']
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم التعديل بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def get_posts(self, bjson : bool = False):
        # return it in json prototype, as I'm doing ajax request in dashboard
        if bjson:
            return jsonify([post.serialize for post in Posts.query.order_by(Posts.id).all()])
        else:
            return Departments.query.order_by(Departments.id).all()

    # to get desired post to show it
    def get_post_by_id(self, id_post=None):
        if id_post is not None:
            return json.dumps(Posts.query.filter_by(id=id_post).first().serialize)

    def add_post(self, json_data):
        post = Posts(author_post=json_data['author_post'], title_post=json_data['title_post'],
                     content_post=json_data['content_post'], image_post=json_data['image_post']);
        db.session.add(post)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم إضافة المنشور بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def delete_post(self, json_data):
        post = Posts.query.filter_by(id=json_data['id']).first()
        db.session.delete(post)
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم الحذف بنجاح'})
        except Exception as ex:
            return json_data({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

    def edit_post(self, json_data):
        post = Posts.query.get(json_data['id'])
        post.author_post = json_data['author_post']
        post.title_post = json_data['title_post']
        post.content_post = json_data['content_post']
        post.image_post = json_data['image_post']
        try:
            db.session.commit()
            return json.dumps({'status': True, 'messages': 'تم التعديل بنجاح'})
        except Exception as ex:
            return json.dumps({'status': False, 'messages': '{} المعذرة يوجد خطأ في التنفيذ'.format(ex)})

