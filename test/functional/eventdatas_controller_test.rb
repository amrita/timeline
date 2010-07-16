require 'test_helper'

class EventdatasControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:eventdatas)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create eventdata" do
    assert_difference('Eventdata.count') do
      post :create, :eventdata => { }
    end

    assert_redirected_to eventdata_path(assigns(:eventdata))
  end

  test "should show eventdata" do
    get :show, :id => eventdatas(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => eventdatas(:one).to_param
    assert_response :success
  end

  test "should update eventdata" do
    put :update, :id => eventdatas(:one).to_param, :eventdata => { }
    assert_redirected_to eventdata_path(assigns(:eventdata))
  end

  test "should destroy eventdata" do
    assert_difference('Eventdata.count', -1) do
      delete :destroy, :id => eventdatas(:one).to_param
    end

    assert_redirected_to eventdatas_path
  end
end
