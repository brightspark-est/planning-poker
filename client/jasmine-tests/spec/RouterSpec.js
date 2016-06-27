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

    it("should route to matching url pattern", function() {

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

    it("should route to first match", function() {
      
        var res = router.matchRoute("/et/Map/theAction/1");
        expect(res.name).toBe("map");
        expect(res.parameters.controller).toBe("map");
        expect(res.parameters.action).toBe("theaction");
        expect(res.parameters.id).toBe("1");
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
});
