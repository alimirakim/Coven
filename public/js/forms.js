
<<<<<<< HEAD
=======
// import { deleteCookies } from '../../utils.js';
import { loggedIn } from './utils.js';
>>>>>>> 40d1aa6... Less out of date now.
const query = document.querySelector.bind(document)
const queryAll = document.querySelectorAll.bind(document)
const create = document.createElement.bind(document)

// ELEMENT VARIABLES Login
const loginElements = queryAll('.log')
const loginPage = query(".log")
const loginBtns = queryAll(".log-btn")
const loginExitBtn = query(".log-x")
const loginForm = query("#log-form")
const loginErrorsSection = query(".log-err")
const loginSmallBtn = query(".log-sml")

// ELEMENT VARIABLES Signup
const signupElements = queryAll('.sup')
const signupPage = query(".sup")
const signupBtns = queryAll(".sup-btn")
const signupExitBtn = query(".sup-x")
const signupForm = query("#sup-form")
const signupSmallBtn = query(".sup-sml")
const signupErrorsSection = query(".sup-err")

// ELEMENT VARIABLES Logout Button

// ELEMENT VARIABLES Form inputs
const signupFirstNameInput = query(".sup-first")
const signupLastNameInput = query(".sup-last")
const signupEmailInput = query(".sup-email")
const signupPasswordInput = query(".sup-password")
const signupVerifyPasswordInput = query(".sup-verify")
const loginEmailInput = query(".sup-email")
const loginPasswordInput = query(".sup-password")


// LISTENER FUNCTIONS Signup submit
function signupNewUser() {
  signupForm.addEventListener("submit", async (ev) => {
    ev.preventDefault()
    const form = new FormData(signupForm)
    const firstName = form.get("firstName")
    const lastName = form.get("lastName")
    const email = form.get("email")
    const password = form.get("password")
    const confirmPassword = form.get("verifyPassword")

    const res = await fetch(`/api/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
    })

    if (res.ok) {
      const { token, user } = await res.json()
      // localStorage.setItem("COVEN_TOKEN", token)
      // localStorage.setItem("COVEN_ID", user.id)
      generateWelcomeMessage(user)
      await fadeoutElement(signupPage)
      updateLoginStateElements()
      location.reload()

    } else {
      const { title, errors } = await res.json()
      displayErrors(title, errors, signupErrorsSection)
    }
  })
}

// HELPER signupNewUser()
function generateWelcomeMessage(user) {
  const h2Welcome = create("h2")
  h2Welcome.innerHTML = "Thank you"
  const buttonX = create("button")
  buttonX.classList.add("log-x", "l-exit")
  buttonX.setAttribute("type", "button")
  buttonX.innerHTML = "X"
  const p1 = create("p")
  p1.innerHTML = `Thank you for joining us,${user.firstName} ${user.lastName}.`
  const p2 = create("p")
  p2.innerHTML = `Welcome to the sisterhood.`
  signupPage.replaceChildren(h2Welcome, buttonX, p1, p2)
}

// HELPER general, style
async function fadeoutElement(el) {
  await new Promise(resolve => {
    setTimeout(() => {
      el.classList.add("is-fading")
      resolve()
    }, 1500)
  })
  await new Promise(resolve => {
    setTimeout(() => {
      el.classList.add("is-hidden")
      el.classList.remove("is-fading")
      resolve()
    }, 500)
  })
}


// LISTENER login submit
function loginUser() {
  loginForm.addEventListener("submit", async (ev) => {
    ev.preventDefault()
    const form = new FormData(loginForm)
    const email = form.get("email")
    const password = form.get("password")

    // Sets cookies
    const res = await fetch(`/api/users/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      updateLoginStateElements()
      loginPage.classList.add("is-hidden")
      window.location.reload()
    } else {
      const { title, errors } = await res.json()
      displayErrors(title, errors, loginErrorsSection)
    }
  })
}


// HELPER general, state-change
function toggleHiddenStateOnClick(el, btn) {
  btn.addEventListener("click", (ev) => {
    el.classList.toggle("is-hidden")
  })
}


// HELPER forms, state-reset/state-swap
function toggleSignupLoginForm(btn) {
  console.log("click")
  if (btn.classList.contains("log-sml")) {

    // for (const el of signupElements) { el.classList.add("is-hidden") }
    // for (const el of loginElements) { el.classList.remove("is-hidden") }
    loginEmailInput.value = "demo@user.com"
    loginPasswordInput.value = "1234567890"
    loginErrorsSection.innerHTML = ""
  } else {
    // for (const el of signupElements) { el.classList.remove("is-hidden") }
    // for (const el of loginElements) { el.classList.add("is-hidden") }
    signupFirstNameInput.value = ""
    signupLastNameInput.value = ""
    signupEmailInput.value = ""
    signupPasswordInput.value = ""
    signupVerifyPasswordInput.value = ""
    signupErrorsSection.innerHTML = ""
  }
}


// HELPER forms, consolidate show-form button clicks
function toggleDisplayLoginSignupForms() {
  console.log("\ntoggle~!")
  for (const btn of signupBtns) { toggleHiddenStateOnClick(signupPage, btn) }
  for (const btn of loginBtns) { toggleHiddenStateOnClick(loginPage, btn) }
  toggleHiddenStateOnClick(signupPage, signupExitBtn)
  toggleHiddenStateOnClick(loginPage, loginExitBtn)
}


// HELPER forms, swap between login and signup forms
function swapLoginSignupForm() {
  loginSmallBtn.addEventListener("click", (ev) => toggleSignupLoginForm(loginSmallBtn))
  signupSmallBtn.addEventListener("click", (ev) => toggleSignupLoginForm(signupSmallBtn))
}


<<<<<<< HEAD
=======
// HELPER Log user out by deleting cookies with passed expiry
function deleteCookies() {
  const rawCookies = document.cookie.split("; ")
  rawCookies.forEach((cookie, i) => {
    const localHostName = window.location.hostname.split(".")
    while (localHostName.length > 0) {
      const cookieBase = encodeURIComponent(cookie.split(";")[0].split("=")[0]) + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" + localHostName.join(".") + " ;path="
      const path = location.pathname.split('/')
      document.cookie = cookieBase + "/"
      while (path.length > 0) {
        document.cookie = cookieBase + path.join("/")
        path.pop()
      }
      localHostName.shift()
    }
  })
}

// Log user out on button-click
function logoutUser() {
  const logoutBtn = query(".logout")
  logoutBtn?.addEventListener("click", (e) => {
    deleteCookies()
    location.reload()
  })
}

>>>>>>> 40d1aa6... Less out of date now.
signupNewUser()
loginUser()
logoutUser()
toggleDisplayLoginSignupForms()
swapLoginSignupForm()
// updateLoginStateElements()