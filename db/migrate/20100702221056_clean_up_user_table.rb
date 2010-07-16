class CleanUpUserTable < ActiveRecord::Migration
  def self.up
    remove_column :users, :lastname, :parentname, :parentemail
    rename_column :users, :firstname, :name
  end

  def self.down
  end
end
