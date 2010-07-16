class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.integer :eventid
      t.string :desc
      t.string :userid
      t.datetime :startdate
      t.datetime :enddate
      t.integer :span
      t.integer :location
      t.integer :year
      t.integer :month
      t.integer :day
      t.integer :segmentlen
      t.string :icon

      t.timestamps
    end
  end

  def self.down
    drop_table :events
  end
end
