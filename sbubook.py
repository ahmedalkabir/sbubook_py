import click
from app import create_app, db
from flask_migrate import Migrate, upgrade

app = create_app('')
migrate = Migrate(app, db)


@app.cli.command()
def deploy():
    """Run deployment tasks."""
    # migrate the database
    upgrade()
