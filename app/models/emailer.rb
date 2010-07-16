class Emailer < ActionMailer::Base

  def forgot_password(recipient, recipient_name, encoded_url, sent_at = Time.now)
     @subject = 'Access your Isles of Time'  #subject of the email 
     @recipients = recipient  #email address of the recepient
     @from = 'no-reply@islesoftime.com'
		 @bcc  = 'admin@islesoftime.com'
     @sent_on = sent_at
			   @body["email"]          = 'info@islesoftime.com'
         @body["recipient_name"] = recipient_name
         @body["encoded_url"]    = encoded_url 
     @headers = {}
  end  

  # create a function with all the variables I want to use in my actual email 
  def feedback(user_name, user_email, userid, feedback, sent_at = Time.now)
     @subject = 'Feedback from IOT Website'
     @recipients = 'feedback@islesoftime.com'
     @from = user_email
     @sent_on = sent_at
         @body["user_name"] = user_name
         @body["email"]     = user_email
         @body["userid"]    = userid
				 @body["feedback"]  = feedback
     @headers = {}
  end 
	
end
