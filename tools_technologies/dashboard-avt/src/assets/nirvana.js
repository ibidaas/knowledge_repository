/*!
 *
 *   Copyright (c) 1999 - 2011 my-Channels Ltd
 *   Copyright (c) 2012 - 2017 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 *   Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG.
 *
 */
/*

Title: Universal Messaging JavaScript API

    *Pure JavaScript API For JavaScript/HTML5 Clients*

    The Universal Messaging JavaScript API is intended to be simple to use, while being sufficiently comprehensive to accommodate
    a range of application requirements and infrastructures.
    Though the full API is extensive, its ease of use for typical use cases should be clear from the
    following simple example, which in only a few lines of code, sets up a <Session>, subscribes to a <Channel>, and receives,
    processes and publishes <Events>:

    (start code)

        var session = Nirvana.createSession();
        var channel = session.getChannel("/demo/channel");

        function demoHandler(event) {
            if (event.getDictionary().get("demoMessage") == "ping") {
                newEvent = Nirvana.createEvent();
                newEvent.getDictionary().putString("demoMessage", "pong");
                channel.publish(newEvent);
            }
        }

        session.start();

        channel.on(Nirvana.Observe.DATA, demoHandler);
        channel.subscribe();

    (end code)

    Universal Messaging streams events to web clients asynchronously, without the requirement for any additional technology components
    or plugins on client browsers.
    The API will automatically detect client capabilities and make use of the optimum underlying transport driver in each case.
    See <Nirvana.Driver> for more details of the many available Web Socket and Comet drivers.


About: Version & Support

    JavaScript API Version 112089-112089.
    Released August 27 2018.

    For support, please open a Support Incident via Empower eServices at:
    https://empower.softwareag.com/

    Telephone numbers for your local Support Center can be found at:
    https://empower.softwareag.com/public_directory.asp

    If you have forgotten your Empower password, you can request a new one from:
    https://empower.softwareag.com/passwordHelp.asp

About: Copyright & License

    Copyright 1999-2011 (c) My-Channels
    Copyright (c) 2012–2015 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.

    Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG.

*/
(function (window, undefined) {

/*
   Namespace: Nirvana

   <Nirvana> is the API namespace which provides a number of static methods and properties for creating
   Universal Messaging <Sessions>, <Events>, and <EventDictionaries> along with definitions of constants used throughout.


   Constants: Observe

   <Nirvana.Observe> defines constants which identify observable events that, when fired, notify interested listeners
   (see the on() and removeListener() methods in the <Nirvana>, <Session>, <Channel>, <Queue> and <TransactionalQueue> objects).


   Observable Events for <Nirvana>:

   Nirvana.Observe.ERROR        -   Fires when an unexpected error occurs. Two parameters are passed to all listeners:
                                    the relevant <Session> object, and an exception with details of the error.

   Observable Events for <Session>:

   Nirvana.Observe.START        -   Fires when the <Session> successfully starts.
                                    The <Session> object itself is passed as a parameter to all listeners.

   Nirvana.Observe.STOP         -   Fires when the <Session> is cleanly closed.
                                    The <Session> object itself is passed as a parameter to all listeners.

   Nirvana.Observe.DISCONNECT   -   Fires when the <Session> is disconnected and automatically attempts to reconnect.
                                    The <Session> object itself is passed as a parameter to all listeners.

   Nirvana.Observe.RECONNECT    -   Fires when the <Session> has successfully automatically reconnected following temporary disconnection.
                                    The <Session> object itself is passed as a parameter to all listeners.

   Nirvana.Observe.DATA         -   Fires when a Universal Messaging <Event> is received by a DataStream-enabled <Session>.
                                    The Universal Messaging <Event> is passed as a parameter to all listeners.

   Nirvana.Observe.DRIVER_CHANGE-   Fires when the <Session's> transport driver changes for any reason.
                                    Two parameters are passed to all listeners:
                                    the <Session> object itself, and a string representing the name of the new driver (See <Nirvana.Driver>).

   Nirvana.Observe.ERROR        -   Fires when an unexpected error occurs. Two parameters are passed to all listeners:
                                    the <Session> object itself, and an exception with details of the error.


   Observable Events for Resource Objects (<Channels>, <Queues> and <TransactionalQueues>):

   Nirvana.Observe.SUBSCRIBE    -   Fires when a subscription to a resource such as a <Channel> or a <Queue> is successfully started.
                                    The resource itself is passed as a parameter to all listeners.

   Nirvana.Observe.DATA         -   Fires when a Universal Messaging <Event> is received by a <Channel>, <Queue> or <TransactionalQueue> resource.
                                    The Universal Messaging <Event> is passed as a parameter to all listeners.

   Nirvana.Observe.UNSUBSCRIBE  -   Fires when a subscription to a resource such as a <Channel> or a <Queue> is ended.
                                    The resource object itself is passed as a parameter to all listeners.

   Nirvana.Observe.PUBLISH      -   Fires when an event is successfully published to a resource such as a <Channel> or a <Queue>.
                                    Two parameters are passed to all listeners:
                                    the resource object itself, and a string representing the server's response.

   Nirvana.Observe.ERROR        -   Fires when an unexpected error occurs.
                                    Two parameters are passed to all listeners:
                                    the resource object itself, and an exception with details of the error.



   Additional Observable Events <TransactionalQueues>:

   Nirvana.Observe.COMMIT       -   Fires when a transactional read is successfully committed to the server.
                                    Two parameters are passed to all listeners: The <TransactionalQueue> itself, and the response status.

   Nirvana.Observe.ROLLBACK     -   Fires when a transactional read is rolled back on the server.
                                    Two parameters are passed to all listeners: The <TransactionalQueue> itself, and the response status.



   Observable Events on <Transactions>:

   Nirvana.Observe.COMMIT       -   Fires when a transactional publish is successfully committed to the server.
                                    Two parameters are passed to all listeners: The <Transaction> itself, and the response status.



   Example Usage:

        > function myHandler(evt) {
        >   console.log(evt.getEID());
        > }
        > myChannel.on(Nirvana.Observe.DATA, myHandler);
        > myChannel.subscribe();


    Note that the above example uses a *named listener*, _myHandler_, in the call to <Channel.on()>.
    This allows a developer to make a corresponding call to <Channel.removeListener()> when desired.

    It is also possible to use an anonymous function as a listener.

        > myChannel.on(Nirvana.Observe.DATA, function(evt) {
        >   console.log(evt.getEID());
        > });
        > myChannel.subscribe();

    Use of an anonymous function as a listener is *not recommended*, however, as the lack of a reference
    to the anonymous function makes it impossible for a developer to remove the listener via <removeListener()>.
    It is almost always better to use a named listener as in the first example above.

    See Also:

    <Nirvana.on()>, <Session.on()>, <Channel.on()>, <Queue.on()>, <TransactionalQueue.on()>, <Transaction.on()>


    Constants: Driver

    <Nirvana.Driver> defines the names of all available transport drivers that may be used by a <Session>.
    By default, a client will attempt to use all drivers in the order defined below, settling on the first driver that allows it to initialize a <Session>.

    WEBSOCKET                        - Streaming driver for browsers supporting HTML5 Web Sockets.
    XHR_STREAMING_CORS                - Streaming driver for browsers supporting XMLHTTPRequest with CORS (Cross-Origin Resource Sharing). Intended for Chrome, Firefox, Safari, IE10+ and MS Edge.
    IFRAME_STREAMING_POSTMESSAGE    - Streaming driver for browsers supporting the cross-window postMessage API (per https://developer.mozilla.org/en/DOM/window.postMessage). Intended for Chrome, Firefox, Safari, IE8+ and MS Edge.
    EVENTSOURCE_STREAMING_POSTMESSAGE - Streaming driver for browsers supporting both Server-Sent-Events and the cross-window postMessage API. Intended for Chrome, Firefox and Safari.
    XHR_LONGPOLL_CORS                - Longpoll driver for browsers supporting XMLHTTPRequest with CORS (Cross-Origin Resource Sharing). Intended for Chrome, Firefox, Safari, IE10+ and MS Edge.
    XHR_LONGPOLL_POSTMESSAGE        - Longpoll driver for browsers supporting the cross-window postMessage API. Intended for Chrome, Firefox, Safari, IE8+ and MS Edge.
    NOXD_IFRAME_STREAMING            - Legacy non-cross domain streaming driver for older clients requiring streaming from the realm that serves the application itself. Intended for Chrome, Firefox, Safari, IE6+ and MS Edge.
    JSONP_LONGPOLL                    - Longpoll driver for older browsers relying on DOM manipulation only. Browser will show "busy indicator/throbber" when in use. Intended for Chrome, Firefox, Safari, IE6+ and MS Edge.

    More about Drivers:

    Developers may override which transport drivers are available for use by specifying a _drivers_ key
    (whose value is an array of driver names in order of preference) in the optional configuration object passed
    to <Nirvana.createSession()> - see example usage below.

    Note that streaming drivers are, in general, to be preferred over longpoll drivers for many reasons.
    Some clients, however, may be restricted by intermediate infrastructure (such as poorly configured proxy servers)
    which may prevent them from successfully using a streaming driver. The various longpoll drivers provide a fallback for
    such clients.

    All drivers, except the legacy _NOXD_IFRAME_STREAMING_ driver, are *fully cross domain*.

    Understanding Driver and Realm Failover:

    Each driver gets 3 consecutive attempts to initialise a session. If the client has to switch to a new driver,
    it will immediately try to connect and initialise a session. The second connection attempt has a delay of 1 second.
    The third attempt has a delay of 2 seconds. This is to avoid compounding problems on a server that may be undergoing
    maintenance or other load issues.

    If the client's session object has been configured to connect to *just a single realm*, then:

        - If the client gets a confirmed session to the realm, then, for the rest of the browsing session (until page
         reload) it will always use that driver thereafter. It will never attempt to fail over to a different driver
         as the selected driver will be the best option for the infrastructural environment.
        - If it gets disconnected, it will continue retrying to connect with the same driver forever. To avoid
         any potential overloading issues, it will increase the delay between connection attempts by 1 second up
         to a maximum of rand(30,60) seconds.

    If the client's session object has been configured to connect to an *array of more than one realm* (e.g. realms in a cluster), then:

        - If the client gets a confirmed session to realm X, then it will always try to use that driver thereafter.
        - If it gets disconnected from realm X, it will continue retrying to connect with the same driver for a maximum
        of 5 consecutive failed attempts (any successful connection will reset the failure count to 0).
        If the 5th attempt fails, it will switch to the next realm, re-enable *all* drivers, and start cycling through
        them again (giving each one 3 chances to connect as usual).

   Example Usage:

    >    var session = Nirvana.createSession({
    >        drivers : [
    >            Nirvana.Driver.WEBSOCKET,
    >            Nirvana.Driver.XHR_STREAMING_CORS,
    >            Nirvana.Driver.XHR_LONGPOLL_CORS
    >        ]
    >    });
    >
    >    session.start();
    >    var driverName = session.getCurrentDriver();

    See Also:

    <Nirvana.createSession()>, <Session.getCurrentDriver()>



    Constants: VERSION_NUMBER
    <Nirvana.VERSION_NUMBER> is an integer constant representing the API version number.


    Constants: BUILD_NUMBER
    <Nirvana.BUILD_NUMBER> is an integer constant representing the API build number.


    Constants: BUILD_DATE
    <Nirvana.BUILD_DATE> defines the API build date.


    Constants: CHANNEL_RESOURCE
    <Nirvana.CHANNEL_RESOURCE> is an integer constant representing a <Channel's> type.

    See Also:
    <Channel.getResourceType()>


    Constants: QUEUE_RESOURCE
    <Nirvana.QUEUE_RESOURCE> is an integer constant representing a <Queue's> type.

    See Also:
    <Queue.getResourceType()>


    Constants: TRANSACTIONAL_QUEUE_RESOURCE
    <Nirvana.TRANSACTIONAL_QUEUE_RESOURCE> is an integer constant representing a <TransactionalQueue's> type.

    See Also:
    <TransactionalQueue.getResourceType()>

*/


    var Nirvana = (function () {
        /** @namespace window.Nirvana */

        var PrivateConstants = {
            SESSION_START:1,
            RESOURCE_SUBSCRIBE:2,
            KEEP_ALIVE:3,
            BATCH_SUBSCRIBE:5,
            PACKET_RECEIVE:7,
            EVENT_RECEIVE:8,
            SET_RESOURCE_ALIAS:10,
            RESOURCE_PUBLISH:14,
            RESOURCE_UNSUBSCRIBE:15,
            QUEUE_COMMIT:16,
            QUEUE_ROLLBACK:17,
            TX_PUBLISH:20,
            TX_IS_COMMITTED:24,
            CLIENT_CLOSE:30
        };

        var CallbackConstants = {
            "START":1,
            "STOP":2,
            "DISCONNECT":3,
            "RECONNECT":4,
            "ERROR":5,
            "DATA":6,
            "DRIVER_CHANGE":7,
            "SUBSCRIBE":8,
            "UNSUBSCRIBE":9,
            "COMMIT":10,
            "ROLLBACK":11,
            "PUBLISH":13
        };

        var Statuses = {
            "NOTSTARTED":"NOTSTARTED",
            "CONNECTING":"CONNECTING",
            "CONNECTED":"CONNECTED",
            "RECONNECTING":"RECONNECTING",
            "STOPPED":"STOPPED"
        };

        var DriverDomObjectsContainerID = '_Nirvana_Driver_DOM_Objects_Container'; // Anything we add to the DOM should go in here.
        var ListenerManagers = {};

        var lm = null;


        /*
         *  ************************************************************************************
         *  Utils is a private class:
         *  ************************************************************************************
         */

        var Utils = (function () {

            var debugLevel = 9;
            var loggingEnabled = false;

            var Logger = (function () {
                var logs = [];
                var maxLogLength = 10000;
                var debugConsoleOpened = false;
                var _console;

                var logFunction = function (message) {};

                //    9 OFF | 8 SEVERE | 7 WARNING | 6 INFO | 5 CONFIG | 4 TRANSPORT META | 3 REQUEST/REPONSE | 2 TRANSPORT DETAILED | 1 DRIVERCOMMS | 0 ALL

                function log(severity, msg) {
                    if (debugLevel <= severity) {
                        var msgArgs = Array.prototype.slice.call(arguments);
                        msgArgs.unshift(new Date());
                        var logMessage = msgArgs.join(" ");
                        if (debugConsoleOpened && _console && !_console.closed) _console.document.writeln(logMessage + "<br/>");
                        if (logs.length > maxLogLength) {
                            logs.shift();
                        }
                        logs.push(logMessage);
                        logFunction(logMessage);
                    }
                }

                function logException(severity, ex) {
                    var msg = "EXCEPTION: " + ex.name + " - " + ex.message;
                    log(severity, msg);
                }

                function setLogger(fn) {
                    logFunction = fn;
                }

                function debuggerKeyListener(e) {
                    if (!e) { //for IE
                        e = window.event;
                    }
                    if ((e.keyCode == 68) && e.ctrlKey && e.altKey) {
                        showDebugConsole();
                    }
                }

                function showDebugConsole() {
                    if (!debugConsoleOpened || (_console && _console.closed)) {
                        _console = window.open("", "Console", "width=600,height=300,scrollbars=yes,resizable");
                        _console.document.open();
                        _console.document.writeln("<style> { font-size: 10px; font-family: verdana, lucida sans, courier new, courier, sans-serif ; }</style>");
                        _console.document.writeln("<b>User Agent: " + navigator.userAgent + "</b><br/>");
                        for (var i = 0; i < logs.length; i++) {
                            _console.document.writeln(logs[i] + "<br/>");
                        }
                        debugConsoleOpened = true;
                    } else {
                        _console.focus();
                    }
                }

                // Press Ctrl-Alt-d to launch a debug window:
                try {
                    if (window.addEventListener) {
                        window.addEventListener('keydown', debuggerKeyListener, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('onkeydown', debuggerKeyListener);
                    } else {
                        document.addEventListener("keydown", debuggerKeyListener, true);
                    }
                } catch (ex) {
                    // this browser will not support key listener
                }

                return {
                    setLogger:setLogger,
                    log:log,
                    logException:logException
                };
            }());

            var isLoggingEnabled = function () {
                return loggingEnabled;
            };

            var setDebugLevel = function (level) {
                debugLevel = level;
                loggingEnabled = debugLevel < 9;
            };

            var setCookie = function(cookieName, value) {
                document.cookie = cookieName + "=" + encodeURIComponent(value) + "; expires=" + new Date((new Date()).getTime() + 365 * 24 * 60 * 60 * 1000) + "; ";
            };

            var getCookie = function(cookieName) {
                var cookieArray = document.cookie.split('; ');
                for(var x = 0; x < cookieArray.length; x++){
                    var nameValPair = cookieArray[x].split('=');
                    if(nameValPair[0] == cookieName) {
                        return decodeURIComponent(nameValPair[1]);
                    }
                }
                return null;
            };

            var Scheduler = (function () {

                var increment = 500;
                var time = 0;
                var counter = 0;
                var scheduledTasks = {};

                function schedule(func, delay) {
                    var id = counter++;
                    scheduledTasks[id] = { "t" : time + delay, "f" : func };
                    return id;
                }

                function cancel(id) {
                    try {
                        if (scheduledTasks[id]) {
                            delete scheduledTasks[id];
                        }
                    } catch (ex) {
                    }
                }

                function tick() {
                    time += increment;
                    processTasks();
                    setTimeout(tick, increment);
                }

                function processTasks() {
                    for (var id in scheduledTasks) {
                        if (scheduledTasks.hasOwnProperty(id)) {
                            var task = scheduledTasks[id];
                            if (time >= task.t) {
                                (task.f)();
                                cancel(id);
                            }
                        }
                    }
                }

                // start the clock:
                tick();

                return {
                    "schedule":schedule,
                    "cancel":cancel
                };

            }());

            var HTTPRequestFactory = function () {

                var requestBuilder = [];

                var buildCommonParameters = function (command) {
                    if (Transport.getNirvanaCookie() !== undefined) {
                        return "&Connection-Type=JR&" + Transport.getNirvanaCookie() + "&R=" + command.requestID;
                    } else { //Websocket Connection
                        return "&R=" + command.requestID;
                    }
                };

                var buildEvent = function (event) {
                    var request = "";

                    if (event.hasTag()) {
                        request = request + "&T=" + Utils.base64Encode(event.getTag());
                    }

                    if (event.hasData()) {
                        request = request + "&D=" + event.getData(Nirvana.BYTE_ARRAY_AS_BASE64_STRING);
                    }

                    if (event.hasDictionary()) {
                        request = request + "&J=" + buildEventDictionary(event.getDictionary());
                    }

                    request = request + "&L=" + event.getTTL() + buildEventAttributes(event.getEventAttributes());

                    return request;
                };

                var buildEventDictionary = function (dictionary) {
                    var keys = dictionary.getKeys();
                    var keyLength = keys.length;

                    var obj = "";
                    for (var i = 0; i < keyLength; i++) {
                        if (i > 0) {
                            obj += ",";
                        }
                        var key = keys[i];
                        var type = dictionary.getType(key);
                        obj += encodeURIComponent(key) + "," + type;
                        if (type === EventDictionary.ARRAY) {
                            type = dictionary.getArrayType(key);
                            var val = dictionary.get(key, Nirvana.LongType.LONG_AS_DECIMAL_STRING);
                            if(type === EventDictionary.STRING || type === EventDictionary.CHARACTER){
                                var tmp = [];
                                for(var x=0;x<val.length; x++){
                                    tmp[x]= encodeURIComponent(val[x]);
                                }
                                val =tmp;
                            }
                            obj += "," + type + "," + val.length + "," + val.join(",");
                        } else if (type === EventDictionary.DICTIONARY) {
                            obj += "," + buildEventDictionary(dictionary.get(key));
                        } else if(type === EventDictionary.STRING || type === EventDictionary.CHARACTER){
                            obj += "," + encodeURIComponent(dictionary.get(key));
                        } else {
                            obj += "," + dictionary.get(key, Nirvana.LongType.LONG_AS_DECIMAL_STRING);
                        }
                    }

                    return obj;
                };

                var buildEventAttributes = function (attributes) {
                    var headerHash = 0;
                    var headerValues = [];

                    var headerKeys = EventAttributes.HEADER_KEYS;
                    var headerKeyLength = headerKeys.length;
                    for (var headIdx = 0; headIdx < headerKeyLength; headIdx++) {
                        var attribute = attributes.getAttribute(headerKeys[headIdx]);
                        if (attribute || attribute === 0) {
                            headerHash = headerHash + (1 << headIdx);
                            headerValues.push(encodeURIComponent(attribute));
                        }
                    }


                    if (attributes.getMessageType() > -1 && attributes.getMessageType() < 7) {
                        var jmsKeys = EventAttributes.JMS_HEADER_KEYS;
                        var jmsHeaderLength = jmsKeys.length;
                        for (var jmsIdx = 0; jmsIdx < jmsHeaderLength; jmsIdx++) {
                            var jmsAttribute = attributes.getAttribute(jmsKeys[jmsIdx]);
                            if (jmsAttribute  || jmsAttribute === 0) {
                                headerHash = headerHash + (1 << (headerKeyLength + jmsIdx));
                                headerValues.push(encodeURIComponent(jmsAttribute));
                            }
                        }
                    }

                    if (headerHash > 0) {
                        return "&K=" + headerHash + "&H=" + headerValues.join(",");
                    }

                    return "";
                };

                requestBuilder[PrivateConstants.SESSION_START] = function (command) {
                    var session = command.session;
                    return ["F=" + PrivateConstants.SESSION_START +
                        "&Connection-Type=JC&Y=10"+
                        "&V=" + navigator.appName.replace(' ', '-') +
                        "&P=" + Transport.Drivers.WireProtocol[Transport.getCurrentDriver()] +
                        "&W=" + Nirvana.BUILD_NUMBER.replace(' ', '-') +
                        "&X=" + Nirvana.BUILD_DATE.replace(' ', '-') +
                        "&Z=" + navigator.platform.toString().replace(' ','_') +
                        "&S=" + encodeURIComponent(session.getUsername()) +
                        "&A=" + encodeURIComponent(session.getConfig().applicationName) +
                        "&G=" + (session.getConfig().serverLogging ? "T" : "F") +
                        "&D=" + (session.isDataStreamEnabled() ? "T" : "F") +
                        "&B=" + (session.getDataStreamID()) +
                        "&R=" + command.requestID +
                        "&1Date=" + new Date().getTime(),
                        ""];
            };

                requestBuilder[PrivateConstants.CLIENT_CLOSE] = function (command) {
                    return ["F=" + PrivateConstants.CLIENT_CLOSE + buildCommonParameters(command), ""];
                };

                requestBuilder[PrivateConstants.KEEP_ALIVE] = function (command) {
                    return ["F=" + PrivateConstants.KEEP_ALIVE + buildCommonParameters(command), ""];
                };

                requestBuilder[PrivateConstants.BATCH_SUBSCRIBE] = function (command) {
                    var param = "";
                    var resources = command.resources;
                    var resourceLength = resources.length;
                    for (var i = 0; i < resourceLength; i++) {
                        var resource = resources[i];
                        var resourceType = resource.getResourceType();
                        if (i > 0) {
                            param += ",";
                        }
                        param += resource.getName();

                        // Add additional information based on resource type
                        if (resourceType === Nirvana.CHANNEL_RESOURCE) {
                            var eid;
                            if(resource.getCurrentEID() >= 0){
                                eid = resource.getCurrentEID() + 1;
                            } else {
                                eid = resource.getStartEID();
                            }
                            param += "," + eid;
                            param += "," + encodeURIComponent(resource.getFilter());
                            param += ",F";
                        } else if (resourceType === Nirvana.QUEUE_RESOURCE) {
                            param += ",0";
                            param += "," + encodeURIComponent(resource.getFilter());
                            param += ",T";
                        } else if (resourceType === Nirvana.TRANSACTIONAL_QUEUE_RESOURCE) {
                            param += "," + resource.getWindowSize();
                            param += "," + encodeURIComponent(resource.getFilter());
                            param += ",T";
                        } else {
                            param += ",0";
                            param += "," + encodeURIComponent(resource.getFilter());
                            param += ",F";
                        }
                    }

                    return ["F=" + PrivateConstants.BATCH_SUBSCRIBE + buildCommonParameters(command), "E=" + resourceLength + "&N=" + param ];

                };

                requestBuilder[PrivateConstants.RESOURCE_SUBSCRIBE] = function (command) {
                    command.resources = [command.resource];
                    return requestBuilder[PrivateConstants.BATCH_SUBSCRIBE](command);
                };

                requestBuilder[PrivateConstants.RESOURCE_PUBLISH] = function (command) {
                    var resource = command.resource;
                    var event = command.event;

                    return ["F=" + PrivateConstants.RESOURCE_PUBLISH + buildCommonParameters(command), "N=" + resource.getName() + buildEvent(event)];
                };

                requestBuilder[PrivateConstants.RESOURCE_UNSUBSCRIBE] = function (command) {
                    var resource = command.resource;
                    var resourceType = resource.getResourceType();
                    var request = ["F=" + PrivateConstants.RESOURCE_UNSUBSCRIBE + buildCommonParameters(command), "N=" + resource.getName()];

                    if (resourceType === Nirvana.QUEUE_RESOURCE || resourceType === Nirvana.TRANSACTIONAL_QUEUE_RESOURCE) {
                        request[1] = request[1] + "&Q=T";
                    }

                    return request;
                };

                requestBuilder[PrivateConstants.QUEUE_COMMIT] = function (command) {
                    var resource = command.resource;
                    var event = command.event;

                    return ["F=" + PrivateConstants.QUEUE_COMMIT + buildCommonParameters(command), "N=" + resource.getName() + "&E=" + event.getEID()];
                };

                requestBuilder[PrivateConstants.QUEUE_ROLLBACK] = function (command) {
                    var resource = command.resource;
                    var event = command.event;

                    return ["F=" + PrivateConstants.QUEUE_ROLLBACK + buildCommonParameters(command), "N=" + resource.getName() + "&E=" + event.getEID()];
                };

                requestBuilder[PrivateConstants.TX_PUBLISH] = function (command) {
                    /** Command Object:
                     *      resource
                     *      transaction
                     *      event
                     */
                    var resource = command.resource;
                    var transaction = command.transaction;
                    var event = command.event;

                    return ["F=" + PrivateConstants.TX_PUBLISH + buildCommonParameters(command), "N=" + resource.getName() + "&X=" + transaction.getTxID() + buildEvent(event)];
                };

                requestBuilder[PrivateConstants.TX_IS_COMMITTED] = function (command) {
                    /** Command Object:
                     *      transaction
                     */
                    var transaction = command.transaction;

                    return ["F=" + PrivateConstants.TX_IS_COMMITTED + buildCommonParameters(command), "X=" + transaction.getTxID()];
                };


                var buildRequest = function (command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Request Factory] Building Request from Command " + describe(command.requestType));
                    }
                    return (requestBuilder[command.requestType](command));
                };

                return {
                    buildRequest:buildRequest
                };
            };

            var HTTPResponseFactory = function (parentSession) {
                var responseHandlers = [];

                var postSessionInitSuccess = false;

                var buildEvent = function (rawEvent, resource, resourceName) {

                    /** @namespace rawEvent.Data */
                    /** @namespace rawEvent.h */
                    /** @namespace rawEvent.EID */
                    /** @namespace rawEvent.Tag */
                    /** @namespace rawEvent.Dictionary */
                    var dictionary;
                    if (rawEvent.Dictionary) {
                        dictionary = buildEventDictionary(rawEvent.Dictionary);
                    }

                    var attributes = new EventAttributes(rawEvent.h);

                    var tag;
                    if(rawEvent.Tag) {
                        tag = Utils.base64Decode(rawEvent.Tag);
                    }


                    return new Event(parentSession, rawEvent.EID, resource, resourceName, attributes,rawEvent.Data, tag, dictionary);
                };

                var buildEventDictionary = function (rawDictionary) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Building Event Dictionary ", rawDictionary);
                    }
                    for (var key in rawDictionary) {
                        if (rawDictionary.hasOwnProperty(key)) {
                            var entry = rawDictionary[key];
                            if (entry[0] === EventDictionary.STRING || entry[0] === EventDictionary.CHARACTER) {
                                entry[1] = decodeURIComponent(entry[1]);
                            } else if (entry[0] === EventDictionary.DICTIONARY) {
                                entry[1] = buildEventDictionary(entry[1]);
                            } else if (entry[0] === EventDictionary.ARRAY) {
                                if (entry[1] === EventDictionary.STRING || entry[1] === EventDictionary.CHARACTER) {
                                    var strings = entry[2];
                                    var stringsLength = strings.length;
                                    for (var i = 0; i < stringsLength; i++) {
                                        strings[i] = decodeURIComponent(strings[i]);
                                    }
                                } else if (entry[1] === EventDictionary.DICTIONARY) {
                                    var dictionaries = entry[2];
                                    var dictionariesLength = dictionaries.length;

                                    for (var j = 0; j < dictionariesLength; j++) {
                                        dictionaries[j] = buildEventDictionary(dictionaries[j]);
                                    }
                                }
                            }
                        }
                    }
                    return new EventDictionary(rawDictionary, true);
                };

                responseHandlers[PrivateConstants.SESSION_START] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(6, "[HTTP Response Factory] Received Session Start Response for Command " + command.requestType, response, command);
                    }
                    if (response[1]) {
                        parentSession.setSessionID(response[2]);
                        parentSession.setDataStreamID(response[3]);
                        Transport.onConnect(response[4]);
                        OutboundEngine.setReady(true);
                        // Notify listeners
                        if (command.reconnect) {
                            parentSession.notifyListeners(CallbackConstants.RECONNECT, parentSession, response[3]);
                        } else {
                            parentSession.notifyListeners(CallbackConstants.START, parentSession, response[3]);
                        }
                    } else {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(6, "[HTTP Response Factory] Session Connection Error: " + response[2]);
                        }
                        parentSession.notifyListeners(CallbackConstants.ERROR, parentSession, { name:"SessionConnectException", message:response[2] });
                    }
                };

                responseHandlers[PrivateConstants.BATCH_SUBSCRIBE] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Received Batch Subscribe Callback for Command " + command.requestType, response, command);
                    }
                    var resources = command.resources;
                    var callbacks = response.slice(1);
                    var isResubscribe = command.resubscribe;

                    var resourceCount = resources.length;
                    for (var i = 0; i < resourceCount; i++) {
                        var resource = resources[i];
                        var callback = callbacks[i];
                        var success = callback[1];
                        resource.setSubscribed(success);
                        if (success) {
                            resource.setAlias(callback[2]);
                            if (!isResubscribe) { // Only notify on initial subscription
                                resource.notifyListeners(Nirvana.Observe.SUBSCRIBE, resource, "OK");
                            }
                        } else {
                            var errorMessage = callback[2];
                            var error;
                            if (errorMessage) {
                                if (errorMessage.indexOf("SECURITY") !== -1) {
                                    error = new SecurityException(errorMessage);
                                } else if (errorMessage.indexOf("Channel Not Found") !== -1) {
                                    error = new MissingResourceException(resource.getName(), errorMessage);
                                } else {
                                    error = new GenericException(errorMessage);
                                }
                            }

                            if (!error) {
                                error = new GenericException("Unknown Error Occurred");
                            }

                            resource.notifyListeners(Nirvana.Observe.ERROR, resource, error);
                        }
                    }
                };

                responseHandlers[PrivateConstants.KEEP_ALIVE] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Processing KA Response " + response.toString());
                    }
                };

                responseHandlers[PrivateConstants.RESOURCE_PUBLISH] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Received Publish Callback for Command " + command.requestType, response, command);
                    }
                    var resource = command.resource;
                    var success = response[1];
                    if(success) {
                        resource.notifyListeners(CallbackConstants.PUBLISH, resource, success);
                    } else {
                        var reason = response[2];
                        var ex;
                        if(reason && reason.indexOf("SECURITY") !== -1) {
                            ex = new SecurityException(reason);
                        } else {
                            ex = new GenericException(reason);
                        }
                        resource.notifyListeners(CallbackConstants.ERROR, resource, ex);
                    }
                };

                responseHandlers[PrivateConstants.RESOURCE_UNSUBSCRIBE] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Received Resource unsubscribe Callback for Command " + command.requestType);
                    }
                    var resource = command.resource;
                    resource.setSubscribed(false);
                    resource.notifyListeners(CallbackConstants.UNSUBSCRIBE, resource, "OK");
                };

                responseHandlers[PrivateConstants.PACKET_RECEIVE] = function (data) {
                    if(parentSession.getLongPollRequestID() < data[1]){
                        parentSession.setLongPollRequestID(data[1]);
                    } else{
                        Transport.onError("Data received out of order, reset required. Expected packet " + (parentSession.getLongPollRequestID()+1) + " but received " + data[1]);
                    }
                };

                responseHandlers[PrivateConstants.EVENT_RECEIVE] = function (data) {
                    /** @namespace rawEvent.CNAME */
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Received Event", data);
                    }

                    var rawEvent = data[1];
                    var isDataGroup = rawEvent.dg === "1";

                    // Look up resource
                    var resource;
                    var resourceType;
                    var name;
                    if (!isDataGroup) {
                        resource = parentSession.getResourceByAlias(rawEvent.CNAME);
                        if (!resource) {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(3, "[HTTP Response Factory] Event was for non-existent resource: " + rawEvent.CNAME);
                            }
                            return;
                        }
                        resourceType = resource.getResourceType();
                        name = resource.getName();
                    } else {
                        resource = parentSession;
                        resourceType = -1;
                        name = parentSession.getGroupName(rawEvent.CNAME);
                    }

                    var newEvent = buildEvent(rawEvent, resource, name);
                    if (resource) {
                        if(resourceType === Nirvana.CHANNEL_RESOURCE) {
                            resource.setCurrentEID(newEvent.getEID());
                        }
                        resource.notifyListeners(CallbackConstants.DATA, newEvent);
                    }
                };

                responseHandlers[PrivateConstants.SET_RESOURCE_ALIAS] = function (data) {
                    /** Data:
                     *      setResourceAlias
                     *      Resource Type (1-3)(Channel, Queue, DataGroup)
                     *      Resource Name
                     *      Resource Alias
                     */
                    var type = data[1];
                    var name = data[2];
                    var alias = data[3];

                    if (type == "3") {
                        parentSession.setGroupAlias(name, alias);
                    } else {
                        parentSession.setResourceAlias(name, alias);
                    }
                };

                responseHandlers[PrivateConstants.QUEUE_COMMIT] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Received Queue Commit Response", response, command);
                    }
                    var resource = command.resource;
                    resource.notifyListeners(CallbackConstants.COMMIT, resource, response[1]);
                };

                responseHandlers[PrivateConstants.QUEUE_ROLLBACK] = function (response, command) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Received Queue Rollback Response", response, command);
                    }
                    var resource = command.resource;
                    resource.notifyListeners(CallbackConstants.ROLLBACK, resource, response[1]);
                };

                responseHandlers[PrivateConstants.TX_PUBLISH] = function (response, command) {
                    /** Response:
                     *      requestType
                     *      Commit Status (T/F) OR "No Such Channel"
                     */
                    var commitStatus = response[1];

                    /** Command Object:
                     *      requestType
                     *      resource
                     *      transaction
                     *      event
                     */

                    var transaction = command.transaction;
                    if (commitStatus) {
                        transaction.notifyListeners(CallbackConstants.COMMIT, transaction, true);
                        transaction.setIsCommitted(true);
                    } else {
                        transaction.notifyListeners(CallbackConstants.COMMIT, transaction, false);
                        transaction.notifyListeners(CallbackConstants.ERROR, transaction, response[2]);
                        transaction.setIsCommitted(false);
                    }
                };

                responseHandlers[PrivateConstants.TX_IS_COMMITTED] = function (response, command) {
                    /** Response:
                     *       requestType
                     *       Commit Status (T/F)
                     */

                    /** Command Object:
                     *       requestType
                     *       transaction
                     */
                    var transaction = command.transaction;
                    transaction.notifyListeners(CallbackConstants.COMMIT, transaction, response[1]);
                    transaction.setIsCommitted(true);
                };

                responseHandlers[PrivateConstants.CLIENT_CLOSE] = function (response, command) {
                    /** Response:
                     *       clientClosedSession
                     */

                    /** Command Object:
                     *       clientClosedSession
                     */
                    if(command.clientRequest) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(6, "[HTTP Response Factory] Received Client Close Session Response " + describe(response[0]) + " for command " + describe(command));
                        }
                        Transport.stop();
                        parentSession.notifyListeners(CallbackConstants.STOP, parentSession, true);
                    } else {
                        if (Utils.isLoggingEnabled())	{
                            Utils.Logger.log(4, "[HTTP Response Factory] Received Internal Close Session Response " + describe(response[0]) + " for command " + describe(command));
                        }
                        Transport.onError("Internal close session processed for driver reset");
                    }
                };

                function dispatchResponse(response) {
                    /** @namespace response.d */
                    /** @namespace response.r */
                    var responseData = response.d;
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[HTTP Response Factory] Dispatching response " + describe(responseData[0]));
                    }
                    var messageID = responseData[0];

                    if (messageID == PrivateConstants.SESSION_START) {
                        postSessionInitSuccess = false;
                    }

                    if ( !postSessionInitSuccess && messageID !== PrivateConstants.SESSION_START ) {
                        postSessionInitSuccess = true;
                        Transport.setPreferredDriver();
                    }
                    if( messageID === PrivateConstants.EVENT_RECEIVE || messageID === PrivateConstants.PACKET_RECEIVE || messageID === PrivateConstants.SET_RESOURCE_ALIAS ){
                        responseHandlers[messageID](responseData);
                    } else {
                        var command = OutboundEngine.dequeueCommand(response.r);
                        if (command === null && messageID !== PrivateConstants.KEEP_ALIVE) {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(6, "[HTTP Response Factory] Command is null");
                            }
                            return false;
                        }
                        responseHandlers[messageID](responseData, command);
                        if(command !== null && messageID !== PrivateConstants.SESSION_START ){
                            return true;
                        }
                    }
                    return false;
                }

                return {
                    "dispatchResponse":dispatchResponse
                };
            };

            /*
             *  ************************************************************************************
             *  CrossDomainProxy is an XHR, ForeverIFrame and SSE replacement that works via postMessage()
             *    This works in Chrome at the moment but will need minor workarounds for IE8/9.
             *    See:    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
             *            http://stevesouders.com/misc/test-postmessage.php
             *  ************************************************************************************
             */

            function CrossDomainProxy(session, driverName, proxyRealm, initCallback, errorCB) {
                this.session = session;
                this.proxyWin = null;
                this.initialized = false;
                this.initCallback = initCallback;
                this.proxyRealm = proxyRealm;
                this.proxyID = driverName + "_" + new Date().getTime();
                this.proxyURL = proxyRealm + session.getConfig().crossDomainPath + "/crossDomainProxy.html";
                this.proxyIFrame = createIFrame(this.proxyURL +
                    "?proxyID=" + this.proxyID +
                    "&sessionID=" + Utils.generateUniqueID() +
                    "&validOrigins=" + encodeURIComponent(session.getConfig().currentDomain + "," + session.getConfig().realms.join(",")), errorCB);
                this.readyState = 0;
                this.responseText = "";
                this.status = 0;
                postMessageProxies.collection[this.proxyID] = this;
            }

            CrossDomainProxy.prototype.proxyRequest = function (op, arg) {
                if (this.proxyWin === null) this.proxyWin = this.proxyIFrame.contentWindow;
                var tmp = [this.proxyID, op];
                for(var i=0; i< arg.length;i++){
                    tmp.push(arg[i]);
                }

                this.proxyWin.postMessage(JSON.stringify(tmp), this.proxyRealm); // only postMessage to a valid realm
            };

            CrossDomainProxy.prototype.open = function (method, url, asynch) {
                // All requests will be async.
                this.proxyRequest("open", arguments);
            };
            CrossDomainProxy.prototype.send = function () {
                this.proxyRequest("send", arguments);
            };
            CrossDomainProxy.prototype.setRequestHeader = function () {
                this.proxyRequest("setRequestHeader", arguments);
            };
            CrossDomainProxy.prototype.abort = function () {
                this.proxyRequest("abort", arguments);
            };

            CrossDomainProxy.prototype.destroy = function () {
                this.proxyIFrame.src = this.proxyURL + "?expired=" + new Date().getTime();
                delete postMessageProxies.collection[this.proxyID];
                postMessageProxies.collection[this.proxyID] = null;
                this.proxyIFrame = null;
                this.responseText = null;
            };


            /*
             *  ************************************************************************************
             *  FormSubmitter is used by JSONP_LONGPOLL Driver to send commands to the server.
             *  ************************************************************************************
             */

            function FormSubmitter() {
                this.id = Utils.generateUniqueID();
                var containerID = "container" + this.id;

                // Create a DOM Element for storing the script:
                var scriptContainer = document.createElement('div');
                scriptContainer.style.display = 'none';
                scriptContainer.setAttribute('id', containerID);
                document.getElementById(DriverDomObjectsContainerID).appendChild(scriptContainer);
                var isIE = navigator.appName == "Microsoft Internet Explorer";

                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[FormSubmitter] Creating new FormSubmitter: " + this.id);
                }

                this.send = function(url, data){
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(2, "[FormSubmitter] Sending " + url + "?" + data[0] + "&" + data[1]);
                    }
                    cleanNode(scriptContainer,isIE);
                    var form = document.createElement("form");
                    form.style.display = 'none';
                    form.style.position = 'absolute';
                    form.method = 'POST';
                    form.enctype = 'application/x-www-form-urlencoded';
                    form.acceptCharset = "UTF-8";
                    scriptContainer.appendChild(form);
                    var iFrame;
                    try {
                        iFrame = document.createElement('<iframe name="' + this.id + '">');
                    } catch (x) {
                        iFrame = document.createElement('iframe');
                        iFrame.name = this.id;
                    }
                    iFrame.id = this.id;
                    iFrame.style.display = 'none';
                    form.appendChild(iFrame);
                    form.target = this.id;
                    form.action = url + "?" + data[0];
                    try {
                        var components = data[1].split("&");
                        for (var i = 0; i < components.length; i++) {
                            var keyval = components[i].indexOf("=");
                            if (keyval > -1) {
                                var key = components[i].substring(0, keyval);
                                var val = components[i].substring(keyval + 1, components[i].length);
                                var area = document.createElement('textarea');
                                area.name = key;
                                area.value = val;
                                form.appendChild(area);
                            }
                        }
                    } catch (ex) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(2, "[FormSubmitter] Exception: " + ex.message);
                        }
                    }
                    form.submit();
                };

                this.destroy = function () {
                    cleanNode(scriptContainer, isIE);
                    document.getElementById(DriverDomObjectsContainerID).removeChild(scriptContainer);
                };
            }


            /*
             *  ************************************************************************************
             *  JSONP_Poller is used by JSONP_LONGPOLL Driver to receive data from the server.
             *  ************************************************************************************
             */

            function JSONP_Poller(errorCB) {

                this.id = Utils.generateUniqueID();

                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[JSONP_Poller] Creating new longpoller: " + this.id);
                }

                var containerID = "container" + this.id;
                var errorCount = 0;
                // Create a DOM Element for storing the script:
                var scriptContainer = document.createElement('div');
                scriptContainer.style.display = 'none';
                scriptContainer.setAttribute('id', containerID);
                var stopSpam = document.createElement('link');
                stopSpam.setAttribute("rel","shortcut icon");
                stopSpam.setAttribute("href","about:blank");
                scriptContainer.appendChild(stopSpam);
                document.getElementById(DriverDomObjectsContainerID).appendChild(scriptContainer);
                var hasInitialised = false;
                var isIE = navigator.appName == "Microsoft Internet Explorer";

                this.send = function (url, data) {

                    var scriptSrc = url + "?" + data[0] + "&" + data[1];

                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(2, "[JSONP_Poller] Sending " + scriptSrc);
                    }
                    try {
                        if (hasInitialised) {
                            cleanNode(scriptContainer, isIE);
                        }else{
                            hasInitialised = true;
                        }
                        var newScript = document.createElement('script');
                        newScript.type = "text/javascript";
                        newScript.src = scriptSrc;
                        newScript.onerror = errorCB;
                        scriptContainer.appendChild(newScript);
                        errorCount = 0;
                    } catch (ex) {
                            if (errorCount++ == 5) errorCB("[JSONP_Poller] Exception: " + ex.message);
                    }
                };

                this.destroy = function () {
                    cleanNode(scriptContainer, isIE);
                    document.getElementById(DriverDomObjectsContainerID).removeChild(scriptContainer);
                };
            }

            function cleanNode(scriptContainer, isIE){
                if(isIE){
                    while (scriptContainer.hasChildNodes()) {
                        scriptContainer.removeChild(scriptContainer.lastChild);
                    }
                } else{
                    while (scriptContainer.hasChildNodes()) {
                        var tmp = scriptContainer.removeChild(scriptContainer.lastChild);
                        for (var prop in tmp) {
                            delete tmp[prop];
                        }
                    }
                }
            }

            function initXMLHTTP(name) {
                // If IE7, Mozilla, Safari, etc: Use native object
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[initXMLHTTP] for " + name);
                }
                var thisXMLHttp = false;
                if (typeof window.XMLHttpRequest != 'undefined' && window.XMLHttpRequest) {
                    try {
                        thisXMLHttp = new XMLHttpRequest();
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(2, "initXMLHTTP : Constructed XMLHttpRequest for [" + name + "]");
                        }
                        return thisXMLHttp;
                    } catch (anex) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(2, "initXMLHTTP : Error constructing XMLHttpRequest for [" + name + "]. error=" + anex.message);
                        }
                        thisXMLHttp = false;
                    }
                } else if (typeof window.ActiveXObject != 'undefined' && window.ActiveXObject) {
                    // try the activeX control for IE5 and IE6
                    var vers = ["MSXML2.XMLHttp", "Microsoft.XMLHttp", "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0"];
                    for (var a = 0; a < vers.length; a++) {
                        try {
                            thisXMLHttp = new ActiveXObject(vers[a]);
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(2, "initXMLHTTP : Constructed ActiveXObject XMLHttpRequest using [" + vers[a] + "] for [" + name + "]");
                            }
                            return thisXMLHttp;
                        } catch (anotherex) {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(2, "initXMLHTTP : Error constructing ActiveXObject XMLHttpRequest :" + vers[a] + " for [" + name + "]. error=" + anotherex.message);
                            }
                            thisXMLHttp = false;
                        }
                    }
                } else {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(2, "initXMLHTTP : Failed to construct xmlHTTP object for [" + name + "]");
                    }
                    thisXMLHttp = false;
                }
                return thisXMLHttp;
            }


            /*
             *  ************************************************************************************
             *  Instantiate a single, generic listener for messages received via postMessage():
             *  ************************************************************************************
             */

            window.addEventListener("message", function (e) {

                // Is this message intended as a cross domain proxy message?
                if (!isCrossDomainProxyMessage(e.data)){
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(0, "Window received message event that is not intended as cross domain proxy communication.");
                    }
                    return;
                }
                // Do we trust the sender of this message?
                if (!isTrustedPostMessageSender(getCanonicalOrigin(e.origin))) {
                    ListenerManagers[window.Nirvana].notifyListeners(Nirvana.Observe.ERROR, null, // since this message is not associated with any session.
                        new DriverSecurityException("CrossDomainProxy", "PostMessage Event Origin " + e.origin + " does not equal any proxied realm origin " + getPostMessageProxyRealms())
                    );
                    return;
                }

                var dataArray = JSON.parse(e.data);

                var proxyAlias = dataArray[0];
                var action = dataArray[2];

                var XHR = postMessageProxies.collection[proxyAlias];
                if (action == "init" && XHR) {
                    XHR.initialized = true;
                    XHR.initCallback("initialized");
                }

                if (action == "change") {
                    // Check if state change callback exists
                    if(XHR.onreadystatechange) {
                        XHR.responseText = dataArray[3];
                        XHR.readyState = dataArray[4];
                        XHR.status = dataArray[5];
                        XHR.onreadystatechange();
                    }
                }

                if (action == "iframe") {
                    Transport.c(JSON.parse(dataArray[3]));
                }

                if (action == "iFrame_close") { 
                    Transport.onError(action);
                }

                if (action == "sse") {
                    Transport.c(JSON.parse(dataArray[3]));
                }


            }, false);

            /*
             *  ************************************************************************************
             *  Utility functions to support lookup of any postMessageProxy IFrames:
             *  ************************************************************************************
             */

            var postMessageProxies = {
                counter:0,
                collection:{}
            };

            function isTrustedPostMessageSender(origin) {
                origin = origin.toUpperCase();
                for (var proxyAlias in postMessageProxies.collection) {
                    if (postMessageProxies.collection.hasOwnProperty(proxyAlias))
                        if (postMessageProxies.collection[proxyAlias])
                            if (getCanonicalOrigin(postMessageProxies.collection[proxyAlias].proxyRealm).toUpperCase() == origin) return true;
                }
                return false;
            }

            function isCrossDomainProxyMessage(messageData){
                var messageComponents = JSON.parse(messageData);
            
                if (messageComponents.length > 0){

                    var tmp = messageComponents[0];
                    if ((tmp.indexOf('EVENTSOURCE_STREAMING_POSTMESSAGE') != -1) || (tmp.indexOf('XHR_LONGPOLL_POSTMESSAGE') != -1) || 
                        (tmp.indexOf('IFRAME_STREAMING_POSTMESSAGE') != -1)){
                        return true;
                    }   
                }
                return false;
            }

            function getPostMessageProxyRealms() {
                var origins = [];
                for (var proxyAlias in postMessageProxies.collection) {
                    if (postMessageProxies.collection.hasOwnProperty(proxyAlias))
                        if (postMessageProxies.collection[proxyAlias])
                            origins.push(getCanonicalOrigin(postMessageProxies.collection[proxyAlias].proxyRealm));
                }
                return origins.join(",");
            }

            function createIFrame(url, errorCB) {
                var iframe = document.createElement('iframe');
                iframe.id = "iframe" + new Date().getTime();
                iframe.src = url;
                iframe.style.display = 'none';
                iframe.style.position = 'absolute';
                iframe.onerror = errorCB;
                //window.document.body.appendChild(iframe);
                try {
                    document.getElementById(DriverDomObjectsContainerID).appendChild(iframe);
                } catch (ex) {
                    errorCB("IFrame Exception: " + ex.message);
                }
                return iframe;
            }


            function createForeverIFrame(url, onMessageCB, onErrorCB) {
                // This is for same-domain communications only. It is used by the NOXD_IFRAME_STREAMING driver.
                var iFrame;
                if (document.createElement) {
                    var element = document.getElementById("NVLSubFrame");
                    if (element) {
                        element.setAttribute("src", url);
                        iFrame = element;
                    } else {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(2, "Iframe does not exist, so creating new one");
                        }
                        var iframeSubHTML = "<iframe id=\"NVLSubFrame\"";
                        iframeSubHTML += " onload=\"window.parent.errorCB('iframe_connection_closed',";
                        iframeSubHTML += window.ActiveXObject ? true : false;
                        iframeSubHTML += ")\"";
                        iframeSubHTML += " src=\"" + url + "\" style=\"";
                        iframeSubHTML += 'border:1px;';
                        iframeSubHTML += 'width:0px;';
                        iframeSubHTML += 'height:0px;';
                        iframeSubHTML += '"><\/iframe>';

                        if (window.ActiveXObject) {
                            this.htmlfile = new ActiveXObject('htmlfile');
                            this.htmlfile.open();
                            this.htmlfile.write('<html></html>');
                            this.htmlfile.close();

                            // set our various callbacks:
                            this.htmlfile.parentWindow.onMessage = onMessageCB;
                            this.htmlfile.parentWindow.errorCB = onErrorCB;

                            var iframeC = this.htmlfile.createElement('div');
                            this.htmlfile.body.appendChild(iframeC);
                            iframeC.innerHTML += iframeSubHTML;
                            iFrame = this.htmlfile;
                        } else {
                            document.getElementById(DriverDomObjectsContainerID).innerHTML += iframeSubHTML;
                            iFrame = {};
                            iFrame.document = {};
                            iFrame.document.location = {};
                            iFrame.document.location.iframe = document.getElementById('NVLSubFrame');
                            iFrame.document.location.replace = function (location) {
                                this.iframe.src = location;
                            };
                        }
                    }
                }
                return iFrame;
            }

            /**
            *
            *  Base64 encode / decode
            *  http://www.webtoolkit.info/
            *
            **/
            // If possible use the native implementation of b64 encode, as this will be much faster
            var base64Encode;

            var nBase64Encode = function (input, isIntArray) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

                var codeToUTFChar = function (c) {
                    var utftext = "";
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    return utftext;
                };

                var utf8_encode = function (input) {
                    var utftext = "";
                    input = input.replace(/\r\n/g, "\n");
                    for (var n = 0; n < input.length; n++) {
                        var c = input.charCodeAt(n);
                        utftext += codeToUTFChar(c);
                    }
                    return utftext;
                };

                if (!isIntArray) {
                    input = utf8_encode(input);
                }

                while (i < input.length) {
                    if (isIntArray) {
                        chr1 = input[i++];
                        chr2 = input[i++];
                        chr3 = input[i++];
                    } else {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);
                    }
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (i-2===input.length || isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (i-1===input.length || isNaN(chr3)) {
                        enc4 = 64;
                }

                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);

              }
              return output;
            };

            if (typeof btoa === "undefined") {
                base64Encode = nBase64Encode;
            } else {
                base64Encode = function (data, isIntArray) {
                    if (isIntArray) {
                        return nBase64Encode(data, isIntArray);
                    } else {
                        return btoa(data);
                    }
                };
            }

            // if possible use the native implementation of b64 decode, as this will be much faster
            var base64Decode;

            var nBase64Decode = function (input, asIntArray) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            var utf8_decode = function (utftext) {
                var string = "";
                var i = 0;
                var c2 = 0;
                var c3 = 0;
                var c = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                          c2 = utftext.charCodeAt(i + 1);
                          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                          i += 2;
                    } else {
                          c2 = utftext.charCodeAt(i + 1);
                          c3 = utftext.charCodeAt(i + 2);
                          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                          i += 3;
                    }
                }
                return string;
            };

            input = input.replace(/[^A-Za-z0-9\+\/=]/g, "");

            var byteVals = [];
            while (i < input.length) {

                  enc1 = keyStr.indexOf(input.charAt(i++));
                  enc2 = keyStr.indexOf(input.charAt(i++));
                  enc3 = keyStr.indexOf(input.charAt(i++));
                  enc4 = keyStr.indexOf(input.charAt(i++));

                  chr1 = (enc1 << 2) | (enc2 >> 4);
                  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                  chr3 = ((enc3 & 3) << 6) | enc4;

                  output = output + String.fromCharCode(chr1);
                  if (asIntArray) {
                    byteVals.push(chr1);
                  }

                  if (enc3 != 64) {
                      output = output + String.fromCharCode(chr2);
                      if (asIntArray) {
                        byteVals.push(chr2);
                      }
                  }
                  if (enc4 != 64) {
                      output = output + String.fromCharCode(chr3);
                      if (asIntArray) {
                        byteVals.push(chr3);
                      }
                  }
            }

            if (asIntArray) {
                return byteVals;
            } else {
                return utf8_decode(output);
            }

          };

            if (typeof atob === "undefined") {
                base64Decode = nBase64Decode;
            } else {
                base64Decode = function (data, isIntArray) {
                    if (isIntArray) {
                        return nBase64Decode(data, isIntArray);
                    } else {
                        return atob(data);
                    }
                };
            }

            var lastTxID = 0;

            function generateTransactionID() {
                return lastTxID++;
            }

            function generateUniqueID() {
                var S4 = function () {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                };
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            }

            function getOrigin(url) {
                if (url.match(/https?:\/\/[^\/]+/)) {
                    return url.match(/https?:\/\/[^\/]+/)[0];
                } else {
                    return url;
                }
            }

            function getUrlProtocol(url) {
                return url.match(/^([a-z]+):\/\//)[0];
            }

            function getCanonicalOrigin(url) {
                url = getOrigin(url);
                if (!url.match(/:[0-9]+$/)) {
                    if (url.match(/^https:/)) {
                        url += ":443";
                    } else {
                        url += ":80";
                    }
                }
                return url;
            }

            function getCanonicalResourceName(resourceName) {
                resourceName = resourceName.replace(/[^A-Za-z0-9\/_\-#]+/gi, '');
                if (resourceName.match(/^[^\/].*?\//)) {
                    resourceName = "/" + resourceName;
                }

                return resourceName;
            }
            /*
             *
             * The following three functions are used for longs to decide on the format
             *
             */
            var shift32Bits = 4294967296;
            function convertLongFromServer(longType, tmpValue){
                if(tmpValue && Array.isArray(tmpValue)) {
                    if (longType == Nirvana.LongType.LONG_AS_ARRAY) {
                        return tmpValue;
                    }
                    var isNegative = false;
                    var upper = tmpValue[0];
                    var lower = tmpValue[1];

                    if(upper - 0x7FFFFFFF > 0){
                        upper -= 0x80000000;
                        isNegative = true;
                    }
                    if (longType == Nirvana.LongType.LONG_AS_DECIMAL_STRING) {
                        return arrayToDeciamlString(upper, lower, isNegative);
                    } else if (longType == Nirvana.LongType.LONG_AS_HEXADECIMAL_STRING) {
                        return arrayToHexString(upper, lower, isNegative);
                    } else {//Long as Number, we will loose precision past 53 bits
                        var tmp = upper * shift32Bits + lower;
                        if(isNegative){
                            tmp = -tmp;
                        }
                        return tmp;
                    }
                }else{
                    return tmpValue;
                }
            }

            function arrayToHexString(upper, lower, isNegative) {
                var str = lower.toString(16);
                if (upper !== 0) {
                    while (str.length < 8) {
                        str = "0" + str;
                    }
                    str= upper.toString(16) + str;
                }
                if(isNegative){
                    str = "-"+str;
                }
                return str;
            }

            function arrayToDeciamlString(upper, lower, isNegative) {
                if(upper<0){
                    return "-9223372036854775808";
                }
                var str = "";
                var d4, d3, d2, d1, d0, q;
                d0 = lower & 0xFFFF;
                d1 = (lower >> 16) & 0xFFFF;
                if(upper <0){
                    upper = -upper;
                }
                d2 = (upper) & 0xFFFF;
                d3 = (upper >> 16) & 0xFFFF;
                d0 = 656 * d3 + 7296 * d2 + 5536 * d1 + d0;
                q = parseInt(d0 / 10000, 10);
                d0 = d0 % 10000;
                d1 = q + 7671 * d3 + 9496 * d2 + 6 * d1;
                q = parseInt(d1 / 10000, 10);
                d1 = d1 % 10000;
                d2 = q + 4749 * d3 + 42 * d2;
                q = parseInt(d2 / 10000, 10);
                d2 = d2 % 10000;
                d3 = q + 281 * d3;
                q = parseInt(d3 / 10000, 10);
                d3 = d3 % 10000;
                d4 = q;
                if (d4 !== 0) {
                    str += d4.toString();
                }
                if (str.length !== 0) {
                    str += zeroPad(d3);
                } else if (d3 !== 0) {
                    str += d3.toString();
                }
                if (str.length !== 0) {
                    str += zeroPad(d2);
                } else if (d2 !== 0) {
                    str += d2.toString();
                }
                if (str.length !== 0) {
                    str += zeroPad(d1);
                } else if (d1 !== 0) {
                    str += d1.toString();
                }
                if (str.length !== 0) {
                    str += zeroPad(d0);
                } else {
                    str += d0.toString();
                }
                if(isNegative){
                    str = "-"+str;
                }
                return str;
            }
            function zeroPad(number) {
                var ret = "" + number;
                while (ret.length < 4)
                    ret = "0" + ret;
                return ret;
            }

            return {
                "Logger":Logger,
                "Scheduler":Scheduler,
                "isLoggingEnabled":isLoggingEnabled,
                "setDebugLevel":setDebugLevel,
                "HTTPRequestFactory":HTTPRequestFactory,
                "HTTPResponseFactory":HTTPResponseFactory,
                "createIFrame":createIFrame,
                "createForeverIFrame":createForeverIFrame,
                "initXMLHTTP":initXMLHTTP,
                "base64Encode":base64Encode,
                "base64Decode":base64Decode,
                "getCookie":getCookie,
                "setCookie":setCookie,
                "getCanonicalResourceName":getCanonicalResourceName,
                "getCanonicalOrigin":getCanonicalOrigin,
                "getUrlProtocol":getUrlProtocol,
                "generateTransactionID":generateTransactionID,
                "generateUniqueID":generateUniqueID,
                "CrossDomainProxy":CrossDomainProxy,
                "FormSubmitter":FormSubmitter,
                "JSONP_Poller":JSONP_Poller,
                "convertLongFromServer":convertLongFromServer
            };
        }());

        /*
         *  ************************************************************************************
         *  Transport is a private class:
         *  ************************************************************************************
         */

        var Transport = (function () {
            /** @namespace d.isClientSupported() */
            /** @namespace sessionConfig.drivers */
            /** @namespace driver.usesKeepAlive */
            var keepAliveTimeoutID;
            var inRequest = false;
            var resetTimeoutID = null;
            var requestCount = 0;
            var driver;
            var nirvanaCookie = null;
            var currentSession;
            var sessionConfig;
            var hasConnected = false;

            // Values used for Reconnection
            var realmRecoveryAttemptCount = 0;
            var currentDriverFailureCount = 0;
            var currentDriverIndex = 0;
            var currentRealmIndex = 0;
            var lastConnectTime = 0;

            var BACKOFF_INCREMENT_MS = 1000;
            var MAX_DRIVER_FAILURES_BEFORE_CHANGE = 3;
            var MAX_RETRY_DELAY = (Math.floor(Math.random() * 30) + 30) * 1000;

            var keepAliveEveryMs = 60000;

            var reconnectTimeoutID;

            function setPreferredDrivers(userDriverArray, applyUserAgentHeuristicsFlag, usePreviousBestDriverFlag) {
                if (usePreviousBestDriverFlag && preferredDrivers.length) {
                    return;
                }
                if (typeof userDriverArray == "undefined") {
                    preferredDrivers = defaultDrivers;
                } else {
                    var sanitizedDriverArray = [];
                    for (var i = 0; i < userDriverArray.length; i++) {
                        var userDriverName = userDriverArray[i];
                        if (typeof Nirvana.Driver[userDriverName] != "undefined") {
                            sanitizedDriverArray.push(userDriverName);
                        } else {
                            ListenerManagers[window.Nirvana].notifyListeners(Nirvana.Observe.ERROR, currentSession, new InvalidDriverException(userDriverName));
                        }
                    }
                    if (sanitizedDriverArray.length) {
                        preferredDrivers = sanitizedDriverArray;
                    } else {
                        preferredDrivers = defaultDrivers;
                    }
                }
                if (applyUserAgentHeuristicsFlag) {
                    preferredDrivers = applyUserAgentHeuristics(preferredDrivers);
                }
                currentDriverIndex = 0;

                // If the developer wants the client to always start with the "best" driver it used before, then do so:
                if (currentSession.getConfig().rememberDriver) {
                    var rememberedDriver = Utils.getCookie("NirvanaDriver");
                    if (rememberedDriver !== null) {
                        for (var x=0; x < preferredDrivers.length; x++) {
                            if (preferredDrivers[x] == rememberedDriver) {
                                currentDriverIndex = x;
                            }
                        }
                    }
                }

                currentSession.notifyListeners(Nirvana.Observe.DRIVER_CHANGE, currentSession, preferredDrivers[currentDriverIndex]);

            }

            function setPreferredDriver() {
                // When we have a functioning session (not just a successful session init) then we should ALWAYS use this
                // driver in the current browsing session.
                var preferredDriver = Transport.getCurrentDriver();
                preferredDrivers = [preferredDriver];
                currentDriverIndex = 0;
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(7, "[Transport] Settled on preferred driver: " + preferredDriver);
                }
                if (getConfig().rememberDriver) {
                    if (Utils.getCookie("NirvanaDriver") === null) {
                        Utils.setCookie("NirvanaDriver", preferredDriver);
                    }
                }
            }

            function useNextDriver() {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(4, "[Transport] Remaining drivers: " + preferredDrivers.join());
                }
                if (preferredDrivers.length > 1) {
                    currentDriverIndex = (currentDriverIndex + 1) % preferredDrivers.length;
                    if (currentDriverIndex > 0 || sessionConfig.realms.length === 1) {
                        currentSession.notifyListeners(Nirvana.Observe.DRIVER_CHANGE, currentSession, preferredDrivers[currentDriverIndex]);
                    }
                    currentDriverFailureCount = 0;
                }
                // if all drivers have failed for this realm we need to switch to another realm if one is available:
                if (currentDriverIndex === 0) {
                    useNextRealm();
                }
            }

            function useNextRealm() {
                var newIndex = (currentRealmIndex+1) % sessionConfig.realms.length;
                if(currentRealmIndex != newIndex) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(6, "[Transport] Moving to another realm: " + sessionConfig.realms[newIndex]);
                    }
                    currentRealmIndex = newIndex;
                    currentSession.notifyListeners(Nirvana.Observe.REALM_CHANGE, currentSession, sessionConfig.realms[currentRealmIndex]);
                    currentDriverFailureCount = 0;
                    setPreferredDrivers(currentSession.getConfig().drivers, sessionConfig.applyUserAgentHeuristics, false);
                }
            }

            function initializeDriver() {
                if (preferredDrivers.length) {
                    var d = Drivers.createDriver(preferredDrivers[currentDriverIndex]);
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(6, "[Transport] Attempting to use Driver: " + d.name);
                    }
                    if (!d.isClientSupported()) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(7, "[Transport] Driver not supported: " + d.name);
                        }
                        preferredDrivers.splice(currentDriverIndex, 1);
                        if (preferredDrivers.length <= currentDriverIndex) currentDriverIndex = 0;
                        currentSession.notifyListeners(Nirvana.Observe.DRIVER_CHANGE, currentSession, preferredDrivers[currentDriverIndex]);
                        return initializeDriver();
                    } else {
                        return d;
                    }
                } else {
                    return null;
                }
            }

            function supportsDriver(driverName) {
                return Drivers.createDriver(driverName).isClientSupported();
            }

            function applyUserAgentHeuristics(driverArray) {

                // This optional logic disables drivers in browsers that have bugs around which we cannot work.

                function disableDriver(driver) {
                    var i = driverArray.indexOf(driver);
                    if (i > -1) {
                        driverArray.splice(i,1);
                    }
                }

                function ieVersion() {
                    var uaStr = navigator.userAgent.toLowerCase();
                    return (uaStr.indexOf('msie') != -1) ? parseInt(uaStr.split('msie')[1], 10) : false;
                }
                // IE9 leaks memory when using script tag deletion OR replacement:
                if (ieVersion() == 9) {
                    disableDriver(Drivers.Names.JSONP_LONGPOLL);
                }

                return driverArray;

            }

            function setUp(session, usePreviousBestDriverFlag) {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(6, "[Transport] Setting Up");
                }
                currentSession = session;
                sessionConfig = session.getConfig();
                setPreferredDrivers(sessionConfig.drivers, sessionConfig.applyUserAgentHeuristics, usePreviousBestDriverFlag);
            }

            function open() {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(6, "[Transport] Opening Driver to " + sessionConfig.realms[currentRealmIndex]);
                }
                currentSession.setLongPollRequestID(-1);
                driver = Transport.initializeDriver();
                if (driver !== null) {
                    scheduleReset("driver.open",sessionConfig.openDriverTimeout); // in case driver does not open.
                    driver.open();
                } else {
                    var nvde = new NoValidDriversException(sessionConfig.drivers);
                    currentSession.notifyListeners(Nirvana.Observe.ERROR, currentSession, nvde);
                    ListenerManagers[window.Nirvana].notifyListeners(Nirvana.Observe.ERROR, currentSession, nvde);
                }
            }

            function tearDown() {
                hasConnected = false;
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(6, "[Transport] Tearing Down Driver");
                }
                if (driver !== null) {
                    OutboundEngine.setReady(false);
                    clearTimeout(keepAliveTimeoutID); // Since the next driver may not support keep alive.
                    cancelScheduledReset();
                    driver.close();
                    driver = null;

                    // Need to ensure that we only notify the listener once
                    if (currentSession.getStatus() === Statuses.CONNECTED) {
                        currentSession.notifyListeners(Nirvana.Observe.DISCONNECT, currentSession, "Session Disconnected");
                    }
                }
            }

            function getCurrentDriver() {
                return preferredDrivers[currentDriverIndex];
            }

            function getCurrentRealm() {
                return sessionConfig.realms[currentRealmIndex];
            }

            function getCurrentSession() {
                return currentSession;
            }

            function getConfig() {
                return sessionConfig;
            }

            function getRequestCountIncrement() {
                requestCount++;
                return requestCount;
            }

            function stop() {
                tearDown();
                requestCount = 0;
            }

            function getNirvanaCookie() {
                return nirvanaCookie;
            }

            function onConnect(nirvanaCookieIn) {
                nirvanaCookie = nirvanaCookieIn;
                currentDriverFailureCount = 0;
                realmRecoveryAttemptCount = 0;
                lastConnectTime = new Date();
                hasConnected =true;
            }

            function isConnected(){
                return hasConnected;
            }

            function onOpen() {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(4, "[Transport] Received Driver OnOpen Callback");
                }
                if (currentSession.getStatus() == Statuses.CONNECTING) {
                    OutboundEngine.resetMessagesOnQueue();
                }
                OutboundEngine.setReady(true);
            }

            function onError(errorMsg) {
                // This gets invoked when a driver closes itself after a failure. Note this happens on an explicit session close too (thus not an error on this case)
                currentDriverFailureCount++;
                OutboundEngine.setReady(false);
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(4, "[Transport] Received Driver OnError Callback with error: " + errorMsg);
                }
                if (currentSession.getStatus() === Statuses.STOPPED) {
                    tearDown();
                } else {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[Transport] Driver failure count: " + currentDriverFailureCount);
                    }
                    if (currentDriverFailureCount >= MAX_DRIVER_FAILURES_BEFORE_CHANGE) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(3, "[Transport] Driver failure reached maximum permitted count: " + MAX_DRIVER_FAILURES_BEFORE_CHANGE);
                        }
                        useNextDriver();
                    }
                    resetSession("Driver Error: " + errorMsg);
                }
            }

            function onClose() {
                // This gets invoked when we explicitly call close() on a driver.
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(6, "[Transport] Received Driver OnClose Callback");
                }
            }

            function cancelScheduledReset() {
                if (resetTimeoutID !== undefined && resetTimeoutID !== null) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(2, "[Transport] Clearing Scheduler resetTimeoutID : " + resetTimeoutID);
                    }
                    Utils.Scheduler.cancel(resetTimeoutID);
                    resetTimeoutID = null;
                }
            }

            function scheduleReset(request, timeout) {
                cancelScheduledReset();
                resetTimeoutID = Utils.Scheduler.schedule(function () {
                    onError("Request Timed Out, " + request);
                }, timeout);
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[Transport] Setting Scheduler resetTimeoutID  : " + resetTimeoutID + " for request: " + request);
                }
            }

            function send(command) {
                if(driver === null){
                    return;
                }
                inRequest = true;
                var request = currentSession.requestFactory.buildRequest(command);
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(3, "[Transport] Sending request number " + command.requestID + " of " + requestCount + " for " + describe(command.requestType) + " " + request);
                }
                if (driver && driver.usesKeepAlive()) {
                    scheduleKeepAlive(command.session);
                }
                scheduleReset(request,sessionConfig.sendResponseTimeout);
                driver.send(command, request);
            }

            function receive(data) {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[Transport] Receiving Data: " + JSON.stringify(data));
                }
                cancelScheduledReset();
                inRequest = false;
                var check = false;
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        if(currentSession.responseFactory.dispatchResponse(data[i])){
                            check = true;
                            if ((data[i].d)[0] == PrivateConstants.CLIENT_CLOSE) {
                                return check;
                            }
                        }
                    }
                }
                return check;
            }

            function receiveJSON(data) {
                if(data.length>0){
                    return receive(JSON.parse(data));
                }
                return false;
            }

            function scheduleKeepAlive(session) {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[Transport] (Re)Scheduling KeepAlive to occur in " + keepAliveEveryMs + " ms");
                }
                clearTimeout(keepAliveTimeoutID);
                keepAliveTimeoutID = setTimeout(function () {
                    sendKeepAlive(session);
                }, keepAliveEveryMs);
            }

            function sendKeepAlive(session) {
                if (inRequest) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(2, "[Transport] Currently inRequest.");
                    }
                    scheduleKeepAlive(session);
                } else {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(3, "[Transport] Sending KeepAlive");
                    }
                    OutboundEngine.prioritizeCommand({
                        "requestType":PrivateConstants.KEEP_ALIVE,
                        "session":session
                    });
                }
            }

            function resetSession(reason) {
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(7, "[Transport] Resetting the Session. Reason: " + reason);
                }
                tearDown(); // tearDown the driver and notify client of disconnect
                /**
                 * We decide what we must do to reset the session based on the reconnection state we are in
                 *      - If we have not connected yet before we will cycle drivers (State = CONNECTING)
                 *      - If we have connected before with a driver we keep trying to connect (State = CONNECTED or State = RECONNECTING)
                 *      - If this is the first reconnection attempt (State = RECONNECTING), we queue a new init command
                 *      - If we cannot connect X times to a realm we cycle the realm
                 */
                var sessionStatus = currentSession.getStatus();

                var delayFor;

                // If we have more than one realm, then delayFor shall be kept small so that we rapidly failover to the next realm.
                // Only if we have a single realm shall delayFor be increased when necessary.

                if (sessionConfig.realms.length > 1) {
                    delayFor = BACKOFF_INCREMENT_MS * currentDriverFailureCount;
                } else {
                    delayFor = Math.min(MAX_RETRY_DELAY, BACKOFF_INCREMENT_MS * realmRecoveryAttemptCount);
                }

                // We only queue the command on the first reconnection request
                if (currentSession.getStatus() === Statuses.CONNECTED) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(4, "[Transport] Adding Restart Request to Outbound Engine");
                    }
                    if(lastConnectTime+10000 < new Date()){
                        realmRecoveryAttemptCount = 0; // Reset recovery count here as its the first time we are recovering since disconnection
                    }
                    currentSession.setStatus(Statuses.RECONNECTING);

                    // Build resubscribe command and push to the front
                    var subscribedResources = [];
                    var resources = currentSession.getResources();
                    var resourceLength = resources.length;
                    for (var i = 0; i < resourceLength; i++) {
                        if (resources[i].isSubscribed()) {
                            subscribedResources.push(resources[i]);
                        }
                    }
                    if (subscribedResources.length > 0) {
                        var subscribeCommand = {
                            "requestType":PrivateConstants.BATCH_SUBSCRIBE,
                            "session":currentSession,
                            "resources":subscribedResources,
                            "resubscribe":true
                        };
                        OutboundEngine.prioritizeCommand(subscribeCommand);
                    }

                    // Build init command and push to the front
                    var initCommand = {
                        "requestType":PrivateConstants.SESSION_START,
                        "session":currentSession,
                        "reconnect":true
                    };
                    OutboundEngine.prioritizeCommand(initCommand);
                    OutboundEngine.resetMessagesOnQueue();

                }

                if (currentSession.getStatus() === Statuses.RECONNECTING || currentSession.getStatus() === Statuses.CONNECTING) {
                    realmRecoveryAttemptCount++;
                    var queuedCommandCheck = OutboundEngine.peek();
                    if (queuedCommandCheck === null || queuedCommandCheck === undefined || queuedCommandCheck.requestType !== PrivateConstants.SESSION_START) {
                        OutboundEngine.prioritizeCommand({
                            "requestType":PrivateConstants.SESSION_START,
                            "session":currentSession,
                            "reconnect": currentSession.getStatus() == Statuses.RECONNECTING
                        });
                    }
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(6, "[Transport] Recreating Driver to " + currentSession.getStatus() + ". Delaying open() for " + delayFor + "ms");
                    }

                    if(reconnectTimeoutID) {
                        clearTimeout(reconnectTimeoutID);
                    }
                    reconnectTimeoutID = setTimeout(open, delayFor); // recreate the driver which will trigger the outbound engine and send the init request
                }

            }

            var Drivers = (function () {

                var Names = {
                    "WEBSOCKET":"WEBSOCKET",
                    "XHR_STREAMING_CORS":"XHR_STREAMING_CORS",
                    "IFRAME_STREAMING_POSTMESSAGE":"IFRAME_STREAMING_POSTMESSAGE",
                    "EVENTSOURCE_STREAMING_POSTMESSAGE":"EVENTSOURCE_STREAMING_POSTMESSAGE",
                    "XHR_LONGPOLL_CORS":"XHR_LONGPOLL_CORS",
                    "XHR_LONGPOLL_POSTMESSAGE":"XHR_LONGPOLL_POSTMESSAGE",
                    "JSONP_LONGPOLL":"JSONP_LONGPOLL",
                    "NOXD_IFRAME_STREAMING":"NOXD_IFRAME_STREAMING"
                };

                var WireProtocols = {
                    "WEBSOCKET":"nws",
                    "XHR_STREAMING_CORS":"ncc",
                    "IFRAME_STREAMING_POSTMESSAGE":"nsc",
                    "EVENTSOURCE_STREAMING_POSTMESSAGE":"nsse",
                    "XHR_LONGPOLL_CORS":"nlpc",
                    "XHR_LONGPOLL_POSTMESSAGE":"nlp",
                    "JSONP_LONGPOLL":"nlpj",
                    "NOXD_IFRAME_STREAMING":"nsc"
                };

                function createDriver(name) {
                    return new DriverImplementations[name](name);
                }

                var DriverImplementations = {};

                /*
                 *  ************************************************************************************
                 *  WEBSOCKET Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.WEBSOCKET] = function (driverName) {

                    var isClosed = true;
                    var currentSocket;
                    this.name = driverName;

                    this.isClientSupported = function () {
                        return ("WebSocket" in window || "MozWebSocket" in window);
                    };

                    this.usesKeepAlive = function () {
                        return true;
                    };

                    this.open = function () {
                        isClosed = false;

                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }

                        // Location manipulation for URL
                        var wsurl;
                        var loc = document.createElement('a'); // try Utils.getUrlProtocol(Transport.getCurrentRealm())
                        loc.href = Transport.getCurrentRealm();
                        if (loc.protocol === "http:") {
                            wsurl = "ws://" + loc.host;
                        } else {
                            wsurl = "wss://" + loc.host;
                        }
                        wsurl += "/sv/ws";

                        // Check to instantiate correct websocket driver...
                        if ("WebSocket" in window) {
                            currentSocket = new WebSocket(wsurl);
                        } else if ("MozWebSocket" in window) {
                            currentSocket = new MozWebSocket(wsurl);
                        } else {
                            return false;
                        }

                        var onErrorClose = function (parameter) {
                            if (isClosed) {
                                Transport.onClose();
                            } else {
                                var parameterInfo = parameter;
                                if (parameter.code) {
                                    parameterInfo += " Error Code : " + parameter.code;
                                }
                                if (parameter.reason) {
                                    parameterInfo += " Reason : " + parameter.reason;
                                }
                                Transport.onError(parameterInfo);
                            }
                        };

                        // Assign callbacks up to transport layer
                        currentSocket.onopen = Transport.onOpen;
                        currentSocket.onclose = onErrorClose;
                        currentSocket.onerror = onErrorClose;
                        currentSocket.onmessage = function (messageEvent) {
                            if (messageEvent.data) {
                                Transport.d(messageEvent.data);
                            }
                        };
                    };

                    this.send = function (command, data) {
                        currentSocket.send(data[0] + "&" + data[1]);
                        if(Transport.isConnected()){
                            OutboundEngine.setReady(true);
                        }
                    };

                    this.close = function () {
                        isClosed = true;
                        currentSocket.close();
                    };
                };


                /*
                 *  ************************************************************************************
                 *  XHR_STREAMING_CORS Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.XHR_STREAMING_CORS] = function (driverName) {

                    this.name = driverName;

                    var receiver, sender, rname = null;
                    var currentChunkPosition = 2000;
                    var isClosed = false;
                    var maxStreamLength = Transport.getCurrentSession().getConfig().maxStreamLengthStreamingCors;

                    this.isClientSupported = function () {
                        return (( !!window.XMLHttpRequest) && typeof (new XMLHttpRequest()).withCredentials != "undefined");
                    };

                    this.usesKeepAlive = function () {
                        return true;
                    };

                    this.open = function () {
                        var isClosingDown = false;
                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }

                        rname = Transport.getCurrentRealm() + "/sv/nvLite";

                        receiver = new XMLHttpRequest();
                        receiver.onreadystatechange = function () {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + " Receiver] " + this.readyState + " : CumulativeResponseLength=" + this.responseText.length);
                            }
                            if (this.readyState == 3) {
                                currentChunkPosition = DriverUtils.processResponseChunk(this.responseText, currentChunkPosition);
                                if(this.responseText.length >= maxStreamLength && !isClosingDown){
                                    isClosingDown = true;
                                    if (Utils.isLoggingEnabled()) {
                                        Utils.Logger.log(4, "[" + driverName + " Receiver] Reached max stream length "+maxStreamLength+", resetting.");
                                    }
                                    OutboundEngine.prioritizeCommand({"requestType":PrivateConstants.CLIENT_CLOSE, "clientRequest":false});
                                }
                            } else if (this.readyState == 4 && !isClosingDown) {
                                Transport.onError("Receiver Connection Closed = " + this.status);
                            }
                        };

                        sender = new XMLHttpRequest();
                        sender.onreadystatechange = function () {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + " Sender] " + this.readyState + " : CumulativeResponseLength=" + this.responseText.length);
                            }
                            if (this.readyState == 4 && this.status != 200) {
                                Transport.onError("Sender Connection Status = " + this.status);
                            } else if (this.readyState > 3) {
                                Transport.c(this.responseText);
                                OutboundEngine.setReady(true);
                            }
                        };
                        Transport.onOpen();
                    };

                    this.send = function (command, data) {
                        if(!isClosed){
                            if (command.requestType === PrivateConstants.SESSION_START) {
                                receiver.open("GET", rname + "?" + data[0]);
                                receiver.withCredentials = true;
                                receiver.send();
                            } else {
                                sender.open("POST", rname + "?" + data[0]);
                                sender.withCredentials = true;
                                sender.setRequestHeader("Content-Type", "text/plain");
                                sender.send(data[1]);
                            }
                        }
                    };

                    this.close = function () {
                        if (!isClosed) {
                            isClosed = true;
                            receiver.abort();
                            receiver = null;
                            sender.abort();
                            sender = null;
                            Transport.onClose();
                        }
                    };

                };

                /*
                 *  ************************************************************************************
                 *  IFRAME_STREAMING_POSTMESSAGE Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.IFRAME_STREAMING_POSTMESSAGE] = function (driverName) {

                    this.name = driverName;

                    var receiver, sender, rname = null;
                    var isOpened=false;

                    this.isClientSupported = function () {
                        var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
                        return ((typeof window.postMessage === 'function' || typeof window.postMessage === 'object') && (!konqueror));
                    };

                    this.usesKeepAlive = function () {
                        return true;
                    };

                    this.open = function () {

                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }

                        rname = Transport.getCurrentRealm() + "/sv/nvLite";
                        OutboundEngine.setReady(false);
                        receiver = sender = new Utils.CrossDomainProxy(Transport.getCurrentSession(), this.name, Transport.getCurrentRealm(), opened, Transport.onError);
                        sender.onreadystatechange = function () {
                            // This gets called after sending a command, but this.responseText should be empty as server sends data down iframe instead:
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + " Sender] " + this.readyState + " : " + this.responseText);
                            }
                            if (this.readyState == 4 ){
                                if(this.status != 200){
                                    Transport.onError(driverName + " sender status " + this.status);
                                }else{
                                    if(isOpened){
                                        OutboundEngine.setReady(true);
                                    }
                                }
                            }
                        };

                    };

                    function opened(){
                        isOpened=true;
                        Transport.onOpen();
                    }

                    function connectStreamingReceiver(data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + " Receiver] " + Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data);
                        }
                        receiver.proxyRequest("createForeverIFrame", [Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data]);
                    }

                    function sendCommand(command, data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + " Sender] " + Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data);
                        }
                        sender.open("POST", rname + "?" + data[0]);
                        sender.send(data[1]);
                    }

                    this.send = function (command, data) {
                        if(command.requestType === PrivateConstants.SESSION_START){
                            connectStreamingReceiver(data[0] + "&" + data[1]);
                        }else{
                         sendCommand(command, data);
                        }
                    };

                    this.close = function () {
                        isOpened=false;
                        sender.abort();
                        receiver.destroy();
                        sender = null;
                        receiver = null;
                        Transport.onClose();
                    };
                };

                /*
                 *  ************************************************************************************
                 *  EVENTSOURCE_STREAMING_POSTMESSAGE Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.EVENTSOURCE_STREAMING_POSTMESSAGE] = function (driverName) {

                    this.name = driverName;

                    var self = this;

                    var receiver, sender = null;

                    this.isClientSupported = function () {
                        //return false; // alpha
                        if (!("EventSource" in window)) return false;
                        var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
                        return ((typeof window.postMessage === 'function' || typeof window.postMessage === 'object') && (!konqueror));
                    };

                    this.usesKeepAlive = function () {
                        return true;
                    };

                    this.open = function () {

                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }

                        receiver = sender = new Utils.CrossDomainProxy(Transport.getCurrentSession(), this.name, Transport.getCurrentRealm(), Transport.onOpen, Transport.onError);

                        sender.onreadystatechange = function () {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + " Sender] " + this.readyState + " : " + this.responseText);
                            }
                            if (this.readyState == 4 ){
                                if(this.status != 200){
                                    Transport.onError(driverName + " sender status " + this.status);
                                }else{
                                    OutboundEngine.setReady(true);
                                }
                            }
                        };

                    };

                    function connectStreamingReceiver(data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + " Receiver] " + Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data);
                        }
                        receiver.proxyRequest("createEventSource", Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data);
                        self.send = sendCommand;
                    }

                    function sendCommand(command, data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + " Sender] " + Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data);
                        }
                        sender.open("POST", Transport.getCurrentRealm() + "/sv/nvLite" + "?" + data[0], true);
                        sender.send(data[1]);
                    }

                    this.send = function (command, data) {
                        connectStreamingReceiver(data[0] + "&" + data[1]);
                    };

                    this.close = function () {
                        sender.abort();
                        sender = null;
                        receiver = null;
                        Transport.onClose();
                    };

                };

                /*
                 *  ************************************************************************************
                 *  XHR_LONGPOLL_CORS Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.XHR_LONGPOLL_CORS] = function (driverName) {

                    this.name = driverName;

                    var receiver, sender, rName = null;
                    var isClosed = false;

                    this.isClientSupported = function () {
                        return (( !!window.XMLHttpRequest) && typeof (new XMLHttpRequest()).withCredentials != "undefined");
                    };

                    this.usesKeepAlive = function () {
                        return false;
                    };

                    this.open = function () {

                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }

                        rName = Transport.getCurrentRealm() + "/sv/nvLite";

                        receiver = new XMLHttpRequest();
                        receiver.onreadystatechange = function () {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + "] receiver (" + this.readyState + ") : " + this.responseText);
                            }
                            if (this.readyState == 4) {
                                if (this.status != 200) {
                                    Transport.onError(driverName + " receiver status " + this.status);
                                } else {
                                    Transport.d(this.responseText);
                                    if(!isClosed){
                                        setTimeout(DriverUtils.longpoll, 0);
                                    }  // for firefox 3.6
                                }
                            }
                        };

                        sender = new XMLHttpRequest();
                        sender.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                if (this.status != 200) {
                                    Transport.onError(driverName + " sender status " + this.status);
                                } else {
                                    if (this.responseText){
                                        Transport.d(this.responseText);
                                        if(!isClosed){
                                            DriverUtils.longpoll();
                                        }
                                    }
                                    OutboundEngine.setReady(true);
                                }
                            }
                        };

                        Transport.onOpen();
                    };

                    this.send = function (command, data) {
                        if(!isClosed){
                            if (command.requestType === PrivateConstants.KEEP_ALIVE || command.requestType === PrivateConstants.SESSION_START) {
                                receiver.open("GET", rName + "?" + data[0] + "&" + data[1]);
                                receiver.withCredentials = true;
                                receiver.send();
                            } else {
                                sender.open("POST", rName + "?" + data[0]);
                                sender.withCredentials = true;
                                sender.setRequestHeader("Content-Type", "text/plain");
                                sender.send(data[1]);
                            }
                        }
                    };

                    this.close = function () {
                        if (!isClosed) {
                            isClosed = true;
                            DriverUtils.cancelLongpollTimeout();
                            try {
                                receiver.onreadystatechange = null;
                                sender.onreadystatechange = null;
                                receiver.abort();
                                sender.abort();
                            } catch (ex) {
                                if (Utils.isLoggingEnabled()) {
                                    Utils.Logger.log(1, "[" + driverName + "] exception on close(): " + ex.message);
                                }
                            }
                            receiver = null;
                            sender = null;
                            Transport.onClose();
                        }
                    };

                };

                /*
                 *  ************************************************************************************
                 *  XHR_LONGPOLL_POSTMESSAGE Driver
                 *  For browsers that don't support CORS, but do support XHR and postMessage().
                 *  ************************************************************************************
                 */


                DriverImplementations[Names.XHR_LONGPOLL_POSTMESSAGE] = function (driverName) {

                    this.name = driverName;

                    var receiver, sender, rname = null;
                    var isClosed = false;

                    this.isClientSupported = function () {
                        var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
                        return ((typeof window.postMessage === 'function' || typeof window.postMessage === 'object') && (!konqueror));
                    };

                    this.usesKeepAlive = function () {
                        return false;
                    };


                    this.open = function () {

                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }

                        rname = Transport.getCurrentRealm() + "/sv/nvLite";

                        receiver = new Utils.CrossDomainProxy(Transport.getCurrentSession(), driverName, Transport.getCurrentRealm(), notifyTransportOpenWhenReady, Transport.onError);
                        receiver.onreadystatechange = function () {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + "] receiver: (" + this.readyState + ") : " + this.responseText);
                            }
                            if (this.readyState == 4) {
                                if (this.status != 200) {
                                    Transport.onError(driverName + " receiver status " + this.status);
                                } else {
                                    Transport.d(this.responseText);
                                    if(!isClosed){
                                        DriverUtils.longpoll();
                                    }
                                }
                            }
                        };

                        sender = new Utils.CrossDomainProxy(Transport.getCurrentSession(), driverName, Transport.getCurrentRealm(), notifyTransportOpenWhenReady, Transport.onError);
                        sender.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                if (this.status != 200) {
                                    Transport.onError(driverName + " sender status " + this.status);
                                } else {
                                    if (this.responseText){
                                        Transport.d(this.responseText);
                                        if(!isClosed){
                                            DriverUtils.longpoll();
                                        }
                                    }
                                    OutboundEngine.setReady(true);
                                }
                            }
                        };

                        function notifyTransportOpenWhenReady() {
                            if (!!receiver && !!sender && receiver.initialized && sender.initialized) {
                                Transport.onOpen();
                            }
                        }

                    };

                    this.send = function (command, data) {
                        if(!isClosed){
                            if (command.requestType === PrivateConstants.KEEP_ALIVE) {
                                if (Utils.isLoggingEnabled()) {
                                    Utils.Logger.log(1, "[" + driverName + "] receiver requesting: " + data);
                                }
                                receiver.open("GET", rname + "?" + data[0]);
                                receiver.send();
                            } else {
                                if (Utils.isLoggingEnabled()) {
                                    Utils.Logger.log(1, "[" + driverName + "] sender requesting: " + data);
                                }
                                sender.open("POST", rname + "?" + data[0]);
                                sender.send(data[1]);
                            }
                        }
                    };

                    this.close = function () {
                        if (!isClosed) {
                            isClosed = true;
                            DriverUtils.cancelLongpollTimeout();
                            receiver.onreadystatechange = null;
                            sender.onreadystatechange = null;
                            receiver.abort();
                            sender.abort();
                            receiver = null;
                            sender = null;
                            Transport.onClose();
                        }
                    };

                };

                /*
                 *  ************************************************************************************
                 *  JSONP_LONGPOLL Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.JSONP_LONGPOLL] = function (driverName) {

                    this.name = driverName;

                    var receiver, sender, rname = null;
                    var isClosed = false;

                    this.id = Utils.generateUniqueID();

                    this.isClientSupported = function () {
                        // "All" clients "should" support this basic driver.
                        return true;
                    };

                    this.usesKeepAlive = function () {
                        return false;
                    };

                    function receiverResponseHandler(data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + "] receiverResponseHandler: " + data);
                        }
                        if(Transport.c(data)){
                            if(Transport.isConnected()){
                                OutboundEngine.setReady(true);
                            }
                        }
                        if(!isClosed){
                            DriverUtils.longpoll();
                        }
                    }

                    this.open = function () {
                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }
                        rname = Transport.getCurrentRealm() + "/sv/nvLite";
                        window.LPReadyStateCB = receiverResponseHandler;
                        receiver = new Utils.JSONP_Poller(Transport.onError);
                        sender = new Utils.FormSubmitter();
                        Transport.onOpen();
                    };

                    this.send = function (command, data) {
                        if(!isClosed){
                            if (command.requestType === PrivateConstants.KEEP_ALIVE || command.requestType === PrivateConstants.SESSION_START) {
                                if (Utils.isLoggingEnabled()) {
                                    Utils.Logger.log(1, "[" + driverName + "] Receiver Req: " + data[0]);
                                }
                                receiver.send(rname, data);
                            } else {
                                if (Utils.isLoggingEnabled()) {
                                    Utils.Logger.log(1, "[" + driverName + "] Sender Req: " + data[0] + "&" + data[1]);
                                }
                                sender.send(rname, data);
                            }
                        }
                    };

                    this.close = function () {
                        if (!isClosed) {
                            isClosed = true;
                            DriverUtils.cancelLongpollTimeout();
                            receiver.destroy();
                            receiver = null;
                            sender.destroy();
                            sender = null;
                            window.LPReadyStateCB = function(){};
                            Transport.onClose();
                        }
                    };

                };


    /*
                 *  ************************************************************************************
                 *  NOXD_IFRAME_STREAMING Driver
                 *  ************************************************************************************
                 */

                DriverImplementations[Names.NOXD_IFRAME_STREAMING] = function (driverName) {

                    this.name = driverName;
                    var self = this;
                    var receiver, sender, rname = null;
                    var errorCountXHR = 0;
                    var isClosed = false;

                    this.isClientSupported = function () {
                        if (!currentSession) {
                            return true;
                        }
                        var realms = currentSession.getConfig().realms;
                        var realmLength = realms.length;
                        var host = location.host;
                        var rexp = new RegExp("https?://" + host + "/?");
                        for (var i = 0; i < realmLength; i++) {
                            var realm = Utils.getCanonicalOrigin(realms[i]);
                            if (rexp.test(realm)) {
                                return true;
                            }
                        }
                        return false;
                    };

                    this.usesKeepAlive = function () {
                        return true;
                    };

                    function receiverCB(data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + "] receiverCB: " + typeof data + " " + data);
                        }
                        if (data) {
                            Transport.c(data);
                        }
                    }

                    function senderCB(data) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + "] senderCB: " + typeof data + " " + data);
                        }
                        if (data) {
                            Transport.d(data);
                        }
                        OutboundEngine.setReady(true);
                    }

                    function errorCB(error, htmlfileWasUsed){
                        Transport.onError(error);
                    }

                    function connectStreamingReceiver(data) {
                        receiver = Utils.createForeverIFrame(rname + "?" + data, receiverCB, errorCB);
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + " Receiver] " + rname + "?" + data);
                        }
                        self.send = sendRequest;
                    }

                    function sendRequest(command, data) {
                        if(!isClosed){
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + " Sender] " + rname + "?" + data);
                            }
                            var asyncFlag = (command.requestType === PrivateConstants.CLIENT_CLOSE);
                            sender.open("POST", rname + "?" + data[0], asyncFlag);
                            sender.onreadystatechange = readyStateCB;
                            sender.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            try {
                                if (Utils.isLoggingEnabled()) {
                                    Utils.Logger.log(1, "[" + driverName + "] XHR POST: " + data);
                                }
                                sender.send(data[1]);
                                return true;
                            } catch (ex) {
                                return false;
                            }
                        }
                    }

                    function readyStateCB() {
                        if (sender === null) {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + "] statechangecb: Sender is already null");
                            }
                            return;
                        }
                        var thisStateChange = sender.readyState;
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driverName + "] statechangecb: State now changed to " + thisStateChange);
                        }
                        if (thisStateChange !== 4) {
                            return;
                        }
                        // Some gecko browsers throw an exception on accessing the status code
                        var statusCode;
                        try {
                            statusCode = sender.status;
                        } catch (error) {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + "] statechangecb : failed to read status code");
                            }
                        }
                        if (statusCode === 200 || statusCode === 0) {
                            senderCB(sender.responseText);
                        } else {
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(1, "[" + driverName + "] statechangecb - status of " + statusCode + " forcing session reset");
                            }
                            errorCountXHR++;
                            Transport.onError("Error transports has been closed");
                        }
                        var tmp = document.getElementById('NVLSubFrame');
                        if (tmp) {
                            while (tmp.hasChildNodes()) {
                                tmp.removeChild(tmp.lastChild);
                            }
                        }
                    }


                    this.open = function () {
                        if (!this.isClientSupported()) {
                            Transport.onError(this.name + " driver not supported by client");
                            return;
                        }
                        rname = Transport.getCurrentRealm() + "/sv/nvLite";
                        sender = Utils.initXMLHTTP("xmlhttp");
                        sender.onreadystatechange = readyStateCB;
                        window.onMessage = receiverCB;
                        window.errorCB = errorCB;
                        Transport.onOpen();
                        return true;
                    };

                    this.send = function (command, data) {
                        connectStreamingReceiver(data[0] + "&" + data[1]);
                    };

                    this.close = function () {
                        if(!isClosed) {
                            isClosed = true;
                            window.onMessage = function(){};
                            window.errorCB = function(){};
                            sender.onreadystatechange=function(){};
                            sender.abort();
                            if(receiver.close){
                                receiver.close();
                            }
                            sender = null;
                            receiver = null;
                            Transport.onClose();
                        }
                    };
                };


                /*
                 *  ************************************************************************************
                 *  Utility functions used by various drivers:
                 *  ************************************************************************************
                 */

                var DriverUtils = (function () {

                    // Functions for invoking longpolls:
                    var longpollTimeoutID = null;

                    function longpoll() {
                        if(driver === null){
                            cancelLongpollTimeout();
                            return;
                        }
                        cancelLongpollTimeout();
                        var command = {
                            "requestType":PrivateConstants.KEEP_ALIVE,
                            "requestID":requestCount++
                        };
                        var request = currentSession.requestFactory.buildRequest(command);
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(1, "[" + driver.name + "] longpoll() Sending request number " + command.requestID + " of " + requestCount + " for " + describe(command.requestType) + " " + request);
                        }
                        driver.send(command, request);
                        scheduleLongpollTimeout(driver.name);
                    }

                    function scheduleLongpollTimeout(driverName) {
                        longpollTimeoutID = setTimeout(function () {
                            Transport.onError(driverName + " Longpoll Timeout");
                        }, Transport.getConfig().sessionTimeoutMs);
                    }

                    function cancelLongpollTimeout() {
                        if (longpollTimeoutID !== null) clearTimeout(longpollTimeoutID);
                    }

                    // Functions for processing chunked responses:
                    function processResponseChunk(responseChunk, currentPosition) {
                        if (currentPosition > responseChunk.length) {
                            return currentPosition;
                        }
                        var newPosition;
                        do {
                            newPosition = responseChunk.indexOf("];[", currentPosition) + 2;
                            if (newPosition === 1) {
                                if (responseChunk.charAt(responseChunk.length - 1) == ";" && responseChunk.charAt(responseChunk.length - 2) == "]") {
                                    newPosition = responseChunk.length;
                                }else{
                                    return currentPosition;
                                }
                            }
                            if (newPosition > currentPosition) {
                                Transport.d(responseChunk.substring(currentPosition, newPosition-1));
                                currentPosition = newPosition;
                            }
                        } while (newPosition != responseChunk.length);
                        return currentPosition;
                    }

                    return {
                        "longpoll":longpoll,
                        "cancelLongpollTimeout":cancelLongpollTimeout,
                        "processResponseChunk":processResponseChunk
                    };

                }());


                return {
                    "Names":Names,
                    "WireProtocol":WireProtocols,
                    "createDriver":createDriver
                };

            }());


            // Transport's Default Driver Order Preferences:
            var preferredDrivers = [];

            var defaultDrivers = [
                Drivers.Names.WEBSOCKET,
                Drivers.Names.XHR_STREAMING_CORS,
                Drivers.Names.IFRAME_STREAMING_POSTMESSAGE,
                Drivers.Names.EVENTSOURCE_STREAMING_POSTMESSAGE,
                Drivers.Names.XHR_LONGPOLL_CORS,
                Drivers.Names.XHR_LONGPOLL_POSTMESSAGE,
                Drivers.Names.NOXD_IFRAME_STREAMING,
                Drivers.Names.JSONP_LONGPOLL
            ];

            return {
                "Drivers":Drivers,
                "initializeDriver":initializeDriver,
                "supportsDriver":supportsDriver,
                "setPreferredDriver":setPreferredDriver,
                "setUp":setUp,
                "open":open,
                "tearDown":tearDown,
                "getCurrentDriver":getCurrentDriver,
                "getCurrentRealm":getCurrentRealm,
                "getCurrentSession":getCurrentSession,
                "getConfig":getConfig,
                "getRequestCountIncrement":getRequestCountIncrement,
                "stop":stop,
                "getNirvanaCookie":getNirvanaCookie,
                "onConnect":onConnect,
                "onOpen":onOpen,
                "onError":onError,
                "onClose":onClose,
                "send":send,
                "c":receive,
                "d":receiveJSON,
                "isConnected":isConnected
            };
        }());


        var OutboundEngine = (function () {
            var isReady = false;
            var outboundQueue = [];

            function pushToTransport() {
                if (isReady && outboundQueue.length > 0) {
                    var req = peek();
                    if(req !== null){
                        if (req.requestType == PrivateConstants.SESSION_START && Transport.getCurrentSession().getStatus() === Statuses.CONNECTED) {
                            Utils.Logger.log(3, "[Outbound Engine] Dequeueing unnecessary session start request as already connected.", "Req #" + req.requestID);
                            OutboundEngine.dequeueCommand(req.requestID);
                            pushToTransport();
                        } else {
                            isReady = false;
                            req.sent=true;
                            if (Utils.isLoggingEnabled()) {
                                Utils.Logger.log(3, "[Outbound Engine] Sending Command to Transport Layer.", "Req #" + req.requestID);
                            }
                            Transport.send(req);
                        }
                    }
                }
            }

            function setReady(readyValue) {
                isReady = readyValue;
                pushToTransport();
            }

            function queueCommand(command) {
                command.requestID = Transport.getRequestCountIncrement();
                command.sent =false;
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(3, "[Outbound Engine] Queueing Command " + describe(command.requestType), command);
                }
                outboundQueue.push(command);
                pushToTransport();
            }

            function prioritizeCommand(command) {
                command.requestID = Transport.getRequestCountIncrement();
                command.sent =false;
                outboundQueue.unshift(command);
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(3, "[Outbound Engine] Prioritizing Command " + describe(command.requestType), command);
                }
                pushToTransport();
            }

            function dequeueCommand(requestID) {

                var len = outboundQueue.length;
                if (Utils.isLoggingEnabled()) {
                    var commands = "";
                    for (var j = 0; j < len; j++) {
                        commands += describe(outboundQueue[j].requestType) + " ";
                    }
                    Utils.Logger.log(2, "[Outbound Engine] OutboundQueue = " + commands);
                }
                for (var i = 0; i < len; i++) {
                    if (outboundQueue[i].requestID == requestID) {
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.log(3, "[Outbound Engine] Dequeueing Command " + describe(outboundQueue[i].requestType), outboundQueue[i], requestID);
                        }
                        return outboundQueue.splice(i, 1)[0];
                    }
                }
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(3, "[Outbound Engine] No matching queued command to dequeue for request ID: ", requestID);
                }
                return null;
            }

            function resetMessagesOnQueue(){
                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(2, "[Outbound Engine] Resetting messages on outbound queue");
                }
                for (var i = 0; i < outboundQueue.length; i++) {
                    if(outboundQueue[i].requestType === PrivateConstants.KEEP_ALIVE || outboundQueue[i].requestType === PrivateConstants.CLIENT_CLOSE){
                        outboundQueue.splice(i, 1);
                    }else{
                        outboundQueue[i].sent = false;
                        outboundQueue[i].requestID = Transport.getRequestCountIncrement();
                    }
                }
            }

            function peek() {
                var len = outboundQueue.length;
                for (var i = 0; i < len; i++) {
                    if (!outboundQueue[i].sent) {
                        return outboundQueue[i];
                    }
                }
                return null;
            }

            return {
                "setReady":setReady,
                "queueCommand":queueCommand,
                "resetMessagesOnQueue":resetMessagesOnQueue,
                "prioritizeCommand":prioritizeCommand,
                "dequeueCommand":dequeueCommand,
                "peek":peek
            };
        }());

        var CurrentSession;

        function createListenerManager() {

            var listenerStore = [];
            var isNotifying = false;

            var on = function (observable, listener) {

                var typedListenerStore = listenerStore[observable];

                if (!listenerStore[observable]) {
                    typedListenerStore = [];
                    listenerStore[observable] = typedListenerStore;
                }

                var length = typedListenerStore.length;
                for (var i = 0; i < length; i++) {
                    if (listener == typedListenerStore[i]) return;
                }

                // If we are in notifyListener call stack we need to do a copy before we modify the structure
                if (isNotifying) {
                    typedListenerStore = typedListenerStore.slice(0);
                    listenerStore[observable] = typedListenerStore;
                }

                typedListenerStore.push(listener);
            };

            var removeListener = function (observable, listener) {
                var typedListenerStore = listenerStore[observable];

                if (!typedListenerStore) {
                    return;
                }

                // If user passes "true" delete ALL listeners for this action:
                if (listener === true) {
                    typedListenerStore = [];
                    listenerStore[observable] = typedListenerStore;
                }

                // If we are in notifyListener call stack we need to do a copy before we modify the structure
                if (isNotifying) {
                    typedListenerStore = typedListenerStore.slice(0);
                    listenerStore[observable] = typedListenerStore;
                }

                var length = typedListenerStore.length;
                for (var i = 0; i < length; i++) {
                    if (listener == typedListenerStore[i]) {
                        typedListenerStore.splice(i, 1);
                        return;
                    }
                }
            };

            var notifyListeners = function (observable, obj, data) {
                var typedListenerStore = listenerStore[observable];
                if (!typedListenerStore) {
                    return;
                }
                isNotifying = true;
                var length = typedListenerStore.length;
                for (var i = 0; i < length; i++) {
                    var listener = typedListenerStore[i];
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(0, "[NotifyListeners] " + listener + " : " + data);
                    }
                    //Catch any exception raised as its not ideal to allow clients to pass exceptions into our API
                    try{
                        listener(obj, data);
                    }catch(error){
                        if (Utils.isLoggingEnabled()) {
                            Utils.Logger.logException(9, error);
                        }
                    }
                }
                isNotifying = false;
            };

            return {
                "on":on,
                "removeListener":removeListener,
                "notifyListeners":notifyListeners
            };
        }

        function registerListenerManager(obj, listenerManager) {
            ListenerManagers[obj] = listenerManager;
        }

        /*
         *  ************************************************************************************
         *  Exceptions
         *  ************************************************************************************
         */

        function AlreadySubscribedException(resourceName) {
            this.name = "AlreadySubscribedException";
            if (typeof resourceName != "undefined" && resourceName !== null) this.message = "Already subscribed to " + resourceName;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function InvalidDriverException(driverName) {
            this.name = "InvalidDriverException";
            if (typeof driverName != "undefined" && driverName !== null) this.message = driverName + " is not a valid driver name";
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function NoValidDriversException(specifiedDrivers) {
            this.name = "NoValidDriversException";
            this.message = "This client does not support any of the currently configured drivers";
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(8, "[" + this.name + "] " + this.message, specifiedDrivers);
            }
        }

        function DriverSecurityException(driverName, securityMessage) {
            this.name = "DriverSecurityException";
            if (typeof driverName != "undefined" && driverName !== null) this.message = driverName + " - " + securityMessage;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function AlreadyCommittedException(resourceName, txID) {
            this.name = "AlreadyCommittedException";
            this.message = "Already Committed Transaction " + txID + " to resource " + resourceName;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function SessionException(sessionName, message) {
            this.name = "SessionException";
            if (typeof sessionName != "undefined" && sessionName !== null) this.message = sessionName + " - " + message;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function SecurityException(message) {
            this.name = "SecurityException";
            this.message = message;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function MissingResourceException(resource, message) {
            this.name = "MissingResourceException";
            this.resourceName = resource;
            this.message = message;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.message);
            }
        }

        function GenericException(message) {
            this.name = "GenericException";
            if (message) this.errorMessage = message;
            if (Utils.isLoggingEnabled()) {
                Utils.Logger.log(7, "[" + this.name + "] " + this.errorMessage);
            }
        }

        /*
         *  ************************************************************************************
         *  Session
         *  This is the foundation for interacting with a Channel or Queue. It is an EventDispatcher, too.
         *  ************************************************************************************
         */


        /*

        Function: createSession()

            Creates and initializes (but does not start) a session object for communication with a Universal Messaging Realm Server.

        Optional Parameter:

            config - An optional <Session> configuration object containing key/value value pairs. Any key/value pair in this configuration object is also optional.

        Configuration Object Keys (Optional):

            drivers - An array of communication Drivers, in order of preference. Defaults to
            _[ Nirvana.Driver.WEBSOCKET, Nirvana.Driver.XHR_STREAMING_CORS, Nirvana.Driver.IFRAME_STREAMING_POSTMESSAGE, Nirvana.Driver.EVENTSOURCE_STREAMING_POSTMESSAGE, Nirvana.Driver.XHR_LONGPOLL_CORS, Nirvana.Driver.XHR_LONGPOLL_POSTMESSAGE, Nirvana.Driver.NOXD_IFRAME_STREAMING, Nirvana.Driver.JSONP_LONGPOLL]_

            rememberDriver - True or false. Defaults to false. If true, will store the first driver that results in a successful
            session in a cookie so that the client will try to start with the same driver (bypassing any drivers that would
            otherwise fail) the next time the application is loaded. This feature will only work if the client supports
            persistent cookies.

            applicationName - Defaults to "GenericJSClient".

            sessionName - Defaults to "GenericJSSession".

            username - Will be generated randomly if not supplied.

            realms - An array of (optionally, but typically, clustered) realms, each specified as "protocol://fqdn:port".
            For example: _["http://node1.um.softwareag.com:80, http://node2.um.softwareag.com:80", http://node3.um.softwareag.com:80"]_
            If a client fails to connect to the current realm using any of the user-specified drivers
            (or the default drivers, if none are specified), then it will move on to the next realm in the array,
            repeating at the end of the array.

            debugLevel - 0 to 9, where 0 is maximum debug output and 9 is no debug output.
            Defaults to 9. A commonly used value in development might be 4.

            serverLogging - True or false. Defaults to false.

            verboseKeepAlives - True or false. Defaults to false.

            enableDataStreams - True or false. Defaults to true.

            sessionTimeoutMs - Time with no communication with server before session times out and resets.
            Defaults to 120000 (ms) = 2 Minutes.

            sendResponseTimeout - Time with no response from a request.
            Defaults to 10000 (ms) = 10 seconds.

            openDriverTimeout - Time to allow a session to initialise, with postMessage this may need to be increased if latency is high
            as there can be multiple files to download before a session can be initialised allowing a time out unnecessarily.
            Defaults to 15000 (ms) = 15 seconds.

            maxStreamLengthStreamingCors -  Maximum streaming response content-length in bytes for XHR_STREAMING_CORS.
            As with all other keys in this object, maxStreamLengthStreamingCors is optional, but is useful for clients which have high
            data throughput or are long running as memory will be consumed due to browser implementation of responseText growing without
            cleaning up. Defaults to 10000000 (approximately 10mb).

        Returns:

            An object representing a Universal Messaging session.

        Example Usage:

            > var session = Nirvana.createSession();
            > session.start();
            > session.stop();

            A session can be customized by passing in a configuration object containing keys
            which override default values, as follows:

            > var session = Nirvana.createSession({
            >   realms : [ "https://showcase.um.softwareag.com:443" ],
            >   debugLevel : 4
            > });

        See Also:

            <Session.start()>

         */
        function createSession(config) {

            if (CurrentSession) {
                if (CurrentSession.getStatus() !== Statuses.STOPPED && CurrentSession.getStatus() !== Statuses.NOTSTARTED) {
                    lm.notifyListeners(Nirvana.Observe.ERROR, CurrentSession,
                        { name:"SessionExistsException",
                            message:"Cannot Create Session: Session Already Exists"});
                    return undefined;
                }
            }

            CurrentSession = new Session(sanitizeConfiguration(config));

            return CurrentSession;

            function sanitizeConfiguration(config) {

                function sanitizeBoolean(value, defaultValue) {
                    if (typeof value == "undefined" || value === null) {
                        return defaultValue;
                    }
                    return !!value;
                }

                function sanitizeInteger(value, defaultValue) {
                    value = parseInt(value, 10);
                    if(isNaN(value)){
                        value = defaultValue;
                    }
                    return value;
                }

                if (typeof config == "undefined" || config === null) config = {};

                config.debugLevel = sanitizeInteger(config.debugLevel, 9);
                Utils.setDebugLevel(config.debugLevel);

                if (typeof config.applicationName == "undefined")
                    config.applicationName = "GenericJSClient";

                if (typeof config.sessionName == "undefined")
                    config.sessionName = "GenericJSSession";

                if (typeof config.username == "undefined")
                    config.username = "JSUser_" + Utils.generateUniqueID();

                if (typeof config.crossDomainPath == "undefined")
                    config.crossDomainPath = "/lib/js";

                if (typeof config.realms == "undefined") {
                    var realm = document.location.protocol + "//" + document.location.hostname;
                    if (document.location.host.match(/:[0-9]+$/)) {
                        realm += ":" + document.location.port;
                    } else {
                        realm = Utils.getCanonicalOrigin(realm);
                    }
                    config.realms = [realm];
                }
                var currentDomain = document.location.protocol + "//" + document.location.hostname;
                if (document.location.protocol != "file:") {
                    if (document.location.host.match(/:[0-9]+$/)) {
                        currentDomain += ":" + document.location.port;
                    } else {
                        currentDomain = Utils.getCanonicalOrigin(currentDomain);
                    }
                }
                config.currentDomain = currentDomain;
                config.serverLogging = sanitizeBoolean(config.serverLogging, false);
                config.verboseKeepalives = sanitizeBoolean(config.verboseKeepalives, false);
                config.enableDataStreams = sanitizeBoolean(config.enableDataStreams, true);
                config.sessionTimeoutMs = sanitizeInteger(config.sessionTimeoutMs, 120000);
                config.sendResponseTimeout = sanitizeInteger(config.sendResponseTimeout, 10000);
                config.openDriverTimeout = sanitizeInteger(config.openDriverTimeout, 15000);
                config.maxStreamLengthStreamingCors = sanitizeInteger(config.maxStreamLengthStreamingCors, 10000000);
                config.rememberDriver = sanitizeBoolean(config.rememberDriver, false);
                config.applyUserAgentHeuristics = sanitizeBoolean(config.applyUserAgentHeuristics, false);

                if (Utils.isLoggingEnabled()) {
                    var summary = "";
                    for (var name in config) {
                        if (config.hasOwnProperty(name)) {
                            var val = config[name];
                            summary += name + ":\t";
                            if (val.constructor == Array) {
                                summary += val.join("\n\t\t");
                            } else {
                                summary += val;
                            }
                            summary += "\n";
                        }
                    }
                    Utils.Logger.log(5, "[Session] Configuration:\n" + summary);
                }

                return config;
            }

        }

        /*

        Function: createEvent()

            Factory method to create a new, empty Universal Messaging <Event> (typically for subsequent publishing
            to a resource such as a <Channel> or <Queue>).

        Returns:

            A new, empty <Event>.

        Example Usage:

            > var myEvent = Nirvana.createEvent();
            > var myDict = myEvent.getDictionary();
            > myDict.putString("message", "Hello World");
            > myChannel.publish(myEvent);

        See Also:

            <Event>, <Event.getDictionary()>

         */

        function createEvent() {
            return new Event(undefined, -1,undefined,undefined,undefined,undefined,undefined,undefined);
        }

        /*

        Function: createDictionary()

            Factory method to create a new, empty <EventDictionary> (typically for subsequent addition to an existing
            <EventDictionary> using <EventDictionary.putDictionary()>).

        Returns:

            A new, empty <EventDictionary>.

        Example Usage:

            > var myEvent = Nirvana.createEvent();
            > var myDict = myEvent.getDictionary();
            > var newDict = Nirvana.createDictionary();
            > newDict.putString("message", "Hello World");
            > myDict.putDictionary("aNestedDictionary", newDict);
            > myChannel.publish(myEvent);

        See Also:

            <EventDictionary.putDictionary()>

         */

        function createDictionary() {
            return EventDictionary.createDictionary();
        }

        /*
         *  ************************************************************************************
         *  "public" add / remove listener functions for window.Nirvana:
         *  ************************************************************************************
         */

        /*
            Function: on()

                Registers a single event listener on the <Nirvana> object for observable events of the specified type
                (see <Nirvana.Observe> for a list of applicable observables).

                To register more than one observable listener for the same type, invoke <on()> with a
                different listener function as many times as needed.

            Parameters:

                observable - the type of observable event in which the listener is interested.
                listener - the listener function you have implemented, which should handle the parameters associated with the relevant observable event as defined in <Nirvana.Observe>.

            Returns:

                The <Nirvana> object (making this a chainable method).

            Example Usage:

                > function myErrorHandler(session, exception) {
                >   // This will receive errors such as total transport driver failures
                > }
                > Nirvana.on(Nirvana.Observe.ERROR, myErrorHandler);
                >
                > // we can now also un-assign this listener any time we want to:
                > Nirvana.removeListener(Nirvana.Observe.ERROR, myErrorHandler);

            See Also:

                <Nirvana.removeListener()>, <Nirvana.Observe>

        */

        function on(observable, listener) {
            if (lm === null) {
                lm = createListenerManager();
                registerListenerManager(window.Nirvana, lm);
            }
            lm.on(observable, listener);
        }

        /*
            Function: removeListener()

                Removes a specific listener for observable events of the specified type
                (see <Nirvana.Observe> for a list of applicable observables).

            Parameters:

                observable - the type of observable event in which the listener was interested.
                listener - the listener function originally assigned with <on()>, and which should now be removed.

            Returns:

                The <Nirvana> object (making this a chainable method).

            Example Usage:

                > Nirvana.removeListener(Nirvana.Observe.ERROR, myErrorHandler);

                Notice that a reference to the listener is required if you wish to remove it. See the note about
                named and anonymous functions in the <Nirvana.Observe> Example Usage section.

            See Also:

                <Nirvana.on()>, <Nirvana.Observe>

        */

        function removeListener(observable, listener) {
            lm.removeListener(observable, listener);
        }


        /*
            Class: Session

                A <Session> object is returned by a call to <Nirvana.createSession()>.
                All <Session> objects are created with this factory method;
                <Session> has no built-in public constructor method.

                This version of the API expects only one <Session> to be instantiated in any application.
                It is possible that future versions of the API will support concurrent <Sessions>.
        */

        function Session(configuration) {

            var client;

            var self = this;
            var lm = createListenerManager();

            var config = configuration;
            var sessionID = "-1";
            var dataStreamID = "";
            var status = Statuses.NOTSTARTED;
            var longPollRequestID = -1;

            var resources = [];
            var dataGroups = {};
            dataGroups.g1 = "";

            registerListenerManager(self, lm);

            /*
                Function: start()

                    Starts the <Session>. This will launch the first preferred transport driver and attempt to contact
                    the first preferred realm to initialize a session. If the <Session> initializes successfully as a result
                    of this call to <Session.start()>, then any listeners of the _Nirvana.Observe.START_ observable event
                    will be invoked with the new session as a parameter.

                    Note that there is no requirement that the developer wait for the
                    _Nirvana.Observe.START_ observable event to fire before attempting to interact with the <Session>;
                    any such interactions will be transparently queued until the session has successfully initialized.

                Returns:

                The <Session> object on which <Session.start()> was invoked (making this a chainable method).

                Example Usage:

                Starting a <Session> can be
                very simple:

                    > var mySession = Nirvana.createSession();
                    > mySession.start();

                    <Sessions> support arbitrary orders of interaction (transparently queueing commands
                    until realm server communication is possible). It is possible to start a session and subscribe
                    to a channel as follows:

                    > var mySession = Nirvana.createSession();
                    > mySession.start();
                    > mySession.subscribe(mySession.getChannel("/some/channel"));

                    The placement of the <Session.start()> call is flexible.
                    The following would work just as well, for instance:

                    > var mySession = Nirvana.createSession();
                    > mySession.subscribe(mySession.getChannel("/some/channel"));
                    > mySession.start();

                    Client code can be asynchronously notified of the actual session initialization. To do this,
                    simply assign a listener to the <Session's> _Nirvana.Observe.START_ observable event:

                    > function sessionStarted(s) {
                    >   console.log("Session started with ID " + s.getSessionID());
                    > }
                    > mySession.on(Nirvana.Observe.START, sessionStarted);
                    > mySession.start();

                See Also:

                <Nirvana.Observe>, <Nirvana.createSession()>

            */


            this.start = function () {

                if (!(status === Statuses.NOTSTARTED || status === Statuses.STOPPED)) {
                    ListenerManagers[window.Nirvana].notifyListeners(Nirvana.Observe.ERROR, client,
                        new SessionException("Nirvana Session", "start() can only be invoked on a new or stopped session")
                    );
                    return client;
                }

                // if "STOPPED" then just use "best" driver, not all drivers:
                var usePreviousBestDriverFlag = (status === Statuses.STOPPED);

                if (document.getElementById(DriverDomObjectsContainerID) === null) {
                    Nirvana.initialize();
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.log(1, "[Nirvana] Waiting for DOM to be ready");
                    }
                    setTimeout(self.start, 15);
                    return client;
                }

                if (Utils.isLoggingEnabled()) {
                    Utils.Logger.log(6, "[Session] Creating Session");
                }
                status = Statuses.CONNECTING;
                var command = {
                    "session":self,
                    "requestType":PrivateConstants.SESSION_START,
                    "listenerManager":lm
                };

                OutboundEngine.prioritizeCommand(command);
                Transport.setUp(self, usePreviousBestDriverFlag);
                Transport.open();

                var bu = function () {
                    self.stop(true);
                };
                if (window.addEventListener) {
                    window.addEventListener("beforeunload", bu, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onbeforeunload", bu);
                }

                return client;
            };

            /*
                Function: stop()

                    Stops the <Session>.
                    This will close the connection with the realm server, and set the <Session's> status to STOPPED.

                Returns:

                    The <Session> object on which <Session.stop()> was invoked (making this a chainable method).

                Example Usage:

                    > mySession.stop();

                    If a developer wishes to be asynchronously notified when the session has stopped, they
                    can assign a listener to the <Session's> _Nirvana.Observe.STOP_ observable event.

                    > function sessionStopped(session) {
                    >   console.log("Session " + session.getSessionID() + " explicitly stopped");
                    > }
                    > mySession.on(Nirvana.Observe.STOP, sessionStopped);
                    > mySession.stop();

                See Also:

                    <Nirvana.Observe>

            */

            this.stop = function (forceClose) {
								if (Utils.isLoggingEnabled())	{
                    Utils.Logger.log(6, "[Session] Stopping Session");
                }
                if (status === Statuses.STOPPED || status === Statuses.NOTSTARTED) {
                    return client;
                }

                status = Statuses.STOPPED;

                var command = {
                    "requestType":PrivateConstants.CLIENT_CLOSE,
                    "clientRequest":true
                };
                if (forceClose) {
                    OutboundEngine.prioritizeCommand(command);
                } else {
                    OutboundEngine.queueCommand(command);
                }

                return client;
            };

            this.destroy = function() {
                this.stop();
                CurrentSession = null;
                return client;
            };

            /*
                Function: subscribe()

                    Batch-subscribes to multiple <Channel>, <Queue> and/or <TransactionalQueue> resources
                    with a single call to the server.

                    *If attempting to subscribe to more than one resource at a time, this is considerably
                    more efficient than using the resource-level subscription methods such as <Channel.subscribe()>.*

                    This method may be used in place of resource-level subscription methods such as <Channel.subscribe()>
                    even if intending to subscribe only to a single resource; either approach is a matter of developer preference.

                    Each successful subscription or failure will fire an observable event both on the respective
                    <Channel>, <Queue>, and/or <TransactionalQueue> resource object, *and* on the <Session>.

                Parameters:

                    resourceArray - an array of <Channel>, <Queue>, and/or <TransactionalQueue> resource objects.

                Returns:

                    The <Session> object on which <Session.subscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > var myChannel = mySession.getChannel("/some/channel");
                    > var myChannel2 = mySession.getChannel("/some/other/channel");
                    > var myQueue = mySession.getQueue("/some/queue");
                    > mySession.subscribe([myChannel, myChannel2, myQueue]);

                    If a developer wishes to be asynchronously notified when a resource subscription is successful
                    (or if a subscription error occurs), they can assign appropriate listeners to the respective resource,
                    as shown below:

                    > function subscriptionCompleteHandler(resource) {
                    >   // subscription to this resource was successful
                    > }
                    >
                    > function errorHandler(resource, ex) {
                    >    if (ex instanceof MissingResourceException) {
                    >        console.log("Resource " + resource.getName() + " not found: " + ex.message);
                    >    }
                    >    else if (ex instanceof AlreadySubscribedException) {
                    >        console.log("Already subscribed to " + resource.getName());
                    >    }
                    >    else if (ex instanceof SecurityException) {
                    >        console.log("ACL error for " + resource.getName() + ": " + ex.message);
                    >    }
                    > }
                    >
                    > function eventHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    >
                    > myChannel.on(Nirvana.Observe.SUBSCRIBE, subscriptionCompleteHandler);
                    > myChannel.on(Nirvana.Observe.ERROR, errorHandler);
                    > myChannel.on(Nirvana.Observe.DATA, eventHandler);
                    > mySession.subscribe([myChannel, myChannel2, myQueue]);

                See Also:

                    <Nirvana.Observe>, <Channel.subscribe()>, <Queue.subscribe()>, <TransactionalQueue.subscribe()>

            */

            this.subscribe = function (resourceArray) {
                try {
                    var apiResources = [];
                    for (var i = 0; i < resourceArray.length; i++) {
                        var clientResource = resourceArray[i];
                        if (clientResource.isSubscribed()) {
                            var ase = new AlreadySubscribedException(clientResource.getName());
                            clientResource.notifyListeners(Nirvana.Observe.ERROR, clientResource, ase);
                            lm.notifyListeners(Nirvana.Observe.ERROR, client, ase);
                            ListenerManagers[window.Nirvana].notifyListeners(Nirvana.Observe.ERROR, client, ase);
                        } else {
                            apiResources.push(self.getResourceByName(clientResource.getName()));
                        }
                    }
                    if (resourceArray.length) {
                        var command = self.prepareCommand(PrivateConstants.BATCH_SUBSCRIBE);
                        command.resources = apiResources;
                        OutboundEngine.queueCommand(command);
                    }
                } catch (ex) {
                    if (Utils.isLoggingEnabled()) {
                        Utils.Logger.logException(8, ex);
                    }
                    ListenerManagers[window.Nirvana].notifyListeners(Nirvana.Observe.ERROR, client, ex);
                }
                return client;
            };


            /*
                Function: getChannel()

                    Returns the <Channel> object for the supplied channel name.
                    Note that a valid object will be returned irrespective of whether this resource actually exists on the realm server.

                Parameters:

                    channelName - a string representation of the fully qualified channel name (e.g. "/some/channel").

                Returns:

                    A <Channel> object for the supplied channel name.

                Example Usage:

                    > var myChannel = mySession.getChannel("/some/channel");

            */

            this.getChannel = function (channelName) {
                channelName = Utils.getCanonicalResourceName(channelName);
                var channel = self.getResourceByName(channelName);
                if (!channel) {
                    var listenerManager = createListenerManager();
                    channel = new Channel(channelName, listenerManager, self);
                    registerListenerManager(channel, listenerManager);
                } else {
                    return channel.getClientResource();
                }
                return channel;
            };

            /*
                Function: getQueue()

                    Returns the <Queue> or <TransactionalQueue> object for the supplied queue name.
                    If the optional second parameter is not supplied (or has a false value), then a <Queue> is returned.
                    If the value of the second parameter is true, then a <TransactionalQueue> is returned.
                    Note that a valid object will be returned irrespective of whether this resource actually exists on the realm server.

                Parameters:

                    queueName - a string representation of the fully qualified channel name (e.g. "/some/queue").
                    isTransactionalReader - a boolean representing whether this should be a transactional reader.

                Returns:

                    A <Queue> or <TransactionalQueue> object for the supplied queue name.

                Example Usage:

                    > var myQueue = mySession.getQueue("/some/queue");

            */

            this.getQueue = function (queueName, isTransactionalReader) {
                queueName = Utils.getCanonicalResourceName(queueName);
                var queue = self.getResourceByName(queueName);
                if (!queue) {
                    var listenerManager = createListenerManager();
                    if (isTransactionalReader) {
                        queue = new TransactionalQueue(queueName, listenerManager, self);
                    } else {
                        queue = new Queue(queueName, listenerManager, self);
                    }
                    registerListenerManager(queue, listenerManager);
                } else {
                    return queue.getClientResource();
                }
                return queue;
            };

            this.notifyListeners = function (observable, obj, data) {
                lm.notifyListeners(observable, obj, data);
            };

            /*
                Function: on()

                    Registers a single event listener on the <Session> for observable events of the specified type
                    (see <Nirvana.Observe> for a list of applicable observables).

                    To register more than one observable listener for the same type, invoke <on()> with a
                    different listener function as many times as needed.

                Parameters:

                    observable - the type of observable event in which the listener is interested.
                    listener - the listener function you have implemented, which should handle the parameters associated with the relevant observable event as defined in <Nirvana.Observe>.

                Returns:

                    The <Session> object on which <Session.on()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >   // do something with the evt passed to us as a parameter
                    > }
                    > session.on(Nirvana.Observe.DATA, myHandler);
                    >
                    > // we can now also un-assign this listener any time we want to:
                    > session.removeListener(Nirvana.Observe.DATA, myHandler);

                See Also:

                    <Session.removeListener()>, <Nirvana.Observe>

            */

            this.on = function (observable, listener) {
                lm.on(observable, listener);
                return client;
            };


            /*
                Function: removeListener()

                    Removes a specific listener for observable events of the specified type
                    (see <Nirvana.Observe> for a list of applicable observables).

                Parameters:

                    observable - the type of observable event in which the listener was interested.
                    listener - the listener function originally assigned with <on()>, and which should now be removed.

                Returns:

                    The <Session> object on which <Session.removeListener()> was invoked (making this a chainable method).

                Example Usage:

                    > session.removeListener(Nirvana.Observe.DATA, myHandler);

                    Notice that a reference to the listener is required if you wish to remove it. See the note about
                    named and anonymous functions in the <Nirvana.Observe> Example Usage section.

                See Also:

                    <Session.on()>, <Nirvana.Observe>

            */

            this.removeListener = function (observable, listener) {
                lm.removeListener(observable, listener);
                return client;
            };

            /*
                Function: getUsername()

                    Returns the username used in this <Session>.
                    A username can be optionally set when invoking <Nirvana.createSession()> with a suitable configuration object parameter.

                Returns:

                    The <Session>'s username.

                Example Usage:

                    > var username = mySession.getUsername();

                See Also:

                    <Nirvana.createSession()>

            */

            this.getUsername = function () {
                return config.username;
            };

            /*
                Function: getCurrentDriver()

                    Returns the name of the <Session>'s current transport driver.
                    This will be one of the names defined in <Nirvana.Driver>, and, if the call to
                    <Nirvana.createSession()> included a configuration object parameter with a "drivers" key,
                    will be restricted to one of the user-specified drivers.

                Returns:

                    The name of the <Session>'s current transport driver.

                Example Usage:

                    > var driverName = mySession.getCurrentDriver();

                See Also:

                    <Nirvana.Driver>, <Nirvana.createSession()>

            */

            this.getCurrentDriver = function () {
                return Transport.getCurrentDriver();
            };

            /*
                Function: getCurrentRealm()

                    Returns the RNAME (in _protocol://host:port_ format) of the realm server to which the <Session> is currently connected.
                    This will be one of the RNAMEs defined in the _realms_ value in the configuration object passed into
                    <Nirvana.createSession()>, or, if not configured, willbe derived from the protocol, host and port
                    of the server which served the application itself.

                Returns:

                    The name of the realm to which the <Session> is connected.

                Example Usage:

                    > var rname = mySession.getCurrentRealm();

                See Also:

                    <Nirvana.createSession()>

            */

            this.getCurrentRealm = function () {
                return Transport.getCurrentRealm();
            };

            this.pushResource = function (resource) {
                resources.push(resource);
            };

            this.setGroupAlias = function (groupName, groupAlias) {
                dataGroups[groupAlias] = groupName;
            };

            this.getGroupName = function (resourceAlias) {
                return dataGroups[resourceAlias];
            };

            this.getResources = function () {
                return resources;
            };

            this.getResourceByName = function (resourceName) {
                var length = resources.length;
                for (var i = 0; i < length; i++) {
                    var resource = resources[i];
                    if (resource.getName() == resourceName) {
                        return resource;
                    }
                }
            };

            this.setResourceAlias = function (resourceName, resourceAlias) {
                var length = resources.length;
                for (var i = 0; i < length; i++) {
                    var resource = resources[i];
                    if (resource.getName() === resourceName) {
                        resource.setAlias(resourceAlias);
                        return;
                    }
                }
            };

            this.getResourceByAlias = function (resourceAlias) {
                var length = resources.length;
                for (var i = 0; i < length; i++) {
                    var resource = resources[i];
                    if (resource.getAlias() === resourceAlias) {
                        return resource;
                    }
                }
            };

            this.setSessionID = function (newID) {
                sessionID = "" + newID;
                status = Statuses.CONNECTED;
            };

            this.setDataStreamID = function (newID) {
                dataStreamID = "" + newID;
            };

            this.getLongPollRequestID = function(){
                return longPollRequestID;
            };

            this.setLongPollRequestID = function(id){
                longPollRequestID = id;
            };

            /*
                Function: getSessionID()

                    Returns the <Session>'s current session ID.
                    This will be a string, generated and assigned by the realm server after a successful session start or reconnection.

                Returns:

                    A string representing the <Session>'s current session ID.

                Example Usage:

                    > var sessionID = mySession.getSessionID();

                See Also:

                    <Session.start()>

            */

            this.getSessionID = function () {
                return sessionID;
            };

            /*
                Function: getDataStreamID()

                    Returns the <Session>'s current DataStream ID.
                    This will be a string, generated and assigned by the realm server after a successful session start or reconnection IF the session was DataStream-enabled (see enableDataStreams property of session configuration object).

                Returns:

                    A string representing the <Session>'s current DataStream ID.

                Example Usage:

                    > var dataStreamID = mySession.getDataStreamID();

                See Also:

                    <Session.start()>

            */

            this.getDataStreamID = function () {
                return dataStreamID;
            };

            /*
                Function: getConfig()

                    Returns the configuration object for the <Session>. Its key/value pairs will be affected by any user-specified
                    values in the optional configuration object if passed as a parameter to <Nirvana.createSession()>. Some
                    such values (such as the _drivers_ value) may have changed over time, depending on client capabilities.

                Returns:

                    The configuration object for the <Session>.

                Example Usage:

                    > var config = mySession.getConfig();
                    > var myRealmArray = config.realms;

                See Also:

                    <Nirvana.createSession()>

            */

            this.getConfig = function () {
                return config;
            };

            this.setStatus = function (newStatus) {
                status = newStatus;
            };

            /*
                Function: getStatus()

                    Returns the <Session>'s current status, which describes whether it is, for example, not yet started,
                    connected, disconnected, or stopped. The actual status value is represented by of the following string constants:

                    NOTSTARTED - <Session.start()> has not yet been invoked.
                    CONNECTING - <Session.start()> has been invoked, but the <Session> has not yet been initialized with a sessionID.
                    CONNECTED - The <Session> is successfully connected, and a sessionID has been assigned.
                    RECONNECTING - The <Session> has been temporarily disconnected and is automatically attempting to reconnect.
                    STOPPED - <Session.stop()> has been invoked and the <Session> is disconnected.

                Returns:

                    A string representing the <Session>'s current status.

                Example Usage:

                    > var status = mySession.getStatus();

            */

            this.getStatus = function () {
                return status;
            };

            /*
                Function: isDataStreamEnabled()

                    Returns true or false, depending on whether the <Session> was configured to be DataStream-enabled
                    (via setting of the _dataStreamEnabled_ key in the configuration object passed as an optional parameter
                    to <Nirvana.createSession()>.

                Returns:

                    A boolean value of true or false.

                Example Usage:

                    > if ( mySession.isDataStreamEnabled() ) {
                    >    console.log("This DataStream session receives events from any DataGroup of which it is a member.");
                    > }

                See Also:

                    <Nirvana.createSession()>

            */

            this.isDataStreamEnabled = function () {
                return config.enableDataStreams;
            };

            // Private Functions:
            this.prepareCommand = function (type) {
                return {
                    "session":this,
                    "requestType":type
                };
            };

            this.requestFactory = Utils.HTTPRequestFactory();
            this.responseFactory = Utils.HTTPResponseFactory(self);

            /*
             *  ************************************************************************************
             *  Public interface to Session:
             *  ************************************************************************************
             */

            client = {
                "on":this.on,
                "removeListener":this.removeListener,
                "isDataStreamEnabled":this.isDataStreamEnabled,
                "getConfig":this.getConfig,
                "getStatus":this.getStatus,
                "getChannel":this.getChannel,
                "getQueue":this.getQueue,
                "getUsername":this.getUsername,
                "getSessionID":this.getSessionID,
                "getDataStreamID":this.getDataStreamID,
                "getCurrentRealm":this.getCurrentRealm,
                "getCurrentDriver":this.getCurrentDriver,
                "start":this.start,
                "stop":this.stop,
                "destroy":this.destroy,
                "subscribe":this.subscribe
            };

            return client;
        }

        /*
          Ends Scope of "Session"
         */

        /*
         *  ************************************************************************************
         *  Channel
         *  ************************************************************************************
         */

        /*
            Class: Channel
            A <Channel> object is returned by any call to <Session.getChannel()>.
            All <Channel> objects are created with this factory method;
            <Channel> has no built-in public constructor method.
        */

        function Channel(channelName, listenerManager, parentSession) {

            // API and Client Objects
            var self = this;
            var client;

            var lm = listenerManager;
            var subscribed = false;
            var startEID = 0;
            var filter = "";
            var alias;
            var currentEID =-1;

            this.getClientResource = function () {
                return client;
            };

            /*
                Function: subscribe()

                    Subscribes to the <Channel>, and begins receiving events.

                    Each successful subscription or failure will fire an observable event both on the respective
                    <Channel> resource object, *and* on the <Session> (see <Nirvana.Observe> for applicable observables).

                Returns:

                    The <Channel> object on which <Channel.subscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > var myChannel = mySession.getChannel("/some/channel");
                    >
                    > function eventHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    >
                    > myChannel.on(Nirvana.Observe.DATA, eventHandler);
                    > myChannel.subscribe();

                Additional Information:

                    For more information on assignment of listeners for subscription success or failure and for
                    receipt of individual events, please see <Session.subscribe()>, as the techniques and caveats
                    discussed there also apply.

                See Also:

                    <Nirvana.Observe>

            */

            this.subscribe = function () {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_SUBSCRIBE,
                    "session":parentSession,
                    "resource":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*
                Function: unsubscribe()

                    Unsubscribes from the <Channel>, and stops receiving events.

                    A successful or failed unsubscription attempt will fire an observable event on the <Channel>
                    (see <Nirvana.Observe> for applicable observables).

                Returns:

                    The <Channel> object on which <Channel.unsubscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > function unsubscribeHandler(resource) {
                    >    console.log("Unsubscribed from: " + resource.getName());
                    > }
                    >
                    > myChannel.on(Nirvana.Observe.UNSUBSCRIBE, unsubscribeHandler);
                    > myChannel.unsubscribe();

                See Also:

                    <Channel.subscribe()>, <Session.subscribe()>, <Nirvana.Observe>

            */

            this.unsubscribe = function () {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_UNSUBSCRIBE,
                    "session":parentSession,
                    "resource":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            this.getAlias = function () {
                return alias;
            };

            this.setAlias = function (newAlias) {
                alias = newAlias;
            };

            this.setSubscribed = function (subscribeState) {
                subscribed = subscribeState;
                if(subscribed === false){
                    currentEID=-1;
                }
            };

            /*
                Function: isSubscribed()

                Returns true or false, depending on whether a subscription exists for the <Channel>.

                Returns:

                    A boolean value of true or false.

                Example Usage:

                    > if ( !myChannel.isSubscribed() ) {
                    >    myChannel.subscribe();
                    > }

                See Also:

                    <Channel.subscribe()>, <Session.subscribe()>

            */

            this.isSubscribed = function () {
                return subscribed;
            };

            /*

            Function: publish()

                Publishes a Universal Messaging <Event> to the <Channel>.

            Parameters:

                event - the Universal Messaging <Event> which is to be published to this <Channel>.

            Returns:

                The <Channel> object on which <Channel.publish()> was invoked (making this a chainable method).

            Example Usage:

                > var myEvent = Nirvana.createEvent();
                > var myDict = myEvent.getDictionary();
                > myDict.putString("message", "Hello World");
                > myChannel.publish(myEvent);

            */

            this.publish = function (event) {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_PUBLISH,
                    "session":parentSession,
                    "resource":self,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*

            Function: createTransaction()

                Factory method to create a new <Transaction> for use on the <Channel>.

            Returns:

                A new <Transaction> object.

            Example Usage:

                > var myTransaction = myChannel.createTransaction();

            */

            this.createTransaction = function () {
                var listenerManager = createListenerManager();
                var txID = parentSession.getSessionID() + Utils.generateTransactionID();
                return new Transaction(txID, listenerManager, self);
            };

            /*

            Function: getStartEID()

                Returns the <Event> ID (the "EID") from which an existing subscription to the <Channel> started,
                or from which a subsequent subscription to the <Channel> will start.
                This defaults to 0 unless it is set with <setStartEID()>.

            Returns:

                An integer representing the EID from which any subscription on the <Channel> will start.

            Example Usage:

                > var startEID = myChannel.getStartEID();

            See Also:

                <Channel.setStartEID()>, <Channel.subscribe()>, <Channel.getFilter()>, <Channel.setFilter()>

            */

            this.getStartEID = function () {
                return startEID;
            };

            /*

            Function: setStartEID()

                Sets the <Event> ID (the "EID") from which a subsequent subscription to the <Channel> shall start.
                This defaults to 0 if not set explicitly.

            Parameters:

                eid - the <Event> ID (the "EID") from which any subsequent subscription to the <Channel> shall start.

            Returns:

                The <Channel> object on which <Channel.setStartEID()> was invoked (making this a chainable method).

            Example Usage:

                > var myChannel = mySession.getChannel("/some/channel");
                > myChannel.setStartEID(5106); // receive only events with EID 5016 or higher
                > myChannel.subscribe();

            See Also:

                <Channel.getStartEID()>, <Channel.subscribe()>, <Channel.getFilter()>, <Channel.setFilter()>

            */

            this.setStartEID = function (eid) {
                startEID = eid;
                return client;
            };

            /*

             Function: getCurrentEID()

             Returns the <Event> ID (the "EID") which an existing subscription to the <Channel> is at.
             This defaults to -1 before any events are received.

             Returns:

             An integer representing the EID which the subscription on the <Channel> is up to.

             Example Usage:

             > var currentEID = myChannel.getCurrentEID();

             See Also:

             <Channel.setCurrentEID()>, <Channel.subscribe()>, <Channel.getFilter()>, <Channel.setFilter()>

             */

            this.getCurrentEID = function () {
                return currentEID;
            };

            this.setCurrentEID = function(newEID) {
                currentEID = newEID;
            };

            /*
                Function: getFilter()

                    Returns the SQL-style filter applied to an existing or subsequent subscription to the <Channel>.
                    By default, no filter is used unless one is set with <setFilter()>.

                Returns:

                    A string representing the filter applied to an existing or subsequent subscription to the <Channel>.

                Example Usage:

                    > var filter = myChannel.getFilter();

                See Also:

                    <Channel.setFilter()>, <Channel.subscribe()>, <Channel.getStartEID()>, <Channel.setStartEID()>

            */

            this.getFilter = function () {
                return filter;
            };

            /*

            Function: setFilter()

                Sets the SQL-style filter to be applied to a subsequent subscription to the <Channel>.
                No filter is applied to a subscription if one is not set explicitly using this method.

            Parameters:

                filter - the SQL-style filter to be applied to a subsequent subscription to the <Channel>.

            Returns:

                The <Channel> object on which <Channel.setFilter()> was invoked (making this a chainable method).

            Example Usage:

                > var myChannel = mySession.getChannel("/some/channel");
                > // receive only events matching the following filter:
                > myChannel.setFilter("currencypair = 'USDGBP' AND price < 0.6385");
                > myChannel.subscribe();

            See Also:

                <Channel.getFilter()>, <Channel.subscribe()>, <Channel.getStartEID()>, <Channel.setStartEID()>

            */

            this.setFilter = function (newFilter) {
                filter = newFilter;
                return client;
            };

            /*

            Function: getName()

                Returns the <Channel's> fully qualified name (e.g. "/some/channel").

            Returns:

                A string representing the <Channel's> fully qualified name.

            Example Usage:

                > var channelName = myChannel.getName();

            See Also:

                <Session.getChannel()>

            */

            this.getName = function () {
                return channelName;
            };

            /*

            Function: getResourceType()

                Returns the constant <Nirvana.CHANNEL_RESOURCE>, which identifies this resource as a <Channel>.

            Returns:

                A integer constant equal to <Nirvana.CHANNEL_RESOURCE>.

            Example Usage:

                > if (myChannel.getResourceType() === Nirvana.CHANNEL_RESOURCE) {
                >    console.log("myChannel is a channel");
                > }

            */

            this.getResourceType = function () {
                return Nirvana.CHANNEL_RESOURCE;
            };


            /*
                Function: on()

                    Registers a single event listener on the <Channel> for observable events of the specified type
                    (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable -    the type of observable event in which the listener is interested.
                    listener -      the listener function you have implemented, which should handle the parameters
                                    associated with the relevant observable event as defined in <Nirvana.Observe>.

                Returns:

                    The <Channel> object on which <Channel.on()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    > myChannel.on(Nirvana.Observe.DATA, myHandler);

                Additional Information:

                    For more information on assigning listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <Channel.removeListener()>, <Nirvana.Observe>

            */

            this.on = function (observable, listener) {
                lm.on(observable, listener);
                return client;
            };

            /*
                Function: removeListener()

                Removes a specific listener for observable events of the specified type (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable - the type of observable event in which the listener was interested.
                    listener - the listener function originally assigned with <on()>, and which should now be removed.

                Returns:

                    The <Channel> object on which <Channel.removeListener()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >   // do something with the evt passed to us as a parameter
                    > }
                    > myChannel.on(Nirvana.Observe.DATA, myHandler);
                    >
                    > // when we want to, we can un-assign the listener:
                    > myChannel.removeListener(Nirvana.Observe.DATA, myHandler);

                Additional Information:

                    For more information on removing listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <Channel.on()>, <Nirvana.Observe>

            */

            this.removeListener = function (observable, listener) {
                lm.removeListener(observable, listener);
                return client;
            };

            this.notifyListeners = function (observable, obj, data) {
                lm.notifyListeners(observable, obj, data);
            };

            // Set API and Client Versions
            parentSession.pushResource(self);
            client = {
                "on":this.on,
                "removeListener":this.removeListener,
                "subscribe":this.subscribe,
                "unsubscribe":this.unsubscribe,
                "isSubscribed":this.isSubscribed,
                "publish":this.publish,
                "createTransaction":this.createTransaction,
                "getStartEID":this.getStartEID,
                "setStartEID":this.setStartEID,
                "getFilter":this.getFilter,
                "setFilter":this.setFilter,
                "getName":this.getName,
                "getResourceType":this.getResourceType
            };

            return client;
        }

        /*
         *  ************************************************************************************
         *  Queue
         *  ************************************************************************************
         */

        /*
            Class: Queue
            A <Queue> object is returned by any call to <Session.getQueue()> when the
            optional second Queue, _isTransactionalReader_, is either *not supplied or is false*.

            If the optional second parameter is _true_, then a <TransactionalQueue> object is returned instead.

            All <Queue> objects are created with this factory method;
            <Queue> has no built-in public constructor method.

            See Also:

                <TransactionalQueue>
        */

        function Queue(queueName, listenerManager, parentSession) {

            var self = this;
            var client;

            var lm = listenerManager;
            var subscribed = false;
            var filter = "";
            var alias;

            this.getClientResource = function () {
                return client;
            };

            /*
                Function: subscribe()

                    Subscribes to the <Queue>, and begins receiving events.

                    Each successful subscription or failure will fire an observable event both on the respective
                    <Queue> resource object, *and* on the <Session> (see <Nirvana.Observe> for applicable observables).

                Returns:

                    The <Queue> object on which <Queue.subscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > var myQueue = mySession.getChannel("/some/queue");
                    >
                    > function eventHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    >
                    > myQueue.on(Nirvana.Observe.DATA, eventHandler);
                    > myQueue.subscribe();

                Additional Information:

                    For more information on assignment of listeners for subscription success or failure and for
                    receipt of individual events, please see <Session.subscribe()>, as the techniques and caveats
                    discussed there also apply.

                See Also:

                    <Nirvana.Observe>

            */

            this.subscribe = function () {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_SUBSCRIBE,
                    "session":parentSession,
                    "resource":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*
                Function: unsubscribe()

                    Unsubscribes from the <Queue>, and stops receiving events.

                    A successful or failed unsubscription attempt will fire an observable event on the <Queue>
                    (see <Nirvana.Observe> for applicable observables).

                Returns:

                    The <Queue> object on which <Queue.unsubscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > function unsubscribeHandler(resource) {
                    >    console.log("Unsubscribed from: " + resource.getName());
                    > }
                    >
                    > myQueue.on(Nirvana.Observe.UNSUBSCRIBE, unsubscribeHandler);
                    > myQueue.unsubscribe();

                See Also:

                    <Queue.subscribe()>, <Session.subscribe()>, <Nirvana.Observe>

            */

            this.unsubscribe = function () {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_UNSUBSCRIBE,
                    "session":parentSession,
                    "resource":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            this.getAlias = function () {
                return alias;
            };

            this.setAlias = function (newAlias) {
                alias = newAlias;
            };

            this.setSubscribed = function (subscriptionState) {
                subscribed = subscriptionState;
            };


            /*
                Function: isSubscribed()

                Returns true or false, depending on whether a subscription exists for the <Queue>.

                Returns:

                    A boolean value of true or false.

                Example Usage:

                    > if ( !myQueue.isSubscribed() ) {
                    >    myQueue.subscribe();
                    > }

                See Also:

                    <Queue.subscribe()>, <Session.subscribe()>

            */

            this.isSubscribed = function () {
                return subscribed;
            };

            /*

            Function: publish()

                Publishes a Universal Messaging <Event> to the <Queue>.

            Parameters:

                event - the Universal Messaging <Event> which is to be published to this <Queue>.

            Returns:

                The <Queue> object on which <Queue.publish()> was invoked (making this a chainable method).

            Example Usage:

                > var myEvent = Nirvana.createEvent();
                > var myDict = myEvent.getDictionary();
                > myDict.putString("message", "Hello World");
                > myQueue.publish(myEvent);

            */

            this.publish = function (event) {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_PUBLISH,
                    "session":parentSession,
                    "resource":self,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*
                Function: createTransaction()

                    Factory method to create a new <Transaction> for use on the <Queue>.

                Returns:

                    A new <Transaction> object.

                Example Usage:

                    > var myTransaction = myQueue.createTransaction();

            */

            this.createTransaction = function () {
                var listenerManager = createListenerManager();
                var txID = parentSession.getSessionID() + Utils.generateTransactionID();
                return new Transaction(txID, listenerManager, self);
            };

            /*
                Function: getFilter()

                    Returns the SQL-style filter applied to an existing or subsequent subscription to the <Queue>.
                    By default, no filter is used unless one is set with <setFilter()>.

                Returns:

                    A string representing the filter applied to an existing or subsequent subscription to the <Queue>.

                Example Usage:

                    > var filter = myQueue.getFilter();

                See Also:

                    <Queue.setFilter()>, <Queue.subscribe()>

            */

            this.getFilter = function () {
                return filter;
            };

            /*

            Function: setFilter()

                Sets the SQL-style filter to be applied to a subsequent subscription to the <Queue>.
                No filter is applied to a subscription if one is not set explicitly using this method.

            Parameters:

                filter - the SQL-style filter to be applied to a subsequent subscription to the <Queue>.

            Returns:

                The <Queue> object on which <Queue.setFilter()> was invoked (making this a chainable method).

            Example Usage:

                > var myQueue = mySession.getQueue("/some/queue");
                > // receive only events matching the following filter:
                > myQueue.setFilter("currencypair = 'USDGBP' AND price < 0.6385");
                > myQueue.subscribe();

            See Also:

                <Queue.getFilter()>, <Queue.subscribe()>

            */

            this.setFilter = function (newFilter) {
                filter = newFilter;
                return client;
            };

            /*

            Function: getName()

                Returns the <Queue's> fully qualified name (e.g. "/some/queue").

            Returns:

                A string representing the <Queue's> fully qualified name.

            Example Usage:

                > var queueName = myQueue.getName();

            See Also:

                <Session.getQueue()>

            */

            this.getName = function () {
                return queueName;
            };

            /*

            Function: getResourceType()

                Returns the constant <Nirvana.QUEUE_RESOURCE>, which identifies this resource as a <Queue>.

            Returns:

                A integer constant equal to <Nirvana.QUEUE_RESOURCE>.

            Example Usage:

                > if (myQueue.getResourceType() === Nirvana.QUEUE_RESOURCE) {
                >    console.log("myQueue is a queue");
                > }

            */

            this.getResourceType = function () {
                return Nirvana.QUEUE_RESOURCE;
            };


            /*
                Function: on()

                    Registers a single event listener on the <Queue> for observable events of the specified type
                    (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable -    the type of observable event in which the listener is interested.
                    listener -      the listener function you have implemented, which should handle the parameters
                                    associated with the relevant observable event as defined in <Nirvana.Observe>.

                Returns:

                    The <Queue> object on which <Queue.on()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    > myQueue.on(Nirvana.Observe.DATA, myHandler);

                Additional Information:

                    For more information on assigning listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <Queue.removeListener()>, <Nirvana.Observe>

            */

            this.on = function (observable, listener) {
                lm.on(observable, listener);
                return client;
            };

            /*
                Function: removeListener()

                Removes a specific listener for observable events of the specified type (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable - the type of observable event in which the listener was interested.
                    listener - the listener function originally assigned with <on()>, and which should now be removed.

                Returns:

                    The <Queue> object on which <Queue.removeListener()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >   // do something with the evt passed to us as a parameter
                    > }
                    > myQueue.on(Nirvana.Observe.DATA, myHandler);
                    >
                    > // when we want to, we can un-assign the listener:
                    > myQueue.removeListener(Nirvana.Observe.DATA, myHandler);

                Additional Information:

                    For more information on removing listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <Queue.on()>, <Nirvana.Observe>

            */

            this.removeListener = function (observable, listener) {
                lm.removeListener(observable, listener);
                return client;
            };

            this.notifyListeners = function (observable, obj, data) {
                lm.notifyListeners(observable, obj, data);
            };

            parentSession.pushResource(self);
            client = {
                "on":this.on,
                "removeListener":this.removeListener,
                "subscribe":this.subscribe,
                "unsubscribe":this.unsubscribe,
                "isSubscribed":this.isSubscribed,
                "publish":this.publish,
                "getFilter":this.getFilter,
                "setFilter":this.setFilter,
                "getName":this.getName,
                "getResourceType":this.getResourceType,
                "createTransaction":this.createTransaction
            };

            return client;
        }

        /*
         *  ************************************************************************************
         *  TransactionalQueue (Queue with transactional read behaviour)
         *  ************************************************************************************
         */

        /*
            Class: TransactionalQueue

            A <TransactionalQueue> object is returned by any call to <Session.getQueue()> when the
            optional second parameter, _isTransactionalReader_, is *true*.

            If the optional second parameter is either not supplied or is false, then a basic <Queue> object is returned instead.

            All <TransactionalQueue> objects are created with this factory method;
            <TransactionalQueue> has no built-in public constructor method.

            A <TransactionalQueue> is a type of <Queue>, but with additional transactional read behaviour.
            It offers all of the methods of <Queue>, but also offers the following additional methods:

                - <TransactionalQueue.commit()>,
                - <TransactionalQueue.commitAll()>,
                - <TransactionalQueue.rollback()>,
                - <TransactionalQueue.setWindowSize()> and
                - <TransactionalQueue.getWindowSize()>.

            See Also:

                <Queue>

        */


        function TransactionalQueue(queueName, listenerManager, parentSession) {

            var self = this;
            var client;

            var subscribed = false;
            var lm = listenerManager;
            var filter = "";
            var windowSize = 5;
            var alias;

            this.getClientResource = function () {
                return client;
            };

            /*
                Function: subscribe()

                    Subscribes to the <TransactionalQueue>, and begins receiving events.

                    Each successful subscription or failure will fire an observable event both on the respective
                    <TransactionalQueue> resource object, *and* on the <Session> (see <Nirvana.Observe> for applicable observables).

                Returns:

                    The <TransactionalQueue> object on which <TransactionalQueue.subscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > var myTransactionalQueue = mySession.getChannel("/some/queue");
                    >
                    > function eventHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    >
                    > myTransactionalQueue.on(Nirvana.Observe.DATA, eventHandler);
                    > myTransactionalQueue.subscribe();

                Additional Information:

                    For more information on assignment of listeners for subscription success or failure and for
                    receipt of individual events, please see <Session.subscribe()>, as the techniques and caveats
                    discussed there also apply.

                See Also:

                    <Nirvana.Observe>

            */

            this.subscribe = function () {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_SUBSCRIBE,
                    "session":parentSession,
                    "resource":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*
                Function: unsubscribe()

                    Unsubscribes from the <TransactionalQueue>, and stops receiving events.

                    A successful or failed unsubscription attempt will fire an observable event on the <Queue>
                    (see <Nirvana.Observe> for applicable observables).

                Returns:

                    The <TransactionalQueue> object on which <TransactionalQueue.unsubscribe()> was invoked (making this a chainable method).

                Example Usage:

                    > function unsubscribeHandler(resource) {
                    >    console.log("Unsubscribed from: " + resource.getName());
                    > }
                    >
                    > myTransactionalQueue.on(Nirvana.Observe.UNSUBSCRIBE, unsubscribeHandler);
                    > myTransactionalQueue.unsubscribe();

                See Also:

                    <TransactionalQueue.subscribe()>, <Session.subscribe()>, <Nirvana.Observe>

            */

            this.unsubscribe = function () {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_UNSUBSCRIBE,
                    "session":parentSession,
                    "resource":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            this.getAlias = function () {
                return alias;
            };

            this.setAlias = function (newAlias) {
                alias = newAlias;
            };

            this.setSubscribed = function (subscribedState) {
                subscribed = subscribedState;
            };

            /*
                Function: isSubscribed()

                Returns true or false, depending on whether a subscription exists for the <TransactionalQueue>.

                Returns:

                    A boolean value of true or false.

                Example Usage:

                    > if ( !myTransactionalQueue.isSubscribed() ) {
                    >    myTransactionalQueue.subscribe();
                    > }

                See Also:

                    <TransactionalQueue.subscribe()>, <Session.subscribe()>

            */

            this.isSubscribed = function () {
                return subscribed;
            };

            /*

            Function: publish()

                Publishes a Universal Messaging <Event> to the <TransactionalQueue>.

            Parameters:

                event - the Universal Messaging <Event> which is to be published to this <TransactionalQueue>.

            Returns:

                The <TransactionalQueue> object on which <TransactionalQueue.publish()> was invoked (making this a chainable method).

            Example Usage:

                > var myEvent = Nirvana.createEvent();
                > var myDict = myEvent.getDictionary();
                > myDict.putString("message", "Hello World");
                > myTransactionalQueue.publish(myEvent);

            */

            this.publish = function (event) {
                var command = {
                    "requestType":PrivateConstants.RESOURCE_PUBLISH,
                    "session":parentSession,
                    "resource":self,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };


            /*

             Function: createTransaction()

             Factory method to create a new <Transaction> for use on the <TransactionalQueue>.

             Returns:

             A new <Transaction> object.

             Example Usage:

             > var myTransaction = myTransactionalQueue.createTransaction();

             */

            this.createTransaction = function () {
                var listenerManager = createListenerManager();
                var txID = parentSession.getSessionID() + Utils.generateTransactionID();
                return new Transaction(txID, listenerManager, self);
            };

            /*

            Function: commit()

                Commits the read of the supplied <Event> on the <TransactionalQueue>. If there are any <Event> objects
                which the client has previously received but not called commit on, they will be implicitly committed.

            Parameters:

                event - the Universal Messaging <Event> for which a read is to be committed on this <TransactionalQueue>.

            Returns:

                The <TransactionalQueue> object on which <TransactionalQueue.commit()> was invoked (making this a chainable method).

            Example Usage:

                > var dataCallback = function(event) {
                >   myQueue.commit(event); // commit every event we receive
                > }
                >
                > myQueue.on(Nirvana.Observe.DATA, dataCallback);

            */

            this.commit = function (event) {
                var command = {
                    "requestType":PrivateConstants.QUEUE_COMMIT,
                    "session":parentSession,
                    "resource":self,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*

            Function: commitAll()

                Commits the read of all received <Events> on the <TransactionalQueue>. This behaves the same as committing the
                most recent event received by the client.

            Returns:

                The <TransactionalQueue> object on which <TransactionalQueue.commitAll()> was invoked (making this a chainable method).

            Example Usage:

                > var dataCallback = function(event) {
                >   myQueue.commitAll(); // Same as doing myQueue.commit(event)
                > }
                >
                > myQueue.on(Nirvana.Observe.DATA, dataCallback);

            */

            this.commitAll = function () {
                var command = {
                    "requestType":PrivateConstants.QUEUE_COMMIT,
                    "session":parentSession,
                    "resource":self,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*

            Function: rollback()

                Performs a Roll back of the <TransactionalQueue> to the supplied <Event>. Any uncommitted events received after the
                given parameter will be added to the queue and redelivered to clients.

                Note that different clients may receive the redelivered events.

            Parameters:

                event - the Universal Messaging <Event> for which a read is to be rolled back from this <TransactionalQueue>.

            Returns:

                The <TransactionalQueue> object on which <TransactionalQueue.rollback()> was invoked (making this a chainable method).

            Example Usage:

                > var myEvents = [];
                >
                > var dataCallback = function(event) {
                >   myEvents.push(event);
                >
                >   if(myEvents.length === 5) {
                >       myQueue.rollback(myEvents[0]); // Rolls back myEvents[1] to myEvents[4]
                >   }
                >
                > }
                >
                > myQueue.on(Nirvana.Observe.DATA, dataCallback);

            */

            this.rollback = function (event) {
                var command = {
                    "requestType":PrivateConstants.QUEUE_ROLLBACK,
                    "session":parentSession,
                    "resource":self,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*
                Function: getFilter()

                    Returns the SQL-style filter applied to an existing or subsequent subscription to the <TransactionalQueue>.
                    By default, no filter is used unless one is set with <setFilter()>.

                Returns:

                    A string representing the filter applied to an existing or subsequent subscription to the <TransactionalQueue>.

                Example Usage:

                    > var filter = myTransactionalQueue.getFilter();

                See Also:

                    <TransactionalQueue.setFilter()>, <TransactionalQueue.subscribe()>

            */

            this.getFilter = function () {
                return filter;
            };

            /*
            Function: setFilter()

                Sets the SQL-style filter to be applied to a subsequent subscription to the <TransactionalQueue>.
                No filter is applied to a subscription if one is not set explicitly using this method.

            Parameters:

                filter - the SQL-style filter to be applied to a subsequent subscription to the <TransactionalQueue>.

            Returns:

                The <TransactionalQueue> object on which <TransactionalQueue.setFilter()> was invoked (making this a chainable method).

            Example Usage:

                > var myTransactionalQueue = mySession.getQueue("/some/queue");
                > // receive only events matching the following filter:
                > myTransactionalQueue.setFilter("currencypair = 'USDGBP' AND price < 0.6385");
                > myTransactionalQueue.subscribe();

            See Also:

                <TransactionalQueue.getFilter()>, <TransactionalQueue.subscribe()>

            */

            this.setFilter = function (newFilter) {
                filter = newFilter;
                return client;
            };

            /*
                Function: getWindowSize()

                    Returns the window size for transactional reading on the <TransactionalQueue>.
                    By default, its value is 5 unless changed with <TransactionalQueue.setWindowSize()>.

                    The window size for a <TransactionalQueue> indicates how many events will be delivered by
                    the server to the client before the client must call <TransactionalQueue.commit()> or
                    <TransactionalQueue.rollback()>.

                Returns:

                    An integer representing the window size of the current or future subscription to this <TransactionalQueue>.

                Example Usage:

                    > var windowSize = myTransactionalQueue.getWindowSize();

                See Also:

                    <TransactionalQueue.setWindowSize()>

            */

            this.getWindowSize = function () {
                return windowSize;
            };

            /*

            Function: setWindowSize()

                Sets the window size for transactional reading on the <TransactionalQueue>.

                This defines the number of <Events> that can be read before the reads are committed with a call to
                <TransactionalQueue.commit(Event)> or <TransactionalQueue.rollback()>.

                If the window size is not explicitly set with a call to <TransactionalQueue.setWindowSize()>, then
                the default value is 5.

            Parameters:

                A positive integer, greater than 0. Representing the new window size of this <TransactionalQueue>.

            Returns:

                The <TransactionalQueue> object on which <TransactionalQueue.setWindowSize()> was invoked (making this a chainable method).

            Example Usage:

                > myTransactionalQueue.setWindowSize(10);

            See Also:

                <TransactionalQueue.getWindowSize()>

            */

            this.setWindowSize = function (newWindowSize) {
                windowSize = newWindowSize;
                return client;
            };


            /*

            Function: getName()

                Returns the <TransactionalQueue's> fully qualified name (e.g. "/some/queue").

            Returns:

                A string representing the <TransactionalQueue's> fully qualified name.

            Example Usage:

                > var transactionalQueueName = myTransactionalQueue.getName();

            See Also:

                <Session.getQueue()>

            */

            this.getName = function () {
                return queueName;
            };

            /*

            Function: getResourceType()

                Returns the constant <Nirvana.TRANSACTIONAL_QUEUE_RESOURCE>, which identifies this resource as a <TransactionalQueue>.

            Returns:

                A integer constant equal to <Nirvana.TRANSACTIONAL_QUEUE_RESOURCE>.

            Example Usage:

                > if (myQueue.getResourceType() === Nirvana.TRANSACTIONAL_QUEUE_RESOURCE) {
                >    console.log("myQueue is a queue with a transactional reader");
                > }

            */

            this.getResourceType = function () {
                return Nirvana.TRANSACTIONAL_QUEUE_RESOURCE;
            };


            /*
                Function: on()

                    Registers a single event listener on the <TransactionalQueue> for observable events of the specified type
                    (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable -    the type of observable event in which the listener is interested.
                    listener -      the listener function you have implemented, which should handle the parameters
                                    associated with the relevant observable event as defined in <Nirvana.Observe>.

                Returns:

                    The <TransactionalQueue> object on which <TransactionalQueue.on()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >    console.log("Received event from: " + evt.getResourceName());
                    > }
                    > myTransactionalQueue.on(Nirvana.Observe.DATA, myHandler);

                Additional Information:

                    For more information on assigning listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <TransactionalQueue.removeListener()>, <Nirvana.Observe>

            */

            this.on = function (observable, listener) {
                lm.on(observable, listener);
                return client;
            };

            /*
                Function: removeListener()

                Removes a specific listener for observable events of the specified type (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable - the type of observable event in which the listener was interested.
                    listener - the listener function originally assigned with <on()>, and which should now be removed.

                Returns:

                    The <TransactionalQueue> object on which <TransactionalQueue.removeListener()> was invoked (making this a chainable method).

                Example Usage:

                    > function myHandler(evt) {
                    >   // do something with the evt passed to us as a parameter
                    > }
                    > myTransactionalQueue.on(Nirvana.Observe.DATA, myHandler);
                    >
                    > // when we want to, we can un-assign the listener:
                    > myTransactionalQueue.removeListener(Nirvana.Observe.DATA, myHandler);

                Additional Information:

                    For more information on removing listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <TransactionalQueue.on()>, <Nirvana.Observe>

            */

            this.removeListener = function (observable, listener) {
                lm.removeListener(observable, listener);
                return client;
            };

            this.notifyListeners = function (observable, obj, data) {
                lm.notifyListeners(observable, obj, data);
            };


            parentSession.pushResource(self);

            client = {
                "on":this.on,
                "removeListener":this.removeListener,
                "subscribe":this.subscribe,
                "unsubscribe":this.unsubscribe,
                "isSubscribed":this.isSubscribed,
                "publish":this.publish,
                "commitAll":this.commitAll,
                "commit":this.commit,
                "rollback":this.rollback,
                "getFilter":this.getFilter,
                "setFilter":this.setFilter,
                "getWindowSize":this.getWindowSize,
                "setWindowSize":this.setWindowSize,
                "getName":this.getName,
                "getResourceType":this.getResourceType,
                "createTransaction": this.createTransaction
            };

            return client;
        }

        /*
            Class: Event
            An <Event> object is returned by any call to <Nirvana.createEvent()>.
            All client-created <Event> objects are created with this factory method; <Event> has no built-in public constructor method.
            In addition, all messages received via a subscription to a resource such as a <Channel> or <Queue> are of type <Event>;
            these <Events> are passed to any subscribed resource's listeners of the <Nirvana.Observe>.DATA observable event.
        */

        function Event(parentSession, eventID, resource, resourceName, eventAttributes, data, tag, dictionary) {
            this.parentSession = parentSession;
            this.dictionary = dictionary;
            this.eventAttributes = eventAttributes;
            this._data = data;
            this.tag = tag;
            this.ttl = 0;
            this.resource = resource;
            this.eventID = eventID;
            this.resourceName = resourceName;
        }

            /*

                Function: getSession()

                    Returns the <Session> with which this <Event> is associated, or null if this is a new client-created <Event>.

                    If an <Event> is received via a subscription to a resource such as a <Channel>, <Queue> or <TransactionalQueue>
                    then this method will return the <Session> object with which the resource, and thus the <Event>, is associated.

                    If an <Event> has been created locally with a call to <Nirvana.createEvent()>, then this method will return null.

                Returns:

                    A <Session> object or null.

                Example Usage:

                    > var s = evt.getSession();
                    > if (s != null) {
                    >    s.getChannel("/some/channel").publish(evt);
                    > }

            */

        Event.prototype.getSession = function getSession() {
            return this.parentSession;
        };

            /*
                Function: getResource()

                    Returns the resource object from which the <Event> was received, or null if this is a new client-created <Event>.

                    If this <Event> was received via a client-initiated subscription, then this method will return
                    the corresponding <Channel>, <Queue> or <TransactionalQueue> object.

                    If this <Event> was received as a result of DataGroup membership via a DataStream-enabled <Session>, this
                    method will return a reference to the <Session> object.

                    If an <Event> has been created locally with a call to <Nirvana.createEvent()>, then this method will return null.

                Returns:

                    The resource from which the <Event> was received, or null if it is a new, locally-created <Event>.

                Example Usage:

                    > var sourceChannel = evt.getResource(); // assuming evt came from a Channel subscription

            */

        Event.prototype.getResource = function getResource() {
            return this.resource;
        };

            /*
                Function: getResourceName()

                    Returns the name of the resource with which the <Event> is associated, or null if this is a new client-created <Event>.

                    If an <Event> is received via a client-initiated subscription to a resource such as a <Channel>, <Queue> or <TransactionalQueue>
                    then this method will return the name of the resource with which the <Event> is associated (e.g. "/some/channel").

                    If this <Event> was received as a result of DataGroup membership via a DataStream-enabled <Session>, this
                    method will return the name of the source DataGroup.

                    If an <Event> has been created locally with a call to <Nirvana.createEvent()>, then this method will return null.

                Returns:

                    A string representing the resource's fully qualified name, or null if it is a new, locally-created <Event>.

                Example Usage:

                    > var channelName = evt.getResourceName(); // assuming evt came from a Channel subscription

            */

        Event.prototype.getResourceName = function getResourceName() {
            return this.resourceName;
        };

            /*
                Function: getTTL()

                    Returns the <Event's> TTL (Time-to-live) in milliseconds.

                Returns:

                    An integer representing the <Event's> TTL in milliseconds.

                Example Usage:

                    > var ttl = evt.getTTL();

                See Also:

                    <Event.setTTL()>

            */

        Event.prototype.getTTL = function getTTL() {
            return this.ttl;
        };

            /*
                Function: setTTL()

                    Sets the <Event's> TTL (Time-to-live) in milliseconds.
                    This is useful if you wish to publish an <Event> that will expire after a certain time.

                Parameters:

                    newTTL - the TTL for this <Event>, in milliseconds.

                Returns:

                    The <Event> object on which <Event.setTTL()> was invoked (making this a chainable method).

                Example Usage:

                    > evt.setTTL(60000); // expire one minute after publishing
                    > myChannel.publish(evt);

                See Also:

                    <Event.getTTL()>

            */

        Event.prototype.setTTL = function setTTL(newTTL) {
            this.ttl = newTTL;
            return this;
        };

            /*
            Function: getEID()

                 Returns the <Event's> ID (the EID).

             Parameters:

                    longFormat - optional <Nirvana.LongType>


             Returns:

                    By default a Number representing the <Event's> ID (EID).
                    If longFormat is provided as a parameter will return the selected type if the Event's origin is from the server

            Example Usage:

                > var eid = evt.getEID();                         //returns the EID as the default, a Number
                > evt.getEID(Nirvana.LongType.LONG_AS_ARRAY);    // returns an array of the EID split into two 32 bit parts
                > evt.getEID(Nirvana.LongType.LONG_AS_DECIMAL_STRING);    // returns the EID as decimal formated string
                > evt.getEID(Nirvana.LongType.LONG_AS_HEXADECIMAL_STRING);    // returns the EID as a hexadecimal string

            */

        Event.prototype.getEID = function getEID(longFormat) {
            return Utils.convertLongFromServer(longFormat, this.eventID);
        };

            /*
                Function: getData()

                    Returns the <Event's> raw data, or _undefined_ if it has no data.

                Parameters:

                    base64Encoded - optional boolean parameter; if true, the data will be returned in base64encoded form.

                Returns:

                    The <Event's> raw data, or _undefined_ if it has no data.

                Example Usage:

                    > evt.setData("Hello World");
                    > evt.getData();        // returns "Hello World"
                    > evt.getData(true);    // returns "SGVsbG8gV29ybGQ="

                See Also:

                    <Event.setData()>, <Event.hasData()>

            */

        Event.prototype.getData = function getData(dataFormat) {
            if (dataFormat == Nirvana.BYTE_ARRAY_AS_BASE64_STRING) {
                return this._data;
            } else if (dataFormat == Nirvana.BYTE_ARRAY_AS_INT_ARRAY) {
                return Utils.base64Decode(this._data, true);
            } else {
                return Utils.base64Decode(this._data);
            }
        };

            /*
                Function: setData()

                    Sets the <Event's> raw data.

                Parameters:

                    data - the data; this is either the raw data or a base64-encoded representation of it.
                    isBase64Encoded - optional boolean parameter; set this to true if the data is already base64-encoded.

                Returns:

                    The <Event> object on which <Event.setData()> was invoked (making this a chainable method).

                Example Usage:

                    > evt.setData("Hello World");
                    > evt.getData();                // returns "Hello World"

                    > evt.setData(Utils.base64Encode("Another Example"), true);
                    > evt.getData();                // returns "Another Example"

                See Also:

                    <Event.getData()>, <Event.hasData()>

            */

        Event.prototype.setData = function setData(data, dataFormat) {
            if (dataFormat == Nirvana.BYTE_ARRAY_AS_BASE64_STRING) {
                this._data = data;
            } else if (dataFormat == Nirvana.BYTE_ARRAY_AS_INT_ARRAY) {
                this._data = Utils.base64Encode(data, true);
            } else {
                this._data = Utils.base64Encode(data);
            }
            return this;
        };

            /*
                Function: getTag()

                    Returns the <Event's> tag, or _undefined_ if it has no data.

                Returns:

                    The <Event's> tag, or _undefined_ if it has no data.

                Example Usage:

                    > console.log(evt.getTag());

                See Also:

                    <Event.setTag()>, <Event.hasTag()>

         */

        Event.prototype.getTag = function getTag() {
            return this.tag;
        };

            /*
                Function: setTag()

                    Sets the <Event's> tag.

                Parameters:

                    newTag - a  string representation of the tag for the <Event>.

                Returns:

                    The <Event> object on which <Event.setTTL()> was invoked (making this a chainable method).

                Example Usage:

                    > evt.setTag("sometag");

                See Also:

                    <Event.getTag()>, <Event.hasTag()>

            */

        Event.prototype.setTag = function setTag(newTag) {
            this.tag = newTag;
            return this;
        };

            /*
                Function: getDictionary()

                    Returns the <Event's> <EventDictionary>. If the <Event> did not explicitly have an <EventDictionary>,
                    then a new, empty <EventDictionary> is initialized for the <Event>.

                    Note that the object returned is a reference to the <Event's> actual <EventDictionary>, not a copy.
                    There is therefore no corresponding _setDictionary()_ method.

                Returns:

                    An <EventDictionary> object.

                Example Usage:

                    > var dict = evt.getDictionary();
                    > dict.putString("message", "Hello World");
                    > myChannel.publish(evt);

                See Also:

                    <Nirvana.createDictionary()>, <EventDictionary>

            */

        Event.prototype.getDictionary = function getDictionary() {
            if (!this.dictionary) {
                this.dictionary = new EventDictionary({});
            }
            return this.dictionary;
        };

            /*
                Function: getEventAttributes()

                    Returns the <Event's> <EventAttributes>. If the <Event> did not explicitly have any <EventAttributes>,
                    then a new, empty <EventAttributes> object is initialized for the <Event>.

                    Note that the object returned is a reference to the <Event's> actual <EventAttributes>, not a copy.
                    There is therefore no corresponding _setEventAttributes()_ method.

                Returns:

                    An <EventAttributes> object.

                Example Usage:

                    > var attribs = evt.getEventAttributes();
                    > attribs.setPublisherName("John Doe");
                    > myChannel.publish(evt);

                See Also:

                    <Event.setTag()>, <Event.hasTag()>

            */

        Event.prototype.getEventAttributes = function getEventAttributes() {
            if (!this.eventAttributes) {
                this.eventAttributes = new EventAttributes({});
            }
            return this.eventAttributes;
        };

            /*
                Function: hasData()

                    Returns true if the <Event> has data, or false otherwise.

                Returns:

                    A boolean value of true or false

                Example Usage:

                    > if (evt.hasData()) {
                    >   console.log(evt.getData());
                    > }

                See Also:

                    <Event.getData()>, <Event.setData()>, <Event.getEncodedData()>, <Event.setEncodedData()>

            */

        Event.prototype.hasData = function hasData() {
            return this._data !== undefined;
        };

            /*
                Function: hasTag()

                    Returns true if the <Event> has a tag, or false otherwise.

                Returns:

                    A boolean value of true or false

                Example Usage:

                    > if (evt.hasTag()) {
                    >   console.log(evt.getTag());
                    > }

                See Also:

                    <Event.getTag()>, <Event.setTag()>

            */

        Event.prototype.hasTag = function hasTag() {
            return this.tag !== undefined;
        };

            /*
                Function: hasDictionary()

                    Returns true if the <Event> has an <EventDictionary>, or false otherwise.

                Returns:

                    A boolean value of true or false

                Example Usage:

                    > if (evt.hasDictionary()) {
                    >    console.log(evt.getDictionary().getKeys());
                    > }

                See Also:

                    <Event.getDictionary()>

            */

        Event.prototype.hasDictionary = function hasDictionary() {
            return this.dictionary !== undefined;
        };

        /*
            Class: EventDictionary
            An <EventDictionary> object is returned by any call to <Event.getDictionary()> or <Nirvana.createDictionary()>.
            All <EventAttributes> objects are created with these two methods;
            <EventAttributes> has no built-in public constructor method.


            Example Usage:

                It is very common to interact with the <EventDictionary> of an <Event> that may have been received through
                a subscription to a resource such as a <Channel> or a <Queue>:

                > var dict = evt.getDictionary();
                > console.log(dict.get("somekey"));

                It is also very common to manipulate an <Event's> <EventDictionary> before publishing the <Event> to
                such a resource:

                > var dict = evt.getDictionary();
                > dict.putString("message", "Hello World");
                > nestedDict = Nirvana.createDictionary();
                > nestedDict.putString("nestedmessage", "Hello again");
                > dict.putDictionary(nestedDict);
                > myChannel.publish(evt);

            Cross-API Data Types:

                Since JavaScript only supports a very basic set of data types, <EventDictionaries> include extra data
                type information for each key/value pair. This permits communication with Universal Messaging clients built with
                APIs in other languages that include more sophisticated data type support.
                A number of constants to represent these types are defined within <EventDictionary> (see below).


            Constants: STRING
            <EventDictionary.STRING> is an integer constant representing the *String* data type.

            See Also:
                <EventDictionary.putString()>, <EventDictionary.getType()>


            Constants: LONG
            <EventDictionary.LONG> is an integer constant representing the *Long* data type.

            See Also:
                <EventDictionary.putLong()>, <EventDictionary.getType()>

            Constants: DOUBLE
            <EventDictionary.DOUBLE> is an integer constant representing the *Double* data type.

            See Also:
                <EventDictionary.putDouble()>, <EventDictionary.getType()>

            Constants: BOOLEAN
            <EventDictionary.BOOLEAN> is an integer constant representing the *Boolean* data type.

            See Also:
                <EventDictionary.putBoolean()>, <EventDictionary.getType()>

            Constants: INTEGER
            <EventDictionary.INTEGER> is an integer constant representing the *Integer* data type.

            See Also:
                <EventDictionary.putInteger()>, <EventDictionary.getType()>

            Constants: FLOAT
            <EventDictionary.FLOAT> is an integer constant representing the *Float* data type.

            See Also:
                <EventDictionary.putFloat()>, <EventDictionary.getType()>

            Constants: CHARACTER
            <EventDictionary.CHARACTER> is an integer constant representing the *Character* data type.

            See Also:
                <EventDictionary.putChar()>, <EventDictionary.getType()>

            Constants: BYTE
            <EventDictionary.BYTE> is an integer constant representing the *Byte* data type.

            See Also:
                <EventDictionary.putByte()>, <EventDictionary.getType()>

            Constants: DICTIONARY
            <EventDictionary.DICTIONARY> is an integer constant representing the *<EventDictionary>* data type (useful for nested <EventDictionaries>).

            See Also:
                <EventDictionary.putDictionary()>, <EventDictionary.getType()>

            Constants: ARRAY
            <EventDictionary.ARRAY> is an integer constant representing the *Array* data type.

            See Also:
                <EventDictionary.putArray()>, <EventDictionary.getType()>, <EventDictionary.getArrayType()>
        */

        EventDictionary.STRING = 0;
        EventDictionary.LONG = 1;
        EventDictionary.DOUBLE = 2;
        EventDictionary.BOOLEAN = 3;
        EventDictionary.INTEGER = 4;
        EventDictionary.FLOAT = 5;
        EventDictionary.CHARACTER = 6;
        EventDictionary.BYTE = 7;
        EventDictionary.DICTIONARY = 9;
        EventDictionary.ARRAY = -1;

        EventDictionary.createDictionary = function () {
            return new EventDictionary({});
        };


        function EventDictionary(innerProperties) {
            this.innerProperties = innerProperties;
        }

            /*
                Function: getKeys()

                    Returns an array of the keys contained in the <EventDictionary>.

                Returns:

                    An array of key names.

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().getKeys(); // returns []
                    >
                    > evt.getDictionary().putString("message", "Hello World");
                    > evt.getDictionary().getKeys(); // returns ["message"]

                See Also:

                    <EventDictionary.get()>

            */

        EventDictionary.prototype.getKeys = function () {
            var keys = [];
            for (var key in this.innerProperties) {
                if(this.innerProperties.hasOwnProperty(key)){
                    keys.push(key);
                }
            }
            return keys;
        };

            /*
                Function: get()

                    Returns the value to which the <EventDictionary> maps the specified key.

                Parameters:

                    key - a string representing the name of the key.
                    longType - a <Nirvana.LongType> used if the type being returned is a long and from the server when more than the accuracy of Javascript Number is required

                Returns:

                    The value to which this <EventDictionary> maps the specified key.

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    > evt.getDictionary().putString("message", "Hello World");
                    > evt.getDictionary().get("message"); // returns "Hello World"

                    A common use case is to examine the values of <EventDictionary> entries after receiving an <Event>
                    via a subscription to a resource:

                    > function myHandler(evt) {
                    >    console.log(evt.getDictionary().get("currencypair"));
                    >    console.log(evt.getDictionary().get("price"));
                    > }
                    > myChannel.addHandler(Nirvana.Observe.DATA, myHandler);
                    > myChannel.subscribe();

                See Also:

                    <EventDictionary.getKeys()>, <EventDictionary.getType()>, <EventDictionary.getArrayType()>
                    along with the various type-specific *put* methods,
                    <EventDictionary.get()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */



        EventDictionary.prototype.get = function (key, longType) {
            if (this.innerProperties.hasOwnProperty(key)) {
                var wholeEntry = this.innerProperties[key];
                if(wholeEntry[0] === Nirvana.EventDictionary.ARRAY){
                    if(wholeEntry[1] === Nirvana.EventDictionary.LONG){
                        var length = wholeEntry[2].length;
                        var actualArr = wholeEntry[2];
                        var returnArray = [];
                        for(var i =0; i<length; i++){
                            returnArray[i]=Utils.convertLongFromServer(longType, actualArr[i]);
                        }
                        return returnArray;
                    }
                    return wholeEntry[2];
                } else {
                    if(wholeEntry[0] === Nirvana.EventDictionary.LONG){
                        return Utils.convertLongFromServer(longType, wholeEntry[1]);
                    }
                    return wholeEntry[1];
                }
            }
            return null;
        };

            /*
                Function: getType()

                    Returns the *type* of the value to which the <EventDictionary> maps the specified key.

                Parameters:

                    key - a string representing the name of the key.

                Returns:

                    An integer constant representing the type. See <EventDictionary.Constants>.

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putString("message", "Hello World");
                    > evt.getDictionary().getKeys(); // returns ["message"]

                See Also:

                    <EventDictionary.Constants>, <EventDictionary.get()>, <EventDictionary.getArrayType()>

            */

        EventDictionary.prototype.getType = function (key) {
            return this.innerProperties[key][0];
        };

            /*
                Function: getArrayType()

                    Returns the *type of the entries* in the array value to which the <EventDictionary> maps the specified key.

                Parameters:

                    name - a string representing the name of the array.

                Returns:

                    An integer constant representing the type.

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putArray("myArray", ["Hello","World"], EventDictionary.STRING);
                    > evt.getDictionary().get("myArray"); // returns ["Hello","World"]
                    > evt.getDictionary().getType("myArray") === EventDictionary.ARRAY; // true
                    > evt.getDictionary().getArrayType("myArray") === EventDictionary.STRING; // true

                See Also:

                    <EventDictionary.ARRAY>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.putArray()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>

            */

        EventDictionary.prototype.getArrayType = function (key) {
            return this.innerProperties[key][1];
        };

        EventDictionary.prototype.put = function (key, value, type) {
            this.innerProperties[key] = [type, value];
            return this;
        };

            /*
                Function: putString()

                    Associates the specified String value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the String value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putString()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putString("message", "Hello World");
                    > evt.getDictionary().get("message"); // returns "Hello World"

                See Also:

                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putString = function (key, value) {
            this.innerProperties[key] = [EventDictionary.STRING, value];
            return this;
        };

            /*
                Function: putLong()

                    Associates the specified String value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Long value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putLong()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putLong("myLong", 42424242);
                    > evt.getDictionary().get("myLong"); // returns 42424242
                    > evt.getDictionary().getType("myLong") === EventDictionary.LONG; // true

                See Also:

                    <EventDictionary.LONG>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putLong = function (key, value) {
            this.innerProperties[key] = [EventDictionary.LONG, value];
            return this;
        };

            /*
                Function: putDouble()

                    Associates the specified <EventDictionary.DOUBLE> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Double value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putDouble()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putDouble("myDouble", 42.424242);
                    > evt.getDictionary().get("myDouble"); // returns 42.424242
                    > evt.getDictionary().getType("myDouble") === EventDictionary.DOUBLE; // true

                See Also:

                    <EventDictionary.DOUBLE>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putDouble = function (key, value) {
            this.innerProperties[key] = [EventDictionary.DOUBLE, value];
            return this;
        };

            /*
                Function: putBoolean()

                    Associates the specified <EventDictionary.BOOLEAN> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Boolean value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putBoolean()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putBoolean("myBoolean", true);
                    > evt.getDictionary().get("myBoolean"); // returns true
                    > evt.getDictionary().getType("myBoolean") === EventDictionary.BOOLEAN; // true

                See Also:

                    <EventDictionary.BOOLEAN>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putBoolean = function (key, value) {
            this.innerProperties[key] = [EventDictionary.BOOLEAN, value];
            return this;
        };

            /*
                Function: putInteger()

                    Associates the specified <EventDictionary.INTEGER> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Integer value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putInteger()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putInteger("myInt", 42);
                    > evt.getDictionary().get("myInt"); // returns 42
                    > evt.getDictionary().getType("myInt") === EventDictionary.INTEGER; // true

                See Also:

                    <EventDictionary.INTEGER>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putInteger = function (key, value) {
            this.innerProperties[key] = [EventDictionary.INTEGER, value];
            return this;
        };

            /*
                Function: putFloat()

                    Associates the specified <EventDictionary.FLOAT> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Float value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putFloat()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putFloat("myFloat", 1.234);
                    > evt.getDictionary().get("myFloat"); // returns 1.234
                    > evt.getDictionary().getType("myFloat") === EventDictionary.FLOAT; // true

                See Also:

                    <EventDictionary.FLOAT>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putFloat = function (key, value) {
            this.innerProperties[key] = [EventDictionary.FLOAT, value];
            return this;
        };

            /*
                Function: putChar()

                    Associates the specified <EventDictionary.CHARACTER> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Character value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putChar()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putChar("myCharVal", "x");
                    > evt.getDictionary().get("myCharVal"); // returns "x"
                    > evt.getDictionary().getType("myCharVal") === EventDictionary.CHARACTER; // true

                See Also:

                    <EventDictionary.CHARACTER>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putChar = function (key, value) {
            this.innerProperties[key] = [EventDictionary.CHARACTER, value];
            return this;
        };

            /*
                Function: putByte()

                    Associates the specified <EventDictionary.BYTE> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the Byte value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putByte()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putByte("myByteVal", myByteValue);
                    > evt.getDictionary().getType("myByteVal") === EventDictionary.BYTE; // true

                See Also:

                    <EventDictionary.BYTE>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putDictionary()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putByte = function (key, value) {
            this.innerProperties[key] = [EventDictionary.BYTE, value];
            return this;
        };

            /*
                Function: putDictionary()

                    Associates the specified <EventDictionary> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the <EventDictionary> value to be added.

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putDictionary()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    > var dict = evt.getDictionary();
                    > nestedDict = Nirvana.createDictionary();
                    > nestedDict.putString("message", "This is in a nested EventDictionary");
                    > dict.putDictionary("myNestedDictionary", nestedDict);
                    > myChannel.publish(evt);
                    > evt.getDictionary().getType("myNestedDictionary") === EventDictionary.DICTIONARY; // true


                See Also:

                    <EventDictionary.DICTIONARY>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putArray()>

            */

        EventDictionary.prototype.putDictionary = function (key, value) {
            this.innerProperties[key] = [EventDictionary.DICTIONARY, value];
            return this;
        };

            /*
                Function: putArray()

                    Associates the specified <EventDictionary.ARRAY> value with the specified key in this <EventDictionary>.

                Parameters:

                    key - a string representing the name of the key.
                    value - the array of values to be added.
                    arrType - the type of the values in the array (see <EventDictionary.Constants>).

                Returns:

                    The <EventDictionary> object on which <EventDictionary.putArray()> was invoked (making this a chainable method).

                Example Usage:

                    > var evt = Nirvana.createEvent();
                    >
                    > evt.getDictionary().putArray("myArray", ["Hello","World"], EventDictionary.STRING);
                    > evt.getDictionary().get("myArray"); // returns ["Hello","World"]
                    > evt.getDictionary().getType("myArray") === EventDictionary.ARRAY; // true
                    > evt.getDictionary().getArrayType("myArray") === EventDictionary.STRING; // true

                See Also:

                    <EventDictionary.ARRAY>,
                    <EventDictionary.get()>,
                    <EventDictionary.getType()>,
                    <EventDictionary.getArrayType()>,
                    <EventDictionary.putString()>,
                    <EventDictionary.putLong()>,
                    <EventDictionary.putDouble()>,
                    <EventDictionary.putBoolean()>,
                    <EventDictionary.putInteger()>,
                    <EventDictionary.putFloat()>,
                    <EventDictionary.putChar()>,
                    <EventDictionary.putByte()>,
                    <EventDictionary.putDictionary()>

            */

        EventDictionary.prototype.putArray = function (key, value, arrType) {
            this.innerProperties[key] = [EventDictionary.ARRAY, arrType, value];
            return this;
        };

        /*
            Class: EventAttributes
            An <EventAttributes> object is returned by any call to <Event.getEventAttributes()>.
            All <EventAttributes> objects are created with this factory method;
            <EventAttributes> no built-in public constructor method.

            Example Usage:

                > var publisher = evt.getAttributes().getPublisherName();

                Developers will typically use specific getter/setter methods (such as <EventAttributes.getPublisherName()>)
                which exist for all default attributes. Alternatively, if they know the underlying attribute key name,
                they may use the generic <EventAttributes.getAttribute()> and <EventAttributes.setAttribute()> methods
                to accomplish the same thing:

                > var publisher = evt.getAttributes().getAttribute("pubName");

            Methods:

                For brevity, the many methods of <EventAttributes> have no extended documentation;
                their meanings and usage, however, should be reasonably self-explanatory.

        */

        EventAttributes.HEADER_KEYS = ["_allowMerging", "pubHost", "pubName", "subHost", "subName", "subID", "messageType"];
        EventAttributes.SERVER_HEADER_KEYS = ["timeStamp", "_isDelta", "_isRedelivered", "_isRegistered", "deadEID", "deadEventChannel", "joinEID", "joinChannel", "joinRealm", "joinPath"];
        EventAttributes.JMS_HEADER_KEYS = ["messageID", "correlationID", "type", "expiration", "destination", "deliveryMode", "priority", "userID", "appID", "replyToName", "replyToType"];

        function EventAttributes(innerAttributes) {
            this.innerAttributes = innerAttributes;
        }

            /*********************************************************************
                Group: Getters/Setters
            **********************************************************************/


            /*
                Function: getSubscriberHost()

                    Returns a string representing the subscriber host.

                See Also:

                    <EventAttributes.setSubscriberHost()>, <EventAttributes.getPublisherHost()>
            */
            EventAttributes.prototype.getSubscriberHost = function () {
                    return this.innerAttributes.subHost;
                };

            /*
                Function: getSubscriberName()

                    Returns a string representing the subscriber name.

                See Also:

                    <EventAttributes.setSubscriberName()>, <EventAttributes.getPublisherName()>
            */
            EventAttributes.prototype.getSubscriberName = function () {
                    return this.innerAttributes.subName;
                };

            /*
                Function: getSubscriberID()

                    Returns a string representing the subscriber ID.

                See Also:

                    <EventAttributes.setSubscriberID()>
            */
            EventAttributes.prototype.getSubscriberID = function () {
                    return this.innerAttributes.subID;
                };

            /*
                Function: getPublisherHost()

                    Returns a string representing the publisher host.

                See Also:

                    <EventAttributes.setPublisherHost()>, <EventAttributes.getSubscriberHost()>
            */
            EventAttributes.prototype.getPublisherHost = function () {
                    return this.innerAttributes.pubHost;
                };

            /*
                Function: getPublisherName()

                    Returns a string representing the publisher name.

                See Also:

                    <EventAttributes.setPublisherName()>, <EventAttributes.getSubscriberName()>
            */
            EventAttributes.prototype.getPublisherName = function () {
                    return this.innerAttributes.pubName;
                };

            /*
                Function: setSubscriberHost()

                    Sets the subscriber host.

                Returns:

                    The <EventAttributes> object on which <EventAttributes.setSubscriberHost()> was invoked (making this a chainable method).

                See Also:

                    <EventAttributes.getSubscriberHost()>, <EventAttributes.setPublisherHost()>
            */
            EventAttributes.prototype.setSubscriberHost = function (subscriberHost) {
                    this.innerAttributes.subHost = subscriberHost;
                    return this;
                };

            /*
                Function: setSubscriberName()

                    Sets the subscriber name.

                Returns:

                    The <EventAttributes> object on which <EventAttributes.setSubscriberName()> was invoked (making this a chainable method).

                See Also:

                    <EventAttributes.getSubscriberName()>, <EventAttributes.setPublisherName()>
            */
            EventAttributes.prototype.setSubscriberName = function (subscriberName) {
                    this.innerAttributes.subName = subscriberName;
                    return this;
                };

            // Reserved for future use:

            EventAttributes.prototype.setSubscriberNames = function (subscriberNames) {
                    this.innerAttributes.subName = subscriberNames;
                    return this;
                };

            /*
                Function: setPublisherName()

                    Sets the publisher name.

                Returns:

                    The <EventAttributes> object on which <EventAttributes.setPublisherName()> was invoked (making this a chainable method).

                See Also:

                    <EventAttributes.getPublisherName()>, <EventAttributes.setSubscriberName()>
            */
            EventAttributes.prototype.setPublisherName = function (publisherName) {
                    this.innerAttributes.pubName = publisherName;
                    return this;
                };

            /*
                Function: setPublisherHost()

                    Sets the publisher host.

                Returns:

                    The <EventAttributes> object on which <EventAttributes.setPublisherHost()> was invoked (making this a chainable method).

                See Also:

                    <EventAttributes.getPublisherHost()>, <EventAttributes.setSubscriberHost()>
            */
            EventAttributes.prototype.setPublisherHost = function (publisherHost) {
                    this.innerAttributes.pubHost = publisherHost;
                    return this;
                };


            /*********************************************************************
                Group: Low-Level Getters/Setters
            **********************************************************************/

            /*
                Function: getAttribute()

                    Returns the value to which the <EventAttributes> maps the specified name.

                See Also:

                    <EventAttributes.setAttribute()>, <EventAttributes.getAttributeNames()>
            */
            EventAttributes.prototype.getAttribute = function (name) {
                    return this.innerAttributes[name];
                };

            /*
                Function: getAttributeNames()

                    Returns an array of an attribute names in this <EventAttributes> object.

                See Also:

                    <EventAttributes.getAttribute()>

            */
            EventAttributes.prototype.getAttributeNames = function () {
                    var attributes = [];
                    for (var attribute in this.innerAttributes) {
                        if(this.innerAttributes.hasOwnProperty(attribute)){
                            attributes.push(attribute);
                        }
                    }
                    return attributes;
                };
            /*
                Function: setAttribute()

                    Associates the specified value with the specified attribute name in this <EventAttributes> object.

                Parameters:

                    attributeName - the name of the attribute.
                    attributeValue - the value to be set.

                See Also:

                    <EventAttributes.getAttribute()>, <EventAttributes.getAttributeNames()>
            */
            EventAttributes.prototype.setAttribute = function (attributeName, attributeValue) {
                    this.innerAttributes[attributeName] = attributeValue;
                    return this;
                };


            /*********************************************************************
                Group: Read-Only methods accessing Immutable Server-Side Values
            **********************************************************************/

            /*
                Function: getTimeStamp()

                    Returns the <Event's> publication timestamp as an integer value representing the number of milliseconds since 1 January 1970 00:00:00 UTC (Unix Epoch).

                Parameters:

                    longFormat - optional <Nirvana.LongType> only applicable if event origin is the server

            */
            EventAttributes.prototype.getTimeStamp = function (longType) {
                    return Utils.convertLongFromServer(longType, this.innerAttributes.timeStamp);
                };

            /*
                Function: getAllowMerge()

                    Returns true if the <Event> can be merged, or false otherwise.
            */
            EventAttributes.prototype.getAllowMerge = function () {
                    return this.innerAttributes._allowMerging;
                };

            /*
                Function: isDelta()

                    Returns true if the <Event> is a delta. Returns false if the <Event> is a standard event.

            */
            EventAttributes.prototype.isDelta = function () {
                /** @namespace innerAttributes._isDelta */
                    return this.innerAttributes._isDelta;
                };

            /*
                Function: isRedelivered()

                    Returns true if the <Event> is redelivered. Returns false otherwise.

            */
            EventAttributes.prototype.isRedelivered = function () {
                /** @namespace innerAttributes._isRedelivered */
                    return this.innerAttributes._isRedelivered;
                };

            /*
                Function: isRegistered()

                    Returns true if the <Event> is a "registered event", or false otherwise.
            */
            EventAttributes.prototype.isRegistered = function () {
                /** @namespace innerAttributes._isRegistered */
                    return this.innerAttributes._isRegistered;
                };


            /*********************************************************************
                Group: Join-Specific Functions

                Methods for working with <Events> received via *Joined Channels*.

                Learn more about Channel Joins at: http://um.terracotta.org/developers/nirvana/enterprisemanager/channeladmin/channeljoins.html
            **********************************************************************/

            /*
                Function: getJoinChannel()

                    Returns a string representing the name of the <Channel> from which the <Event> originated.

            */
            EventAttributes.prototype.getJoinChannel = function () {
                    /** @namespace innerAttributes.joinChannel */
                    return this.innerAttributes.joinChannel;
                };

            /*
                Function: getJoinEID()

                    Returns an integer representing the EID of the original <Event> on the joined <Channel>.

                Parameters:

                    longFormat - optional <Nirvana.LongType> only applicable if event origin is the server

                Returns:

                    By default a Number representing the <Event's> ID from the orignial <Event> on the joined <Channel>

                Example Usage:

                     > var eid = evt.getJoinEID();                         //returns the EID as the default, a Number
                     > evt.getJoinEID(Nirvana.LongType.LONG_AS_ARRAY);    // returns an array of the Join EID split into two 32 bit parts
                     > evt.getJoinEID(Nirvana.LongType.LONG_AS_DECIMAL_STRING);    // returns the Join EID as decimal formated string
                     > evt.getJoinEID(Nirvana.LongType.LONG_AS_HEXADECIMAL_STRING);    // returns the Join EID as a hexadecimal string

            */
            EventAttributes.prototype.getJoinEID = function (longType) {
                    /** @namespace innerAttributes.joinEID */
                    return Utils.convertLongFromServer(longType, this.innerAttributes.joinEID);
                };

            /*
                Function: getJoinPath()

                    Returns the names of all the <Channels> in the join path for the <Event>.

            */
            EventAttributes.prototype.getJoinPath = function () {
                    /** @namespace innerAttributes.joinPath */
                    return this.innerAttributes.joinPath;
                };

            /*
                Function: getJoinRealm()

                    Returns a string representing the details of the realm on which the joined <Channel> exists.

            */
            EventAttributes.prototype.getJoinRealm = function () {
                    /** @namespace innerAttributes.joinRealm */
                    return this.innerAttributes.joinRealm;
                };


            /*********************************************************************
                Group: Dead-Event Functions
            **********************************************************************/

            /*
                Function: getDeadEID()
                    Returns the  EID of the Dead <Event>

                Parameters:
                    longType - optional <Nirvana.LongType> only applicable if event origin is the server

                Returns
                    Returns a Number representing the EID of the Dead <Event> (assuming it was consumed from a dead event store).
                    If longType is provided as a paramater will return the appropriate type, only applicable if event origin is the server

                Example Usage:
                    > var eid = evt.getDeadEID();                         //returns the dead event EID as the default, a Number
                    > evt.getDeadEID(Nirvana.LongType.LONG_AS_ARRAY);    // returns an array of the dead event EID split into two 32 bit parts
                    > evt.getDeadEID(Nirvana.LongType.LONG_AS_DECIMAL_STRING);    // returns the dead event EID as decimal formated string
                    > evt.getDeadEID(Nirvana.LongType.LONG_AS_HEXADECIMAL_STRING);    // returns the EID as a hexadecimal string
            */


            EventAttributes.prototype.getDeadEID = function (longType) {
                    /** @namespace innerAttributes.deadEID */
                    return Utils.convertLongFromServer(longType, this.innerAttributes.deadEID);
                };

            /*
                Function: getDeadEventStore()

                    Returns a string representing the name of the Dead <Event's> dead event store (assuming it was consumed from a dead event store).
            */
            EventAttributes.prototype.getDeadEventStore = function () {
                    /** @namespace innerAttributes.deadEventChannel */
                    return this.innerAttributes.deadEventChannel;
                };

            /*********************************************************************
                Group: JMS Functions
            **********************************************************************/

            /*
                Function: getApplicationID()

                    Returns the application ID allocated to the <Event>.
            */
            EventAttributes.prototype.getApplicationID = function () {
                    return this.innerAttributes.appID;
                };


            /*
                Function: getCorrelationID()

                    Returns the correlation ID allocated to the <Event>.
            */
            EventAttributes.prototype.getCorrelationID = function () {
                    return this.innerAttributes.correlationID;
                };

            /*
                Function: getDeliveryMode()

                    Returns the delivery mode used for the <Event>.
            */
            EventAttributes.prototype.getDeliveryMode = function () {
                    return this.innerAttributes.deliveryMode;
                };

            /*
                Function: getDestination()

                    Returns the destination allocated to the <Event>.
            */
            EventAttributes.prototype.getDestination = function () {
                    return this.innerAttributes.destination;
                };

            /*
                Function: getExpiration()

                    Returns the expiration value allocated to the <Event>.

                 Parameters:

                     longFormat - optional <Nirvana.LongType> only applicable if event origin is the server

             */
            EventAttributes.prototype.getExpiration = function (longType) {
                    return Utils.convertLongFromServer(longType, this.innerAttributes.expiration);
                };

            /*
                Function: getMessageID()

                    Returns the message ID allocated to the <Event>.
            */
            EventAttributes.prototype.getMessageID = function () {
                    return this.innerAttributes.messageID;
                };

            /*
                Function: getMessageType()

                    Returns an integer representing the message type of the <Event>.
            */
            EventAttributes.prototype.getMessageType = function () {
                    return this.innerAttributes.messageType;
                };

            /*
                Function: getPriority()

                    Returns an integer representing the <Event> priority.
            */
            EventAttributes.prototype.getPriority = function () {
                    return this.innerAttributes.priority;
                };

            /*
                Function: getRedeliveredCount()

                    Returns an integer representing the number of times the <Event> has been redelivered.
            */
            EventAttributes.prototype.getRedeliveredCount = function () {
                    /** @namespace innerAttributes.redeliveredCount */
                    return this.innerAttributes.redeliveredCount;
                };

            /*
                Function: getReplyToName()

                    Returns the "reply to" name allocated to the <Event>.
            */
            EventAttributes.prototype.getReplyToName = function () {
                    return this.innerAttributes.replyToName;
                };

            /*
                Function: getReplyType()

                    Returns an integer representing the reply type of the <Event>.
            */
            EventAttributes.prototype.getReplyType = function () {
                    return this.innerAttributes.replyToType;
                };


            /*
                Function: getType()

                    Returns the arbitrary type of the <Event>.
            */
            EventAttributes.prototype.getType = function () {
                    return this.innerAttributes.type;
                };

            /*
                Function: getUserID()

                    Returns the user ID given to the <Event>.
            */
            EventAttributes.prototype.getUserID = function () {
                    return this.innerAttributes.userID;
                };

            /*
                Function: setAllowMerge()
            */
            EventAttributes.prototype.setAllowMerge = function (mergeValue) {
                    this.innerAttributes._allowMerging = mergeValue;
                    return this;
                };

            /*
                Function: setApplicationID()
            */
            EventAttributes.prototype.setApplicationID = function (applicationID) {
                    this.innerAttributes.appID = applicationID;
                    return this;
                };


            /*
                Function: setCorrelationID()
            */
            EventAttributes.prototype.setCorrelationID = function (correlationID) {
                    this.innerAttributes.correlationID = correlationID;
                    return this;
                };

            /*
                Function: setDeliveryMode()
            */
            EventAttributes.prototype.setDeliveryMode = function (deliveryMode) {
                    this.innerAttributes.deliveryMode = deliveryMode;
                    return this;
                };

            /*
                Function: setDestination()
            */
            EventAttributes.prototype.setDestination = function (destination) {
                    this.innerAttributes.destination = destination;
                    return this;
                };

            /*
                Function: setExpiration()
            */
            EventAttributes.prototype.setExpiration = function (expiration) {
                    this.innerAttributes.expiration = expiration;
                    return this;
                };

            /*
                Function: setMessageID()
            */
            EventAttributes.prototype.setMessageID = function (messageID) {
                    this.innerAttributes.messageID = messageID;
                    return this;
                };

            /*
                Function: setMessageType()
            */
            EventAttributes.prototype.setMessageType = function (messageType) {
                    this.innerAttributes.messageType = messageType;
                    return this;
                };

            /*
                Function: setPriority()
            */
            EventAttributes.prototype.setPriority = function (priority) {
                    this.innerAttributes.priority = priority;
                    return this;
                };

            /*
                Function: setReplyToName()
            */
            EventAttributes.prototype.setReplyToName = function (replyToName) {
                    this.innerAttributes.replyToName = replyToName;
                    return this;
                };

            /*
                Function: setReplyType()
            */
            EventAttributes.prototype.setReplyType = function (replyType) {
                    this.innerAttributes.replyToType = replyType;
                    return this;
                };

            /*
                Function: setType()
            */
            EventAttributes.prototype.setType = function (type) {
                    this.innerAttributes.type = type;
                    return this;
                };

            /*
                Function: setUserID()
            */
            EventAttributes.prototype.setUserID = function (userID) {
                    this.innerAttributes.userID = userID;
                    return this;
                };

            /*
                Function: setSubscriberID()
            */
            EventAttributes.prototype.setSubscriberID = function (subscriberID) {
                    this.innerAttributes.subID = subscriberID;
                    return this;
                };

        /*
            Class: Transaction

                A <Transaction> object is returned by any call to <Channel.createTransaction()>.
                All <Transaction> objects are created with this factory method;
                <Transaction> has no built-in public constructor method.
        */
        function Transaction(txID, listenerManager, parentChannel) {

            var self = this;
            var client;

            var lm = listenerManager;

            var channel = parentChannel;
            var event;

            var isCommitted = false;
            var hasPublished = false;

            this.getTxID = function () {
                return txID;
            };

            /*
             Function: publishAndCommit()
             */
            this.publishAndCommit = function () {
                if (hasPublished) {
                    throw new AlreadyCommittedException(channel.getName(), txID);
                }
                var command = {
                    "requestType":PrivateConstants.TX_PUBLISH,
                    "transaction":self,
                    "resource":channel,
                    "event":event
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            this.setIsCommitted = function (commitState) {
                isCommitted = commitState;
            };

            /*
             Function: checkCommitStatus()
             */
            this.checkCommitStatus = function (queryServer) {
                if (isCommitted || !queryServer) {
                    lm.notifyListeners(CallbackConstants.COMMIT, client, true);
                }
                var command = {
                    "requestType":PrivateConstants.TX_IS_COMMITTED,
                    "transaction":self
                };
                OutboundEngine.queueCommand(command);
                return client;
            };

            /*
             Function: setEvent()
             */
            this.setEvent = function (newEvent) {
                if (hasPublished) {
                    throw new AlreadyCommittedException(channel.getName(), txID);
                }
                event = newEvent;
                return client;
            };

            /*
                Function: on()

                    Registers a single event listener on the <Transaction> for observable events of the specified type
                    (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable -    the type of observable event in which the listener is interested.
                    listener -      the listener function you have implemented, which should handle the parameters
                                    associated with the relevant observable event as defined in <Nirvana.Observe>.

                Returns:

                    The <Transaction> object on which <Transaction.on()> was invoked (making this a chainable method).

                Example Usage:

                    > function myCommitCB(transaction, successFlag) {
                    >   if (successFlag) {
                    >        console.log("Commit was successful");
                    >    }
                    > }
                    > myTransaction.on(Nirvana.Observe.COMMIT, myCommitCB);

                Additional Information:

                    For more information on assigning listeners for _Nirvana.Observe.DATA_ or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

                    <Transaction.removeListener()>, <Nirvana.Observe>

            */


            this.on = function (observable, listener) {
                lm.on(observable, listener);
                return client;
            };

            /*
                Function: removeListener()

                Removes a specific listener for observable events of the specified type (see <Nirvana.Observe> for applicable observables).

                Parameters:

                    observable - the type of observable event in which the listener was interested.
                    listener - the listener function originally assigned with <on()>, and which should now be removed.

                Returns:

                    The <Transaction> object on which <Transaction.removeListener()> was invoked (making this a chainable method).

                Example Usage:

                    > function myCommitCB(transaction, successFlag) {
                    >   if (successFlag) {
                    >        console.log("Commit was successful");
                    >    }
                    > }
                    > myTransaction.on(Nirvana.Observe.COMMIT, myCommitCB);
                    >
                    > // when we want to, we can un-assign the listener:
                    > myTransaction.removeListener(Nirvana.Observe.COMMIT, myCommitCB);

                Additional Information:

                    For more information on removing listeners for _Nirvana.Observe.COMMIT or any other observable event,
                    please see the <Nirvana.Observe> Example Usage section.

                See Also:

             <Transaction.on()>, <Nirvana.Observe>

            */

            this.removeListener = function (observable, listener) {
                lm.removeListener(observable, listener);
                return client;
            };

            this.notifyListeners = function (observable, obj, data) {
                lm.notifyListeners(observable, obj, data);
            };

            client = {
                "on":this.on,
                "removeListener":this.removeListener,
                "checkCommitStatus":this.checkCommitStatus,
                "publishAndCommit":this.publishAndCommit,
                "setEvent":this.setEvent
            };
            return client;
        }

        function initialize() {

            var intervalID = null;

            var createDriverDomObjectsContainer = function() {
                try {
                    if (document.getElementById(DriverDomObjectsContainerID) === null) {
                        var elem = document.createElement('span');
                        elem.style.display = 'none';
                        elem.setAttribute('id', DriverDomObjectsContainerID);
                        var body = document.getElementsByTagName('body')[0];
                        body.appendChild(elem);
                        // elem is where we should create any iframes etc.
                        clearInterval(intervalID);
                    }
                } catch (e) {
                    // document evidently not ready.
                }
            };

            createDriverDomObjectsContainer();

            if (document.getElementById(DriverDomObjectsContainerID) === null) {
                intervalID = setInterval(function () {
                    createDriverDomObjectsContainer();
                }, 10);
            }

        }

        function describe(commandCode) {
            return getKeyByValue(PrivateConstants, commandCode) + " [" + commandCode + "]";
        }

        function getKeyByValue (obj, val) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] == val) {
              return key;
            }
          }
        }


        /*
         *  ************************************************************************************
         *  Public interface to window.Nirvana:
         *  ************************************************************************************
         */

        return {

            "VERSION_NUMBER":"10.3.0.0",
            "BUILD_NUMBER":"112089-112089",
            "BUILD_DATE":"August 27 2018",

            // Event Handler Callbacks
            "Observe":CallbackConstants,

            // Data Constants
            "BYTE_ARRAY_AS_STRING":0,
            "BYTE_ARRAY_AS_BASE64_STRING":1,
            "BYTE_ARRAY_AS_INT_ARRAY":2,

            // Resource Types
            "CHANNEL_RESOURCE":1,
            "QUEUE_RESOURCE":2,
            "TRANSACTIONAL_QUEUE_RESOURCE":3,

            "Driver":Transport.Drivers.Names,
            "clientSupportsDriver":Transport.supportsDriver,

            // Framework Level Methods
            "initialize":initialize,
            "createSession":createSession,
            "createEvent":createEvent,
            "createDictionary":createDictionary,
            "on":on,
            "removeListener":removeListener,

            /*
                Class: Nirvana.Utils

                    <Nirvana.Utils> provides access to a number of utility methods.


                Function: isLoggingEnabled()

                    Returns true or false, depending on the value of a _debugLevel_ key in the configuration
                    object passed as an optional parameter to <Nirvana.createSession()>.

                Returns:

                    A boolean value of true or false.

                See Also:

                    <Nirvana.createSession()>


                Function: Logger.setLogger()

                    Assigns a user-defined function as the default log function which is invoked as appropriate,
                    depending on the value of a _debugLevel_ key in the configuration object passed as an optional
                    parameter to <Nirvana.createSession()>.

                Parameters:

                    logFunction - the user-defined log function. It should accept a string as a parameter.

                Example Usage:

                    > function myLogFunction(debugMessage) {
                    >   console.log("Log: " + debugMessage);
                    > }
                    >
                    > Nirvana.Utils.Logger.setLogger(myLogFunction);



                Function: Logger.log()

                    Log a message to the debug log. By default, this will invoke the built-in debug function
                    (the output of which can be seen by pressing Ctrl-Alt-d, depending on the value of a
                    _debugLevel_ key in the configuration object passed as an optional parameter to <Nirvana.createSession()>).

                Parameters:

                    logMessage - the string to be logged.


                Function: Logger.logException()

                    Log an exception to the debug log. By default, this will invoke the built-in debug function
                    (the output of which can be seen by pressing Ctrl-Alt-d, depending on the value of a
                    _debugLevel_ key in the configuration object passed as an optional parameter to <Nirvana.createSession()>).

                Parameters:

                    log_exception - the exception to be logged.




                Function: base64Encode()

                    Takes a string and returns a base64 encoded representation of it.

                Parameters:

                    rawData - the string to be base64-encoded.

                Returns:

                    A base64-encoded representation of the user-supplied string.



                Function: base64Decode()

                    Takes a base64-encoded string and returns the base64 decoded value.

                Parameters:

                    base64string - the base64-encoded string to be decoded.

                Returns:

                    The raw base64-decoded data.

            */

            "Utils":{
                "isLoggingEnabled":Utils.isLoggingEnabled,
                "Logger":Utils.Logger,
                "base64Encode":Utils.base64Encode,
                "base64Decode":Utils.base64Decode
            },

            /*
             Class: Nirvana.EventDictionary

             <Nirvana.EventDictionary> provides the options for dictionary types

             */

            "EventDictionary":{
                "STRING":0,
                "LONG":1,
                "DOUBLE":2,
                "BOOLEAN":3,
                "INTEGER":4,
                "FLOAT":5,
                "CHARACTER":6,
                "BYTE":7,
                "DICTIONARY":9,
                "ARRAY":-1
            },

            /*
             Class Nirvana.LongType

             <Nirvana.LongType> provides the options for long representations when recieving events from the server
             */
            "LongType":{
                "LONG_AS_NUMBER":0,
                "LONG_AS_ARRAY":1,
                "LONG_AS_DECIMAL_STRING":2,
                "LONG_AS_HEXADECIMAL_STRING":3
            }
        };
    }());

    window.Nirvana = Nirvana; // Sorry, any pre-existing Nirvana object. We're here now!
    Nirvana.on(Nirvana.Observe.ERROR, function (session, error) {
        Nirvana.Utils.Logger.log(8, "System Error: " + error.message, session);
    });

    if (window.addEventListener) {
        window.addEventListener('load', Nirvana.initialize, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', Nirvana.initialize);
    }

}(window));