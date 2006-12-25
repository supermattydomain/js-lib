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
    if (null == this.req) {
      this.error = true;
      return false;
    }
    this.error = false;
    return true;
  };
  this.getResponseXML = function() {
    if (this.error || null == this.req) {
      printMessage('AJAX: No XML response available due to request error');
      return null;
    } else if (null == this.req.responseXML || undefined == this.req.responseXML) {
      printMessage('AJAX: No XML response returned');
      printMessage(this.req.responseText);
      return null;
    }
    return this.req.responseXML;
  }
  this.isSuccessfulStatus = function(status) {
    return (200 <= status && status <= 299);
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
      printMessage('AJAX: Init failed');
      return false;
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
      this.error = true;
      return false;
    }
    this.error = true;
    return false;
  };
  var self = this;
  this.onreadystatechange = function(evt) {
    // printMessage('Reached readyState ' + self.req.readyState);
    if (4 == self.req.readyState) {
      if (self.isSuccessfulStatus(self.req.status)) {
        self.requestDoneCallback(self);
      } else {
        printMessage('AJAX: Got non-success status ' + self.req.status + ' for URL ' + self.url);
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
}
