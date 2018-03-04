import click
from app import create_app, db
from flask_migrate import Migrate, upgrade

# TODO: don't forget to change it to heroku for deployment 
app = create_app('development')
migrate = Migrate(app, db)


@app.cli.command()
def deploy():
    """Run deployment tasks."""
    # migrate the database
    print('start deploying')
    upgrade()
