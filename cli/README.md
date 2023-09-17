boosted-html comes with an (optional) CLI called blaze.

## Installation

Blaze doesn't come with an installer. You can download the single executable [here](https://github.com/andrealicheri/boosted-html/raw/main/cli/blaze.exe) and run it with:

    ./blaze <command here>

## Creating a project

You can create an empty project (index and local library) with the `init` command:

    ./blaze init

Alternatively, you can create a PWA project with the `pwa` subcommand:

    ./blaze init pwa

## Population

The main problem with standard browser library is that you have to paste the same bundle over and over on every page of your website. You can do this automatically with the `populate` command.

    ./blaze populate

## Serve your app

You can spawn an http server with the `serve` command. If a port is not specified, the default is 8000:

    ./blaze serve 5001