function Ajax(url, callback) {
  this.url = url;
  this.callback = callback;
  this.error = false;
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
        this.req = null;
      }
    }
  }
  if (!this.req) {
    this.error = true;
  }
  this.isSuccessfulStatus = function(status) {
    return (200 <= status && status <= 299);
  };
  this.abort = function() {
    if (this.req) {
      this.req.onreadystatechange = function() { };
      this.req.abort();
      this.req = null;
    }
  };
  this.doRequest = function(data) {
    if (null == this.req) {
      this.error = true;
      return false;
    }
    var self = this;
    this.req.onreadystatechange = function(evt) {
      // printMessage('Reached readyState ' + self.req.readyState);
      if (4 == self.req.readyState) {
        if (self.isSuccessfulStatus(self.req.status)) {
          self.callback(self);
        } else {
          printMessage('Got non-success status ' + self.req.status);
          self.error = true;
        }
      }
    }
    if ('POST' == this.method) {
      this.req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    this.req.open(this.method, this.url, true);
    this.req.send(data);
    return true;
  };
  this.doGet = function() {
    this.method = 'GET';
    return this.doRequest(null);
  }
  this.doPost = function(data) {
    this.method = 'POST';
    return this.doRequest(data);
  }
}
