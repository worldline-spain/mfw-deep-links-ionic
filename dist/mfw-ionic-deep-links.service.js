(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @module mfw-ionic.deep-links
   * @name mfw-ionic.deep-links
   *
   * @requires ionic
   * @requires {@link https://github.com/angular-ui/ui-router ui.router}
   *
   * @description
   * # Description
   *
   * This module provides an abstraction of {@link https://github.com/driftyco/ionic-plugin-deeplinks#non-ionicangular `IonicDeeplink` plugin}.
   *
   * ## ngCordova and Ionic Native
   *
   * JavaScript code of {@link https://github.com/driftyco/ionic-plugin-deeplinks IonicDeeplink} is used as plain JS module instead
   * of the {@link https://github.com/driftyco/ionic-plugin-deeplinks#ionicangular-1 `$cordovaDeeplinks`} AngularJS service.
   *
   * That's because it's not part of commonly used {@link http://ngcordova.com/docs/plugins/ ngCordova} project.
   * It's defined in a drop-in replacement project named {@link http://ionicframework.com/docs/v2/native/ ionic-native}.
   *
   * Setting `ionic.native` AngularJS module as a requirement may collide with projects using ngCordova because all
   * service names are the same.
   *
   * # Plugins
   *
   * This module requires the following Cordova plugins:
   *
   * * {@link https://github.com/driftyco/ionic-plugin-deeplinks ionic-plugin-deeplinks}
   *
   * # Features
   *
   * ## UI Router integration
   *
   * Provider {@link mfw-ionic.deep-links.$mfwiLinksProvider `$mfwiLinksProvider`} offers a way of *linking* ui.router
   * states to deep links.
   *
   *
   * ### Explicit links
   *
   * Method {@link mfw-ionic.deep-links.$mfwiLinksProvider#methods_addRoute `$mfwiLinksProvider.addRoute()`} allows you
   * to specify a deep link URL associated to a state name, so the state is accessed automatically when a deep link match
   * is found.
   *
   * **Example**
   *
   * <pre>
   *     $mfwiLinksProvider
   *         // One to one
   *         .addRoute('/products', 'app.products')
   *         // Match parameters are used as `$stateParams`
   *         .addRoute('/products/:productId', 'app.products.detail');
   * </pre>
   *
   *
   * ### Declarative links: state definitions
   *
   * There's a declarative way of deining links to ui.router states just by adding a `deepLink` property to the state's `data` object.
   *
   * This way you can avoid using explicitly {@link mfw-ionic.deep-links.$mfwiLinksProvider `$mfwiLinksProvider`} to add
   * deep links to your screen states.
   *
   * You can define deep links in your state in different ways:
   *
   * * As `true` boolean value: the state URL is used as deep link route URL
   * * As `String` value: explicit deep link route URL
   * * As `Function` or `Array.<string|function()>: the state URL is used as deep link and the injectable callback is set.
   * * As `object` value: the state URL is used as deep link and the object itself is used as route data.
   *    * You can define a `callback` property with an injectable callback definition.
   *
   * **Example**
   *
   * <pre>
   *     $stateProvider
   *         .state({
   *             name: 'settings',
   *             url: '/settings',
   *             data: {
   *                 // deep link URL: /settings
   *                 deepLink: true
   *             }
   *         })
   *         .state({
   *             name: 'settings.language',
   *             url: '/language',
   *             data: {
   *                 // deep link URL: /customer/language
   *                 deepLink: '/customer/language'
   *             }
   *         })
   *         .state({
   *             name: 'settings.section2',
   *             url: '/section2',
   *             data: {
   *                 // deep link URL: /settings/section2
   *                 deepLink: ['$log', '$match', function ($log, $match) {
   *                     $log.log('Match found', $match);
   *                 }]
   *             }
   *         })
   *         .state({
   *             name: 'section3',
   *             url: '/section3',
   *             data: {
   *                 // deep link URL: /section3
   *                 deepLink: function ($log, $match) {
   *                     $log.log('Match found', $match);
   *                 }
   *             }
   *         })
   *         .state({
   *             name: 'section4',
   *             url: '/section4',
   *             data: {
   *                 // deep link URL: /section4
   *                 deepLink: {
   *                     param1: 'value1',
   *                     param2: 'value2'
   *                 }
   *             }
   *         })
   *         .state({
   *             name: 'section5',
   *             url: '/section5',
   *             data: {
   *                 // deep link URL: /settings/section5
   *                 deepLink: {
   *                     param1: 'value1',
   *                     param2: 'value2',
   *                     callback: function ($match) {
   *                     }
   *                 }
   *             }
   *         });
   * </pre>
   *
   */
  var DeepLinksModule = angular.module('mfw-ionic.deep-links', [
    'ionic',
    'ui.router'
  ]);


  /**
   * RUN section.
   *
   * Ensure service is instantiated at least once.
   */
  DeepLinksModule.run(initService);
  initService.$inject = ['$mfwiLinks'];
  function initService($mfwiLinks) {
    // Do nothing
  }


  /**
   * @ngdoc service
   * @name mfw-ionic.deep-links.$mfwiLinksProvider
   *
   * @description
   * Provider of {@link mfw-ionic.deep-links.service:$mfwiLinks `$mfwiLinks`} service.
   */
  DeepLinksModule.provider('$mfwiLinks', DeepLinksProvider);
  DeepLinksProvider.$inject = [];
  function DeepLinksProvider() {
    var defaultOptions = {
      matchCallback: undefined,
      nomatchCallback: undefined,
      routesPrefix: ''
    };
    var routes = {};

    /**
     * @ngdoc function
     * @name mfw-ionic.deep-links.$mfwiLinksProvider#config
     * @methodOf mfw-ionic.deep-links.$mfwiLinksProvider
     *
     * @description
     * Configure generic options to be used on each new browser launched.
     *
     * @param {object} options Options
     * @param {Function=} options.matchCallback Function to be executed for all matches.
     *
     *    Defaults to: `undefined`
     * @param {Function=} options.nomatchCallback Function to be executed for all non-matches.
     *
     *    Defaults to: `undefined`
     * @param {string=} options.routesPrefix Prefix to be prepended to all
     *    {@link mfw-ionic.deep-links.$mfwiLinksProvider#methods_addRoute route} calls.
     *
     *    Defaults to: `""`
     * @returns {object} Provider instance for nested calls.
     */
    this.config = function (options) {
      defaultOptions = angular.extend({}, defaultOptions, options || {});
      return this;
    };

    /**
     * @ngdoc method
     * @name mfw-ionic.deep-links.$mfwiLinksProvider#addRoute
     * @methodOf mfw-ionic.deep-links.$mfwiLinksProvider
     *
     * @param {string|object} routeDefOrUrl
     *    Deep link route definition:
     *
     *    * If `string`: URL to be matched.
     *    * If `object`: route {@link https://github.com/driftyco/ionic-plugin-deeplinks#handling-deeplinks-in-javascript definition}.
     *
     * @param {string|Function|Array.<String|function()>} stateNameOrCallback
     *    Match callback:
     *
     *    * If `string`: name of the ui-router state to be loaded.
     *    * If `Function` or `Array.<String|function()>`: injectable callback to be executed.
     *
     * @description
     *
     * Declare a new route by setting the relative URI and an associated callback.
     *
     * Callbacks can be:
     *
     * * ui.router state name: this state will be accessed when the route is matched
     * * An {@link https://docs.angularjs.org/guide/di injectable} function (both explicit and implicit).
     *    * You can inject an special object named `$match` where you'll receive the
     *    {@link https://github.com/driftyco/ionic-plugin-deeplinks#handling-deeplinks-in-javascript matched} route.
     *
     * **Example**
     *
     * <pre>
     * $mfwiLinksProvider
     *     // Route with data
     *     .addRoute({
     *         '/help': {
     *             target: 'app.help',
     *             parent: 'app.home'
     *         }
     *      })
     *     // Injectable callback
     *     .addRoute('/route/:param', ['$log', '$match', function ($log, $match) {
     *         $log.log('Matched route:', $match);
     *     }])
     *     // Route
     *     .addRoute('/settings', 'app.settings');
     * </pre>
     *
     * @returns {object} Provider instance for nested calls.
     */
    this.addRoute = function (routeDefOrUrl, stateNameOrCallback) {
      var routeDef;

      // Standardize
      if (angular.isString(routeDefOrUrl)) {
        routeDef = {};
        routeDef[routeDefOrUrl] = {};
      } else {
        routeDef = routeDefOrUrl;
      }

      for (var key in routeDef) {
        routeDef[key]['callback'] = stateNameOrCallback;
      }

      // Add it
      angular.extend(routes, routeDef);

      return this;
    };

    this.$get = ['$log', '$q', '$window', '$ionicPlatform', '$state', '$injector', function ($log, $q, $window, $ionicPlatform, $state, $injector) {
      /**
       * @ngdoc service
       * @name mfw-ionic.deep-links.service:$mfwiLinks
       *
       * @description
       * Service.
       *
       * **Currently there's no public API**
       */
      var service = {};
      initialize();
      return service;

      ////////////////////

      /**
       * @description
       * Initializer method.
       *
       * @private
       */
      function initialize() {
        $ionicPlatform.ready(function () {
          // Add routesPrefix if available
          for (var key in routes) {
            if (defaultOptions.routesPrefix && defaultOptions.routesPrefix.length) {
              var newKey = defaultOptions.routesPrefix + key;
              routes[newKey] = routes[key];
              delete routes[key];
              key = newKey;
            }
            console.debug('Registering deepLink ' + key + ':', routes[key]);
          }

          if ($window.cordova) {
            $window.IonicDeeplink.route(routes, _match, _nomatch);
          }
        });
      }

      /**
       *
       * @param {object} match
       * @private
       */
      function _match(match) {
        var stateNameOrCallback = match.$route.callback;

        if (angular.isString(stateNameOrCallback)) {
          $state.go(match.$route.callback, match.$args);
        } else if (angular.isFunction(stateNameOrCallback) || angular.isArray(stateNameOrCallback)) {
          $injector.invoke(stateNameOrCallback, null, {$match: match});
        } else if (angular.isDefined(stateNameOrCallback)) {
          throw new Error('Unexpected type for stateNameOrCallback. Expected string or function, found:', typeof stateNameOrCallback);
        }

        if (angular.isDefined(defaultOptions.matchCallback)) {
          $injector.invoke(defaultOptions.matchCallback, null, {$match: match});
        }
      }

      /**
       *
       * @param {object} nomatch
       * @private
       */
      function _nomatch(nomatch) {
        if (angular.isDefined(defaultOptions.nomatchCallback)) {
          $injector.invoke(defaultOptions.nomatchCallback, null, {$match: nomatch});
        }
      }
    }];
  }

  /**
   * CONFIG
   *
   * Define a decorator of ui.router states to detect the ones configured with a `deepLink` property.
   */
  DeepLinksModule.config(decorateResponsiveStates);
  decorateResponsiveStates.$inject = ['$stateProvider', '$mfwiLinksProvider'];
  function decorateResponsiveStates($stateProvider, $mfwiLinksProvider) {
    $stateProvider.decorator('data', function (state, parent) {
      var data = parent(state);

      if (data && angular.isDefined(data.deepLink)) {
        var stateName = state.name;
        var stateUrl = state.url;

        console.debug('Deep link for ui.router state ' + stateName);

        // Declared as deepLink
        var deepLink = data.deepLink;
        if (angular.isString(deepLink)) {
          // Provided route URL as string
          //console.debug('Configuring deepLink for state ' + stateName + ': ' + deepLink);
          $mfwiLinksProvider.addRoute(deepLink, stateName);
        } else if (deepLink === true) {
          // Same route as state's final URL
          //console.debug('Configuring symmetric deepLink for state ' + stateName + ': ' + stateUrl);
          $mfwiLinksProvider.addRoute(stateUrl, stateName);
        } else if (angular.isArray(deepLink) || angular.isFunction(deepLink)) {
          // Same route as state's final URL and callback
          //console.debug('Configuring deepLink with injection for state ' + stateName + ': ' + stateUrl);
          $mfwiLinksProvider.addRoute(stateUrl, deepLink);
        } else if (angular.isObject(deepLink)) {
          // Route data with explicit callback, if any
          //console.debug('Configuring deepLink with data for state ' + stateName + ': ' + stateUrl, deepLink);
          var routeDef = {};
          routeDef[stateUrl] = deepLink;
          $mfwiLinksProvider.addRoute(routeDef);
        } else {
          console.warn('Unknown deep link configuration for state ' + stateName, deepLink);
        }
      }

      return data;
    });
  }
})();
