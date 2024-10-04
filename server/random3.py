#source .venv/Scripts/activate
#flask --app=main db init   --- instead if flask db init
#flask --app=main db migrate --- make migration
'''
mech = MechaModel.query.get(mech_id)
creator = mech.creator  # Access the creator of this mech

user = UserModel.query.get(user_id)
mechs = user.usermechs  # Access the mechs created by this user











 @marshal_with(mechaFields)
    def post(self):
        args = mech_args.parse_args()
        mech = MechaModel(name=args["name"], description=args["description"], universe=args["universe"], img_url=args["img_url"])
        db.session.add(mech)
        db.session.commit()
        mechs = MechaModel.query.all()
        return mechs 


@marshal_with(userFields)
    def post(self):
        args = user_args.parse_args()
        username = args['username']
        email = args['email']
        email_in_use = UserModel.query.filter_by(email=email).first() is not None
        if email_in_use:
            return jsonify({"error": "That email is already being used."}), 409
        username_check = UserModel.query.filter_by(username=username).first() is not None
        if username_check:
            return jsonify({"error": "Username is already in use."}), 409
        password = bcrypt.generate_password_hash(args['password']).decode('utf-8')
        new_user = UserModel(username=args["username"], email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        #session["user_id"] = new_user.id
        return {'message': 'User registered successfully'}, 201
        #return jsonify({
         #   "id": new_user.id,
          #  "email": new_user.email
        #})
'''