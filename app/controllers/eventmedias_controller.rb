class EventmediasController < ApplicationController
  # GET /eventmedias
  # GET /eventmedias.xml
  def index
    @eventmedias = Eventmedia.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @eventmedias }
    end
  end

  # GET /eventmedias/1
  # GET /eventmedias/1.xml
  def show
    @eventmedia = Eventmedia.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @eventmedia }
    end
  end

  # GET /eventmedias/new
  # GET /eventmedias/new.xml
  def new
    @eventmedia = Eventmedia.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @eventmedia }
    end
  end

  # GET /eventmedias/1/edit
  def edit
    @eventmedia = Eventmedia.find(params[:id])
  end

  # POST /eventmedias
  # POST /eventmedias.xml
  def create
    @eventmedia = Eventmedia.new(params[:eventmedia])

    respond_to do |format|
      if @eventmedia.save
        format.html { redirect_to(@eventmedia, :notice => 'Eventmedia was successfully created.') }
        format.xml  { render :xml => @eventmedia, :status => :created, :location => @eventmedia }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @eventmedia.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /eventmedias/1
  # PUT /eventmedias/1.xml
  def update
    @eventmedia = Eventmedia.find(params[:id])

    respond_to do |format|
      if @eventmedia.update_attributes(params[:eventmedia])
        format.html { redirect_to(@eventmedia, :notice => 'Eventmedia was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @eventmedia.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /eventmedias/1
  # DELETE /eventmedias/1.xml
  def destroy
    @eventmedia = Eventmedia.find(params[:id])
    @eventmedia.destroy

    respond_to do |format|
      format.html { redirect_to(eventmedias_url) }
      format.xml  { head :ok }
    end
  end
end
