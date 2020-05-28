# ShowroomClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.4.
You should install Angular CLI according to instructions on their website.

## Angular CLI development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Deployment

The application is prepared for deployment as an App Engine website hosted on GCP.
All the required configuration is set in the files [app.yaml](app.yaml) and [.gcloudignore](.gcloudignore).

To deploy the application, you will need the [GCloud SDK](https://cloud.google.com/sdk/install) and sufficient access to the GCP project you want to deploy the application to.

### Initial setup

Your GCloud SDK installation must be authenticated and configured against the GCP project.

Initial login: 
````
gcloud auth login
````

Point towards the project:
```
gcloud config set project <project-name>
```

### Deployment

First, build the application (see the build section above for details), which packs and minifies the application for deployment:
```
ng build --prod
```

Then deploy the build app with GCloud SDK:
```
gcloud app deploy
```
and follow the prompts. Deployment may  take up to 30 seconds.
