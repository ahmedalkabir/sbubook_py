from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_login import LoginManager
from config import config

# db object to handle database operation management
db = SQLAlchemy()

login_manager = LoginManager()
login_manager.login_view = 'admin_sbu.login'

def create_app(config_name):
    app = Flask(__name__)

    # TODO : Don't forget to clean your shit
    # note : just for development processing and learning
    # app.config['SQLALCHEMY_DATABASE_URI'] =\
    #     'postgresql://federer:test2011@localhost:3333/tennis'
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # app.config['SECRET_KEY'] = 'hello_nigga_from_the_other_world'
    # app.config['SSL_REDIRECT'] = True

    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    login_manager.init_app(app)

    if app.config['SSL_REDIRECT']:
        from flask_sslify import SSLify
        sslify = SSLify(app)

    migrate = Migrate(app, db)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .admin_sbu import admin as admin_sbu_blueprint
    app.register_blueprint(admin_sbu_blueprint, url_prefix='/admin_sbu')

    return app
