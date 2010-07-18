class UsersController < ApplicationController
  
	layout 'standard' 
	
  def signin
	  flash[:signin_notice] = nil
		flash[:signup_notice] = nil
		flash.keep(:url)
  end

  def post_register
		
		# WARNING
		# This logic is wholy dependent on the names of the buttons on the signin
		# page.  If you change the button text, you must update the strings here
		#
		if params[:commit] == "Sign in"
		  post_register_signin
			return
	  elsif params[:commit] == "Forgot Password"
			forgot_password
			return
		end
	
	  @user = User.new
		@user.userid = params[:user][:userid]
		@user.name = params[:user][:name]
		@user.dob = params[:user][:dob]
		@user.email = params[:user][:email]
		@password = params[:password]
		@password_confirmation = params[:password_confirmation]

		@user.date_added = Time.now
		@user.date_modified = Time.now
				
		
		flash[:signup_notice] = nil
		#flash[:signin_notice] = nil
		flash.keep(:url)
		
		
		if @user.name.length < 1
			logger.error("Name can't be blank")
			flash[:signup_notice] = "Name can't be blank"
			render(:action => :signin)
			return
		elsif @user.email.length < 1
			logger.error("Email can't be blank")
			flash[:signup_notice] = "Email can't be blank"
			render(:action => :signin)
			return
		end
		match = User.find_by_email(@user.email)
		if not match.nil?
			logger.error("Email is already in use")
			flash[:signup_notice] = "Email is already in use"
			render(:action => :signin)
			return
		end
		match = User.find_by_userid(@user.userid)
		if not match.nil?
			logger.error("User id is already in use")
			flash[:signup_notice] = "User id is already in use"
			render(:action => :signin)
		elsif (@password != @password_confirmation)
			logger.error("Confirmation must match password")
			flash[:signup_notice] = "Confirmation must match password"
			render(:action => :signin)
		elsif (@password.length < 6)
			logger.error("Password must contain at least six characters")
			flash[:signup_notice] = "Password must contain six or more characters"
			render(:action => :signin)
		else
			@user.password = Digest::SHA1.hexdigest(@password)
			if @user.save
				session["timeline_id"] = @user[:userid];
				if flash[:url]
					redirect_to(flash[:url])	    	
				else
					redirect_to("/events/timeline/#{@user[:id]}")	    	
				end
			else
				render(:action => :signin)
			end
		end	  
	
	end


  def post_register_signin
	  flash[:signup_notice] = nil
		flash[:signin_notice] = nil
		flash.keep(:url)
		
		@user = User.find_by_userid(params[:user][:userid])
		if (@user.nil?)
			reset_session
			logger.error("Invalid User id")
			flash[:signin_notice] = "Invalid User id"
			render :action => 'signin'
		else
			if params[:temp] == nil
				@password = Digest::SHA1.hexdigest(params[:password])
				#print "\n\n\n1:" + @password + "\n\n\n"
			else
				@password = params[:temp]
				#print "\n\n\n2:" + @password + "\n\n\n"
			end
			if (@password != @user.password)
				logger.error("Invalid password")
				flash[:signin_notice] = "Invalid password"
				render(:action => :signin)
			else
				session["timeline_id"] = @user[:userid];
				if flash[:url]
					redirect_to(flash[:url])	    	
				else
					redirect_to("/events/timeline/#{@user[:id]}")	    	
				end
			end
		end  
	end
	
	def forgot_password
	  flash[:signup_notice] = nil
		flash[:signin_notice] = nil
		flash.keep(:url)
		
		if (params[:user].nil?)
			print "user is nil\n"
		elsif (params[:user][:userid].nil?)
			print "user id is nil\n"
		end
		
		if ((params[:user].nil?) || (params[:user][:userid].nil?))
			reset_session
			logger.error("Please enter User id")
			flash[:signin_notice] = "Please enter User id"
			render :action => 'signin'
			return
	  end
		
		@user = User.find_by_userid(params[:user][:userid])
		
		if (@user.nil?)
			print "USER IS NIL\n"
			reset_session
			logger.error("Please enter User id")
			flash[:signin_notice] = "Please enter User id"
			render :action => 'signin'
		else
			print "DELIVERING EMAIL\n"
		  @user = User.find_by_userid(params[:user][:userid])
			#encoded_url = "islesoftime.com/users/post_register_signin?user[userid]=#{@user[:userid]}&temp=#{@user[:password]}"
			encoded_url = "localhost:3000/users/post_register_signin?user[userid]=#{@user[:userid]}&temp=#{@user[:password]}"
			Emailer.deliver_forgot_password(@user.email, @user.name, encoded_url);
			redirect_to(:controller => :users, :action => :signin)
			end  
	end
	
	
def logout
  reset_session
	redirect_to("/")  
end
	
  # GET /users
  # GET /users.xml
  def index
	  if (session["timeline_id"] != 'amrita')
		  redirect_to("/")
			return
		end
			  
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @users }
    end
  end

  # GET /users/1
  # GET /users/1.xml
  def show
	
		#HACK
		if (params[:id] == "post_register_signin")
			post_register_signin
			return
		end
	
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @user }
    end
  end

  # GET /users/new
  # GET /users/new.xml
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.xml
  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        format.html { redirect_to(@user, :notice => 'User was successfully created.') }
        format.xml  { render :xml => @user, :status => :created, :location => @user }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.xml
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to(@user, :notice => 'User was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.xml
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to(users_url) }
      format.xml  { head :ok }
    end
  end
end
