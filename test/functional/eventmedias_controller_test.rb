require 'test_helper'

class EventmediasControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:eventmedias)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create eventmedia" do
    assert_difference('Eventmedia.count') do
      post :create, :eventmedia => { }
    end

    assert_redirected_to eventmedia_path(assigns(:eventmedia))
  end

  test "should show eventmedia" do
    get :show, :id => eventmedias(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => eventmedias(:one).to_param
    assert_response :success
  end

  test "should update eventmedia" do
    put :update, :id => eventmedias(:one).to_param, :eventmedia => { }
    assert_redirected_to eventmedia_path(assigns(:eventmedia))
  end

  test "should destroy eventmedia" do
    assert_difference('Eventmedia.count', -1) do
      delete :destroy, :id => eventmedias(:one).to_param
    end

    assert_redirected_to eventmedias_path
  end
end
