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
	  flash.keep(:url)
		
		#find the event 
	  @event      = Event.find(:first, :conditions => ["userid = ? AND eventid = ?", session["timeline_id"], params[:event][:update_eventid]])
	  
		
		#if it doesnt find it 
		if (@event.nil?)
			print "\n\n\n WE COULD NOT FIND AN EVENT TO UPDATE \n\n\n"
		else
		  #update its description
		  @event.desc = params[:event][:update_desc]
		
		  print "\n\n\n WE ARE TRYING TO UPDATE IT !!! "  + params[:event][:update_desc] + " \n\n\n "
		
		  if @event.save
			  respond_to do |format|
			    format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
			    format.js 
			  end
	    else
		    print "\n\n\n SOMETHING SCREWED UP COULD NOT UPDATE THE EVENT DESC \n\n"
	    end
	  end
		
	end
	
	
	#delete an event for a user
	def delete_event
	
		#find the event 
	  @event = Event.find(:first, :conditions => ["userid = ? AND eventid = ?", session["timeline_id"], params[:event][:delete_eventid]])
    
		#find the event medias
		@eventmedias = Eventmedia.find(:first, :conditions => ["userid = ? AND eventid = ?", session["timeline_id"], params[:event][:delete_eventid]])
		
		#if it doesnt find it 
		if (@event.nil?)
			print "\n\n\n WE COULD NOT FIND AN EVENT TO UPDATE \n\n\n"
		else
		  #delete it
		  @event.destroy
			#delete any media associated with it
			@eventmedias.destroy_all
		
			#redirect
			respond_to do |format|
        format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
        format.js
      end
	  end

	end
	
	
	#add the journal notes to the events table
	def update_event_notes_sketch
	  flash.keep(:url)
		
	  #find the event 
	  @event      = Event.find(:first, :conditions => ["userid = ? AND eventid = ?", session["timeline_id"], params[:event][:eventnotes_eventid]])
	  
		
		#if it doesnt find it 
		if (@event.nil?)
			print "\n\n\n WE COULD NOT FIND AN EVENT TO UPDATE \n\n\n"
		else
		  #update its description
		  @event.notes  = params[:event][:eventnotes]
			
			#upload the sketch
			#svgstring = params[:event][:eventsketch]
		  #if (svgstring != nil)
	    #  sketch_file = session["timeline_id"] + '_sketch.svg'
			#  new = Dir.getwd + "/userdata/images/" + sketch_file
			#  File.open(new, "wb") { |file| file << svgstring}
	    #end
			
			#set sketch to the file
			@event.sketch = params[:event][:eventsketch]
		
		  print "\n\n\n WE ARE TRYING TO SKETCH AT !!! "  + @event.sketch + " \n\n\n "
		
		  if @event.save
			  respond_to do |format|
			    format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
			    format.js 
			  end
	    else
		    print "\n\n\n SOMETHING SCREWED UP COULD NOT UPDATE THE EVENT NOTES\n\n"
	    end
	  end

		
	end
	
	
	#add the video
	def update_video_details
	  @eventvideo = Eventmedia.new;
		
		@eventvideo.userid     = session["timeline_id"]
		@eventvideo.eventid    = params[:event][:eventvideo_eventid]
		@eventvideo.mediafile  = params[:event][:eventvideo]
		@eventvideo.desc       = params[:event][:eventvideodesc]
		@eventvideo.type       = "video"
		
	  @eventvideo.created_at = Time.now
		@eventvideo.updated_at = Time.now
		
		print "\n\n\n AFTER CREATING/UPDATING NEW EVENT VIDEO MEDIA ROW \n\n\n"
	 
	  if @eventvideo.save
		  respond_to do |format|
			  format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
			  format.js 
			end
	  else
		  print "\n\n\n SOMETHING SCREWED UP COULD NOT SAVE EVENT MEDIA\n\n"
	  end

	 
	
	end
	
	
	def create(prev, new)
		print "\n\n\n IN CREATE  \n\n\n"
		File.open(new, "wb") { |file| file << prev.read}
	end
	
	
	#add the photos and audio files
	def upload_media_details
	
	  @eventmedia = Eventmedia.new;
		
		#upload the event media
		prev = params[:event][:eventmediafile]
		if (prev != nil)
	    image_file = session["timeline_id"] + '_' + prev.original_filename
			new = Dir.getwd + "/userdata/images/" + image_file
			File.open(new, "wb") { |file| file << prev.read}
	  end
		
		print "\n\n\n TRYING TO CREATE NEW EVENT MEDIA ROW \n\n\n"
		
		@eventmedia.userid     = session["timeline_id"]
		@eventmedia.eventid    = params[:event][:eventmedia_eventid]
		#attach the path to the mediafile before 
		@eventmedia.mediafile  = new
		@eventmedia.desc       = params[:event][:eventmediadesc]
		@eventmedia.type       = "image"
		
	  @eventmedia.created_at = Time.now
		@eventmedia.updated_at = Time.now
		
		print "\n\n\n AFTER CREATING/UPDATING NEW EVENT MEDIA ROW \n\n\n"
		
	  if @eventmedia.save
		  respond_to do |format|
			  format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
			  format.js 
			end
	  else
		  print "\n\n\n SOMETHING SCREWED UP COULD NOT SAVE EVENT MEDIA\n\n"
	  end
	
	end
	
	
	#get all the media stuff
	def get_eventcontent
	  
		#get the notes and the sketch
		@eventart   = Event.find(:first, :conditions => ["userid = ? AND eventid = ?", session["timeline_id"], params[:event][:get_eventid]])
		
		#get the images and the video
		#@eventmedia = Event.find(:first, :conditions => ["userid = ? AND eventid = ?", session["timeline_id"], params[:event][:get_eventid]])
	
	  #if it doesnt find it 
		if (@eventart.nil?)
			print "\n\n\n WE COULD NOT FIND AN EVENT TO VIEW \n\n\n"
		else
		  print "\n\n\n\n  we have some event content !  " + @eventart.sketch + "\n\n\n\n"
			
			#redirect
			respond_to do |format|
        format.html { redirect_to ("/events/timeline/#{session["timeline_id"]}") }
        format.js
      end
	  end
	  
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
