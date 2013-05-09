/**
 * window.setZeroTimeout: A version of window.setTimeout that honours a zero timeout argument.
 * Thanks to David Baron.
 * Found at: http://dbaron.org/log/20100309-faster-timeouts
 */
(function() {
	var timeouts = [];
	var messageName = "zero-timeout-message";
	if (window.setImmediate) {
		// No polyfill necessary
		return;
	}
	// If still here, we will install a polyfill of some sort.
	if (window.postMessage && window.addEventListener) {
		// Like setTimeout, but only takes a function argument.  There's
		// no time argument (always zero) and no arguments (you have to
		// use a closure).
		function setZeroTimeout(fn) {
			timeouts.push(fn);
			window.postMessage(messageName, "*");
		}

		function handleMessage(event) {
			if (event.source == window && event.data == messageName) {
				event.stopPropagation();
				if (timeouts.length > 0) {
					var fn = timeouts.shift();
					fn();
				}
			}
		}

		window.addEventListener("message", handleMessage, true);

		// Add the one thing we want added to the window object.
		window.setImmediate = setZeroTimeout;
	} else {
		// Fall back to use of setTimeout
		window.setImmediate = function(func) {
			setTimeout(func, 0);
		};
	}
	window.setImmediate.isPolyfill = true;
})();
