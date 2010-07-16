class CreateEventdatas < ActiveRecord::Migration
  def self.up
    create_table :eventdatas do |t|
      t.integer :dataid
      t.integer :eventid
      t.string :tag
      t.string :tagdesc

      t.timestamps
    end
  end

  def self.down
    drop_table :eventdatas
  end
end
