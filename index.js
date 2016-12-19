class Server {
  constructor () {
    this.express = require('express');
    this.path = require('path');
    this.app = this.express();
    this.data = {
      page: 'Game for all cool people'
    };

    this.server();
  }

  appInit() {
    this.app.set('view engine', 'jade');
    this.app.use(this.express.static(this.path.join(__dirname, 'assets')));

    this.app.get('/',  (rq, rs) => {
      rs.render('main', this.data);
    });

    return this.app;
  }

  server () {
      this.appInit().listen(7529, function () {
      console.log('Server is up on port 7529');
    });
  }
}

new Server();
