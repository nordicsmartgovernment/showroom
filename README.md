# NSG Showroom

You can visit the NSG Showroom [here](https://nsg-dev.ew.r.appspot.com/).

## Development status

A simple Angular-based web application has been established (see ShowroomClient). It communicates with the NSG reference implementation sandbox to provide "purchasing" functionality, generating bank statements and eReceipts/eInvoices in a simulated online store setting.

The general application structure is in place, and should be ready for expansion with more functionality.

Due to time contraints, little work in automated testing, CI/CD, etc. has been done. A testing framework and setup is is provided and ready to use.

# How to build and deploy

```
ng build --prod
gcloud app deploy
```

