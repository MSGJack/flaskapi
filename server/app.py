from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
from flask_migrate import Migrate

app = Flask(__name__)       
cors = CORS(app, origins='*')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app) 
#server_session = Session(app)
#app.secret_key = 'hii'
app.config['SECRET_KEY'] = 'your_strong_secret_key'
app.config["JWT_SECRET_KEY"] = 'your_jwt_secret_key'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
api = Api(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True)
    usermechs = db.relationship('MechaModel', backref='creator')
    
    def __repr__(self): 
        return f"User(username = {self.username}, email = {self.email}"
    
user_args = reqparse.RequestParser()
user_args.add_argument('username', type=str, required=True, help="username cannot be blank")
user_args.add_argument('email', type=str, required=True, help="email cannot be blank")
user_args.add_argument('password', type=str, required=True, help="password cannot be blank")

userFields = {
    'id':fields.Integer,
    'username':fields.String,
    'email':fields.String,
    'password':fields.String,
}

class MechaModel(db.Model):
    __tablename__ = 'mechs' 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(80),  nullable=False)
    universe = db.Column(db.String(80), nullable=False)
    img_url = db.Column(db.String(80))
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    inventor = db.relationship('UserModel', backref='created_mechs', lazy=True)

    def __repr__(self): 
        return f"Mech(name = {self.name}, description = {self.description}, universe = {self.universe}, img_url = {self.img_url}, creator_id = {self.creator_id})"

mech_args = reqparse.RequestParser()
mech_args.add_argument('name', type=str, required=True, help="Name cannot be blank")
mech_args.add_argument('description', type=str, required=True, help="Description cannot be blank")
mech_args.add_argument('universe', type=str, required=True, help="Universe cannot be blank")
mech_args.add_argument('img_url', type=str)
mech_args.add_argument('creator_id', type=str)

mechaFields = {
    'id':fields.Integer,
    'name':fields.String,
    'description':fields.String,
    'universe':fields.String,
    'img_url':fields.String,
    'creator_id':fields.Integer
}

class Mechs(Resource):
    @marshal_with(mechaFields)
    def get(self):
        mechs = MechaModel.query.all()
        return mechs
    
    @jwt_required()
    @marshal_with(mechaFields)
    def post(self):
        args = mech_args.parse_args()
        name = args['name']
        universe = args['universe']
        description = args['description']
        img_url = args['img_url']
        user_id = get_jwt_identity()
        check_name = MechaModel.query.filter_by(name=name).first()
        if check_name:
            abort(409, message="MS already exists")
        mech = MechaModel(name=args["name"], description=args["description"], universe=args["universe"], img_url=args["img_url"], creator_id = user_id)
        db.session.add(mech)
        db.session.commit()
        mechs = MechaModel.query.all()
        return mechs 
        
class Mech(Resource):
    @marshal_with(mechaFields)
    def get(self, id):
        mech = MechaModel.query.filter_by(id=id).first_or_404()
        return  mech
    
    #@marshal_with(mechaFields
    @jwt_required()
    @marshal_with(mechaFields)
    def patch(self, id):
        args = mech_args.parse_args()
        user_id = get_jwt_identity()
        mech = MechaModel.query.filter_by(id=id).first_or_404()
        if user_id != mech.creator_id:
            return jsonify({"message": "You are not allowed to edit this mech"}), 401              
        mech.name = args["name"]
        mech.description = args["description"]
        mech.universe = args["universe"]
        mech.img_url = args["img_url"]
        db.session.commit()
        return {'message': 'Mecha successful update'}, 200
    
    @jwt_required()
    @marshal_with(mechaFields)
    def delete(self, id):
        user_id = get_jwt_identity()
        mech = MechaModel.query.filter_by(id=id).first_or_404()
        if user_id != mech.creator_id:
            return {"message": "You are not allowed to delete this mech"}, 401
        else:
            db.session.delete(mech)
            db.session.commit()
            mechs = MechaModel.query.all()
            return mechs

class Users(Resource):
    @marshal_with(userFields)
    def get(self):
        users = UserModel.query.all()
        return users

