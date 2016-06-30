describe("Core", function() {

    it("should add functions extend method to apply base class", function() {

        function Bar () {
            this.y = 1;
        }

        var Foo = (function Foo() {

            Bar.call(this);
            
            this.x = 1;

        }).extends(Bar);

        // or 
        // function Foo() {
        // }
        // Foo.extends(Bar);

        // latter does not expect Bar to be defined before Foo

        var foo = new Foo();
        var bar = new Bar();

        expect(foo instanceof Foo).toBe(true);
        expect(foo instanceof Bar).toBe(true);

        expect(bar instanceof Foo).toBe(false);
        expect(bar instanceof Bar).toBe(true);

        expect(foo.x).toBe(1);
        expect(foo.y).toBe(1);

    });
});