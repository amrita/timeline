# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100729191114) do

  create_table "data_files", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "eventdatas", :force => true do |t|
    t.integer  "dataid"
    t.integer  "eventid"
    t.string   "tag"
    t.string   "tagdesc"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "eventmedias", :force => true do |t|
    t.integer  "eventid"
    t.string   "userid"
    t.string   "mediafile"
    t.string   "desc"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", :force => true do |t|
    t.integer  "eventid"
    t.string   "userid"
    t.string   "desc"
    t.string   "div"
    t.integer  "top"
    t.integer  "left"
    t.integer  "year"
    t.integer  "month"
    t.integer  "day"
    t.integer  "hour"
    t.integer  "interval"
    t.string   "icon"
    t.datetime "startdate"
    t.datetime "enddate"
    t.integer  "span"
    t.integer  "location"
    t.integer  "segmentlen"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "notes"
    t.string   "sketch"
  end

  create_table "users", :force => true do |t|
    t.string   "userid"
    t.string   "password"
    t.string   "name"
    t.date     "dob"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "date_added"
    t.datetime "date_modified"
  end

end
