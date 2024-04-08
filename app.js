const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Blog = require('./models/blogs');

const dbURI = 'mongodb+srv://user:qw4hdd@nodetuts.fjgxv6c.mongodb.net/nodetutorial?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result)=>app.listen(3000))
  .catch((err)=>console.log(err))

  // register view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/blogs', (req,res) => {
  Blog.find().sort({createdAt: -1})
    .then((result) => {
      res.render('index', { title: 'All Blogs', blogs: result})
    })
    .catch((err) => { 
      console.log(err);
    })
})

app.post('/blogs', (req,res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then((result) => {res.redirect('/blogs');})
    .catch((err) => {console.log(err);})    
})

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});