class User(Resource):
    @jwt_required()
    @marshal_with(userFields)
    def get(self, id):
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="NO USER FOUND")
        return user
    
    @jwt_required()
    @marshal_with(userFields)
    def patch(self):
        token = get_jwt_identity()
        if not token:
            return jsonify({"msg": "No token found"}), 400
        args = user_args.parse_args()
        user = UserModel.query.filter_by(id=token).first_or_404()
        if not user:
            abort(404, message="NO USER TO UPDATE")
        user.username = args["username"]
        user.email = args["email"]
        user.password = args["password"]
        db.session.commit()
        return user
    
    @jwt_required()
    @marshal_with(userFields)
    def delete(self):
        token = get_jwt_identity()
        if not token:
            return jsonify({"msg": "No token found"}), 400
        user = UserModel.query.filter_by(id=token).first_or_404()
        if not user: 
            abort(404, message="user not found8")
        db.session.delete(user)
        db.session.commit()
        users = UserModel.query.all()
        return users
 
class Login(Resource):
    #@marshal_with(userFields)
    def post(self):
        args = user_args.parse_args()
        username = args['username']
        email = args['email']
        password = args['password']
        user_check = UserModel.query.filter_by(username=username).first()
        if user_check is None:
            return {"error": "Username does not exsit"}, 401
        user = UserModel.query.filter_by(email=email).first()
        if user is None:
            return {"error": "Email not in use"}, 401
        if not bcrypt.check_password_hash(user.password, password):
            # User authentication successful
            return {'error': 'passwords do not match'}, 401
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id)
            return jsonify({'message': 'Login Success', 'access_token': access_token})
        else :
            return jsonify({'message': 'Login Failed'}), 401
        
class Register(Resource):
    def post(self):
        args = user_args.parse_args()
        username = args['username']
        email = args['email']
        password = args['password']
        check_name = UserModel.query.filter_by(username=username).first()
        if check_name is not None:
            return {"error": "Username is already taken"}, 401
        #using first_or_404 above would cause the next lines not to be read
        check_email = UserModel.query.filter_by(email=email).first()
        if check_email is not None:
            return {"error": "Email in use"}, 401
        hash_password = bcrypt.generate_password_hash(args['password'])
        new_user = UserModel(username=args["username"], email=args["email"], password=hash_password)
        db.session.add(new_user)
        db.session.commit()
        return 200
 
#@jwt_required()
class Check(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        if current_user:
            return True
        else:
            return jsonify({'message': 'failed to authenticate'}), 401
   
class GetName(Resource):
    @jwt_required()
    def get(self):
   # Extract the user ID from the JW
        token = get_jwt_identity()
        if not token:
            return jsonify({"msg": "No token found"}), 400
        user = UserModel.query.filter_by(id=token).first_or_404()

    # Check if user exists
        if user:
            return jsonify({"msg":"found","name" : user.username})
        else:
            return jsonify({'message': 'User not found'}), 404

class UserMech(Resource):
    @jwt_required()
    @marshal_with(mechaFields)
    def get(self):
        user_id = get_jwt_identity()
        usermech = MechaModel.query.filter_by(creator_id=user_id).all()
        if usermech == 0:
            return jsonify({'message': "You have not made any mechs yet."})
        else:
            return usermech
        
class VerifyMatch(Resource):
    @jwt_required()
    @marshal_with(mechaFields)
    def get(self, id):
        user = get_jwt_identity()
        print("USER ID")
        print(user)
        print("MS ID")
        print(id)
        mech = MechaModel.query.filter_by(id=id).first_or_404()
        print(mech)
        if user == mech.creator_id:
            print("OKK")
            return {'message': 'match'}, 200
        else:
            print("NOT A MATCH")
            return {'message': 'not a match'}, 401
        
    
 
api.add_resource(Mechs, '/api/mechs/')
api.add_resource(Mech, '/api/mechs/<int:id>')
api.add_resource(User, '/api/user/<int:id>')
api.add_resource(Users, '/api/users/')
api.add_resource(Login, '/api/login')
api.add_resource(Register, '/api/register')
api.add_resource(Check, '/api/verify')
api.add_resource(UserMech, '/api/usermechs')
api.add_resource(VerifyMatch, '/api/match/<int:id>')
api.add_resource(GetName, '/api/get_name')

if __name__ == "__main__":
    app.run(debug=True)