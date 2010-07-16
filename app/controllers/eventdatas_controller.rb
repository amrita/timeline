class EventdatasController < ApplicationController
  # GET /eventdatas
  # GET /eventdatas.xml
  def index
    @eventdatas = Eventdata.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @eventdatas }
    end
  end

  # GET /eventdatas/1
  # GET /eventdatas/1.xml
  def show
    @eventdata = Eventdata.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @eventdata }
    end
  end

  # GET /eventdatas/new
  # GET /eventdatas/new.xml
  def new
    @eventdata = Eventdata.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @eventdata }
    end
  end

  # GET /eventdatas/1/edit
  def edit
    @eventdata = Eventdata.find(params[:id])
  end

  # POST /eventdatas
  # POST /eventdatas.xml
  def create
    @eventdata = Eventdata.new(params[:eventdata])

    respond_to do |format|
      if @eventdata.save
        format.html { redirect_to(@eventdata, :notice => 'Eventdata was successfully created.') }
        format.xml  { render :xml => @eventdata, :status => :created, :location => @eventdata }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @eventdata.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /eventdatas/1
  # PUT /eventdatas/1.xml
  def update
    @eventdata = Eventdata.find(params[:id])

    respond_to do |format|
      if @eventdata.update_attributes(params[:eventdata])
        format.html { redirect_to(@eventdata, :notice => 'Eventdata was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @eventdata.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /eventdatas/1
  # DELETE /eventdatas/1.xml
  def destroy
    @eventdata = Eventdata.find(params[:id])
    @eventdata.destroy

    respond_to do |format|
      format.html { redirect_to(eventdatas_url) }
      format.xml  { head :ok }
    end
  end
end
