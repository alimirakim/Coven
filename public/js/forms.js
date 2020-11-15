
import { loggedIn } from './utils.js';
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
      localStorage.setItem("COVEN_TOKEN", token)
      localStorage.setItem("COVEN_ID", user.id)
      generateWelcomeMessage(user)
      await fadeoutElement(signupPage)
      updateLoginStateElements()
      
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
    const res = await fetch(`/api/users/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      const { token, id } = await res.json()
      localStorage.setItem("COVEN_TOKEN", token)
      localStorage.setItem("COVEN_ID", id)
      updateLoginStateElements()
      loginPage.classList.add("is-hidden")
    } else {
      const { title, errors } = await res.json()
      displayErrors(title, errors, loginErrorsSection)
    }
  })
}


// HELPER forms, element-creation
function displayErrors(title, errors, errorSection) {
  const h3 = create("h3")
  h3.innerHTML = title
  const ul = create("ul")
  errors.forEach(error => {
    ul.innerHTML += `<li>${error}</li>`
  })
  errorSection.replaceChildren(h3, ul)
}


// HELPER general, state-change
function updateLoginStateElements() {
  let isLoggedIn = loggedIn()
  const anonElements = queryAll(".anon")
  const userElements = queryAll(".user")

  if (isLoggedIn) {
    for (const el of anonElements) { el.classList.add('is-hidden') }
    for (const el of userElements) { el.classList.remove('is-hidden') }
  } else {
    for (const el of anonElements) { el.classList.remove('is-hidden') }
    for (const el of userElements) { el.classList.add('is-hidden') }
  }
}


// HELPER general, state-change
function toggleHiddenStateOnClick(el, btn) {
  btn.addEventListener("click", (ev) => {
    el.classList.toggle("is-hidden")
  })
}


// HELPER forms, state-reset/state-swap
function toggleSignupLoginForm(btn) {
  if (btn.classList.contains("log-sml")) {
    for (const el of signupElements) { el.classList.add("is-hidden") }
    for (const el of loginElements) { el.classList.remove("is-hidden") }
    loginEmailInput.value = "demo@user.com"
    loginPasswordInput.value = "1234567890"
    loginErrorsSection.innerHTML = ""
  } else {
    for (const el of signupElements) { el.classList.remove("is-hidden") }
    for (const el of loginElements) { el.classList.add("is-hidden") }
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

signupNewUser()
loginUser()
toggleDisplayLoginSignupForms()
swapLoginSignupForm()
updateLoginStateElements()