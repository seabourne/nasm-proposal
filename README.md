# Proposal to Build a National Air and Space Museum Platform

Hello GEER and NASM! This is the technical README for the NASM Game Prototype and Proposal.  These are instructions for running the app locally in case you are interested.

## Dependencies

You'll need the following libraries installed locally.  We recommend using [Homebrew](http://brew.sh/).

Git: `> brew install git`

NodeJS/NPM: `> brew install node`

## Installation

First you'll need to clone this repository to your computer (assuming you already know Git, etc).

```
> git clone https://github.com/seabourne/nasm-proposal.git
```

Next, you'll need to install the dependencies.

```
> cd nasm-proposal
> npm install
```

Finally, you can start the app with:

```
> npm start
```

and open [http://localhost:3000/](http://localhost:3000/) in your browser.  That's it!

## Anatomy of the Application

The NASM Game app is based on the [Nxus](https://github.com/nxus/core) application.

The core functionality is split between server and client side code.

### Server

The server logic can be found under the [modules folder](https://github.com/seabourne/nasm-proposal/tree/master/modules).

### Client

The client logic is largely in [/modules/theme/assets/js/custom.js](https://github.com/seabourne/nasm-proposal/blob/master/modules/theme/assets/js/custom.js)

### Events

We are using [Keen.io](http://www.keen.io) to capture the user events and generate the aggregations and anlaysis.
