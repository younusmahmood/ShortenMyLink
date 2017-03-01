import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links.js'
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {
  Meteor.publish('links', function(){
    return Links.find({});
  });
});

// Exectued whenever a user visits a shortened URL
function onRoute(req, res, next) {
  // Take the token out of the URL
  // Find matching link in links collection
  // Finds first record matching the req.params.token
  const link = Links.findOne({ token: req.params.token});

  if (link) {
  // If we find a link object, redirect the user
  // to the long url - L73

  Links.update(link, { $inc: {clicks: 1}}); //incrememnts click in the database
  res.writeHead(307, { 'Location': link.url});
  res.end();
} else {
  // If we don't find a link object, send the user
  // to normal react app
  next();
}

}

const middleware = ConnectRoute(function(router) {
  router.get('/:token', onRoute);
});

WebApp.connectHandlers.use(middleware);
