module.exports = function(parties, barrierCallback, abortCallback) {
	var running = true;
	var count = 0;

	var successCallback = barrierCallback || function() {
	};

	var cancelCallback = abortCallback || function() {
	};

	return {
		"submit" : function() {
			if (++count === parties && running) {
				successCallback();
			}
		},
		"abort" : function(customAbortCallback) {
			if (running && customAbortCallback) {
				customAbortCallback();
			}
			else if (running && cancelCallback) {
				cancelCallback();
			}
			running = false;
		}
    };
};	
