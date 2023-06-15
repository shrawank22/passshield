require("dotenv").config();
const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const CryptoJS = require('crypto-js');

const middleware = require('../../middleware');


// Landing Page Route
router.get('/', (req, res) => {
    res.render("explore");
});

// ======================Content_Routes====================================
// Get Route
router.get('/contents', middleware.promptForKey, middleware.isLoggedIn, async (req, res) => {
    try {
        const contents = await Content.find({'owner.username': req.user.username});
        // console.log(contents);
        
        const encryptionKey = req.session.expectedKey;
        // console.log(encryptionKey)

        const decryptedContents = contents.map(content => {
            const propertiesToDecrypt = ['website', 'username', 'password']; 
            
            const decryptedContent = {
                iv: content.iv,
                _id: content._id
            };
            
            propertiesToDecrypt.forEach(prop => {
                let bytes = "";
                let decryptedValue = "";
                // console.log(content[prop]);
                if (content[prop]) {
                    bytes = CryptoJS.AES.decrypt(content[prop], encryptionKey, { iv: content.iv });
                    decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
                    decryptedContent[prop] = decryptedValue;
                }
            });
            
            return decryptedContent;
        });
        // console.log(decryptedContents);
        res.render('index', { contents: decryptedContents });
    } catch (err) {
        console.log(err);
        req.session.validKey = false;
    }
});

// New Route
router.get('/contents/new', middleware.isLoggedIn, (req, res) => {
    res.render("newContent")
});

// Create Route
router.post('/contents', middleware.isLoggedIn, async (req, res) => {
    // console.log(req.user)
    const website = req.sanitize(req.body.content.website);
	const username = req.sanitize(req.body.content.username);
	const password = req.sanitize(req.body.content.password);
    
    const owner = {
		id: req.user._id,
		username: req.user.username
	};
	// const content = {website: website, username: username, password: password, owner: owner};

    // AES Encryption key derivation
    const encryptionKey = req.session.expectedKey;

    // AES Encryption
    var iv = CryptoJS.lib.WordArray.random(32).toString();
    const encryptedWebsite = CryptoJS.AES.encrypt(website, encryptionKey, {iv: iv}).toString();
    const encryptedUsername = CryptoJS.AES.encrypt(username, encryptionKey, {iv: iv}).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey, {iv: iv}).toString();

    const content = {website: encryptedWebsite, username: encryptedUsername, password: encryptedPassword, iv: iv, owner: owner};
    // console.log(content);

    await Content.create(content).then(() => {
        // console.log(newContent);
        res.redirect('/contents')
    }).catch((err) => {
        console.log(err);
        req.session.validKey = false;
    });
});

// SHOW ROUTE 
router.get("/contents/:id", (req, res)=>{
    res.send("NA");
});

//EDIT ROUTE
router.get("/contents/:id/edit", middleware.checkCredentialOwnership, async(req, res)=>{
    const encryptionKey = req.session.expectedKey;

    await Content.findById(req.params.id).then((content) => {
        // console.log(content);

        const propertiesToDecrypt = ['website', 'username', 'password'];    
        const decryptedContent = {
            iv: content.iv,
            _id: content._id
        };

        propertiesToDecrypt.forEach(prop => {
            let bytes = "";
            let decryptedValue = "";
            if (content[prop]) {
                bytes = CryptoJS.AES.decrypt(content[prop], encryptionKey, { iv: content.iv });
                decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
                decryptedContent[prop] = decryptedValue;
            }
        });

        res.render("editContent", {content: decryptedContent});
    }).catch((err) => {
        req.flash(err.message);
        console.log(err);
    });
});

//UPDATE ROUTE
router.put("/contents/:id", middleware.checkCredentialOwnership, async (req,res)=>{
    try {
        const content = await Content.findById(req.params.id);
        // console.log(content);
        // console.log(req.body.content)
        const encryptionKey = req.session.expectedKey;

        const iv = CryptoJS.lib.WordArray.random(32).toString();

        const updatedContent = {
            iv: iv, 
            website: CryptoJS.AES.encrypt(req.body.content.website, encryptionKey, { iv: iv }).toString(),
            username: CryptoJS.AES.encrypt(req.body.content.username, encryptionKey, { iv: iv }).toString(),
            password: CryptoJS.AES.encrypt(req.body.content.password, encryptionKey, { iv: iv }).toString(),
            owner: content.owner,
            _id: content._id,
            createdAt: content.createdAt,
            __v: content.__v
        };

        // console.log(updatedContent)

        await Content.findByIdAndUpdate(req.params.id, updatedContent).then(() => {
            res.redirect("/contents");
        }).catch((err) => {
            req.flash(err.message);
        });
    } catch (err) {
        req.flash(err.message);
        console.log(err);
    }
});

//DELETE ROUTE
router.delete("/contents/:id", middleware.checkCredentialOwnership, (req, res)=>{
    Content.findByIdAndRemove(req.params.id).then(() => {
        res.redirect('/contents');
    }).catch((err) => {
        console.log(err);
    })
});

module.exports = router;
