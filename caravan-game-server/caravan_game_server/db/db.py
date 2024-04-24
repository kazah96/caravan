from peewee import *

DATABASE_NAME = "test.db"

db = SqliteDatabase(DATABASE_NAME)


class User(Model):
    id = CharField(primary_key=True, unique=True)
    name = CharField()

    created_at = DateTimeField()

    class Meta:
        database = db


class Game(Model):
    id = CharField(primary_key=True, unique=True)
    created_at = DateTimeField()
    closed_at = DateTimeField(null=True)

    class Meta:
        database = db
    
class UserGame(Model):
    user = ForeignKeyField(User)
    game = ForeignKeyField(Game)
    result = CharField(null=True)

    class Meta:
        database = db

db.connect()
db.create_tables([User, Game, UserGame])
