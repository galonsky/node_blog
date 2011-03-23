var express = require('express');
var stylus  = require('stylus');
var ArticleProvider = require('./articleprovider-couchdb').ArticleProvider;


var app = express.createServer();

app.configure(function(){
  app.set('view engine', 'jade');
  app.set('views', __dirname+ '/views');
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(stylus.middleware({src: __dirname + '/public'}));
});

var articleProvider= new ArticleProvider('localhost',5984);

app.get('/', function(req, res){
  articleProvider.findAll(function(error, docs){
    res.render('blogs_index', {
      locals: {
        title: 'Blog',
        articles: docs
      }
    });
  })
})
app.get('/blog/new', function(req,res){
  res.render('blog_new', {
    locals: {
      title: 'New Post'
    }
  });
});

app.post('/blog/new', function(req,res){
  articleProvider.save({
    title: req.param('title'),
    body: req.param('body')
  }, function(error, docs) {
    res.redirect('/')
  });
});
app.get('/blog/view/:id', function(req,res){
  articleProvider.findById(req.params.id,
                           function(error, doc){
                             res.render('blog_view', {
                               locals: {
                                 title: 'New Post',
                                 article: doc
                               }
                             });
                           });
});
app.listen(3000);
