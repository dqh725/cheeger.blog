---
layout: post
title:  "Enable Two-factor Authentication for Rails"
lang: en
icon: b
category: developer
tag: rails, two-factor-authentication
comments: true
---

# Introduction
If you want to enable two-factor authentication for rails app, you may find some idea from this post.

# Background
- Rails5 + devise
- Gem: [devise-two-factor][devise-two-factor-github];

# Getstart
#### 1. Setup devise-two-factor
- Add `gem 'devise-two-factor'` to Gemfile

- `$ bundle install`

- edit your user model, Note, in rails5 your env key must be at least 32 bytes.

      devise :two_factor_authenticatable, otp_secret_encryption_key: ENV['YOUR_ENCRYPTION_KEY_HERE']

- `$ rails generate devise_two_factor user YOUR_ENCRYPTION_KEY_HERE` This will generate a migration file, feel free to edit the `default && null` option, this will auto configure the devise initializer to define a `:two_factor_authenticatable` strategy.

- `bundle exec rake db:migrate` Now you have database ready.

#### 2. Override devise SessionsController
- If you happen to use `activeadmin` like me, you could make an initializer to override the devise's session_controller

```ruby
# config/initializers/active_admin_devise_sessions_controller.rb
class ActiveAdmin::Devise::SessionsController
  include AuthenticatesWithTwoFactor

  prepend_before_action :authenticate_with_two_factor, if: :two_factor_enabled?, only: [:create]

  def valid_otp_attempt?(user)
    user.validate_and_consume_otp!(user_params[:otp_attempt])
  end

  private

  def find_user
    if session[:otp_user_id]
      User.find(session[:otp_user_id])
    elsif user_params[:email]
      User.find_by(email: user_params[:email])
    end
  end

  def two_factor_enabled?
    find_user&.two_factor_enabled?
  end

  def user_params
    params.require(:user).permit(:email, :password, :remember_me, :otp_attempt)
  end
end
```

- The module of AuthenticatesWithTwoFactor

```ruby

module AuthenticatesWithTwoFactor
  extend ActiveSupport::Concern

  included do
    # This action comes from DeviseController, but because we call `sign_in`
    # manually, not skipping this action would cause a "You are already signed
    # in." error message to be shown upon successful login.
    skip_before_action :require_no_authentication, only: [:create], raise: false
  end

  # The user must have been authenticated with a valid login and password
  # before calling this method!
  def prompt_for_two_factor(user)
    # Set @user for Devise views
    @user = user

    return locked_user_redirect(user) unless user.can? :login # define your own logic

    session[:otp_user_id] = user.id
    render 'admin/sessions/two_factor'
  end

  def locked_user_redirect(_user)
    flash.now[:alert] = 'Invalid Login or password'
    render 'devise/sessions/new'
  end

  def authenticate_with_two_factor
    user = self.resource = find_user
    if user_params[:otp_attempt].present? && session[:otp_user_id]
      authenticate_with_two_factor_via_otp(user)
    elsif user &.valid_password?(user_params[:password])
      prompt_for_two_factor(user)
    end
  end

  private

  def authenticate_with_two_factor_via_otp(user)
    if valid_otp_attempt?(user)
      # Remove any lingering user data from login
      session.delete(:otp_user_id)

      remember_me(user) if user_params[:remember_me] == '1'
      user.save!
      sign_in(user, notice: :two_factor_authenticated)
    else
      Rails.logger.info("Failed Login: user=#{user.email} ip=#{request.remote_ip} method=OTP")
      flash.now[:alert] = 'Invalid two-factor code.'
      prompt_for_two_factor(user)
    end
  end
end

```
- view for submit the extra code
> app/views/sessions/two_factor.html.erb

```erb
<% if @user.two_factor_enabled? %>
  <%= form_for(resource, as: resource_name, url: session_path(resource_name), method: :post) do |f| %>
    <% resource_params = params[resource_name].presence || params %>
    <%= f.hidden_field :remember_me, value: resource_params.fetch(:remember_me, 0) %>
    <div>
      <%= f.label 'Two-Factor Authentication code', name:  :otp_attempt %>
      <%= f.text_field :otp_attempt, class: 'form-control', required: true, autofocus: true, autocomplete: 'off', title: 'This field is required.' %>
      <p class="form-text text-muted hint">Enter the code from the two-factor app on your mobile device. If you've lost your device, you may enter one of your recovery codes.</p>
      <div class="prepend-top-20">
        <%= f.submit "Verify code", class: "button button-action" %>
      </div>
    </div>
  <% end %>
<% end %>


```

- If you are now not using ActiveAdmin, you can just override the session controller

```ruby
# app/controllers/sessions_controller.rb
class SessionsController < Devise::SessionsController
  ...
end
```

# Explanation
The idea is to call a befor_action of `authenticate_with_two_factor` if the user.two_factor_enabled?, if validated, then it call the `:create` method in session controller.

# QRcode
Generate a QRcode in the UI for the user to integrate the 2fa with a 3rd mobile application, and provide the code to actually enable this feature.

The way to generate the QRCode is simple

- Add `gem 'rqrcode'` into the Gemfile
- `$ bundle install`
- In your user model

```ruby
  def mfa_qrcode_source
    issuer = "Your app name"
    label = "#{issuer}:#{email}"
    otp_provisioning_uri(label, issuer: issuer)
  end

  # then to generate a qucode svg for this user would be:
  svg =  RQRCode::QRCode.new(user.mfa_qrcode_source)
           .as_svg(offset: 0,
                   color: '000',
                   shape_rendering: 'crispEdges',
                   module_size: 2)
           .html_safe

```

# Conclusion:
This should get your application setup with a basic 2fa, you can continue to make it perfect, e.g. two-factor-backupable.

Finally, most of the code in thie article is inspired from an open source project, [gitlabhq][gitlabhq-github], you may find more useful information over there.

[devise-two-factor-github]: https://github.com/tinfoil/devise-two-factor
[gitlabhq-github]: https://github.com/gitlabhq/gitlabhq

