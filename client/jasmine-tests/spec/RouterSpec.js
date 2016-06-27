describe("Router", function() {
    var router = new Router({
        filters: [
            // TBD
        ],
        routes: [
            {
                name: "map",
                pattern: "/:lang/Map/:action?/:id?",
                defaults: { controller: "Map", action: "index" },
                constraints: {
                    lang: function (val) {
                        return (val || "").length == 2;
                    }
                }
            },
            {
                name: "default-with-language",
                pattern: "/:lang/:controller?/:action?/:id?",
                defaults: { controller: "Home", action: "index" },
                constraints: {
                    lang: function (val) {
                        return (val || "").length == 2;
                    }
                }
            },
            {
                name: "default",
                pattern: "/:controller?/:action?/:id?",
                defaults: { lang: "en", controller: "Home", action: "index" }
            }
        ]
    });

    it("should match route by url pattern", function() {

        var res = router.matchRoute("/Foo/Bar/1");
        expect(res.name).toBe("default");

        expect(res.parameters.controller).toBe("foo");
        expect(res.parameters.action).toBe("bar");
        expect(res.parameters.id).toBe("1");

        //

        var res = router.matchRoute("/et/Foo/Bar/1");
        expect(res.name).toBe("default-with-language");

        expect(res.parameters.controller).toBe("foo");
        expect(res.parameters.action).toBe("bar");
        expect(res.parameters.id).toBe("1");

    });

    it("should match route to first match", function() {
      
        var res = router.matchRoute("/et/Map/theAction/1");
        expect(res.name).toBe("map");
        expect(res.parameters.controller).toBe("map");
        expect(res.parameters.action).toBe("theaction");
        expect(res.parameters.id).toBe("1");
    });
  
    it ("should be able to match route by parameter values", function () {

        expect(router.matchRouteByParams({})).toBe("default");
        expect(router.matchRouteByParams({lang: "en"})).toBe("default-with-language");
        expect(router.matchRouteByParams({lang: "en", controller: "map"})).toBe("map");

    });

    it("should have case insensitive route matching", function () {

        var res = router.matchRoute("/et/Map");
        expect(res.name).toBe("map");
        
        var res = router.matchRoute("/et/map/");
        expect(res.name).toBe("map");
        
        var res = router.matchRoute("/ET/HOME/Index/1");
        expect(res.name).toBe("default-with-language");
        
        var res = router.matchRoute("/et/home/index/2");
        expect(res.name).toBe("default-with-language");
    });

    it("should apply constraints when matching route", function() {
      
        var res = router.matchRoute("/foo");
        expect(res.name).toBe("default");
            
    });

    it("should be able to compile url based on route name and parameters", function () {

        var url = router.urlRoute("default", {
            controller: "foo"
        });
        expect(url).toBe("/foo");

        var url = router.urlRoute("default", {
            controller: "foo",
            action: "bar"
        });
        expect(url).toBe("/foo/bar");

        var url = router.urlRoute("default", {
            controller: "foo",
            action: "bar",
            id: 1
        });
        expect(url).toBe("/foo/bar/1");

        var url = router.urlRoute("default-with-language", {
            lang: "en",
            controller: "foo",
            action: "bar",
            id: 1
        });
        expect(url).toBe("/en/foo/bar/1");

        var url = router.urlRoute("map", {
            action: "bar",
            id: 1
        });
        expect(url).toBe("//Map/bar/1");
    });

    it("should be able to compile url based on parameters", function () {

        var url = router.urlAction("foo", "bar");
        expect(url).toBe("/bar/foo");

        var url = router.urlAction("foo");
        expect(url).toBe("/home/foo");

        var url = router.urlAction("foo", { id: 1 });
        expect(url).toBe("/home/foo/1");

    });

    it("should stop compiling url if optional parameter is missing from chain", function () {

        var url = router.urlRoute("default", {
            controller: "foo",
            id: 1
        });
        expect(url).toBe("/foo/index/1");
    });
});
