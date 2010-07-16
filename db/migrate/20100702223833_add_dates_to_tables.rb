class AddDatesToTables < ActiveRecord::Migration
  def self.up
    add_column :users, :date_added, :datetime
    add_column :users, :date_modified, :datetime
    add_column :events, :date_added, :datetime
    add_column :events, :date_modified, :datetime
  end

  def self.down
  end
end
