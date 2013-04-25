#Boilerplate project

Welcome to the development branch of the app project project.

The **dev** branch contains the source code of the application. The **master**
branch contains the compiled code of the application for production purpose.

All developments **must be made in the dev branch** (or merged to the dev branch
if they were done in a dedicated branch). In any case, **do not touch master**
directly as that branch is automatically generated from the source code.

## How to setup a running dev environment

Follow the steps below in order to setup a running dev environment from scratch.

### Clone the repo, select the `dev` branch, install npm dependencies
Run the following commands:
```
git clone git@github.com:joshfire/boilerplate-template-project.git
cd boilerplate-template-project
git checkout dev
npm install
```

### Install the framework
The project depends on the Joshfire Framework, referenced as a submodule. Run
the following command from the root folder to retrieve the code of the Joshfire
Framework:
```
git submodule init
git submodule update
```

The project also uses the framework's optimizer to build the code. That
optimizer now depends on different npm modules listed as dependencies in the
`package.json` file of the framework. These modules are not automatically
installed by `git` when the submodule is updated (simply because `git` does not
know anything about `npm`). On top of the `git` command mentioned above, you
must run the following commands to be able to build the application:
```
cd app/js/lib/framework
npm install
cd ../../../..
```

### Install SASS
The project uses [SASS](http://sass-lang.com) for CSS styles. To install SASS
to your system:
```
sudo gem install sass
```

SASS may be run in the background in *watch* mode to compile the CSS files as
soon as the SCSS files are modified. This essentially boils down to running:
```
sass --watch app/sass/:app/css
```
... but note this has been wrapped in a `watch` task in Grunt (see below for
proper Grunt installation):
```
grunt watch
```

### Install Grunt
The project uses [Grunt](http://gruntjs.com/) to build the app. It uses very
specific version of the Grunt tool and plugins, listed as dependencies in the
`package.json` file of this project.

Do not use a globally installed version of Grunt to build the app! It is likely
to fail. Instead, run:
```
node_modules/grunt-cli/bin/grunt
```

The Grunt file runs the following tasks by default:

- `jshint`: checks code guidelines in JavaScript files
- `sass`: compiles SASS files into CSS files
- `joshoptimize`: compiles the code of the app

When this readme is written, the app only contains a tablet version, so that's
what Grunt generates. The result of the build should appear in the `build`
folder.

Note: there will be a task that automatically moves the result of the build to
the `master` branch. Not done yet when this note is written (2013-02-02)

## How to run the app
The project uses require.js `text` plugin which does not work when the app is
accessed over the filesystem for CORS reasons. You need to run an HTTP server
having the project folder as root.

For instance:
```
python -m SimpleHTTPServer 40107
```

The home page of the application is available at:
```
http://localhost:40107/app/index.html
```

## How to run the tests
Unit tests are written using Jasmine. They are in the `tests` folder. To run the
tests:
```
node tests/runner.js
```

## How to create a custom dev environment without breaking that of others
While developing the app, you may want to use a specific Factory boostrap file
to work on a given view or change the Woodman configuration to silences traces
from certain parts of the app.

Directly updating files that are shared among developers is **not** a good idea.
It's almost guaranteed that these updates will accidentally show up in the repo
sooner or later, breaking others environments.

Do this instead:
- create a custom HTML entry point that contains `.local` in its name (these
files have been `git ignore`d), e.g. `app/index.local.html`
- reference the right bootstrap file and Woodman configuration in this custom
HTML entry point.