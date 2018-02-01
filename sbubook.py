import click
from app import create_app, db
from flask_migrate import Migrate, upgrade

app = create_app('heroku')
migrate = Migrate(app, db)


@app.cli.command()
def deploy():
    """Run deployment tasks."""
    # migrate the database
    print('start deploying')
    upgrade()
