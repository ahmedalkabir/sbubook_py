import json
from flask import jsonify
from ..models import Departments, Subjects, Books
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
        db.session.commit()
        return 'TEST'
    
    def delete_department(self, json_data):
        depart = Departments.query.filter_by(code_department=json_data['code']).first()
        db.session.delete(depart)
        db.session.commit()
        return 'TEST DELETE'

    def edit_department(self, json_data):
        depart = Departments.query.get(json_data['id'])
        depart.code_department = json_data['code']
        depart.name_department = json_data['name']
        try:
            db.session.commit()
            return 'تم التعديل بنجاح'
        except Exception as ex:
           return 'Error: {}'.format(ex)