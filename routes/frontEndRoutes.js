const express = require('express')
const csrf = require('csurf')
const fetch = require('node-fetch')
const { asyncHandler, getCookies, rankStories } = require('../utils')
const { api } = require('../config')
const {
  getUser,
  getStoriesByUser,
  getBookmarkedStoriesForUser,
  getLikesByUser,
  getCommentsByUser,
  getFollowCounts,
  getFollowedUsers,
  getFollowingUsers,
  getStory,
  getAllStories,
  getDiscoveryStories,
  getStoriesByFollowedAuthors,
} = require("../fetches.js")
const { render } = require('pug')

const csrfProtection = csrf({ cookie: true });
const frontEndRouter = express.Router();

// Individual Story page.
frontEndRouter.get("/stories/:id(\\d+)", async (req, res) => {
  const story = await getStory(req.params.id)
  res.render('story-layout', { story, title: story.title, api });
})

frontEndRouter.get("/feed", csrfProtection,
  asyncHandler(async (req, res) => {
    res.render('feed', { title: "My Feed", csrfToken: req.csrfToken(), stories, api });
  }));

  
  
  // TODO TODO TODO
  // Hide login/signup buttons when logged in
  // refresh state after login/signup to show new content
  // logout

  // the fancy editor widget!!!

// Home page. Splash + Feed
frontEndRouter.get("/", csrfProtection, asyncHandler(async (req, res) => {
  const cookies = getCookies(req)
  let authCheck = await fetch(`${api}/api/users/user`, {
    headers: { Authorization: `Bearer ${cookies.COVEN_TOKEN}` }
  })
  if (authCheck.ok) {
    let stories = await getAllStories()
    let discoveryStories = await getDiscoveryStories()
    // TODO Check if this has an off-by-one issue.
    let bookmarks = await getBookmarkedStoriesForUser(1)
    const isEnoughBookmarks = bookmarks.length >= 6
    if (isEnoughBookmarks) bookmarks = rankStories(bookmarks)
    res.render("feed", {
      title: "Coven - Home",
      csrfToken: req.csrfToken(),
      stories,
      discoveryStories,
      bookmarks,
      isEnoughBookmarks,
    })
  } else {
    let topics = await fetch(`${api}/api/topics`)
    topics = await topics.json()
    res.render('splash', {
      title: "Coven",
      csrfToken: req.csrfToken(),
      topics,
      // slideshow
    })
  }
}))

// //sign up form
// frontEndRouter.get("/signup", csrfProtection, (req, res) => {
//   await fetch(`/api/users`, {
//     method: 'POST',
//     body: req.body
//   })


//   res.render('splash', {
//     csrfToken: req.csrfToken(),
//     isSignupForm: true,
//     api,
//   });
// })
//log-in form
// frontEndRouter.get("/login", csrfProtection, asyncHandler(async (req, res) => {
//   console.log("PRINT REQ", req, req.body)
//   const res = await fetch(`/api/token`, {
//     method: "POST",
//     body: req.body
//   })

//   res.render('splash', {
//   csrfToken: req.csrfToken(),
//   isSignupForm: false,
//   api,
// });
// }))


//user profile
frontEndRouter.get("/users/:id(\\d+)", csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id)
    const followCounts = await getFollowCounts(req.params.id)
    const userStories = await getStoriesByUser(req.params.id)
    res.render('profile-tab-stories',
      { csrfToken: req.csrfToken(), user, followCounts, userStories, api });
  }))

frontEndRouter.get("/users/:id(\\d+)/comments", csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id)
    const followCounts = await getFollowCounts(req.params.id)
    const userComments = await getCommentsByUser(req.params.id)
    res.render('profile-tab-comments',
      { csrfToken: req.csrfToken(), user, followCounts, userComments, api });
  }))
frontEndRouter.get("/users/:id/likes", csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id)
    const followCounts = await getFollowCounts(req.params.id)
    const userLikes = await getLikesByUser(req.params.id)
    res.render('profile-tab-likes',
      { csrfToken: req.csrfToken(), user, followCounts, userLikes, api });
  }))
frontEndRouter.get("/users/:id/following", csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id)
    const followCounts = await getFollowCounts(req.params.id)
    const followedUsers = await getFollowedUsers(req.params.id)
    res.render('profile-tab-follows',
      { csrfToken: req.csrfToken(), user, followCounts, followedUsers, api });
  }))
frontEndRouter.get("/users/:id/followers", csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id)
    const followCounts = await getFollowCounts(req.params.id)
    const followingUsers = await getFollowingUsers(req.params.id)
    res.render('profile-tab-followers',
      { csrfToken: req.csrfToken(), user, followCounts, followingUsers, api });
  }))
frontEndRouter.get("/users/:id/bookmarks", csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id)
    const followCounts = await getFollowCounts(req.params.id)
    const bookmarkedStories = await getBookmarkedStoriesForUser(req.params.id)
    res.render('profile-tab-bookmarks',
      { csrfToken: req.csrfToken(), user, followCounts, bookmarkedStories, api });
  }))

//edit user profile form
// frontEndRouter.get("/users/:id/edit", csrfProtection, (req, res) => {
//   res.render('edit-profile', { csrfToken: req.csrfToken() });
// });
//create new story form
frontEndRouter.get("/create", csrfProtection, (req, res) => {
  res.render('create', { csrfToken: req.csrfToken(), api });
});
//display story edit form
frontEndRouter.get("/stories/:id/edit", csrfProtection, (req, res) => {
  res.render('story-edit-layout', { csrfToken: req.csrfToken(), api });
});
//sign up form
frontEndRouter.get("/sign-up", csrfProtection, (req, res) => {
  res.render('sign-up', { csrfToken: req.csrfToken(), title: "Sign Up", api });
});
//log-in form
frontEndRouter.get("/log-in", csrfProtection, (req, res) => {
  res.render('log-in', { csrfToken: req.csrfToken(), title: "Log In", api });
});
//user profile
frontEndRouter.get("/users", (req, res) => {
  res.render('profile', { title: "Profile", api });
});
//edit user profile form
frontEndRouter.get("/users/:id(\\d+)/edit", csrfProtection, (req, res) => {
  res.render('edit-profile', { csrfToken: req.csrfToken(), title: "Edit Profile", api });
});
//create new story form
frontEndRouter.get("/create", csrfProtection, (req, res) => {
  res.render('create', { csrfToken: req.csrfToken(), title: "Create a Story", api });
});
//display story edit form
frontEndRouter.get("/stories/:id(\\d+)/edit", csrfProtection, (req, res) => {
  res.render('story-edit-layout', { csrfToken: req.csrfToken(), title: "Edit Story", api });
});
//display feed
frontEndRouter.get("/feed", csrfProtection,
  asyncHandler(async (req, res) => {
    res.render('feed', { title: "My Feed", csrfToken: req.csrfToken(), stories, api });
  }));


//throw error
frontEndRouter.get("/error-test", (req, res, next) => {
  const err = new Error("500 Internal Server Error.");
  err.status = 500;
  err.title = "custom 500 error";
  next(err);
})

module.exports = frontEndRouter;
