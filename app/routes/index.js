module.exports = function(app){
    app.use(function(req, res, next){
        console.log("%s %s", req.method, req.url);
        next()
        return;
    })
    app.get("/", function(req, res){
        res.render("index");
    })
}