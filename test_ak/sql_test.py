from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

base = declarative_base()


db_string = "postgresql://federer:test2011@localhost:3333/tennis"


def db_connect():
    return create_engine(db_string)


def create_deals_table(engine):
    return base.metadata.create_all(engine)


class Deals(base):
    """Sqlalchemy deals model"""
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True)
    title = Column('title', String)
    link = Column('link', String, nullable=True)
    location = Column('location', String, nullable=True)
    original_price = Column('original_price', Integer, nullable=True)
    price = Column('price', Integer, nullable=True)
    end_date = Column('end_date', DateTime, nullable=True)


engine = db_connect()
create_deals_table(engine)
Session = sessionmaker(bind=engine)
