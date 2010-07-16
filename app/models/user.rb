class User < ActiveRecord::Base
  has_many :events

  validates_associated :events

  validates_presence_of :userid, :name, :email
  validates_uniqueness_of :userid
end
