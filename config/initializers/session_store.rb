# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_timeline_session',
  :secret      => 'd90cc9af7f3a904dd6d9cc564f94b5031bbc207b65de6e6f85438daf0036054e833ec8dfe5692529a47991587469395ad882246a6c714801f10d337acc1023b9'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
