class EventsController < ApplicationController
  layout 'standard' 
	
	def timeline
	  render :layout => 'standardtimeline'
	  print "\n\n\n\n my first new timeline controller \n\n\n\n"
	end

	def learnmore
	  print "\n\n\n\n my learn more page in the controller \n\n\n\n"
	end
	
  def about
	  print "\n\n\n\n my about page in the controller \n\n\n\n"
	end
	
	def faqs
	  print "\n\n\n\n my faqs page in the controller \n\n\n\n"
	end

  def privacy
	  print "\n\n\n\n my privacy page in the controller \n\n\n\n"
	end
	
	def terms
	  print "\n\n\n\n my terms page in the controller \n\n\n\n"
	end

  
	# Add a new event or update a modified event
	def add_event
	  flash.keep(:url)
	
	  #see if the event already exists
	  @event = Event.find_by_eventid(params[:event][:eventid])
		
		#if it doesnt then create a new event row
		if (@event.nil?)
			print "\n\n\n CREATING A NEW EVENT ROW \n\n\n"
	    @event = Event.new
		end
		
		print "\n\n\n TRYING TO CREATE /UPDATING NEW EVENT ROW \n\n\n"
		
		# add/update the event with the form values
		@event.eventid  = params[:event][:eventid]
		@event.userid   = session["timeline_id"];
		@event.desc     = params[:event][:desc]
		@event.div      = params[:event][:div]
		@event.top      = params[:event][:top]
		@event.left     = params[:event][:left]
		@event.year     = params[:event][:year]
		@event.month    = params[:event][:month]
		@event.day      = params[:event][:day]
		@event.hour     = params[:event][:hour]
		@event.interval = params[:event][:interval]
		@event.icon     = params[:event][:icon]
		
		@event.created_at    = Time.now
		@event.updated_at    = Time.now
		
		print "\n\n\n AFTER CREATING/UPDATING NEW EVENT ROW \n\n\n"
	 
	  if @event.save
		  respond_to do |format|
			  format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
			  format.js 
			end
	  else
		  print "\n\n\n SOMETHING SCREWED UP COULD NOT SAVE EVENT \n\n"
	  end
	 
  end
	
	
	# Get all the events for a given user
	def get_events
	  @events = Event.find(:all, :conditions => ["userid = ?", session["timeline_id"]])
	
		respond_to do |format|
		  format.html
			format.js
		end

  end
	
	
	#update the event description field for a given event for a user
	def update_event_description
	
	end
	
	
	#delete an event for a user
	def delete_event
	
	end
	

  # GET /events
  # GET /events.xml
  def index
    @events = Event.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @events }
    end
  end

  # GET /events/1
  # GET /events/1.xml
  def show
    @event = Event.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @event }
    end
  end

  # GET /events/new
  # GET /events/new.xml
  def new
    @event = Event.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @event }
    end
  end

  # GET /events/1/edit
  def edit
    @event = Event.find(params[:id])
  end

  # POST /events
  # POST /events.xml
  def create
    @event = Event.new(params[:event])

    respond_to do |format|
      if @event.save
        format.html { redirect_to(@event, :notice => 'Event was successfully created.') }
        format.xml  { render :xml => @event, :status => :created, :location => @event }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /events/1
  # PUT /events/1.xml
  def update
    @event = Event.find(params[:id])

    respond_to do |format|
      if @event.update_attributes(params[:event])
        format.html { redirect_to(@event, :notice => 'Event was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1
  # DELETE /events/1.xml
  def destroy
    @event = Event.find(params[:id])
    @event.destroy

    respond_to do |format|
      format.html { redirect_to(events_url) }
      format.xml  { head :ok }
    end
  end
end
