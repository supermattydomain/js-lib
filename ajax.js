function Ajax(url, requestDoneCallback) {
  this.method = null;
  this.url = url;
  this.doc = null;
  this.req = null;
  this.requestDoneCallback = requestDoneCallback;
  this.error = false;
  this.init = function() {
    try {
      // Firefox, Safari, IE7
      this.req = new XMLHttpRequest();
    } catch (e) {
      try {
        // Recent IE
        this.req = new ActiveXObject('MSXML2.XMLHTTP');
      } catch (e) {
        try {
          // Early IE
          this.req = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
        }
      }
    }
    if (bad(this.req)) {
    	fatal('Cannot create XMLHttpRequest');
	}
    this.error = false;
    return !this.error;
  };
  this.getResponseXML = function() {
    if (this.error) {
      fatal('AJAX: No XML response available due to request error');
    } else if (!this.req) {
      return null;
    } else if (bad(this.req.responseXML)) {
      printMessage('AJAX: No XML response returned');
      printMessage(this.req.responseText);
      return null;
    }
    return this.req.responseXML;
  }
  this.isSuccessfulStatus = function() {
    return (200 <= this.status && this.status <= 299);
  };
  this.abort = function() {
    if (null != this.req) {
      this.req.onreadystatechange = function() { };
      this.req.abort();
      this.req = null;
    }
  };
  this.doRequest = function(data) {
    if (false == this.init()) {
      fatal('AJAX: Init failed');
    }
    this.req.onreadystatechange = this.onreadystatechange;
    if ('POST' == this.method) {
      this.req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    try {
      this.req.open(this.method, this.url, true);
      this.req.send(data);
      return true;
    } catch (e) {
    }
   	fatal('Ajax: Cannot open request');
   	return false;
  };
  var self = this;
  this.onreadystatechange = function(evt) {
    // printMessage('onreadystatechange: readyState=' + self.req.readyState);
    if (self.req.responseXML) {
      // printMessage('got XML');
      if (self.req.responseXML.childNodes) {
        // printMessage('Reached readyState ' + self.req.readyState + '; children=' + self.req.responseXML.childNodes.length);
      } else {
        // printMessage('Reached readyState ' + self.req.readyState + ' but no child nodes yet');
      }
    } else if (self.req.responseText) {
      // printMessage('Reached readyState ' + self.req.readyState + '; text=' + self.req.responseText.length);
      showStatus('Read ' + self.req.responseText.length + ' bytes from server...');
    } else {
      // printMessage('No data');
    }
    if (4 == self.req.readyState) {
      try {
	self.status = self.req.status;
	self.statusText = self.req.statusText;
      } catch (e) {
	self.status = null;
	self.statusText = null;
      }
      if (self.isSuccessfulStatus()) {
        self.requestDoneCallback(self);
      } else {
        printMessage('AJAX: Status ' + self.status + " '" + self.statusText + "' for URL '" + self.url + "'");
        self.error = true;
      }
    }
  };
  this.doGet = function() {
    this.method = 'GET';
    return this.doRequest(null);
  };
  this.doPost = function(data) {
    this.method = 'POST';
    return this.doRequest(data);
  };
  this.cleanup = function() {
	this.doc = null;
  	this.req = null;
  };
}
