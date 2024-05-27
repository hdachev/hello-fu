
// live-server hack to skip .html suffixes,
//  hope is Github Pages does the same.

module.exports = function(req, res, next) {
    if (!/\.[a-z]+$/.test(req.url) && !/\/$/.test(req.url))
        req.url += '.html';

    next();
}
