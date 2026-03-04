from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "D:\Pogram Files\SQLSERVER2024\MSSQL16.MSSQLSERVER\MSSQL"
engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)
Base = declarative_base()



# DATABASE = {
#     'username': 'lrm',
#     'password': '1234',
#     'db_name': 'SCHEDULE'
# }

# DATABASE_URL = f"mysql+mysqlconnector.//{DATABASE['username']}:{DATABASE['password']}@localhost/{DATABASE['db_name']}"

# def get_db():
#     db = Session()
#     print(db)
#     try:
#         yield db
#     finally:
#         db.close()
#
#
# get_db()
# engine = create_engine(DATABASE_URL, echo=True)
# Session = sessionmaker(bind=engine)
# Base = declarative_base()
