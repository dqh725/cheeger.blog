---
layout: post
comments: true
title:  OCserv on Ubuntu 16.04 for Cisco AnyConnect Client
category: develop
tags: VPN cisco
---

# OCserv_with_anyconnect


## OCserv on Ubuntu 16.04 for Cisco AnyConnect Client



<div class="entry-meta"><span class="author vcard">[<span class="fn">Ri Xu</span>](https://xuri.me/author/xuri)</span> <span class="date updated">[March 19, 2016](https://xuri.me/2016/03/19/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client.html "18:50")</span> <span class="category">[Linux](https://xuri.me/category/linux)</span> <span class="comments">[1 Comment](https://xuri.me/2016/03/19/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client.html#disqus_thread)</span></div>

</div>


![Cisco AnyConnect Secure Mobility Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-10.png)

**Introduction**

OCserv is the OpenConnect VPN server. Its purpose is to be a secure, small, fast and configurable VPN server. It implements the OpenConnect SSL VPN protocol, and has also (currently experimental) compatibility with clients using the AnyConnect SSL VPN protocol. The OpenConnect protocol provides a dual TCP/UDP VPN channel, and uses the standard IETF security protocols to secure it. The server is implemented primarily for the GNU/Linux platform but its code is designed to be portable to other UNIX variants as well. From Ubuntu 16.04 onward, OCserv is included in the standard Ubuntu repositories, so you do not need to compile it from source. In this tutorial the iOS 9 client, which could be an iPad or an iPhone, will connect to the VPN server using the Cisco AnyConnect VPN client.

**Install packages on server**

Log on to your server and install the OCserv package:

<pre>$ sudo apt-get install ocserv
</pre>

We will also need the GnuTLS package, since we use the GnuTLS utilities to generate our public key infrastructure (keys and certificates):

<pre>$ sudo apt-get install gnutls-bin
</pre>

We can use self-signed certificates or using a purchased commercial certificate from CA certificate providers, such as [Comodo](https://www.comodo.com/), [StartSSL](https://www.startssl.com/), [WoSign](https://www.wosign.com/english/) and etc.

**Make CA certificate and server certificate**

The GnuTLS certificate tool (`certtool`) allows you to specify the fields for your certificates in a configuration template file.

Start by creating a configuration template file for your Certificate Authority (CA) certificate:

<pre>$ cd /etc/ocserv
$ sudo vim ca.tmpl
</pre>

Press the <kbd>I</kbd> key on your keyboard to enter insert mode.

Enter the following fields into the CA configuration file, customizing the values as you prefer:

<pre>cn = "My CA"
organization = "My Org"
serial = 1
expiration_days = 3650
ca
signing_key
cert_signing_key
crl_signing_key
</pre>

When you have finished entering the above, escape from insert mode, write the file to disk, and quit the editor.

Now generate a key and certificate for your CA, using the CA configuration template file you just created:

<pre>$ sudo certtool --generate-privkey --outfile ca-key.pem
$ sudo certtool --generate-self-signed --load-privkey ca-key.pem \
    --template ca.tmpl --outfile ca-cert.pem
</pre>

Now create a server certificate template file:

<pre>$ sudo vim server.tmpl
</pre>

Press the <kbd>I</kbd> key on your keyboard to enter insert mode.

Enter the following fields into the server configuration file. Note that in the common name (`cn`) field, you must specify your actual server IP address or hostname (shown as `vpn.xuri.me` in the example that follows):

<pre>cn = "vpn.xuri.me"
organization = "My Org"
expiration_days = 3650
signing_key
encryption_key
tls_www_server
</pre>

When you have finished entering the above, escape from insert mode, write the file to disk, and quit the editor.

Generate the server key and certificate, using the configuration template file:

<pre>$ sudo certtool --generate-privkey --outfile server-key.pem
$ sudo certtool --generate-certificate --load-privkey server-key.pem \
    --load-ca-certificate ca-cert.pem --load-ca-privkey ca-key.pem \
    --template server.tmpl --outfile server-cert.pem
</pre>

**Use commercial certificate**

For example I use [WoSign Free SSL Certificates](https://buy.wosign.com/free/). I got `1_vpn.xuri.me_bundle.crt` and `2_vpn.xuri.me.key` two files. Convert `.crt` certificate to `.pem` format:

<pre>$ openssl x509 -in 1_vpn.xuri.me_bundle.crt -out server-cert.pem -outform PEM
</pre>

Convert `.key` file to `.pem` format:

<pre>$ cat 2_vpn.xuri.me.key > server-key.pem
</pre>

Put `server-cert.pem` and `server-key.pem` on path `/etc/ocserv/`, and set file permission `600`.

If you are use CA certificates issued by StartSSL, you have got certificate `cert.crt` file, I some case you should create certificate chain and merge sub certificate and root certificate like this:

<pre>$ wget http://cert.startssl.com/certs/ca.pem
$ wget http://cert.startssl.com/certs/sub.class1.server.ca.pem
$ cat cert.crt sub.class1.server.ca.pem ca.pem > server-cert.pem
</pre>

**Configure the OpenConnect VPN server**

Edit the OCserv sample configuration file that is provided in `/etc/ocserv`:

<pre>$ sudo vim ocserv.conf
</pre>

Use the editor to comment out (`#`) the default values and replace them with those shown in the example that follows:

<pre>#auth = "pam[gid-min=1000]"
auth = "plain[/etc/ocserv/ocpasswd]"

#server-cert = /etc/ssl/certs/ssl-cert-snakeoil.pem
#server-key = /etc/ssl/private/ssl-cert-snakeoil.key
server-cert = /etc/ocserv/server-cert.pem
server-key = /etc/ocserv/server-key.pem

#try-mtu-discovery = false
try-mtu-discovery = true

#dns = 192.168.1.2
dns = 8.8.8.8

# Comment out all route fields
#route = 10.10.10.0/255.255.255.0
#route = 192.168.0.0/255.255.0.0
#route = fef4:db8:1000:1001::/64

#no-route = 192.168.5.0/255.255.255.0

cisco-client-compat = true
</pre>

When you have finished entering the above, escape from insert mode, write the file to disk, and quit the editor.

**Create user id and password**

Generate a user id and password that you will use to authenticate from AnyConnect to OCserv. For example, if you want your user id to be `xuri`:

<pre>$ sudo ocpasswd -c /etc/ocserv/ocpasswd xuri
</pre>

You will be prompted to enter a password twice. The password will not be displayed on your terminal:

<pre>Enter password:
Re-enter password:
</pre>

**Enable packet forwarding**

Allow forwarding in the Linux kernel by editing the system control configuration file:

<pre>$ sudo vim /etc/sysctl.conf
</pre>

Delete the `#` sign at the start to uncomment the line:

<pre>net.ipv4.ip_forward=1
</pre>

Write the file to disk and quit the editor, and make this change active now:

<pre>$ sudo sysctl -p
</pre>

**Open firewall**

Open the server firewall for SSL:

<pre>$ sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
$ sudo iptables -A INPUT -p udp --dport 443 -j ACCEPT
</pre>

Enable network address translation (NAT):

<pre>$ sudo iptables -t nat -A POSTROUTING -j MASQUERADE
</pre>

Assuming you have already installed `iptables-persistent`, reconfigure it to make your changes persist across server reboots:

<pre>$ sudo dpkg-reconfigure iptables-persistent
</pre>

**Start OpenConnect VPN server**

Check that nothing is already listening on port 443:

<pre>$ sudo lsof -i
</pre>

The command `sudo lsof -i` then showed systemd listening to port 443 on IPv6\. I do not know why systemd was doing this. The command `systemctl -all list-sockets` showed the related unit as ocserv.socket. The solution was to issue the command `sudo systemctl stop ocserv.socket`.

Start OCserv:

<pre>$ sudo ocserv -c /etc/ocserv/ocserv.conf
</pre>

Check that it is now listening on port 443 with the command:

<pre>$ sudo netstat -tulpn | grep 443
</pre>

**Make CA certificate available for download**

Your client such as Mac, iPad or iPhone needs to be able to validate the server certificate. To allow it to do this, you must install your CA certificate on the iPad or iPhone as a trusted root certificate. The first step in this is to make the CA certificate available for download from your server.

Open the firewall so that you can reach the server from a browser:

<pre>$ sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
</pre>

Install Apache:

<pre>$ sudo apt-get install apache2
</pre>

Copy the CA certificate into the web root folder:

<pre>$ sudo cp /etc/ocserv/ca-cert.pem /var/www/html
</pre>

Download and install CA certificate

**Connect OCserv on Mac**

Download and install [Cisco AnyConnect Secure Mobility Client](https://www.cisco.com/c/en/us/support/security/anyconnect-secure-mobility-client/tsd-products-support-series-home.html) for OS X with last version. Add your server IP address (e.g. `vpn.xuri.me`):

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-1.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-1.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

Enter your username:

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-2.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-2.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

Enter your password:

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-3.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-3.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

Connect to VPN

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-4.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-4.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

**Connect OCserv on mobile client**

Now go to your iOS device (iPad or iPhone).

Open the Safari browser.

Browse to the location of the CA certificate at your server’s IP address. For example, if your server is located at `vpn.xuri.me`, then in Safari you would browse to:

<pre>http://vpn.xuri.me/ca-cert.pem
</pre>

Follow the prompts to install the CA certificate as a "Profile" on your iOS 9 device.

Once the "Profile" (i.e., certificate) is installed, tap on Done:

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-5.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-5.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

Install AnyConnect on iOS 9 client

On your iPad or iPhone, open the the App Store, and search for [Cisco AnyConnect](https://itunes.apple.com/en/app/cisco-anyconnect/id392790924?mt=8).

Configure AnyConnect on iOS 9 client

Open the AnyConnect app.

Tap on Connections.

Tap on Add VPN Connection.

*   Description is whatever you want
*   Server Address is your server IP address (e.g. `vpn.xuri.me`)

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-6.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-6.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

Tap Save.

Connect to VPN

Now connect from your iPad or iPhone to your VPN.

You will be prompted to enter your username (the one you set up with `ocpasswd` a few minutes ago, for example, `xuri`):

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-7.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-7.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

You will be prompted to enter your password (the one you set up for that username when you invoked `ocpasswd`):

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-8.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-8.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

The AnyConnect VPN toggle goes green when you are connected:

[![OCserv on Ubuntu 16.04 for Cisco AnyConnect Client](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-9.png)](https://xuri.me/wp-content/uploads/2016/03/ocserv-on-ubuntu-16-04-for-cisco-anyconnect-client-9.png "OCserv on Ubuntu 16.04 for Cisco AnyConnect Client")

(Also, if you log on to your server and use a command such as `sudo tail /var/log/syslog`, you will see messages such as `sec-mod: initiating session for user 'xuri'`.)

<div class="ratings hreview-aggregate" data-post="2615"><span class="item"><span class="fn">OCserv on Ubuntu 16.04 for Cisco AnyConnect Client</span></span>

*   <span class="average">4.50 / 5</span> <span class="best">5</span>
*   <a title="Give 1 out of 5 stars">1 / 5</a>
*   <a title="Give 2 out of 5 stars">2 / 5</a>
*   <a title="Give 3 out of 5 stars">3 / 5</a>
*   <a title="Give 4 out of 5 stars">4 / 5</a>
*   <a title="Give 5 out of 5 stars">5 / 5</a>

<div class="meta">**4** votes, **4.50** avg. rating (**90**% score)</div>

</div>

[Cisco](https://xuri.me/tag/cisco), [Linux](https://xuri.me/tag/linux-os), [VPN](https://xuri.me/tag/vpn)

</div>

*   [<span class="meta-nav">←</span> Use SSL SNI in Production](https://xuri.me/2016/02/28/use-ssl-sni-in-production.html)
*   [Setup Hadoop on Ubuntu (Multi-Node Cluster) <span class="meta-nav">→</span>](https://xuri.me/2016/03/22/setup-hadoop-on-ubuntu-multi-node-cluster.html)

<div id="disqus_thread"><iframe id="dsq-app1" name="dsq-app1" allowtransparency="true" frameborder="0" scrolling="no" tabindex="0" title="Disqus" width="100%" src="https://disqus.com/embed/comments/?base=default&amp;f=xurionline&amp;t_i=2615%20https%3A%2F%2Fxuri.me%2F%3Fp%3D2615&amp;t_u=https%3A%2F%2Fxuri.me%2F2016%2F03%2F19%2Focserv-on-ubuntu-16-04-for-cisco-anyconnect-client.html&amp;t_e=OCserv%20on%20Ubuntu%2016.04%20for%20Cisco%20AnyConnect%20Client&amp;t_d=OCserv%20on%20Ubuntu%2016.04%20for%20Cisco%20AnyConnect%20Client%20%7C%20Ri%20Xu%20Online&amp;t_t=OCserv%20on%20Ubuntu%2016.04%20for%20Cisco%20AnyConnect%20Client&amp;s_o=default&amp;l=#version=8e4b6e0b39b37378f55ff3d3af623214" style="width: 1px !important; min-width: 100% !important; border: none !important; overflow: hidden !important; height: 427px !important;" horizontalscrolling="no" verticalscrolling="no"></iframe></div>

