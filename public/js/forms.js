
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

console.log("\nREACHING?")
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
      // localStorage.setItem("COVEN_TOKEN", token)
      // localStorage.setItem("COVEN_ID", id)
      updateLoginStateElements()
      loginPage.classList.add("is-hidden")
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


signupNewUser()
loginUser()
toggleDisplayLoginSignupForms()
swapLoginSignupForm()
updateLoginStateElements()