class Event < ActiveRecord::Base
  has_many :eventdatas
  has_many :eventmedias

  belongs_to :user

  validates_associated :eventdatas, :eventmedias
end
