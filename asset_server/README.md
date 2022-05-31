How this works:

A post request is sent to the assets path with a key that is the assets hash stored by git.

The only way the key could be known is by accessing the metadata stored in Arangodb.

When the asset becomes inaccessible to someone who has previously accessed it, all the hashes are changed in git and on the database.


