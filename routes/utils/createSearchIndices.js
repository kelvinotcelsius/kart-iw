var fs = require('fs');
const algoliasearch = require('algoliasearch');
const express = require('express');
const router = express.Router();

const client = algoliasearch('G4BVIGANC0', '39f9585173a92d78545412bb14907042');

exports.createProductIndices = function (products) {
  const index = client.initIndex('products');
  var json = {};
  json['products'] = [];

  products.forEach((product) => {
    var data = {
      name: product.name,
      description: product.description,
      url: `/product/${product._id}`,
      picture: product.picture,
    };
    json['products'].push(data);
  });

  index
    .saveObjects(json['products'], { autoGenerateObjectIDIfNotExist: true })
    .then(() => {
      // done
    });

  index
    .setSettings({
      searchableAttributes: ['name', 'description'],
    })
    .then(() => {
      // done
    });

  return json['products'];
};

exports.createUserIndices = function (users) {
  const index = client.initIndex('users');
  var json = {};
  json['users'] = [];

  users.forEach((user) => {
    var data = {
      username: user.username,
      first: user.first,
      last: user.last,
      bio: user.bio,
      profile_pic: user.profile_pic,
      url: `/user/${user._id}`,
    };
    json['users'].push(data);
  });

  index
    .saveObjects(json['users'], { autoGenerateObjectIDIfNotExist: true })
    .then(() => {
      // done
    });

  index
    .setSettings({
      searchableAttributes: ['username', 'first', 'last'],
    })
    .then(() => {
      // done
    });

  return json['users'];
};

exports.createPostIndices = async function (posts) {
  const index = client.initIndex('posts');
  var json = {};
  json['posts'] = [];

  for (const post of posts) {
    // const user = await router.get(`/users/${post.creator_id}`);
    // const product = await router.get(`/products/${post.product_id}`);
    // console.log(user);
    var data = {
      caption: post.caption,
      preview: post.preview,
      // creator: user.username,
      // product: product.name,
      url: `/${post.creator_id}/${post._id}`,
    };
    json['posts'].push(data);
  }

  // posts.forEach(async (post) => {
  //   user = await router.get(`/users/${post.creator_id}`);
  //   product = await router.get(`/products/${post.product_id}`);
  //   console.log(user);
  //   var data = {
  //     caption: post.caption,
  //     preview: post.preview,
  //     creator: user.username,
  //     product: product.name,
  //     url: `/${post.creator_id}/${post._id}`,
  //   };
  //   json['posts'].push(data);
  // });

  index
    .saveObjects(json['posts'], { autoGenerateObjectIDIfNotExist: true })
    .then(() => {
      // done
    });

  index
    .setSettings({
      searchableAttributes: ['caption'],
    })
    .then(() => {
      // done
    });

  return json['posts'];
};
