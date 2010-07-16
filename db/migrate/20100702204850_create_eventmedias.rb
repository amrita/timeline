class CreateEventmedias < ActiveRecord::Migration
  def self.up
    create_table :eventmedias do |t|
      t.integer :eventid
      t.string :mediafile

      t.timestamps
    end
  end

  def self.down
    drop_table :eventmedias
  end
end
