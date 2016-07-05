describe("RenderEgine", function() {

    Re.componentFactory = new (function () {
        
        this.create = function () {
            
            // dummy component
            return new (function () {
                
                this.render = function () {
                    return "OK!";
                }
                
            });
            
        };
        
    });

    it("should replace component container with its html", function() {
 
        var html = Re.render("<div><component:TestComponent /></div>");
        
        expect(html).toBe("<div>OK!</div>");

    });
    
    
    it("should be able to match parameters from component container", function() {
 
        var html = Re.render("<div><component:TestComponent name='x' foo=\"bar\" /></div>");
        
        expect(html).toBe("<div>OK!</div>");

    });
});