class AddSketchToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :sketch, :string
  end

  def self.down
  end
end
