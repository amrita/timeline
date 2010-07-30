class RebuildEventMediasTable < ActiveRecord::Migration
  def self.up
     drop_table :eventmedias

          create_table :eventmedias do |t|
      t.integer :eventid
      t.string  :userid
      t.string  :mediafile
      t.string  :desc
      t.string  :type
      t.timestamps
  end

  end

  def self.down
  end
end
