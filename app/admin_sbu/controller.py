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
        print(json_data)
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
        pass

    def add_book(self):
        pass

    def delete_book(self):
        pass

    def edit_book(self):
        pass

    def get_post(self):
        pass

    def add_post(self, json_data):
        pass

    def delete_post(self, json_data):
        pass

    def edit_post(self, json_data):
        pass