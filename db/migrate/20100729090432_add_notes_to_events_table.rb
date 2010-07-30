class AddNotesToEventsTable < ActiveRecord::Migration
  def self.up
    add_column :events, :notes, :string
  end

  def self.down
  end
end
