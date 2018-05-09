from . import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


# Models
class Departments(db.Model):
    __tablename__ = 'Departments'
    id = db.Column(db.Integer, primary_key=True)
    code_department = db.Column(db.String(64), unique=True)
    name_department = db.Column(db.String(64))
    code_department_to_subjects = db.relationship('Subjects', backref='departments')

    def __repr__(self):
        return '<Department {}>'.format(self.name_department)

    @property
    def serialize(self):
        """ Return object data in serializeable format """
        return {
            'id': self.id,
            'code_department': self.code_department,
            'name_department': self.name_department        
        } 


class Subjects(db.Model):
    __tablename__ = 'Subjects'
    id = db.Column(db.Integer, primary_key=True)
    code_subject = db.Column(db.String(64), unique=True)
    name_subject = db.Column(db.String(64))
    units_subject = db.Column(db.Integer)
    prerequisites = db.Column(db.String(64))
    code_department = db.Column(db.String(64), db.ForeignKey('Departments.code_department'))
    code_subject_to_books = db.relationship('Books', backref='subjects')

    def __repr__(self):
        return '<Subject {}>'.format(self.name_subjects)

    @property
    def serialize(self):
        """ Return object data in serializeable format """
        return {
            'id': self.id,
            'code_subject': self.code_subject,
            'name_subject': self.name_subject,
            'units_subject': self.units_subject,
            'prerequisites': self.prerequisites,
            'code_department': self.code_department
        }


class Books(db.Model):
    __tablename__ = 'Books'
    id = db.Column(db.Integer, primary_key=True)
    code_subject = db.Column(db.String(64), db.ForeignKey(Subjects.code_subject))
    name_book = db.Column(db.String(128))
    type_of_book = db.Column(db.String(128))
    size_of_book = db.Column(db.FLOAT)
    url_of_book = db.Column(db.String(260))

    def __repr__(self):
        return '<Books {}>'.format(self.name_book)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'code_subject': self.code_subject,
            'name_book': self.name_book,
            'type_of_book': self.type_of_book,
            'size_of_book': self.size_of_book,
            'url_of_book': self.url_of_book
        }


class Posts(db.Model):
    __tablename__ = 'Posts'
    id = db.Column(db.Integer, primary_key=True)
    author_post = db.Column(db.String(64))
    title_post = db.Column(db.String(64))
    content_post = db.Column(db.TEXT)
    image_post = db.Column(db.String(64))

    def __repr__(self):
        return '<Posts {}>'.format(self.title_post)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'author_post': self.author_post,
            'title_post': self.title_post,
            'content_post': self.content_post,
            'image_post': self.image_post
        }


class User(UserMixin, db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(64))
    about_me = db.Column(db.Text())

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get(self, id):
        return self.get_id()
