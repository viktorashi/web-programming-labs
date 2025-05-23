# web-programming-labs

doar sa nu le pierd panamea idk imi face githubu verde

Pt lab 7 ca ala e cel mai al naiibii

tine minte ca ai fct de pe mac sonoma cu `httpd` instalta prin `brew` si configu iti e

`/opt/homebrew/etc/httpd/httpd.confg`

```
LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so

#pt php PHP
LoadModule php_module  /opt/homebrew/opt/php/lib/httpd/modules/libphp.so

#
# DirectoryIndex: sets the file that Apache will serve if a directory
# is requested.
#
#am dat comment ca e  fct configu asta in /opt/homebrew/etc/httpd/extra/httpd-php.conf
#<IfModule dir_module>
        #DirectoryIndex index.html
#</IfModule>
# PHP php settings tot asa (nici nu exista fisieru asta lmao like)
Include /opt/homebrew/etc/httpd/extra/httpd-php.conf

# Virtual hosts (si pe asta il mai folosesc)
Include /opt/homebrew/etc/httpd/extra/httpd-vhosts.conf


#
# ServerName gives the name and port that the server uses to identify itself.
# This can often be determined automatically, but we recommend you specify
# it explicitly to prevent problems during startup.
#
# If your host doesn't have a registered DNS name, enter its IP address here.
#
ServerName viktora.sh:8080
Listen 80
```

`/opt/homebrew/etc/httpd/extra/httpd-vhosts.conf`

```
<VirtualHost *:80>
    ServerName viktora.sh
    DocumentRoot /Users/viktorashi/faculta/web-brogramming/labs/l7-php/testez-eu
    <Directory /Users/viktorashi/faculta/web-brogramming/labs/l7-php/testez-eu>
        Require all granted
        AllowOverride All
    </Directory>
</VirtualHost>
```

`/opt/homebrew/etc/httpd/extra/httpd-php.conf`

```
<IfModule php_module>
  <FilesMatch \.php$>
    SetHandler application/x-httpd-php
  </FilesMatch>

  <IfModule dir_module>
    DirectoryIndex index.php index.html
  </IfModule>
</IfModule>
```

<br>
<br>
logurile, si de acccess si de error sunt amandoua si in

`/opt/homebrew/var/log/httpd`

dar creca si in

`~/Library/Logs/Homebrew/httpd.log`

<br>
<br>

Ca sa il pornesc ca background service pot ori

`brew services start httpd`

sauu

`apachectl start`

<br>
<br>

daca vreau sa vad daca e bun scris configu dau un `httpd -t`, si daca vreau sa vad configu default (ne-overwritten de vhosts) dau `httpd -S`

<br>
<br>

daca vreau sa dau eu un restart si chiar nu meerge `brew services restart httpd` incerc sa inchid totu manual
priam data vad daca chiar exista pornit cu

`ps aux | grep httpd`

si daca da KILL IT

`sudo killall httpd`

Problema poa sa fie si cu LaunchAngenta lu maxos ca nu vrea sa-l pornesca / opresca pe service,
asa ca pot doar sa-l sterg si sa-i dau cleanup

```bash
rm ~/Library/LaunchAgents/homebrew.mxcl.httpd.plist
brew services cleanup
brew services restart httpd
```

sauu "for richer errors" whatever that means

```bash
sudo brew services restart httpd
```

(da vezi ca dupa n-o sa-ti mai mearga la user login aparenet ca gen asta e rooot , nu mai e user logged in so ye)

<br>
<br>
<br>
<br>

Dbu in sine e pe mysql pornit cu

```bash
brew services start mysql
```

care poti sa vezi daca merge cu

```bash
mysqladmin -u root -p version
```

mere si

```bash
mysql -u root
```

dbu facut cu

```sql
CREATE DATABASE guestbook;
USE guestbook;

CREATE TABLE entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

si in rest e totu in cod la `/l7-php` lmaoo like

<br>

facut parola cu

```bash
htpasswd -c /opt/homebrew/etc/httpd/.htpasswd myuser
```

da ciuciu ca asta imi face numa sa ceara parola cand intru eu pe aplciatie gen lol nu la login doar la admin

vesi ca nu mai e parola acm daca incerci iara cand o sa vrei sa-l deschizi pt nostalgie peste 10 ani
