class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.integer :eventid
      t.string  :userid
      t.string  :desc
      t.string  :div
      t.integer :top
      t.integer :left
      t.integer :year
      t.integer :month
      t.integer :day
      t.integer :hour
      t.integer :interval
      t.string  :icon
      t.datetime :startdate
      t.datetime :enddate
      t.integer  :span
      t.integer  :location
      t.integer  :segmentlen
			
      t.timestamps
    end
  end

  def self.down
    drop_table :events
  end
end
