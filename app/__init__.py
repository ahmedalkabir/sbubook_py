from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_login import LoginManager
from config import config

# db object to handle database operation management
db = SQLAlchemy()

login_manager = LoginManager()
login_manager.login_view = 'admin.login'
login_manager.login_message = 'الرجاء التسجيل الدخول أولًا'

def create_app(config_name):
    app = Flask(__name__)

    # TODO : Don't forget to clean your shit
    # note : just for development processing and learning
    app.config['SQLALCHEMY_DATABASE_URI'] =\
        'postgres://wmgaplpjsdyypt:46b7f4a2a0a2735b48463c419618e92cb3f86ff739feeb79ecaa34fe90a285f9@ec2-107-21-236-219.compute-1.amazonaws.com:5432/d9n6hj7vtbh07b'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'hello_nigga_from_the_other_world'
    # TODO: Don't forget to uncomment when you're going to publish this application 
    # app.config['SSL_REDIRECT'] = True

    # app.config.from_object(config[config_name])
    # config[config_name].init_app(app)

    db.init_app(app)
    login_manager.init_app(app)

    # TODO: Don't forget to uncomment when you're going to publish this application 
    # if app.config['SSL_REDIRECT']:
    #     from flask_sslify import SSLify
    #     sslify = SSLify(app)

    migrate = Migrate(app, db)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .admin_sbu import admin as admin_sbu_blueprint
    app.register_blueprint(admin_sbu_blueprint, url_prefix='/admin_sbu')

    return app
