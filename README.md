![Build an angular project](https://github.com/joserafael97/catalogues-ui/workflows/Build%20an%20angular%20project/badge.svg)
# Catalogues-ui
Application for managing vendors and products.

## Deployed links app

* [Front-end deployed](https://catalogues-ui.herokuapp.com)
* [API docs](https://catalogues-api.herokuapp.com)
* [Main end-point](https://catalogues-api.herokuapp.com/api/vendors)

## Getting Started
This project is developed in Typescript with Angular 8 framework. 


### Prerequisites
For the execution of the project it is necessary to install the following libraries


* [Node](https://nodejs.org/en/download/) (used v.14.x)
* [NPM](https://www.npmjs.com/get-npm)
* [Angular-cli](https://cli.angular.io/)

### Estructure

The project directory structure is described below

```
.
├── .github/workflows                 # Stores file that triggers Github Action;
├── e2e                               # Tests files;
├── src                               # Stores all components and logic developed. 
...
```

### Installing
To install the libraries, execute the command below inside the main repository directory.

```
npm install
```

### Run App
```
ng serve

```

### Automatic Deploy
This project uses Github Action to deploy the application to each new commit main branch. To do this, it uses the following file:

* [.github/workflows/main.yml](https://github.com/joserafael97/catalogues-ui/blob/master/.github/workflows/main.yml)

## Authors

* **José Remígio** - *Initial work* - [José Remígio](https://github.com/joserafael97)
