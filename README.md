# MFW Ionic Deep Links v1.0.1

This AngularJS module provides a way to associate app screens to URLs as part of **Mobile FrameWork (MFW)** for **Ionic** applications.

This module relies on [`ionic-plugin-deeplinks`](https://github.com/driftyco/ionic-plugin-deeplinks) plugin.


## ngCordova and Ionic Native

JavaScript code of [IonicDeeplink](https://github.com/driftyco/ionic-plugin-deeplinks) is used as plain JS module instead of the [`$cordovaDeeplinks`](https://github.com/driftyco/ionic-plugin-deeplinks#ionicangular-1) AngularJS service.

That's because it's not part of commonly used [ngCordova](http://ngcordova.com/docs/plugins/) project.
It's defined in a drop-in replacement project named [ionic-native](http://ionicframework.com/docs/v2/native/).

Setting `ionic.native` AngularJS module as a requirement may collide with projects using ngCordova because all service names are the same.


## Description

Deep linking is a way of relating external URLs to parts of your application.

This [Ionic blog entry](http://blog.ionic.io/deeplinking-in-ionic-apps/) describes deep links integration using Ionic.


## Features

This module lets you link your Ionic app in several ways:

* [URL-schemes](https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/Inter-AppCommunication/Inter-AppCommunication.html): iOS
* [Universal links](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html): iOS
* [App links](https://developer.android.com/training/app-links/index.html): Android

> **Important**: Universal/App links require your server side to enable deep links for your app. Read platform-specific links above.


### UI Router integration

You can define your `ui.router` states as usual and define an associated deep link in several easy ways:

* Define a `deepLink` property inside `data` object:
	* Use current state URL (computed state hierarchy URL) as deep link URL
	* Define a new explicit URL
* Use `$mfwiLinksProvider.addRoute(*, string)` method.


## Installation

### Plugins

This module requires the following Cordova plugins:

* [ionic-plugin-deeplinks](https://github.com/driftyco/ionic-plugin-deeplinks)


### Via Bower

Get module from Bower registry.

```shell
$ bower install --save mfw-deep-links-ionic
```


### Other

Download source files and include them into your project sources.



### Dependency

Once dependency has been downloaded, configure your application module(s) to require:

* `mfw-ionic.inapp-browser` module: provider and service to register for push notifications.

```js
angular
    .module('your-module', [
        // Your other dependencies
        'mfw-ionic.deep-links'
    ]);
```

Now you can inject `$mwfiLinksProvider` provider.


> For further documentation, please read the generated `ngDocs` documentation inside `docs/` folder.




## Usage

### Configure

**Declarative configuration**

Configure in your state definitions.

```js
angular
    .module('your-module')
    .config(configRoutes);

configRoutes.$inject = ['$stateProvider'];
function configRoutes(&stateProvider) {
    $stateProvider
        .state({
            name: 'settings',
            url: '/settings',
            data: {
                // deep link URL: /settings
                deepLink: true
            }
        })
        .state({
            name: 'settings.language',
            url: '/language',
            data: {
                // deep link URL: /customer/language
                deepLink: '/customer/language'
            }
        })
        .state({
            name: 'settings.section2',
            url: '/section2',
            data: {
                // deep link URL: /settings/section2
                deepLink: ['$log', '$match', function ($log, $match) {
                    $log.log('Match found', $match);
                }]
            }
        })
        .state({
            name: 'section3',
            url: '/section3',
            data: {
                // deep link URL: /section3
                deepLink: function ($log, $match) {
                    $log.log('Match found', $match);
                }
            }
        })
        .state({
            name: 'section4',
            url: '/section4',
            data: {
                // deep link URL: /section4
                deepLink: {
                    // Special key: It will access state 'settings' and then it will load this state
                    uiRouterParent: 'settings',
                    param1: 'value1',
                    param2: 'value2'
                }
            }
        })
        .state({
            name: 'section5',
            url: '/section5',
            data: {
                // deep link URL: /settings/section5
                deepLink: {
                    param1: 'value1',
                    param2: 'value2',
                    callback: function ($match) {
                    }
                }
            }
        });
}
```


**Imperative configuration**

Use `$mfwiLinksProvider.config(options)` and `$mfwiLinksProvider.addRoute(routeDef, callback)` methods.

```js
angular
    .module('your-module')
    .config(configDeepLinks);

configDeepLinks.$inject = ['$mfwiLinksProvider'];
function configDeepLinks($mfwiLinksProvider) {
    $mfwiLinksProvider
        .config({
            // All registered routes (imperative and declarative) will be prepended with this prefix
            routesPrefix: '/app',
            // Milliseconds of delay between loading parent state and the matched one
            nestedStatesDelay: 700,
            // Callback executed for each match
            matchCallback: ['$log', '$match', function ($log, $match) {
                $log.log('Match found', $match);
            }],
            // Callback executed for each non match
            nomatchCallback: ['$log', '$match', function ($log, $match) {
                $log.log('No match found', $match);
            }]
        })
        .addRoute('/more', 'app.more-features')
        .addRoute('/hi/:name', ['$log', '$match', function ($log, $match) {
            $log.log('>>> DL: Hi ' + $match.$args.name);
        }])
        .addRoute('/help', ['$timeout', '$log', '$state', '$match', 'helpService', function ($timeout, $log, $state, $match, helpService) {
            $log.log('>>>Received match', $match);
            if (!$state.current) {
                $state.go('app.home');
            }
            $timeout(function () {
                $state.go('app.help');
            }, 100);
        }]);
}

```

> For further documentation, please read the generated `ngDocs` documentation inside `docs/` folder.



### Server

In order to enable your application to handle Universal/App links, you must include your application in the list of allowed apps.

You'll find further information in Apple's documentation for [Universal links](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html) and Google's documentation for [App links](https://developer.android.com/training/app-links/index.html).


#### Apple Universal links

Assuming your application bundleID with team prefix is `C2UZU6ZLJE.com.company.app`, update the `apple-app-site-association` with your app link:

```js
{
  "appID": "C2UZU6ZLJE.com.company.app",
  "paths": [/* URL path */]
}
```

Here's an example of `apple-app-site-association` file:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "C2UZU6ZLJE.com.company.app",
        "paths": ["/your-path/*"]
      }
    ]
  }
}
```

> **Remember** this file must be accessible from public URL: https://your-domain/.well-known/apple-app-site-association

> **Important**: this link may help you if Universal links do not work: [Debugging universal links](http://building.usebutton.com/debugging/ios/deep-linking/links/universal-links/2016/03/31/debugging-universal-links/).


#### Google App links

Assuming your application package name is `com.company.app`, update the `assetlinks.json` with your app link:

```js
{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.company.app",
    "sha256_cert_fingerprints": [/* App fingerprint */]
  }
}
```

Here's an example of `assetlinks.json` file:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.company.app",
      "sha256_cert_fingerprints": ["0A:00:7A:D8:BF:C9:04:9D:AA:33:00:C9:65:2C:95:E0:41:0C:F5:31:9E:26:8C:18:14:A7:CB:E1:64:7D:71:76"]
    }
  }
]
```

> **Remember** this file must be accessible from public URL: https://your-domain/.well-known/assetlinks.json


## Development

* Use Gitflow
* Update package.json version
* Tag Git with same version numbers as NPM
* Check for valid `ngDocs` output inside `docs/` folder

> **Important**: Run `npm install` before anything. This will install NPM and Bower dependencies.

> **Important**: Run `npm run deliver` before committing anything. This will build documentation and distribution files.
> It's a shortcut for running both `build` and `docs` scripts.


### NPM commands

* Bower: install Bower dependencies in `bower_components/` folder:

```shell
$ npm run bower
```

* Build: build distributable binaries in `dist/` folder:

```shell
$ npm run build
```

* Documentation: generate user documentation (using `ngDocs`):

```shell
$ npm run docs
```

* Linting: run *linter* (currently JSHint):

```shell
$ npm run lint
```

* Deliver: **run it before committing to Git**. It's a shortcut for `build` and `docs` scripts:

```shell
$ npm run deliver
```
