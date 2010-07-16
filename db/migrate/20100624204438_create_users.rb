class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :userid
      t.string :password
      t.string :firstname
      t.string :lastname
      t.date :dob
      t.string :email
      t.string :parentname
      t.string :parentemail

      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
