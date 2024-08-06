const express = require('express')
const session = require('express-session')
const nocache = require('nocache')
const app = express()

const email = 'admin@gmail.com'
const passWord = "1234"


app.use(nocache())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static('views'));


app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user })
    }
    else if (req.session.pass) {
        req.session.pass = false
        const msg = 'Invalid Credentials!'
        res.render('base', { errMsg: msg })
    }
    else {
        res.render('base')
    }
})


app.post('/verify', (req, res) => {
    if (req.body.email === email && req.body.password === passWord) {
        req.session.user = email
        res.redirect('/')
    }
    else {
        req.session.pass = true
        res.redirect('/')
    }
})

app.post('/signout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

app.get('*', (req, res) => {
    res.send("<h2>Page not found</h2>")
})

const port = 4001
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))