var express = require('express');
var router = express.Router();

router.get('/newsletter', function(req, res){
	res.render('newsletter');
});

module.exports = router;